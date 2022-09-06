import { FC } from "react";
import styles from "../../../styles/Work.module.css";
import { useNumMinted } from "../../hooks/useNumMinted";
import { useCollectionSize } from "../../hooks/useCollectionSize";
import SpinnerLoading from "../loading/Loader";

interface NumMintedParams {
  sg721: string
  minter: string
}

export const NumMinted: FC<NumMintedParams> = (params: NumMintedParams) => {

  const { numMinted, error: numMintedError, loading: numMintedLoading } = useNumMinted(params.sg721)
  const { collectionSize, error: collectionSizeError, loading: collSizeLoading } = useCollectionSize(params.minter)

  const numMintedText = numMintedError || !Number.isFinite(numMinted) ? '-' : numMinted
  const collectionSizeText = collectionSizeError || !Number.isFinite(collectionSize) ? '?' : collectionSize

  return (<span className={styles.workAuthor}>
    {" - "}
    {numMintedLoading ? <SpinnerLoading/> : (numMintedText)}
    {" of "}{collSizeLoading ? <SpinnerLoading/> : collectionSizeText + ' minted'}
    </span>);
}