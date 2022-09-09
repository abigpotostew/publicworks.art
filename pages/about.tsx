import styles from '../styles/About.module.css'
import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Col, Container, Row } from "react-bootstrap";
import { RowThinContainer } from '../src/components/layout/RowThinContainer';

function GroupDividerBottom() {
  return (
    <div  className={styles.groupDividerBottomOnly}>
            <span className={styles.align_center}>
      • • •
            </span></div>
      );
}

function GroupDivider() {
  return <Container className={styles.groupDivider}>
    <Row>
      <Col>
        <span className={styles.align_center}>
      • • •
            </span>
      </Col>
    </Row>
  </Container>;
}

const Home = () => {
  return (
    <div>

      

      <Container className={styles.group2}>
        <RowThinContainer>
            <div style={{  }}>
              <h2>
                About Public Works
              </h2>
              <h3 className={`${styles.subtitle} `}>
                Mission
              </h3>
              <p className={`${styles.abouttext} `}>
                CryptoPunks created the concept of pre-generated on-chain art 5 years ago.
                All NFT projects on Stargaze have followed this trajectory by pre-generating and shuffling the collection order during minting.
                This is fun for collectors to take their chances at finding a rare NFT.
                But the set of NFTs is already decided before minting starts.
                PublicWorks.art believes generative art can be so much more exciting.
                </p>

              <p className={`${styles.abouttext} `}>
                The goal of PublicWorks.art is to proliferate generative art into the world, starting with the Cosmos NFT space.
                We&apos;re building artist tools to support programmable artworks that create NFTs at mint time. 
                No NFTs exist until a collector mints-- the artist and collector do not know what will be generated until an NFT is minted.
              </p>

              <p className={`${styles.abouttext} `}>
                We believe this co-creation of art is the most exciting form of generative art. And we&apos;re here for it.
              </p>

              <h3 className={`${styles.subtitle} `}>
                How we&apos;re doing it
              </h3>


              <p className={`${styles.abouttext} `}>
                Smart contracts enable programmable money. Public Works enables programmable art.
              </p>
              <p className={`${styles.abouttext} `}>
                PublicWorks.art is not a launchpad-- it is a platform supporting generative on-chain artworks. We work in tandem with the Stargaze launchpad. You can mint Works on Stargaze!
              </p>

              <p className={`${styles.abouttext} `}>
                The team behind PublicWorks.art is dedicated to building open NFT tools for generative collections. Soon, anyone can submit a generative collection. Think fxhash for the Cosmos.
              </p>

              <p className={`${styles.abouttext} `}>
                The future of generative art NFTs are interactive realtime multimedia powered by PublicWorks.art.
              </p>




              <h3 className={`${styles.subtitle} `}>
                The team
              </h3>


              <p className={`${styles.abouttext} `}>
                Skymagic is a professional engineer, artist, and generative art enthusiast making generative artworks for over a decade.
              </p>
              
            </div>
        </RowThinContainer>
      </Container>

    </div>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout metaTitle={'About'}>
      {page}
    </MainLayout>
  );
};

export default Home;

