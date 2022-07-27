import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Footer } from "../src/components/Footer";
import { NavBar } from "../src/components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import HomepageSketch from "../src/components/logo-sketch";
import SketchAnimation from "../src/components/SketchAnimation";
import kaleidoPix from '../public/img/homepage/kaleido-pix.png'

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>PublicWorks.art</title>
        <meta name="description" content="publicworks.art"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <NavBar/>

      <main className={styles.main}>
        {/*<h1 className={styles.logo}>*/}
        {/*  <Image src={'/img/hyperion-logo2.svg'} width={100} height={100}/>*/}
        {/*</h1>*/}

        {/*<HomepageSketch />*/}

        {/*<h1 className={styles.title}>*/}
        {/*  Welcome to <a href="#">PublicWorks.art!</a>*/}
        {/*</h1>*/}

        <Container>
          <Row>
          <Col xs={0} sm={0} md={1} lg={2} xl={4} xxl={4}/>
          <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
            <p className={`${styles.description} ${styles.home1description}`} style={{ marginTop: '1rem' }}>
              Public Works is a new generative art platform built for Cosmos on a carbon neutral tech stack.
            </p>
          </Col>
            <Col xs={0} sm={0} md={1} lg={2} xl={4} xxl={4}/>
          </Row>
          
        </Container>
        
        <Container>

          <SketchAnimation/>

          {/*<p className={styles.description}>*/}
          {/*  The team behind Public Works is dedicated to bringing the best generative art to the cosmos.*/}
          {/*</p>*/}
        </Container>

        <Container>
          <Row>
            <Col xs={0} sm={0} md={1} lg={1} xl={2} xxl={3}/>
            <Col xs={12} sm={12} md={5} lg={5} xl={4} xxl={3} className={'align-self-center'} >
              <Image src={'/img/homepage/hyperion-collection-image-final.jpg'} width={'200%'} height={'200%'} layout={'intrinsic'} />
              <p className={styles.subdescription_works}>Work 0 - Hyperion</p>
              <p className={styles.subdescription_works}>The seed project that started it all.</p>
            </Col>
            <Col xs={12} sm={12} md={5} lg={5} xl={4} xxl={3} className={'align-self-center'}>
              <div className={styles.align_center}>
              <p className={`${styles.subdescription}` }>Works are generative tokens that are co-created at mint time. Like Art Blocks, the minter and creator participate in the creation of unique on chain art.</p>
              </div>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={2} xxl={3}/>
          </Row>
        </Container>

        <Container className={styles.group2}>
          <Row>
            <Col xs={0} sm={0} md={1} lg={1} xl={2} xxl={3}/>
            
            <Col xs={12} sm={12} md={5} lg={5} xl={4} xxl={3} className={'align-self-center'}>
              <p className={styles.subdescription_works}>Work 2 - Kaleidoscope</p>
              <p className={styles.subdescription_works}>The first official work to be released on public works. Hyperion token holders will receive whitelist spots.</p>
              <p className={styles.subdescription_works}>Drop date August 2022</p>
            </Col>
            <Col xs={12} sm={12} md={5} lg={5} xl={4} xxl={3} className={'al'}>
              <Image src={kaleidoPix} width={200} height={200} layout={"responsive"} />
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={2} xxl={3}/>
          </Row>
        </Container>

        <Container className={styles.group2}>
          <Row>
            <Col xs={0} sm={0} md={1} lg={1} xl={2} xxl={3}/>

            <Col xs={12} sm={12} md={5} lg={5} xl={4} xxl={3} className={'al'}>
              <Image src={kaleidoPix} width={200} height={200} layout={"responsive"} />
            </Col>

            <Col xs={12} sm={12} md={5} lg={5} xl={4} xxl={3} className={'align-self-center'}>
              <p className={styles.subdescription_works}>Work 3 - ???</p>
              <p className={styles.subdescription_works}>Are you a generative artist or creator? We're looking for collection to release during beta. Reach out to @stewbracken on twitter.</p>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={2} xxl={3}/>
          </Row>
        </Container>

        {/*<Container fluid>*/}
        {/*  /!*<Row>*!/*/}
        {/*  /!*  <Col md="auto" lg xl>*!/*/}
        {/*  <Image alt={'Untitled © skymagic 2022'} src={'/preview/preview3.png'} width={'1748'} height={'868'}/>*/}
        {/*  /!*</Col>*!/*/}
        {/*  /!*</Row>*!/*/}
        {/*</Container>*/}

        <Container style={{ marginTop: '100px' }}>
          <Row>
            <Col xs={0} sm={0} md={1} lg={2} xl={4} xxl={4}/>
            <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
              <p className={`${styles.description} `} >
                PublicWorks.art is built for Stargaze.zone. It's off chain rendering pipeline is built on infrastructure that is powered by 100% renewable energy.  
              </p>
              {/*<p className={`${styles.description} `} >*/}
              {/*  Hyperion holders */}
              {/*</p>*/}
            </Col>
            <Col xs={0} sm={0} md={1} lg={2} xl={4} xxl={4}/>
          </Row>

        </Container>
        
      </main>
      <Footer/>

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

