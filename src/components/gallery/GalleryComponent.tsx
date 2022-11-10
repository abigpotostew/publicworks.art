import { WorkSerializable } from "src/dbtypes/works/workSerializable";
import { trpcNextPW } from "src/server/utils/trpc";
import { Card, Col } from "react-bootstrap";
import Link from "next/link";
import styles from "../../../styles/Works.module.scss";
import stylesWork from "../../../styles/Work.module.scss";
import { useRouter } from "next/router";

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
  const onClick = () => {
    router.push("/work/" + w.slug);
  };
  return (
    // <Col key={w.sg721} className={className}>
    <Card
      onClick={onClick}
      // style={{ width: "24rem" }}
      className={`${styles.workCardContainer} `}
    >
      <Card.Img variant="top" src={query.isSuccess ? query.data : ""} />
      <Card.Body>
        <Card.Title className={stylesWork.workSmallTitle}>{w.name}</Card.Title>
        <Card.Text>{w.blurb}</Card.Text>
      </Card.Body>
      <Card.Footer>By {w.creator}</Card.Footer>
    </Card>
    // </Col>
  );
};
