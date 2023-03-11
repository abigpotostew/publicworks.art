import { FC } from "react";
import styles from "../../../styles/Work.module.scss";
import { useNumMinted } from "../../hooks/useNumMinted";
import { useCollectionSize } from "../../hooks/useCollectionSize";
import SpinnerLoading from "../loading/Loader";
import { Card, Placeholder } from "react-bootstrap";
import * as React from "react";

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
    data: collectionSize,
    error: collectionSizeError,
    isLoading: collSizeLoading,
  } = useCollectionSize(params.minter);

  const numMintedText =
    numMintedError || !Number.isFinite(numMinted) ? "-" : numMinted;
  const collectionSizeText =
    collectionSizeError || !Number.isFinite(collectionSize)
      ? "?"
      : collectionSize;
  // numMintedLoading = true;
  // collSizeLoading = true;
  return (
    <span className={styles.workAuthor}>
      {" - "}
      {numMintedLoading ? (
        <Placeholder animation="glow">
          <Placeholder className={"d-inline-block Width-3"} />
        </Placeholder>
      ) : (
        numMintedText
      )}
      {" of "}
      {collSizeLoading ? (
        <Placeholder animation="glow">
          <Placeholder className={"d-inline-block Width-3"} />
        </Placeholder>
      ) : (
        collectionSizeText
      )}
      {" minted"}
    </span>
  );
};
