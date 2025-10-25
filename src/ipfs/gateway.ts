export const ipfsUrl = (cid: string) => {
  return (
    (process.env.NEXT_PUBLIC_IPFS_GATEWAY ||
      "https://ipfs.publicworks.art/ipfs/") + `${cid}`
  );
};
