import { ReactElement } from "react";
import MainLayout from "../../src/layout/MainLayout";
import styles from "../../styles/Work.module.css";
import { Button, Container } from "react-bootstrap";
import { LiveMedia } from "../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../src/components/layout/RowSquareContainer";
import Link from "next/link";

const work = {
  title: "Helio",
  author: 'skymagic',
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis suscipit purus vel fermentum. Aliquam erat volutpat. Sed in turpis non mi laoreet facilisis ac sit amet sem. Maecenas aliquet leo ex, in fermentum urna molestie a. Integer porttitor est a lacus vehicula finibus. Nam felis diam, rutrum sit amet erat nec, fringilla ornare nisl. Mauris et mi aliquam, molestie dolor nec, pellentesque sem. Phasellus porta vulputate purus, vitae egestas nulla ultricies vitae. Integer pellentesque fringilla metus, quis vehicula lacus pretium sed. Phasellus a mi a ipsum lobortis luctus quis accumsan tortor. Morbi dictum magna tortor, et efficitur nisi porta id. Sed venenatis enim ac lectus rhoncus pretium. Mauris at ante ex. Maecenas dui urna, rutrum eu lectus dictum, venenatis sagittis nisi. Donec vel pulvinar mauris, ut pretium risus. In ultricies mollis auctor.\n" +
    "\n" +
    "Vivamus ut tincidunt mi, non pharetra leo. Praesent faucibus suscipit orci, et efficitur ex elementum sed. Aenean sapien justo, volutpat id ullamcorper vel, vulputate at tellus. Nam dignissim ornare bibendum. Praesent blandit ultricies pellentesque. Nullam sagittis pellentesque convallis. Curabitur eu felis sit amet elit consequat consequat. Sed tortor magna, blandit sit amet facilisis sed, blandit eget est.",
  url: 'https://abigpotostew.github.io/hyp2/?hash=52CC735D83B8353AE8932047799E2819C34EA18BA19E973D73B56487C864C297?pixelRatio=1&preview=false',
  collectionSize: 1000,
  mintedCount: 0,
  authorLink: 'https://stewart.codes/nft'

}
const WorkPage = () => {

  return (<>
    <div>

      <Container>
        <RowSquareContainer>
          <div className={`${styles.align_center} align-self-center`}>
          <LiveMedia ipfsUrl={work.url} minHeight={500}/>
          </div>
        </RowSquareContainer>
      </Container>
      <Container>

        <RowThinContainer className={`${styles.paddingTop} ${styles.workHeader}`}>
          <div className={styles.paddingTop}>
            <div >
            <span className={styles.workTitle}>
              {work.title}
            </span>
            <span className={styles.workAuthor}>
              {" - " + work.author}
            </span>
            <span className={styles.workAuthor}>
              {" - " + work.mintedCount +" of " + work.collectionSize + ' minted'}
            </span>
            </div>
            <div className={`${styles.workDescription} ${styles.displayLinebreak} ${styles.sectionBreak}`}>
              {work.description}
            </div>
            <div className={`${styles.workAuthorLink} ${styles.sectionBreak}`}>
              <a href={work.authorLink} rel="noreferrer"  target={'_blank'}>
              {work.authorLink}
              </a>
            </div>
            
            <div className={`${styles.sectionBreak}`}>
              <a href={'https://stargaze.zone'} rel="noreferrer" target={"_blank"}>
                <Button>Mint on Stargaze.zone</Button>
              </a>
            </div>
          </div>
          price and license info
        </RowThinContainer>
      </Container>
    </div>
  </>)
}

WorkPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default WorkPage;