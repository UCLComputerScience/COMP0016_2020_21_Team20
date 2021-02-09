import { Modal } from 'rsuite';
import PropTypes from 'prop-types';

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

AlertDialog.propTypes = {
  /** Whether to open dialog or not */
  open: PropTypes.bool.isRequired,
  /** Function that is triggered by closing the alert */
  setOpen: PropTypes.func.isRequired,
  /** Title of the alert */
  title: PropTypes.string,
  /** Text of the alert */
  text: PropTypes.string,
  /** Content of the alert */
  content: PropTypes.object,
  /** Actions of the alert */
  actions: PropTypes.object,
};
