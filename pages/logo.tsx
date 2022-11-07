import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import LogoAnimation from "src/components/LogoAnimation";

const Logo = () => {
  return (
    <div>
      <Container>
        <LogoAnimation />
      </Container>
    </div>
  );
};

Logo.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Logo;
