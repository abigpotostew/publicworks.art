import styles from '../styles/Home.module.css'
import stylesWorks from '../styles/Work.module.css'
import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Button, Col, Container, Row } from "react-bootstrap";
import SketchAnimation from "../src/components/SketchAnimation";
import kaleidoPix from '../public/img/homepage/kaleido-pix.png'
import Link from "next/link";
import { RowThinContainer } from '../src/components/layout/RowThinContainer';
import { FlexBox } from "../src/components/layout/FlexBox";

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

      <GroupDivider/>
      <RowThinContainer>
        <div style={{ 'textAlign': 'center' }}>
          <p className={`${styles.subdescription} `}>Works are generative tokens that are co-created
            at mint time.
            Like Art Blocks, the minter and creator participate in the creation of unique on chain art.</p>
        </div>
      </RowThinContainer>
      <GroupDivider/>

      <Container fluid>
        <RowThinContainer>
          {/*<Row style={{ borderTop: 'solid 1px' }} className={`${styles.group2} ${styles.sectionGroupDivider}`}>*/}

          <FlexBox>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={'/img/homepage/hyperion-collection-image-final.jpg'} height={'400px'}/>
            </div>
            <div style={{ minWidth: 200, 'textAlign': 'center' }}>
              <div className={`${styles.subdescription_works}  ${stylesWorks.workTitle}`}>Hyperion</div>
              <div className={styles.subdescription_works_large}>Work 0. The seed project that started it all.</div>
            </div>
          </FlexBox>

        </RowThinContainer>
      </Container>

      <GroupDivider/>

      <Container fluid>
        <RowThinContainer>
          {/*<Row style={{ borderTop: 'solid 1px' }} className={`${styles.group2} ${styles.sectionGroupDivider}`}>*/}

          <FlexBox style={{ justifyContent: 'center', 'textAlign': 'center' }}>
            <div style={{ minWidth: 350, 'textAlign': 'center' }}>
              <p
                className={`${styles.subdescription_works} ${styles.subdescription_works_large} ${stylesWorks.workTitle}`}>Kaleidoscope</p>
              <p className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}>Work 1. The first
                official work
                to be released on public works.
                Hyperion token holders will receive whitelist spots.</p>
              <p className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}>Drop date August
                2022</p>
              <p><Link href={'/work/kaleido'}><Button>Learn more</Button></Link></p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={kaleidoPix.src} height={'400px'}/>
              {/*<Image src={kaleidoPix} width={200} height={200} layout={"responsive"}/>*/}
            </div>
          </FlexBox>

        </RowThinContainer>
      </Container>

      {/*<Container className={styles.group2}>*/}
      {/*  <Container fluid>*/}
      {/*    <div style={{ 'textAlign': 'center' }} className={`${styles.flexWrapCenter}`}>*/}
      {/*      <div style={{ minWidth: 300 }}>*/}
      {/*        <p*/}
      {/*          className={`${styles.subdescription_works} ${styles.subdescription_works_large} ${stylesWorks.workTitle}`}>Kaleidoscope</p>*/}
      {/*        <p className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}>Work 1. The first*/}
      {/*          official work*/}
      {/*          to be released on public works.*/}
      {/*          Hyperion token holders will receive whitelist spots.</p>*/}
      {/*        <p className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}>Drop date August*/}
      {/*          2022</p>*/}
      {/*        <p><Link href={'/work/kaleido'}><Button>Learn more</Button></Link></p>*/}
      {/*      </div>*/}

      {/*      <div>*/}
      {/*        <img src={kaleidoPix.src} height={'400px'}/>*/}
      {/*        /!*<Image src={kaleidoPix} width={200} height={200} layout={"responsive"}/>*!/*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </Container>*/}
      {/*</Container>*/}

      <GroupDivider/>
      <Container className={styles.group2}>
        <Row>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
          <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
            <p className={`${styles.description} `}>
              {"The team behind PublicWorks.art is dedicated to building open NFT tools for generative collections. Soon, anyone can submit a generative collection. Think fxhash for the Cosmos."}
            </p>
            {/*<p className={`${styles.description} `} >*/}
            {/*  Hyperion holders */}
            {/*</p>*/}
          </Col>
          <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
        </Row>

      </Container>

      <GroupDivider/>

      <Container fluid>
        <RowThinContainer>
          {/*<Row style={{ borderTop: 'solid 1px' }} className={`${styles.group2} ${styles.sectionGroupDivider}`}>*/}

          <FlexBox>
            <div style={{
              width: 350,
              height: 350,
              display: 'flex',
              alignItems: "center"
            }} className={`${styles.mysterywork}`}>
              ???
            </div>

            <div>
              <p className={`${styles.subdescription_works_large} ${stylesWorks.workTitle}`}>Work 2 and beyond</p>
              <p
                className={`${styles.subdescription_works_large}`}>
                <span>{"During beta we're looking for generative artists and creators to release on PublicWorks.art. Reach out to "}</span>
                <span className={stylesWorks.workAuthorLink}><a rel="noreferrer" target={'_blank'} href={'https://twitter.com/stewbracken'} >@stewbracken</a></span>{" on twitter."}
              </p>
            </div>
          </FlexBox>

        </RowThinContainer>
      </Container>

      {/*<Container className={styles.group2}>*/}
      {/*  <Row>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>*/}
      {/*    <Col xs={12} sm={12} md={5} lg={4} xl={3} xxl={3} className={`align-self-center ${styles.mysterywork}`}*/}
      {/*         style={{ minHeight: 300 }}>*/}
      {/*      /!*<Image src={kaleidoPix} width={200} height={200} layout={"responsive"} />*!/*/}
      {/*      <div className={`align-self-center `}>*/}
      {/*        ???*/}
      {/*      </div>*/}
      {/*    </Col>*/}

      {/*    <Col xs={12} sm={12} md={5} lg={4} xl={3} xxl={3} className={'align-self-center'}>*/}
      {/*      <p className={styles.subdescription_works}>Work 2 and beyond</p>*/}
      {/*      <p*/}
      {/*        className={`${styles.subdescription_works}`}>{"During beta we're looking for generative artists and creators to release on PublicWorks.art. Reach out to @stewbracken on twitter."}</p>*/}
      {/*    </Col>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>*/}
      {/*  </Row>*/}
      {/*</Container>*/}

      <GroupDivider/>

      <Container fluid>
        <RowThinContainer>
          {/*<Row style={{ borderTop: 'solid 1px' }} className={`${styles.group2} ${styles.sectionGroupDivider}`}>*/}

          <FlexBox style={{alignItems:'center'}}>
            <div className={styles.subdescription_works_large}  style={{display:'flex',justifyContent:'center', alignItems:'center', gap:40}}>
            <div>
              <p>Have thoughts or want to participate?</p>
              <p>Join the discussion</p>
            </div>
            <div style={{display:'flex',justifyContent:'center', alignItems:'center', gap:40}}>
            
              <Link href={'https://twitter.com/stewbracken'}><Button>Twitter</Button></Link>
            
              <Link href={'https://discord.gg/X6hSmrxdtW'}><Button>Discord</Button></Link>
            
            </div>
            </div>
          </FlexBox>

        </RowThinContainer>
      </Container>

      {/*<Container className={styles.group2}>*/}
      {/*  <Row>*/}
      {/*    <Col xs={0} sm={0} md={4} lg={2} xl={5} xxl={5}/>*/}
      {/*    <Col xs={12} sm={12} md={4} lg={8} xl={2} xxl={2} className={`align-self-center`}>*/}
      {/*      /!*<Image src={kaleidoPix} width={200} height={200} layout={"responsive"} />*!/*/}
      {/*      <p>Have thoughts or want to participate?</p>*/}
      {/*      <p>Join the discussion</p>*/}
      {/*      <Link href={'https://twitter.com/stewbracken'}><Button>Twitter</Button></Link>*/}
      {/*      <Link href={'https://discord.gg/X6hSmrxdtW'}><Button>Discord</Button></Link>*/}
      {/*    </Col>*/}
      
      {/*    /!*<Col xs={12} sm={12} md={5} lg={4} xl={3} xxl={3} className={'align-self-center'}>*!/*/}
      {/*    /!*  <p className={styles.subdescription_works}>Work 3 and beyond</p>*!/*/}
      {/*    /!*  <p*!/*/}
      {/*    /!*    className={`${styles.subdescription_works}`}>{"During beta we're looking for generative artists and creators to release on PublicWorks.art. Reach out to @stewbracken on twitter."}</p>*!/*/}
      {/*    /!*</Col>*!/*/}
      {/*    <Col xs={0} sm={0} md={4} lg={2} xl={5} xxl={5}/>*/}
      {/*  </Row>*/}
      {/*</Container>*/}

      {/*<Container fluid>*/}
      {/*  /!*<Row>*!/*/}
      {/*  /!*  <Col md="auto" lg xl>*!/*/}
      {/*  <Image alt={'Untitled © skymagic 2022'} src={'/preview/preview3.png'} width={'1748'} height={'868'}/>*/}
      {/*  /!*</Col>*!/*/}
      {/*  /!*</Row>*!/*/}
      {/*</Container>*/}


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

