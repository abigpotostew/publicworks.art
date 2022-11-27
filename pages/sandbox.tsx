import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Col, Container, Figure, Row } from "react-bootstrap";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NormalComponents } from "react-markdown/lib/complex-types";
import {
  HeadingProps,
  SpecialComponents,
} from "react-markdown/lib/ast-to-react";
import Image from "next/image";
import hashToImagePic from "../public/img/docs/hash-to-image.svg";
import hashToInvalidImagePic from "../public/img/docs/hash-to-image-duplicate-error.svg";
import createimage2 from "../public/img/docs/create/2.png";
import createimage3 from "../public/img/docs/create/3.png";
import createimage4 from "../public/img/docs/create/4.png";
import createimage5 from "../public/img/docs/create/5.png";
import createimage6 from "../public/img/docs/create/6.png";
import createimage7 from "../public/img/docs/create/7.png";
import createimage8 from "../public/img/docs/create/8.png";
import createimage9 from "../public/img/docs/create/9.png";
import styles from "../styles/About.module.scss";
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
