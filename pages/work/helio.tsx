import { ReactElement } from "react";
import MainLayout from "../../src/layout/MainLayout";
import styles from "../../styles/Work.module.css";
import { Button, Container } from "react-bootstrap";
import { LiveMedia } from "../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../src/components/layout/RowSquareContainer";
import { NumMinted } from "../../src/components/work/NumMinted";
import { NftMetadata } from "../../src/hooks/useNftMetadata";
import SpinnerLoading from "../../src/components/loading/Loader";
import { getTokenMetadata } from "../../src/wasm/metadata";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const work = {
  title: "Helio",
  author: 'skymagic',
  description: `What:
Helio is a realtime animation that celebrates the sustaining light of our sun. Endless symmetric patterns unite and dissipate to form temporary mandala structures that invite you to find your center and breathe. Striated colors attuned to the form, sometimes chaotically, other times gently, reveal themselves in an intricate psychedelic hoedown.

Controls:
Each Helio is interactive-- viewers can control the animation speed, save still frames, and create a looping gif image.

Press 'f' for fullscreen or click on the overlay button
Press 1-5 to increase or decrease the image quality. 1 is lowest, 5 is highest, 3 is default.
Press 'q' to slow down the animation.
Press 'w' to speed up the animation.
Press 'e' to pause the animation.
Press 'r' to resume normal animation speed.
Press 's' to save an image. Increasing resolution is recommended before saving the frame.
Press 'g' to save a looping gif image. Decreasing resolution first is recommended. Click on the link after gif rendering completes to download your gif.
Works on any screen size at any resolution. Beware, high resolution requires a powerful machine.

Why:
Helio is a slow indulgent breath in the fast paced NFT universe. Like prior works, Helio focuses on creating the most saline and slippery movements using expressive generative color palettes with advanced graphics techniques. 

How:
The algorithm constructs the animation using a 2-dimensional signed distance field technique. Origin points are generated and selected to form a kaleidoscopic pattern. Color position is calculated using the distance and angle from the closest origin point. Realtime color is computed by generative color palette technique with the color position. Animation is produced by precisely shifting the distance field over time. Foreground and background distance fields balance the composition.

Helio has 9 traits consisting of 20 hand picked color palettes and numerous other traits that ultimately produce unique animations.

Helio keeps realtime animation as its upmost priority by utilizing client graphics hardware through WebGL. The animation is created by a single fragment shader. Helio requires WebGL2 and Google Chrome >= v105.`,
  preview_url: 'https://abigpotostew.github.io/hyp2/?hash=52CC735D83B8353AE8932047799E2819C34EA18BA19E973D73B56487C864C297?pixelRatio=1&preview=false',
  code_url: 'https://abigpotostew.github.io/hyp2/',
  authorLink: 'https://stewart.codes/helio',
  //todo change to mainnet values
  sg721: 'stars1kp82qny9vf086chmlqe9wdasxra4a0423vxuterv0k8ddeggyzwqaz3kxw',
  minter: 'stars1j4p0qkqhnqeukw6s7u94w8rscq5cpskncxendvj6maw50ukh4wfstwtqc3'
}

export const getStaticProps: GetStaticProps = async () => {
  let metadata: NftMetadata | null = null;
  try {
    metadata = await getTokenMetadata(work.sg721, '1')

  } catch (e) {

  }
  return {
    props: {
      metadata
    }
  }

}

const WorkPage = ({ metadata }: InferGetStaticPropsType<typeof getStaticProps>) => {


  const loading = false;
  const errorMetadata = false;
  return (<>
    <div>
      <Container>
        <RowSquareContainer>
          <div className={`${styles.align_center} align-self-center`} style={{ minHeight: 500 }}>
            {loading ? <SpinnerLoading/> : errorMetadata ? <div>Something went wrong</div> :
              <LiveMedia ipfsUrl={metadata?.animation_url || work.preview_url} minHeight={500}/>}
          </div>
        </RowSquareContainer>
      </Container>
      <Container>

        <RowThinContainer className={`${styles.paddingTop} ${styles.workHeader}`}>
          <div className={styles.paddingTop}>
            <div>
            <span className={styles.workTitle}>
              {work.title}
            </span>
              <span className={styles.workAuthor}>
              {" - " + work.author}
            </span>
              <NumMinted sg721={work.sg721} minter={work.minter}/>
            </div>
            <div className={`${styles.workDescription} ${styles.displayLinebreak} ${styles.sectionBreak}`}>
              {work.description}
            </div>
            <div className={`${styles.workAuthorLink} ${styles.sectionBreak}`}>
              <a href={work.authorLink} rel="noreferrer" target={'_blank'}>
                {work.authorLink}
              </a>
            </div>

            <div className={`${styles.sectionBreak}`}>
              <a href={'https://stargaze.zone'} rel="noreferrer" target={"_blank"}>
                <Button>Mint on Stargaze.zone</Button>
              </a>
            </div>
          </div>
          Mint Price TBD 
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