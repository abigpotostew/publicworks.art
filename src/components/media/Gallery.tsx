import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import { Token } from "./Token";
import styles from '../../../styles/Work.module.css'

function splitArrayIntoChunksOfLen(arr:any[], len:number) {
  var chunks = [], i = 0, n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}
export const Gallery = ({ sg721,tokenIds,slug }: { slug:string;sg721: string;tokenIds: string[] }) => {

  return (
<>
          {tokenIds.map((tokenId:string) => (
            <Col xs={12} md={6} lg={4} key={tokenId} className={styles.workGalleryItem}>
              <Token slug={slug} sg721={sg721} tokenId={tokenId} />
            </Col>
          ))}
</>
    // <Container >
    //   {chunks.map((chunk, index) => (
    //     <Row  key={index}>
    //       {chunk.map((tokenId:string) => (
    //         <Col xs={12} md={6} lg={4} key={tokenId}>
    //           <Token tokenId={tokenId} />
    //         </Col>
    //       ))}
    //     </Row>
    //   ))}
    // </Container>
  )
}
