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

import { Roles } from '../../lib/constants';

export default function NewUserForm({ userType }) {
  const [email, setEmail] = useState(null);
  const [id, setId] = useState(null);
  const [entities, setEntities] = useState([]);

  const renderEntityFormGroup = () => {
    const isHealthBoard = userType === Roles.USER_TYPE_HEALTH_BOARD;
    const isHospital = userType === Roles.USER_TYPE_HOSPITAL;

    if (userType === null || (!isHealthBoard && !isHospital)) {
      return <span />;
    }

    const textToDisplay = isHealthBoard ? 'Health Board' : 'Hospital';
    const apiEndpoint = isHealthBoard ? 'health_boards' : 'hospitals';

    return (
      <FormGroup>
        <ControlLabel>{textToDisplay}</ControlLabel>
        <FormControl
          value={id}
          name="id"
          cleanable={false}
          accepter={SelectPicker}
          onOpen={() =>
            fetch(`/api/${apiEndpoint}`)
              .then(res => res.json())
              .then(res => setEntities(res))
          }
          data={entities.map(e => ({ label: e.name, value: e.id }))}
          onChange={setId}
        />
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
    );
  };

  const handleSubmit = async () => {
    return await fetch(`/api/users`, {
      method: 'POST',
      body: JSON.stringify({ email, user_type: userType, id }),
    }).then(res => res.json());
  };

  return (
    <Form fluid>
      <FormGroup>
        <ControlLabel>Email address</ControlLabel>
        <FormControl value={email} name="email" onChange={setEmail} />
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

NewUserForm.propTypes = {
  /** What user type is the new user to be? e.g. `health_board` or `hospital` */
  userType: PropTypes.string.isRequired,
};
