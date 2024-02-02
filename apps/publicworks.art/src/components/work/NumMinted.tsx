import styles from "../../../styles/Work.module.scss";
import { useCollectionSize } from "../../hooks/useCollectionSize";
import { FC } from "react";
import * as React from "react";
import { Card, Placeholder } from "react-bootstrap";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { useNumMintedOnChain } from "../../hooks/useNumMintedOnChain";

interface NumMintedParams {
  slug: string;
  minter: string;
  work: WorkSerializable;
}

export const NumMinted: FC<NumMintedParams> = (params: NumMintedParams) => {
  const {
    data: numMinted,
    error: numMintedError,
    isLoading: numMintedLoading,
  } = useNumMintedOnChain(params.minter);
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
