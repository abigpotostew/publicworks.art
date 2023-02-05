// @flow
import * as React from "react";
import { WorkSerializable } from "../../dbtypes/works/workSerializable";
import { FC } from "react";
import Link from "next/link";
import { FlexBox } from "../layout/FlexBoxCenter";
import { Pill } from "../content/Pill";
import { PillSmall } from "../content/PillSmall";
import styles from "./UserProfile.module.scss";
import { useNumMinted } from "../../hooks/useNumMinted";
import SpinnerLoading from "../loading/Loader";
import { Col, Container, Row } from "react-bootstrap";
import { useLastMintedToken } from "../../hooks/useLastMintedToken";
import { relativeTimeFromDates } from "../../util/date-fmt/format";
import { ButtonPW } from "../button/Button";
interface Props {
  work: WorkSerializable;
}

export const WorkRow: FC<Props> = ({ work }: Props) => {
  const numMinted = useNumMinted(work.slug);
  const lastMintedToken = useLastMintedToken(work.slug);

  const collectionSize = work.maxTokens;
  const published = !!work.sg721;
  const status = published ? "Published" : "Draft";
  const hidden = work.hidden ? "Hidden" : "";

  return (
    <div
      className={
        "d-flex flex-row flex-nowrap justify-content-between align-items-center"
      }
    >
      <div>
        {/*Name flex*/}
        <FlexBox>
          <Link
            className={styles.workTitleLink}
            href={`/work/${work.slug}`}
            passHref={true}
          >
            {work.name}
          </Link>

          <PillSmall
            className={"ms-2 text-muted"}
            color={published ? "green" : "yellow"}
          >
            {status}
          </PillSmall>
        </FlexBox>

        <div className={"mt-1"}>
          <FlexBox>
            <div className={"fs-7"}>
              {numMinted.isLoading ? <SpinnerLoading /> : numMinted.data} /{" "}
              {collectionSize} Minted
            </div>
            <div className={"fs-7 ms-2"}>
              Last Mint:{" "}
              {lastMintedToken?.data?.createdDate
                ? relativeTimeFromDates(
                    new Date(lastMintedToken?.data?.createdDate)
                  )
                : "NA"}
            </div>
          </FlexBox>
        </div>
      </div>
      <div>
        <Link href={`/create/${work.id}`} passHref={true}>
          <ButtonPW variant={"outline-secondary"}>Edit</ButtonPW>
        </Link>
      </div>
      {/*<span>*/}
      {/*  {work.name} {" | "}*/}
      {/*  <Link href={`/work/${work.slug}`} passHref={true}>*/}
      {/*    View*/}
      {/*  </Link>*/}
      {/*  {" | "}*/}
      {/* */}
      {/*</span>*/}
    </div>
  );
};
