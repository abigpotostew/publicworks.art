import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { trpcNextPW } from "src/server/utils/trpc";
import { Card } from "react-bootstrap";
import styles from "../../../styles/Works.module.scss";
import stylesWork from "../../../styles/Work.module.scss";
import { useRouter } from "next/router";
import { isStarAddress, shortenAddress } from "../../wasm/address";
import { StarsAddressName } from "../name/StarsAddressName";
import { useNumMinted } from "../../hooks/useNumMinted";
import { useCollectionSize } from "../../hooks/useCollectionSize";

export const GalleryComponent = ({
  work,
  className,
}: {
  work: WorkSerializable;
  className?: string;
}) => {
  const query = trpcNextPW.works.workPreviewImg.useQuery({
    workId: work.id,
  });
  console.log(query.data);
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
      onClick={onClick}
      // style={{ width: "24rem" }}
      className={`${styles.workCardContainer} ${className}`}
    >
      <Card.Img
        className={styles.workCardImage}
        variant="top"
        src={query.isSuccess ? query.data : ""}
      />
      <Card.Body>
        <Card.Title className={stylesWork.workSmallTitle}>{w.name}</Card.Title>
        <Card.Text>{w.blurb}</Card.Text>
      </Card.Body>
      <Card.Footer className={"bg-white"}>
        <div className={""}>
          <div className={"d-flex align-items-center"}>
            <span>By</span>
            <StarsAddressName address={work.ownerAddress || work.creator} />
          </div>
          <div>
            {numMinted.isLoading || collectionSize.loading ? (
              "..."
            ) : (
              <>
                {numMinted.data} of {collectionSize.collectionSize}
              </>
            )}
          </div>
        </div>
      </Card.Footer>
    </Card>
    // </Col>
  );
};
