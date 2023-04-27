import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { trpcNextPW } from "src/server/utils/trpc";
import { Card, Container } from "react-bootstrap";
import styles from "../../../styles/Works.module.scss";
import stylesWork from "../../../styles/Work.module.scss";
import { useRouter } from "next/router";
import { isStarAddress, shortenAddress } from "../../wasm/address";
import { StarsAddressName } from "../name/StarsAddressName";
import { useNumMinted } from "../../hooks/useNumMinted";
import { useCollectionSize } from "../../hooks/useCollectionSize";
import React from "react";
import Link from "next/link";

export const WorksGalleryComponent = ({
  work,
  className,
}: {
  work: WorkSerializable;
  className?: string;
}) => {
  const query = trpcNextPW.works.workPreviewImg.useQuery({
    workId: work.id,
  });
  const w = work;
  const router = useRouter();
  const numMinted = useNumMinted(work.slug);
  const collectionSize = useCollectionSize(work.minter);

  let creatorName = w.creator;
  if (isStarAddress(creatorName)) {
    creatorName = shortenAddress(creatorName);
  }
  const onClick = () => {
    router.push("/work/" + w.slug);
  };
  return (
    // <Col key={w.sg721} className={className}>
    <Card
      // style={{ width: "24rem" }}
      className={`${styles.workCardContainer} ${className} border-light`}
    >
      <Card.Img
        className={styles.workCardImage + " rounded-1 rounded-top button"}
        variant="top"
        src={query.isSuccess ? query.data : ""}
      />
      <Card.ImgOverlay className={` p-0`}>
        <Link href={"/work/" + w.slug} className={"text-decoration-none"}>
          <Container
            className={
              "bg-gradient-transparent text-light rounded-top rounded-1 pt-3 pb-3 "
            }
          >
            <div className={`${stylesWork.workSmallTitle}  ps-3 text-light`}>
              {w.name}
            </div>

            <div className={"ps-3 text-decoration-none"}>{w.blurb}</div>
          </Container>
        </Link>
      </Card.ImgOverlay>
      {/*<Card.Body>*/}
      {/*  /!*<Card.Title className={stylesWork.workSmallTitle}>{w.name}</Card.Title>*!/*/}
      {/*  /!*<Card.Text>{w.blurb}</Card.Text>*!/*/}
      {/*</Card.Body>*/}
      <Card.Footer className={"bg-white mb-1"}>
        <div className={"d-flex justify-content-between"}>
          <div className={"d-flex align-items-center"}>
            <span>By</span>
            <StarsAddressName address={work.ownerAddress || work.creator} />
          </div>
          <div className={"d-flex align-items-center"}>
            {numMinted.isLoading || collectionSize.isLoading ? (
              "..."
            ) : (
              <>
                {numMinted.data} of {collectionSize.data}
              </>
            )}
          </div>
        </div>
      </Card.Footer>
    </Card>
    // </Col>
  );
};