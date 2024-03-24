// @flow
import { FC } from "react";
import { UserSerializable } from "../../../../../packages/db-typeorm/src/serializable/users/userSerializable";
import { Col, Form, Row } from "react-bootstrap";
import { WorkSerializable } from "../../../../../packages/db-typeorm/src/serializable/works/workSerializable";
import { useStargazeClient, useWallet } from "../../../@stargazezone/client";
import { useProfileInfo } from "../../hooks/sg-names";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

interface Props {
  user: UserSerializable;
}
export const UserProfile: FC<Props> = ({ user }: Props) => {
  const sgwallet = useWallet();
  const useName = useProfileInfo({ address: sgwallet.wallet?.address });
  //name: 'twitter', value: 'stewbracken', verified: null
  const twitterRecord = useName?.textRecords?.find(
    (r: any) => r.name === "twitter"
  );
  return (
    <>
      <Row>
        <Form.Group>
          <Col>
            <Form.Label
              // @ts-ignore
              column="md"
              size="sm"
            >
              <>
                {useName.isLoading && "Loading..."}
                {!useName.isLoading &&
                  useName.walletName &&
                  useName.walletName + ".stars"}
                {!useName.isLoading && !useName.walletName && "No Name"}
              </>
            </Form.Label>
          </Col>
        </Form.Group>
      </Row>

      <Row>
        <Form.Label
          column="sm"
          lg={12}
          // className={styles.labelTitle}
        ></Form.Label>
        <Col>
          <Form.Label
            // @ts-ignore
            column="md"
            size="sm"
            className={"tw-mt-0"}
          >
            {useName.isLoading && "Loading..."}
            {!useName.isLoading && twitterRecord?.value && (
              <>
                <span>
                  <FontAwesomeIcon icon={faTwitter} width={16} height={16} /> @
                  {twitterRecord.value}
                  {twitterRecord.verified ? (
                    <FontAwesomeIcon icon={"certificate"} />
                  ) : null}{" "}
                </span>
              </>
            )}
          </Form.Label>
        </Col>
      </Row>
    </>
  );
};
