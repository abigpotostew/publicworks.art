import Link from "next/link";
import { Card } from "react-bootstrap";
import styles from "../../../styles/Works.module.scss";
import { useNftMetadata } from "../../hooks/useNftMetadata";

export const Token = ({
  tokenId,
  sg721,
  slug,
}: {
  sg721: string;
  tokenId: string;
  slug: string;
}) => {
  const { metadata, loading } = useNftMetadata({ tokenId, sg721 });

  const imageUrl = metadata?.image
    ? metadata?.image + "?img-width=330&img-height=187&img-quality=80"
    : "/img/rendering-in-progress.png";
  return (
    <Card className={styles.workCardContainer}>
      <Link href={`/work/${slug}/${tokenId}`}>
        {loading ? (
          <Card.Img variant="top" src={""} />
        ) : (
          <Card.Img variant="top" src={imageUrl} />
        )}
      </Link>
      <Card.Body>
        <Card.Title>#{tokenId}</Card.Title>
        <Card.Text>
          <Link
            href={`/work/${slug}/${encodeURIComponent(tokenId)}`}
            as={`/work/${slug}/${encodeURIComponent(tokenId)}`}
            className={"Token-link"}
          >
            Details
          </Link>{" "}
          |{" "}
          <a href={metadata?.image} className={"Token-link"} download={"true"}>
            Image
          </a>{" "}
          |{" "}
          <a
            href={metadata?.animation_url}
            target={"_blank"}
            className={"Token-link"}
            rel="noreferrer"
          >
            Live
          </a>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
