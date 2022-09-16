import { NftMetadata } from "../hooks/useNftMetadata";
import config from "./config";


export async function fetchTokenUriInfo(tokenUri: string) {
  // Some artists have a double slash, so we need to clean it
  // https://stackoverflow.com/questions/40649382/how-to-replace-double-multiple-slash-to-single-in-url
  tokenUri = tokenUri.replace(/(https?:\/\/)|(\/)+/g, '$1$2');


  let response =  await fetch(tokenUri);

  if (!response.ok) throw Error('Failed to fetch URI: '+ tokenUri);
  const textNftInfo = await response.text();
  let nftInfo;
  try {
    nftInfo = JSON.parse(textNftInfo);
  } catch (e) {
    throw new Error('bad json')
  }

  // Replace IPFS links for browsers that don't support them
  nftInfo.image = getImageUri(nftInfo.image);
  nftInfo.animation_url = getImageUri(nftInfo.animation_url);

  return nftInfo as NftMetadata;
}

export function normalizeMetadataUri(ipfsUri: string, ipfsHost?:string) {
  return ipfsUri.replace(
    /ipfs:\/\//i,
    process.env.NEXT_PUBLIC_IPFS_GATEWAY ||
    ipfsHost||`https://cloudflare-ipfs.com/ipfs/`
  );
}

export function normalizeIpfsUri(ipfsUri: string) {
  return ipfsUri.replace(
    /ipfs:\/\//i,
    process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.publicworks.art/ipfs/'
  );
}

export function normalizeIpfsAnimationUri(ipfsUri: string) {
  return ipfsUri.replace(
    /ipfs:\/\//i,
    process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.publicworks.art/ipfs/'
  );
}

export function getImageUri(ipfsUri: string, queryArgs: string = '') {
  return `${normalizeIpfsUri(ipfsUri)}${queryArgs}`;
}

export const getTokenMetadata =async (sg721:string, tokenId:string, ipfsHost='https://cloudflare-ipfs.com/ipfs/')=>{
  const msgBase64 =  Buffer.from(JSON.stringify({ nft_info: { token_id: tokenId } })).toString('base64')
  const res = await fetch(`${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`)
  if(!res.ok){
    console.log('status: '+res.status, " text: "+(await res.text()) )
    throw new Error('Failed to fetch token info')
  }
  const data = await res.json()
  const url = data?.data?.token_uri;
  if(!url){throw new Error('missing token_uri')}
  return await fetchTokenUriInfo(normalizeMetadataUri(url, ipfsHost));
}

export const getTokenOwner = async(sg721:string, tokenId:string)=>{
  const msgBase64 =  Buffer.from(JSON.stringify({ owner_of: { token_id: tokenId } })).toString('base64')
  const res = await fetch(`${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`)
  if(!res.ok){
    console.log('status: '+res.status, " text: "+(await res.text()) )
    return undefined;
  }
  const data = await res.json()
  const owner = data?.data?.owner;
  if(!owner){return undefined}
  return owner;
}
