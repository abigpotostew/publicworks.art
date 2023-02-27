import { FC } from "react";
import styles from "../../../styles/Work.module.scss";
import { useNumMinted } from "../../hooks/useNumMinted";
import { useCollectionSize } from "../../hooks/useCollectionSize";
import SpinnerLoading from "../loading/Loader";

interface NumMintedParams {
  slug: string;
  minter: string;
}

export const NumMinted: FC<NumMintedParams> = (params: NumMintedParams) => {
  const {
    data: numMinted,
    error: numMintedError,
    isLoading: numMintedLoading,
  } = useNumMinted(params.slug);
  const {
    collectionSize,
    error: collectionSizeError,
    loading: collSizeLoading,
  } = useCollectionSize(params.minter);

  const numMintedText =
    numMintedError || !Number.isFinite(numMinted) ? "-" : numMinted;
  const collectionSizeText =
    collectionSizeError || !Number.isFinite(collectionSize)
      ? "?"
      : collectionSize;

  return (
    <span className={styles.workAuthor}>
      {" - "}
      {numMintedLoading ? <SpinnerLoading /> : numMintedText}
      {" of "}
      {collSizeLoading ? <SpinnerLoading /> : collectionSizeText + " minted"}
    </span>
  );
};
