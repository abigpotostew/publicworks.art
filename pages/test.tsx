import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { Sandbox } from "src/components/sandbox/Sandbox";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";

const TestPage = () => {
  return (
    <Container>
      <RowWideContainer>
        <h1>Test</h1>
      </RowWideContainer>
      <RowWideContainer>
        <Sandbox />
      </RowWideContainer>
    </Container>
  );
};

TestPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Test"}>{page}</MainLayout>;
};

export default TestPage;
