import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  SelectPicker,
  Button,
  ButtonToolbar,
  Icon,
} from 'rsuite';

function NewEntityForm({ healthBoard, hospital, onSuccess, onError }) {
  const [name, setName] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [parentEntities, setParentEntities] = useState([]);

  const renderEntityFormGroup = () => {
    // Only hospitals have a 'parent' entity (health board)
    if (!hospital) return <span />;

    return (
      <FormGroup>
        <ControlLabel>Health Board</ControlLabel>
        <FormControl
          value={parentId}
          name="id"
          cleanable={false}
          accepter={SelectPicker}
          onOpen={() =>
            fetch(`/api/health_boards`)
              .then(res => res.json())
              .then(res => setParentEntities(res))
          }
          data={parentEntities.map(e => ({ label: e.name, value: e.id }))}
          onChange={setParentId}
          renderMenu={menu =>
            parentEntities.length ? menu : <Icon icon="spinner" spin />
          }
        />
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
    );
  };

  const handleSubmit = async () => {
    let res;
    if (hospital) {
      res = await fetch(`/api/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, health_board_id: parentId }),
      }).then(res => res.json());
    } else if (healthBoard) {
      res = await fetch(`/api/health_boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then(res => res.json());
    }

    if (res.error) onError(res.message);
    else onSuccess();
  };

  return (
    <Form fluid>
      <FormGroup>
        <ControlLabel>Name</ControlLabel>
        <FormControl value={name} name="name" onChange={setName} />
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
      {renderEntityFormGroup()}
      <FormGroup>
        <ButtonToolbar>
          <Button appearance="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </ButtonToolbar>
      </FormGroup>
    </Form>
  );
}

NewEntityForm.propTypes = {
  /** Is the new entity to be added a health board? */
  healthBoard: PropTypes.bool,
  /** Is the new entity to be added a hospital? */
  hospital: PropTypes.bool,
  /** Callack function to be called on error with the error message */
  onError: PropTypes.func.isRequired,
  /** Callack function to be called on success (with no parameters) */
  onSuccess: PropTypes.func.isRequired,
};

export default NewEntityForm;
