import styles from '../styles/About.module.css';
import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { RowThinContainer } from '../src/components/layout/RowThinContainer';
import Link from "next/link";

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
                Roadmap
              </h2>
              <p>
                The team behind public works is excited to build creator tools for generative art on Stargaze. We hope you can join us for this journey. 
              </p>
              <ul>
                <li>
                  <p className={`${styles.abouttext} `}>
                    September 16, 2022: Launch Imago, the minting platform that powers PublicWorks.art.
                  </p>
                </li>
                <li>
                  <p className={`${styles.abouttext} `}>
                    September 16, 2022: Launch Work 1 <Link href={'/work/helio'} passHref>Helio</Link>
                  </p>
                </li>
                <li>
                  <p className={`${styles.abouttext} `}>
                    September and beyond: Recruit generative artists and creators to launch on PublicWorks.art
                  </p>
                </li>
                <li>
                  <p className={`${styles.abouttext} `}>
                    Late Q4 2022: Build Work creation tools for early adopter artists.
                  </p>
                </li>
                <li>
                  <p className={`${styles.abouttext} `}>
                    Q1 2023: Create beta on platform mint capabilities. Open up early access to Hyperion holders. 
                  </p>
                </li>
                <li>
                  <p className={`${styles.abouttext} `}>
                    Q1-Q2 2023: Open platform to all artists. 
                  </p>
                </li>
              </ul>
            </div>
        </RowThinContainer>
      </Container>

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

