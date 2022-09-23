import { FC } from "react";
import { WorkSerializable } from "../../dbtypes/works/workSerializable";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ConfirmConfig.module.css";

interface ConfirmConfigProps {
  work: WorkSerializable;
}

export const ConfirmConfig: FC<ConfirmConfigProps> = (
  props: ConfirmConfigProps
) => {
  const w = props.work;

  type Mapping = Record<keyof WorkSerializable, string | null>;

  const pairs: Mapping = {
    name: "Name",
    description: "Description",
    blurb: "Blurb",
    maxTokens: "Collection Size",
    priceStars: "Price $STARS",
    royaltyAddress: "Royalty Receiver",
    royaltyPercent: "Royalty Percent",
    resolution: "Resolution",
    pixelRatio: "Pixel Ratio",
    selector: "CSS Selector",
    license: "License",
    id: null,
    codeCid: "Code IPFS CID",
    creator: null,
    slug: null,
    sg721: null,
    minter: null,
    startDate: null,
    createdDate: null,
    updatedDate: null,
  };

  //https://react-bootstrap.netlify.app/forms/layout/#horizontal-form-label-sizing
  return (
    <Container>
      {Object.keys(pairs)
        .filter((k) => !!pairs[k as keyof WorkSerializable])
        .map((k) => {
          return (
            <Row key={k}>
              <Form.Label column="lg" lg={2} className={styles.labelTitle}>
                {pairs[k as keyof WorkSerializable]}
              </Form.Label>
              <Col>
                <Form.Label column="lg" size="lg">
                  {w[k as keyof WorkSerializable]}
                </Form.Label>
              </Col>
            </Row>
          );
        })}
    </Container>
  );
};
