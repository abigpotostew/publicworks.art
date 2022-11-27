import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { Sandbox } from "src/components/sandbox/Sandbox";

const SandboxPage = () => {
  return (
    <Container>
      <RowThinContainer>
        <h1>Sandbox</h1>
      </RowThinContainer>
      <RowThinContainer>
        <Sandbox />
      </RowThinContainer>
    </Container>
  );
};

SandboxPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Sandbox"}>{page}</MainLayout>;
};

export default SandboxPage;
