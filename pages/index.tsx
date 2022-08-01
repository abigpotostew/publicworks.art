import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Button, Col, Container, Row } from "react-bootstrap";
import SketchAnimation from "../src/components/SketchAnimation";
import kaleidoPix from '../public/img/homepage/kaleido-pix.png'
import Link from "next/link";

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


      {/*<h1 className={styles.logo}>*/}
      {/*  <Image src={'/img/hyperion-logo2.svg'} width={100} height={100}/>*/}
      {/*</h1>*/}

      {/*<HomepageSketch />*/}

      {/*<h1 className={styles.title}>*/}
      {/*  Welcome to <a href="#">PublicWorks.art!</a>*/}
      {/*</h1>*/}

      <Container>
        <Row>

          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
          <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
            <p className={`${styles.title} ${styles.titleheader}`} style={{ marginTop: '80px' }}>
              Public Works
            </p>
          </Col>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
        </Row>
        <Row>

          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
          <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
            <p className={`${styles.description} ${styles.home1description}`} style={{ marginTop: '1rem' }}>
              A new generative art platform built for the Cosmos on a carbon neutral tech stack.
            </p>
          </Col>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
        </Row>

      </Container>

      <Container>

        <SketchAnimation/>

        {/*<p className={styles.description}>*/}
        {/*  The team behind Public Works is dedicated to bringing the best generative art to the cosmos.*/}
        {/*</p>*/}
      </Container>

      <Container>
        <Row style={{ borderTop: 'solid 1px' }} className={`${styles.group2} ${styles.sectionGroupDivider}`}>
          <Col xs={{ span: 0, order: 1 }} sm={{ span: 0, order: 1 }} md={{ span: 1, order: 1 }}
               lg={{ span: 2, order: 1 }} xl={{ span: 2, order: 1 }} xxl={{ span: 3, order: 1 }}/>
          <Col xs={{ span: 12, order: 3 }} sm={{ span: 12, order: 3 }} md={{ span: 5, order: 2 }}
               lg={{ span: 4, order: 2 }} xl={{ span: 4, order: 2 }} xxl={{ span: 3, order: 2 }}
               className={'align-self-center'}>
            <div>
              <Image src={'/img/homepage/hyperion-collection-image-final.jpg'} width={200} height={200}
                     layout={"responsive"}/>
              <div className={styles.subdescription_works}>Hyperion</div>
              <div className={styles.subdescription_works}>Work 0. The seed project that started it all.</div>
            </div>
          </Col>
          <Col xs={{ span: 12, order: 2 }} sm={{ span: 12, order: 2 }} md={{ span: 5, order: 3 }}
               lg={{ span: 4, order: 3 }} xl={{ span: 4, order: 3 }} xxl={{ span: 3, order: 3 }}
               className={'align-self-center'}>
            <div >
              <p className={`${styles.subdescription} ${styles.leftPadded}`}>Works are generative tokens that are co-created at mint time.
                Like Art Blocks, the minter and creator participate in the creation of unique on chain art.</p>
            </div>
          </Col>
          <Col xs={{ span: 0, order: 4 }} sm={{ span: 0, order: 4 }} md={{ span: 1, order: 4 }}
               lg={{ span: 2, order: 4 }} xl={{ span: 2, order: 4 }} xxl={{ span: 3, order: 4 }}/>
        </Row>
      </Container>

      <GroupDivider/>
      <Container className={styles.group2}>
        <Row>
          <Col xs={0} sm={0} md={1} lg={2} xl={2} xxl={3}/>

          <Col xs={12} sm={12} md={5} lg={4} xl={4} xxl={3} className={'align-self-center'}>
            <p className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}>Kaleidoscope</p>
            <p className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}>Work 1. The first official work
              to be released on public works.
              Hyperion token holders will receive whitelist spots.</p>
            <p className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}>Drop date August
              2022</p>
            <p><Link href={'/work/kaleido'}><Button>Learn more</Button></Link></p>
          </Col>
          <Col xs={12} sm={12} md={5} lg={4} xl={4} xxl={3} className={'al'}>
            <Image src={kaleidoPix} width={200} height={200} layout={"responsive"}/>
          </Col>
          <Col xs={0} sm={0} md={1} lg={2} xl={2} xxl={3}/>
        </Row>
      </Container>

      <GroupDivider/>
      <Container className={styles.group2}>
        <Row>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
          <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
            <p className={`${styles.description} `}>
              {"The team behind PublicWorks.art is building open NFT tools for generative collections. Soon, anyone can submit a generative collection. Think fxhash for the Cosmos."}
            </p>
            {/*<p className={`${styles.description} `} >*/}
            {/*  Hyperion holders */}
            {/*</p>*/}
          </Col>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
        </Row>

      </Container>

      <GroupDivider/>

      <Container className={styles.group2}>
        <Row>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
          <Col xs={12} sm={12} md={5} lg={4} xl={3} xxl={3} className={`align-self-center ${styles.mysterywork}`}
               style={{ minHeight: 300 }}>
            {/*<Image src={kaleidoPix} width={200} height={200} layout={"responsive"} />*/}
            <div className={`align-self-center `}>
              ???
            </div>
          </Col>

          <Col xs={12} sm={12} md={5} lg={4} xl={3} xxl={3} className={'align-self-center'}>
            <p className={styles.subdescription_works}>Work 2 and beyond</p>
            <p
              className={`${styles.subdescription_works}`}>{"During beta we're looking for generative artists and creators to release on PublicWorks.art. Reach out to @stewbracken on twitter."}</p>
          </Col>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
        </Row>
      </Container>

      <GroupDivider/>
      
      <Container className={styles.group2}>
        <Row>
          <Col xs={0} sm={0} md={4} lg={2} xl={5} xxl={5}/>
          <Col xs={12} sm={12} md={4} lg={8} xl={2} xxl={2} className={`align-self-center`}>
            {/*<Image src={kaleidoPix} width={200} height={200} layout={"responsive"} />*/}
            <p>Join the discussion</p>
            <Link href={'https://twitter.com/stewbracken'}><Button>Twitter</Button></Link>
            <Link href={'https://discord.gg/X6hSmrxdtW'}><Button>Discord</Button></Link>
          </Col>

          {/*<Col xs={12} sm={12} md={5} lg={4} xl={3} xxl={3} className={'align-self-center'}>*/}
          {/*  <p className={styles.subdescription_works}>Work 3 and beyond</p>*/}
          {/*  <p*/}
          {/*    className={`${styles.subdescription_works}`}>{"During beta we're looking for generative artists and creators to release on PublicWorks.art. Reach out to @stewbracken on twitter."}</p>*/}
          {/*</Col>*/}
          <Col xs={0} sm={0} md={4} lg={2} xl={5} xxl={5}/>
        </Row>
      </Container>

      {/*<Container fluid>*/}
      {/*  /!*<Row>*!/*/}
      {/*  /!*  <Col md="auto" lg xl>*!/*/}
      {/*  <Image alt={'Untitled © skymagic 2022'} src={'/preview/preview3.png'} width={'1748'} height={'868'}/>*/}
      {/*  /!*</Col>*!/*/}
      {/*  /!*</Row>*!/*/}
      {/*</Container>*/}


      s


      {/*<footer className={styles.footer}>*/}
      {/*  PublicWorks.art 2022*/}
      {/*</footer>*/}
    </div>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default Home;

