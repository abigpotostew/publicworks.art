import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Footer } from "../src/components/Footer";
import { NavBar } from "../src/components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import HomepageSketch from "../src/components/sketch";

const Home = ()=> {
  return (
    <div className={styles.container}>
      <Head>
        <title>PublicWorks.art</title>
        <meta name="description" content="publicworks.art"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <NavBar />

      <main className={styles.main}>
        {/*<h1 className={styles.logo}>*/}
        {/*  <Image src={'/img/hyperion-logo2.svg'} width={100} height={100}/>*/}
        {/*</h1>*/}
        
        <HomepageSketch />
        
        {/*<h1 className={styles.title}>*/}
        {/*  Welcome to <a href="#">PublicWorks.art!</a>*/}
        {/*</h1>*/}

        <p className={styles.description} style={{ marginTop: '1rem' }}>
          Public Works is a new generative art platform built for Cosmos on a carbon neutral tech stack.
        </p>
        <p className={styles.description}>
          The team behind Public Works is dedicated to bringing the best generative art to the cosmos. 
        </p>
        
        <Container fluid>
          {/*<Row>*/}
          {/*  <Col md="auto" lg xl>*/}
          <Image alt={'Untitled © skymagic 2022'} src={'/preview/preview3.png'} width={'1748'} height={'868'} />
            {/*</Col>*/}
          {/*</Row>*/}
        </Container>

        <div className={styles.description}>
          The first collection will be released by skymagic.eth in early August, 2022
        </div>
      </main>
      <Footer />

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

