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
} from 'rsuite';

function NewEntityForm({ healthBoard, hospital }) {
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
            fetch(`/api/health_board`)
              .then(res => res.json())
              .then(res => setParentEntities(res))
          }
          data={parentEntities.map(e => ({ label: e.name, value: e.id }))}
          onChange={setParentId}
        />
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
    );
  };

  const handleSubmit = async () => {
    if (hospital) {
      return await fetch(`/api/hospitals`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      }).then(res => res.json());
    } else if (healthBoard) {
      return await fetch(`/api/health_boards`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      }).then(res => res.json());
    }
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
};

export default NewEntityForm;
