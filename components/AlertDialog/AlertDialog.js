import { Modal } from 'rsuite';

export default function AlertDialog(props) {
  return (
    <Modal show={props.open} onHide={() => props.setOpen(false)}>
      <Modal.Header>{props.title}</Modal.Header>
      <Modal.Body>
        <p>{props.text}</p>
        <p>{props.content}</p>
      </Modal.Body>
      <Modal.Footer>{props.actions}</Modal.Footer>
    </Modal>
  );
}
