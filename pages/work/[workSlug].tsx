import { ReactElement } from "react";
import MainLayout from "../../src/layout/MainLayout";
import styles from "../../styles/Home.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { LiveMedia } from "../../src/components/media/LiveMedia";
import { RowContainer } from "../../src/components/layout/RowContainer";

const work={
  title:"Hello World",
  description:"Pizza!!!"
}
const WorkPage = () => {

  return (<>
    <div >
      <main className={styles.main}>
        <Container>
          <Row>
          <LiveMedia ipfsUrl={'https://abigpotostew.github.io/hyp2/?hash=E846ACA602B70CC28122D5BCC37EEDB33326103BDB502254D9EA041831BD22B4?pixelRatio=1&preview=false'} minHeight={500} />
          </Row>
        </Container>
        <Container>
          <RowContainer>
            <div>
              {work.title}
            </div>
          </RowContainer>
        </Container>
      </main>
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