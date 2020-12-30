import { Button } from '@material-ui/core';
import { signIn } from 'next-auth/client';

function LoginMessage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <p>You must login or register to use the Care Quality Dashboard.</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => signIn('keycloak')}>
        Login or Register
      </Button>
    </div>
  );
}

export default LoginMessage;
