import styles from './Header.module.css';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import { ProfileButton } from '..';
import roles from '../../lib/roles';

const paths = {
  [roles.USER_TYPE_ADMIN]: ['TODO'],
  [roles.USER_TYPE_HEALTH_BOARD]: ['statistics'],
  [roles.USER_TYPE_HOSPITAL]: ['statistics'],
  [roles.USER_TYPE_DEPARTMENT]: ['statistics', 'self-assessment', 'manage'],
  [roles.USER_TYPE_CLINICIAN]: ['statistics', 'self-assessment'],
};

function Header() {
  const router = useRouter();
  const [session, loading] = useSession(); // TODO use loading state better?

  const renderLinks = () => {
    const role = session.roles[0]; // TODO do we want to support multiple roles?
    const pathsForRole = paths[role];
    if (!pathsForRole) return <div />;

    return pathsForRole.map((path, i) => (
      <Link key={i} href={'/'.concat(path)}>
        <li
          className={`${styles.link} ${
            router.pathname === `/${path}` && styles.active
          }`}>
          {path}
        </li>
      </Link>
    ));
  };

  return (
    <nav className={styles.header}>
      <h1 className={styles.logo}>NHSW Safety and Care Standards</h1>
      <ul className={styles.links}>{session && renderLinks()}</ul>
      <ProfileButton />
    </nav>
  );
}

export default Header;
