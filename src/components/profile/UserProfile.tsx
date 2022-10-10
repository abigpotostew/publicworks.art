// @flow
import { FC } from "react";
import { UserSerializable } from "src/dbtypes/users/userSerializable";
import { Col, Form, Row } from "react-bootstrap";
import { WorkSerializable } from "src/dbtypes/works/workSerializable";

interface Props {
  user: UserSerializable;
}
export const UserProfile: FC<Props> = ({ user }: Props) => {
  return (
    <>
      <Row>
        <Form.Group>
          <Form.Label
            column="sm"
            lg={12}
            // className={styles.labelTitle}
          >
            Address
          </Form.Label>
          <Col>
            <Form.Label column="lg" size="sm">
              {user.address}
            </Form.Label>
          </Col>
        </Form.Group>
      </Row>
    </>
  );
};
