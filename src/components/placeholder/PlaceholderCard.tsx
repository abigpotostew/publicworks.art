// @flow
import * as React from "react";
import { Button, Card, Placeholder } from "react-bootstrap";

export const PlaceholderCard = ({ className }: { className?: string }) => {
  return (
    <Card style={{ minWidth: "24rem" }} className={className}>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow" className={"mb-4"}>
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow" className={"mb-5"}>
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
      </Card.Body>
      <Card.Footer className={"mb-1 bg-white"}>
        <Placeholder animation="glow" className={"mb-2 bg-white"}>
          <Placeholder xs={7} /> <Placeholder xs={4} />
        </Placeholder>
      </Card.Footer>
    </Card>
  );
};
