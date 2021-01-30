import { Nav, Button } from 'rsuite';
import Link from 'next/link';

import styles from './error.module.css';

function Error({ statusCode }) {
  return (
    <div>
        <Nav className={styles.header}>
            <Link href="/">
            <Nav.Item className={styles.logoWrapper}>
                <span className={styles.logo}>CQ Dashboard</span>
            </Nav.Item>
            </Link>
        </Nav>
        <div className={styles.content}>
            <p>
            {statusCode
                ? `A ${statusCode} error occurred on the server. Please try again later or contact the system administrator if the issue persists.`
                : 'An unknown error occurred. Please try again later or contact the system administrator if the issue persists.'}
            </p>
            <Link href="/">
              <Button appearance="primary" >Go to home page</Button>
            </Link>
        </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
