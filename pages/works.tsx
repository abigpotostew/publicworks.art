import { ReactElement } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Card, Col, Container, Row } from "react-bootstrap";


const work = {
  title: "Helio",
  author: 'skymagic',
  preview_url: 'https://abigpotostew.github.io/hyp2/?hash=52CC735D83B8353AE8932047799E2819C34EA18BA19E973D73B56487C864C297?pixelRatio=1&preview=false',
  code_url: 'https://abigpotostew.github.io/hyp2/',
  authorLink: 'https://stewart.codes/helio',
  //todo change to mainnet values
  sg721: 'stars1kp82qny9vf086chmlqe9wdasxra4a0423vxuterv0k8ddeggyzwqaz3kxw',
  minter: 'stars1j4p0qkqhnqeukw6s7u94w8rscq5cpskncxendvj6maw50ukh4wfstwtqc3',
  previewImg: 'https://publicworks.mypinata.cloud/ipfs/bafybeif5hfb26yvlhbe6ssjyset7t6soug7j5gxbhsz3kqf4cowvigrzze',
  previewImgThumb: 'https://publicworks.mypinata.cloud/ipfs/bafybeif5hfb26yvlhbe6ssjyset7t6soug7j5gxbhsz3kqf4cowvigrzze?img-width=160&img-height=100&img-quality=80'
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

        <Row xs={1} md={2} className="g-4">
          {[work].map((w, idx) => (
            <Col key={w.sg721}>
              <Card>
                <Card.Img variant="top" src={w.previewImgThumb} />
                <Card.Body>
                  <Card.Title>{w.title}</Card.Title>
                  <Card.Text>
                    {w.author}
                  </Card.Text>
                </Card.Body>
              </Card>
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