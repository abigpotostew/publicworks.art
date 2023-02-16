// @flow
import { FC } from "react";
import { UserSerializable } from "src/dbtypes/users/userSerializable";
import { Col, Form, Row } from "react-bootstrap";
import { WorkSerializable } from "src/dbtypes/works/workSerializable";
import { useStargazeClient, useWallet } from "../../../@stargazezone/client";
import { useProfileInfo } from "../../hooks/sg-names";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  user: UserSerializable;
}
export const UserProfile: FC<Props> = ({ user }: Props) => {
  const sgwallet = useWallet();
  const useName = useProfileInfo({ address: sgwallet.wallet?.address });
  //name: 'twitter', value: 'stewbracken', verified: null
  const twitterRecord = useName?.textRecords?.find((r) => r.name === "twitter");
  return (
    <>
      <Row>
        <Form.Group>
          <Form.Label
            column="sm"
            lg={12}
            // className={styles.labelTitle}
          >
            Stars Name
          </Form.Label>
          <Col>
            <Form.Label
              // @ts-ignore
              column="md"
              size="sm"
            >
              {useName.isLoading && "Loading..."}
              {!useName.isLoading &&
                useName.walletName &&
                useName.walletName + ".stars"}
              {!useName.isLoading && !useName.walletName && "No Name"}
            </Form.Label>
          </Col>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group>
          <Form.Label
            column="sm"
            lg={12}
            // className={styles.labelTitle}
          >
            Twitter
          </Form.Label>
          <Col>
            <Form.Label
              // @ts-ignore
              column="md"
              size="sm"
            >
              {useName.isLoading && "Loading..."}
              {!useName.isLoading && twitterRecord?.value && (
                <>
                  <span>
                    {twitterRecord.verified ? (
                      <FontAwesomeIcon icon={"certificate"} />
                    ) : null}{" "}
                    @{twitterRecord.value}
                  </span>
                </>
              )}
              {!useName.isLoading && !twitterRecord?.value && "-"}
            </Form.Label>
          </Col>
        </Form.Group>
      </Row>
    </>
  );
};
