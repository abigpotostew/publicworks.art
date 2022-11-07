import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import LogoAnimation from "src/components/LogoAnimation";
import SpinAnimation from "src/components/animations/SpinAnimation";

const Logo = () => {
  return (
    <div>
      {/*<Container>*/}
      {/*  <LogoAnimation />*/}
      {/*</Container>*/}
      <Container>
        <SpinAnimation />
      </Container>
    </div>
  );
};

Logo.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Logo;
