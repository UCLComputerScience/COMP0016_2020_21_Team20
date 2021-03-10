import { useState } from 'react';
import PropTypes from 'prop-types';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Alert,
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

import { Roles } from '../../lib/constants';

const PASSWORD_LENGTH = 15;
const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!$';

const generateRandomPassword = () => {
  let password = '';
  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    password += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return password;
};

export default function NewUserForm({ userType, onError, onSuccess }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [entityId, setEntityId] = useState(null);
  const [entities, setEntities] = useState([]);

  const renderEntityFormGroup = () => {
    if (
      userType !== Roles.USER_TYPE_HEALTH_BOARD &&
      userType !== Roles.USER_TYPE_HOSPITAL
    ) {
      return <span />;
    }

    const textToDisplay =
      userType === Roles.USER_TYPE_HEALTH_BOARD ? 'Health Board' : 'Hospital';
    const apiEndpoint =
      userType === Roles.USER_TYPE_HEALTH_BOARD ? 'health_boards' : 'hospitals';

    return (
      <FormGroup>
        <ControlLabel>{textToDisplay}</ControlLabel>
        <FormControl
          value={entityId}
          name="id"
          cleanable={false}
          accepter={SelectPicker}
          onOpen={() =>
            fetch(`/api/${apiEndpoint}`)
              .then(res => res.json())
              .then(res => setEntities(res))
          }
          data={entities.map(e => ({ label: e.name, value: e.id }))}
          onChange={setEntityId}
          renderMenu={menu =>
            entities.length ? menu : <Icon icon="spinner" spin />
          }
        />
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
    );
  };

  const handleSubmit = async () => {
    const res = await fetch(`/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        user_type: userType,
        entity_id: entityId,
      }),
    })
      .then(res => res.json())
      .catch(error => {
        console.error('Error adding new user', error);
        return {
          error: true,
          message:
            'There was an error adding the new user. Please check your network connection and try again later.',
        };
      });

    if (res.error) onError(res.message);
    else onSuccess();
  };

  return (
    <Form fluid id="newUserForm">
      <FormGroup>
        <ControlLabel>Email address</ControlLabel>
        <FormControl value={email} name="email" onChange={setEmail} />
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
      {renderEntityFormGroup()}
      <FormGroup>
        <ControlLabel>Password</ControlLabel>
        <FormControl value={password} name="password" onChange={setPassword} />
        <ButtonToolbar>
          <Button
            onClick={() => setPassword(generateRandomPassword())}
            id="generatePassword">
            Generate random password
          </Button>
          <CopyToClipboard text={password} id="copyPassword">
            <Button
              onClick={() => Alert.info('Copied password to clipboard', 3000)}>
              Copy to clipboard
            </Button>
          </CopyToClipboard>
        </ButtonToolbar>
        <HelpBlock>
          Required &mdash; the user will be required to update this on first
          login
        </HelpBlock>
      </FormGroup>
      <FormGroup>
        <ButtonToolbar>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            id="submitNewUser">
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
  /** Callback function to be called on error with the error message */
  onError: PropTypes.func.isRequired,
  /** Callback function to be called on success (with no parameters) */
  onSuccess: PropTypes.func.isRequired,
};
