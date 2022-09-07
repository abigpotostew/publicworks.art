import { ReactElement } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { inspect } from "util";
import styles from '../styles/Works.module.css';
import stylesWork from '../styles/Work.module.css';
import Link from "next/link";


const work = {
  title: "Helio",
  author: 'skymagic',
  preview_url: 'https://abigpotostew.github.io/hyp2/?hash=52CC735D83B8353AE8932047799E2819C34EA18BA19E973D73B56487C864C297?pixelRatio=1&preview=false',
  blurb:'Helio is a slow indulgent breath in the fast paced NFT universe. Like prior works, Helio focuses on creating the most salient and slippery movements using expressive generative color palettes with advanced graphics techniques.',
  code_url: 'https://abigpotostew.github.io/hyp2/',
  authorLink: 'https://stewart.codes/helio',
  //todo change to mainnet values
  sg721: 'stars1kp82qny9vf086chmlqe9wdasxra4a0423vxuterv0k8ddeggyzwqaz3kxw',
  minter: 'stars1j4p0qkqhnqeukw6s7u94w8rscq5cpskncxendvj6maw50ukh4wfstwtqc3',
  previewImg: 'https://publicworks.mypinata.cloud/ipfs/bafybeif5hfb26yvlhbe6ssjyset7t6soug7j5gxbhsz3kqf4cowvigrzze',
  previewImgThumb: 'https://publicworks.mypinata.cloud/ipfs/bafybeif5hfb26yvlhbe6ssjyset7t6soug7j5gxbhsz3kqf4cowvigrzze?img-width=500&img-height=350&img-quality=80',
  slug:'helio'
}


const WorksPage = () => {


  return (<>
    <div>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Container>
        <RowWideContainer>
          <h1>Works</h1>
        </RowWideContainer>
      <RowWideContainer>

        <Row xs={1} md={2} className="g-6">
          {[work].map((w, idx) => (
            <Col key={w.sg721}>
              <Link href={'/work/'+w.slug} passHref>
                
              <Card style={{ width: '32rem' }}  className={`${styles.workCardContainer} `}>
                <Card.Img variant="top" src={w.previewImgThumb} />
                <Card.Body>
                  <Card.Title className={stylesWork.workTitle}>{w.title} - {w.author}</Card.Title>
                  <Card.Text>
                    {w.blurb}
                  </Card.Text>
                  {/* eslint-disable-next-line react/jsx-no-undef */}
                </Card.Body>
              </Card>
                
              </Link>
            </Col>
          ))}
        </Row>
        
        {/*{[work].map((w) => {*/}
        {/*  return (*/}
        {/*    <p key={w.sg721}>{w.title}</p>*/}
        {/*  )*/}
        {/*})}*/}


      </RowWideContainer>
      </Container>

    </div>
  </>)
}

WorksPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default WorksPage;