import Link from "next/link";
import { Card } from "react-bootstrap";
import styles from '../../../styles/Works.module.css'
import { useNftMetadata } from "../../hooks/useNftMetadata";
import slug from "../../../pages/work/[slug]";

export const tokenDetails = (tokenId: string) => {
  return {
    // live: `${config.liveViewUrl}/${tokenId}`,
    // imageUrl: `${config.fileUrlImage}/${tokenId}${config.fileUrlImage}`,
    // imageUrl4k: `${config.fileUrlHighResImage}/${tokenId}${config.fileUrlHighResImageExtension}`,
    // thumbnail: `${config.fileUrlThumbnails}/${tokenId}${config.fileUrlThumbnailsExtension}`,
    // metadata: `${config.fileUrlMetadata}/${tokenId}${config.fileUrlMetadataExtension}`,
  }
}

export const Token = ({ tokenId,sg721,slug }: { sg721:string;tokenId: string;slug:string }) => {

  const token = tokenDetails(tokenId);
  const { metadata } = useNftMetadata({tokenId,sg721})

  return (
    <Card className={styles.workCardContainer}>

      <Link href={`/work/${slug}/${tokenId}`}>
      <Card.Img variant="top" src={metadata?.image+'?img-width=330&img-height=187&img-quality=80'}/>
      </Link>
      <Card.Body>
        <Card.Title>#{tokenId}</Card.Title>
        <Card.Text>
          <Link href={`/work/${slug}/${encodeURIComponent(tokenId)}`} as={`/work/${slug}/${encodeURIComponent(tokenId)}`}>
            <a className={'Token-link'}>Details</a>
          </Link> |{" "}
          <a href={metadata?.image} className={'Token-link'} download={'true'}>Image</a> |{" "}
          <a href={metadata?.animation_url} target={'_blank'} className={'Token-link'} rel="noreferrer">Live</a>
        </Card.Text>
      </Card.Body>
    </Card>

  )
}
