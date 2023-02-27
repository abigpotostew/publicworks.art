import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { Sandbox } from "src/components/sandbox/Sandbox";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";

const SandboxPage = () => {
  return (
    <Container>
      <RowWideContainer>
        <h1>Sandbox</h1>
      </RowWideContainer>
      <RowWideContainer>
        <Sandbox />
      </RowWideContainer>
    </Container>
  );
};

SandboxPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Sandbox"}>{page}</MainLayout>;
};

export default SandboxPage;
