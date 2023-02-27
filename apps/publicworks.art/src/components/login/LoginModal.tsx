import { FC } from "react";
import { Button, Modal } from "react-bootstrap";

interface Props {
  handleClose: () => void;
  isOpen?: boolean;
}
export const LoginModal: FC<Props> = (props: Props) => {
  const show = !!props.isOpen;
  const handleClose = props.handleClose;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
