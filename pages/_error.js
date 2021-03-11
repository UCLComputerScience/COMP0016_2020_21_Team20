import { Nav, Button } from 'rsuite';
import Link from 'next/link';
import styles from './error.module.css';
import PropTypes from 'prop-types';

/**
 * This overrides the default Next.js Error page.
 * It displays a styled header with a message informing the user of an error and
 * a button which takes them back to the homepage so they can recover from the error.
 *
 * @param statusCode the error code that has occurred
 */
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
          <Button appearance="primary">Go to home page</Button>
        </Link>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

Error.propTypes = {
  statusCode: PropTypes.number,
};

export default Error;
