import { Button } from 'rsuite';
import { useRouter } from 'next/router';

function NoAccess() {
  const router = useRouter();
  return (
    <div style={{ textAlign: 'center' }}>
      <p>You do not have access to this page</p>
      <Button appearance="primary" onClick={() => router.push('/')}>
        Go to home page
      </Button>
    </div>
  );
}

export default NoAccess;
