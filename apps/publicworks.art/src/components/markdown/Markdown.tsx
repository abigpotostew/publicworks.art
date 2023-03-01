import hashToImagePic from "../../../public/img/docs/hash-to-image.svg";
import hashToInvalidImagePic from "../../../public/img/docs/hash-to-image-duplicate-error.svg";
import createimage2 from "../../../public/img/docs/create/2.png";
import createimage3 from "../../../public/img/docs/create/3.png";
import createimage4 from "../../../public/img/docs/create/4.png";
import createimage5 from "../../../public/img/docs/create/5.png";
import createimage6 from "../../../public/img/docs/create/6.png";
import createimage7 from "../../../public/img/docs/create/7.png";
import createimage8 from "../../../public/img/docs/create/8.png";
import createimage9 from "../../../public/img/docs/create/9.png";
import bafybeienmv7bkwf56riaft74igcv4hogis2alk7uznhpfznw66f2jhqtza from "../../../public/blog-assets/repetition-by-math-bird/bafybeienmv7bkwf56riaft74igcv4hogis2alk7uznhpfznw66f2jhqtza.png";
import bafybeihfy52llgg3jejvzx7y4ppxs3lrfhk4hbmp6vgwasmfhvuzziepdm from "../../../public/blog-assets/plottable-golden-train-by-greweb/bafybeihfy52llgg3jejvzx7y4ppxs3lrfhk4hbmp6vgwasmfhvuzziepdm.png";
import grewebProfilePic from "../../../public/blog-assets/plottable-golden-train-by-greweb/profile.jpg";
import greweb367 from "../../../public/blog-assets/plottable-golden-train-by-greweb/367.jpg";
import grewebEgo797 from "../../../public/blog-assets/plottable-golden-train-by-greweb/797-ego.jpg";
import grewebTrain709 from "../../../public/blog-assets/plottable-golden-train-by-greweb/709.jpg";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import styles from "../../../styles/About.module.scss";
import React from "react";
import {
  HeadingProps,
  SpecialComponents,
} from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const generateSlug = (str: string) => {
  str = str?.replace(/^\s+|\s+$/g, "");
  str = str?.toLowerCase();
  const from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    ?.replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return str;
};

export function imgMd(props: any) {
  let src: any = props.src;
  if (props.src === "/img/docs/hash-to-image.svg") src = hashToImagePic;
  if (props.src === "/img/docs/hash-to-image-duplicate-error.svg")
    src = hashToInvalidImagePic;
  if (props.src === "/img/docs/create/2.png") src = createimage2;
  if (props.src === "/img/docs/create/3.png") src = createimage3;
  if (props.src === "/img/docs/create/4.png") src = createimage4;
  if (props.src === "/img/docs/create/5.png") src = createimage5;
  if (props.src === "/img/docs/create/6.png") src = createimage6;
  if (props.src === "/img/docs/create/7.png") src = createimage7;
  if (props.src === "/img/docs/create/8.png") src = createimage8;
  if (props.src === "/img/docs/create/9.png") src = createimage9;
  if (
    props.src ===
    "/blog-assets/repetition-by-math-bird/bafybeienmv7bkwf56riaft74igcv4hogis2alk7uznhpfznw66f2jhqtza.png"
  )
    src = bafybeienmv7bkwf56riaft74igcv4hogis2alk7uznhpfznw66f2jhqtza;
  if (
    props.src ===
    "/blog-assets/plottable-golden-train-by-greweb/bafybeihfy52llgg3jejvzx7y4ppxs3lrfhk4hbmp6vgwasmfhvuzziepdm.png"
  )
    src = bafybeihfy52llgg3jejvzx7y4ppxs3lrfhk4hbmp6vgwasmfhvuzziepdm;
  if (props.src === "/blog-assets/plottable-golden-train-by-greweb/profile.jpg")
    src = grewebProfilePic;
  if (props.src === "/blog-assets/plottable-golden-train-by-greweb/367.jpg")
    src = greweb367;
  if (props.src === "/blog-assets/plottable-golden-train-by-greweb/797-ego.jpg")
    src = grewebEgo797;
  if (props.src === "/blog-assets/plottable-golden-train-by-greweb/709.jpg")
    src = grewebTrain709;

  const bwid = 2;
  return (
    // <Figure>
    <Container fluid className={"Margin-B-8 Margin-T-12"}>
      <Row>
        <Col xs={bwid} sm={bwid} md={bwid} lg={bwid} xl={bwid} xxl={bwid} />
        <Col>
          <Image
            className={"figure-img img-fluid rounded"}
            alt={props.alt}
            title={props.title}
            src={src}
          />
          <figcaption className="figure-caption">{props.title}</figcaption>
        </Col>
        <Col xs={bwid} sm={bwid} md={bwid} lg={bwid} xl={bwid} xxl={bwid} />
      </Row>
    </Container>
    //   <Figure.Image
    //     className={"figure-img img-fluid rounded"}
    //     alt={props.alt}
    //     title={props.title}
    //     src={props.src}
    //   />
    //   <Figure.Caption>{props.title}</Figure.Caption>
    // </Figure>
  );
}
export function paragraphMd(props: any) {
  return <div className={styles.abouttext}>{props.children}</div>;
}
export function preMd(props: any) {
  return <pre className={styles.codepre}>{props.children}</pre>;
}
export function Markdown({
  markdown,
  showToc,
}: {
  markdown: string;
  showToc?: boolean;
}) {
  const toc: {
    level: number;
    id: string;
    title: string;
  }[] = [];
  // Magic.
  const addToTOC = ({
    children,
    ...props
  }: React.PropsWithChildren<HeadingProps>) => {
    const level = Number(props.node.tagName.match(/h(\d)/)?.slice(1));
    if (level && children && typeof children[0] === "string") {
      const id = children[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
      toc.push({
        level,
        id,
        title: children[0],
      });
    }
  };
  function TOC(props: any) {
    return (
      <ul className="table-of-contents">
        {toc.map(({ level, id, title }) => (
          <li key={id} className={`toc-entry-level-${level}`}>
            <a href={`#${id}`}>{title}</a>
          </li>
        ))}
      </ul>
    );
  }
  function h3(props: any) {
    addToTOC(props);
    const arr = props.children;
    let heading = "";

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.type !== undefined) {
        for (let j = 0; j < arr[i].props.children.length; j++) {
          heading += arr[i]?.props?.children[0];
        }
      } else heading += arr[i];
    }

    const slug = generateSlug(heading);
    return (
      <h3 id={slug} className={"Margin-B-12 Margin-T-12"}>
        <a
          className={`text-decoration-none text-reset text-decoration-underline `}
          href={`#${slug}`}
          {...props}
        ></a>
      </h3>
    );
  }
  function h4(props: any) {
    addToTOC(props);
    const arr = props.children;
    let heading = "";

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.type !== undefined) {
        for (let j = 0; j < arr[i].props.children.length; j++) {
          heading += arr[i]?.props?.children[0];
        }
      } else heading += arr[i];
    }

    const slug = generateSlug(heading);
    return (
      <h4 id={slug} className={"Margin-B-8 Margin-T-8"}>
        <a
          className={`text-decoration-none text-reset `}
          href={`#${slug}`}
          {...props}
        ></a>
      </h4>
    );
  }

  const MarkdownComponents: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
  > = {
    h4,
    h3,
    img: imgMd,
    p: paragraphMd,
    pre: preMd,
  };

  return (
    <div>
      <ReactMarkdown
        components={MarkdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
      {showToc ? <TOC className={styles.order1} /> : null}
    </div>
  );
}
