import { FC, useCallback, useState } from "react";
import { WorkSerializable } from "../../dbtypes/works/workSerializable";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ConfirmConfig.module.css";
import { FlexBox } from "../layout/FlexBoxCenter";
import { RowWideContainer } from "../layout/RowWideContainer";
import { LiveMedia } from "../media/LiveMedia";
import { normalizeIpfsUri } from "../../wasm/metadata";
import { generateTxHash } from "src/generateHash";
import { BsArrowRepeat } from "react-icons/bs";

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
    externalLink: "External Link",
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
    coverImageCid: null,
    creator: "Creator",
    slug: null,
    sg721: null,
    minter: null,
    startDate: null,
    createdDate: null,
    updatedDate: null,
  };
  const [hash, setHash] = useState<string>(generateTxHash());
  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  //https://react-bootstrap.netlify.app/forms/layout/#horizontal-form-label-sizing
  return (
    <Container>
      <h2>Confirm Collection Configuration</h2>
      <>
        <div>
          <Container>
            <RowWideContainer>
              <LiveMedia
                ipfsUrl={{
                  cid: w.codeCid,
                  hash,
                }}
                minHeight={500}
                style={{ minWidth: 500 }}
              ></LiveMedia>
              <a onClick={onClickRefreshHash}>
                <FlexBox
                  style={{
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div>New Hash</div>
                  <BsArrowRepeat style={{ marginLeft: ".5rem" }} />
                </FlexBox>
              </a>
            </RowWideContainer>
          </Container>
        </div>
        <br />
        <hr />
        <div>
          {Object.keys(pairs)
            .filter((k) => !!pairs[k as keyof WorkSerializable])
            .map((k) => {
              return (
                <Row key={k}>
                  <Form.Group>
                    <Form.Label
                      column="sm"
                      lg={12}
                      className={styles.labelTitle}
                    >
                      {pairs[k as keyof WorkSerializable]}
                    </Form.Label>
                    <Col>
                      <Form.Label column="lg" size="sm">
                        {w[k as keyof WorkSerializable]}
                      </Form.Label>
                    </Col>
                  </Form.Group>
                </Row>
              );
            })}
        </div>
      </>
    </Container>
  );
};
