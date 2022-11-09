import styles from "../styles/Home.module.scss";
import stylesWorks from "../styles/Work.module.scss";
import { FC, ReactElement, ReactNode } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Button, Col, Container, Row } from "react-bootstrap";
import SketchAnimation from "../src/components/SketchAnimation";
import kaleidoPix from "../public/img/homepage/kaleido-pix.png";
import Link from "next/link";
import { RowThinContainer } from "../src/components/layout/RowThinContainer";
import { FlexBoxCenter } from "../src/components/layout/FlexBoxCenter";
import Image from "react-bootstrap/Image";
import { AutoContainer } from "src/components/layout/AutoContainer";
import { Pill } from "src/components/content/Pill";
import { LogoHeader } from "src/components/logo/LogoHeader";

function GroupDividerBottom() {
  return (
    <div className={styles.groupDividerBottomOnly}>
      <span className={styles.align_center}>• • •</span>
    </div>
  );
}

function GroupDivider() {
  return (
    <Container className={styles.groupDivider}>
      <Row>
        <Col>
          <span className={styles.align_center}>• • •</span>
        </Col>
      </Row>
    </Container>
  );
}

const Home = () => {
  return (
    <div>
      <LogoHeader />
      {/*<Container>*/}
      {/*  <Row>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3} />*/}
      {/*    <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>*/}
      {/*      <p*/}
      {/*        className={`${styles.title} ${styles.titleheader}`}*/}
      {/*        style={{ marginTop: "80px" }}*/}
      {/*      >*/}
      {/*        Public Works*/}
      {/*      </p>*/}
      {/*    </Col>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3} />*/}
      {/*  </Row>*/}
      {/*  <Row>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3} />*/}
      {/*    <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>*/}
      {/*      <p*/}
      {/*        className={`${styles.description} ${styles.home1description}`}*/}
      {/*        style={{ marginTop: "1rem" }}*/}
      {/*      >*/}
      {/*        A new generative art platform built for the Cosmos on a carbon*/}
      {/*        neutral tech stack.*/}
      {/*      </p>*/}
      {/*    </Col>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3} />*/}
      {/*  </Row>*/}
      {/*</Container>*/}
      <AutoContainer>
        <Pill>Metadata Generation</Pill>
        <Pill>Mint on demand</Pill>
      </AutoContainer>
      <GroupDividerBottom />
      <Container className={styles.group2}>
        <RowThinContainer>
          <div style={{ textAlign: "center" }}>
            <p className={`${styles.subdescription} `}>
              Works are generative tokens that are co-created at mint time. Like
              Art Blocks, the minter and creator participate in the creation of
              unique on chain art.
            </p>
          </div>
        </RowThinContainer>
      </Container>
      <GroupDivider />
      <Container fluid>
        <RowThinContainer>
          <FlexBoxCenter>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                fluid={true}
                src={"/img/homepage/hyperion-collection-image-final.jpg"}
                style={{ minWidth: 300 }}
              />
            </div>
            <div style={{ minWidth: 250, textAlign: "center" }}>
              <div
                className={`${styles.subdescription_works}  ${stylesWorks.workTitle}`}
              >
                Hyperion
              </div>
              <div className={styles.subdescription_works_large}>
                Work 0. The seed project that started it all.
              </div>
            </div>
          </FlexBoxCenter>
        </RowThinContainer>
      </Container>
      <GroupDivider />
      <Container fluid>
        <RowThinContainer>
          <FlexBoxCenter
            style={{ justifyContent: "center", textAlign: "center" }}
          >
            <div style={{ minWidth: 250, textAlign: "center" }}>
              <p
                className={`${styles.subdescription_works} ${styles.subdescription_works_large} ${stylesWorks.workTitle}`}
              >
                Helio
              </p>
              <p
                className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}
              >
                Work 1. The first official work to be released on public works.
                Hyperion token holders will receive whitelist spots.
              </p>
              <p
                className={`${styles.subdescription_works} ${styles.subdescription_works_large}`}
              >
                Drop date September 2022
              </p>
              <p>
                <Link href={"/work/helio"}>
                  <Button>Learn more</Button>
                </Link>
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                fluid={true}
                src={kaleidoPix.src}
                style={{ minWidth: "300px" }}
              />
            </div>
          </FlexBoxCenter>
        </RowThinContainer>
      </Container>
      {/*<GroupDivider/>*/}
      {/*<Container className={styles.group2}>*/}
      {/*  <FlexBox style={{ justifyContent: 'center', 'textAlign': 'center' }}>*/}
      {/*    <div style={{ minWidth: 250, 'textAlign': 'center' }}>*/}
      {/*      <p className={`${styles.subdescription} `}>*/}
      {/*        Smart contracts enable programmable money. Public Works enables programmable art.*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*    <div style={{ display: 'flex', justifyContent: 'center' }}>*/}
      {/*      <p className={`${styles.description} `}>*/}
      {/*        Publicworks.art is not a launchpad-- it is tech that enables programmable art. Publicworks.art works in tandem with the Stargaze launchpad. You can mint Works on Stargaze!*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </FlexBox>*/}
      {/*      */}
      {/*</Container>*/}
      {/*<GroupDivider/>*/}
      {/*<Container className={styles.group2}>*/}
      {/*  <Row>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>*/}
      {/*    <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>*/}
      {/*      <p className={`${styles.description} `}>*/}
      {/*        {"The team behind PublicWorks.art is dedicated to building open NFT tools for generative collections. Soon, anyone can submit a generative collection. Think fxhash for the Cosmos."}*/}
      {/*      </p>*/}
      {/*    </Col>*/}
      {/*    <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>*/}
      {/*  </Row>*/}
      {/*</Container>*/}
      <GroupDivider />
      <Container fluid>
        <RowThinContainer>
          <FlexBoxCenter
            style={{ justifyContent: "center", textAlign: "center" }}
          >
            <div
              style={{
                width: 300,
                minWidth: 300,
                minHeight: 300,
                maxHeight: 300,
                maxWidth: 300,
                display: "flex",
                alignItems: "center",
              }}
              className={`${styles.mysterywork}`}
            >
              ???
            </div>

            <div style={{ minWidth: 250, textAlign: "center" }}>
              <p
                className={`${styles.subdescription_works_large} ${stylesWorks.workTitle}`}
              >
                Work 2 and beyond
              </p>
              <p className={`${styles.subdescription_works_large}`}>
                <span>
                  {
                    "During beta we're looking for generative artists and creators to release on PublicWorks.art. Reach out to "
                  }
                </span>
                <span className={stylesWorks.workAuthorLink}>
                  <a
                    rel="noreferrer"
                    target={"_blank"}
                    href={"https://twitter.com/stewbracken"}
                  >
                    @skymagic.eth
                  </a>
                </span>
                {" on twitter."}
              </p>
            </div>
          </FlexBoxCenter>
        </RowThinContainer>
      </Container>
      <Container>
        <SketchAnimation />
      </Container>
      <GroupDivider />

      <Container fluid>
        <RowThinContainer>
          <FlexBoxCenter
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div
              className={styles.subdescription_works_large}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 40,
                textAlign: "center",
              }}
            >
              <div>
                <p>Have thoughts or want to participate?</p>
                <p>Join the discussion</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Link href={"https://twitter.com/stewbracken"}>
                <Button variant={"secondary"}>Twitter</Button>
              </Link>

              <Link href={"https://discord.gg/X6hSmrxdtW"}>
                <Button variant={"secondary"}>Discord</Button>
              </Link>
            </div>
          </FlexBoxCenter>
        </RowThinContainer>
      </Container>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
