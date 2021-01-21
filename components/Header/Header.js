import { useRef, useState, useEffect } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Icon, Nav } from 'rsuite';
import Link from 'next/link';

import styles from './Header.module.css';

import { Roles } from '../../lib/constants';
import { ProfileButton } from '..';

const paths = {
  [Roles.USER_TYPE_ADMIN]: ['manage'],
  [Roles.USER_TYPE_HEALTH_BOARD]: ['statistics'],
  [Roles.USER_TYPE_HOSPITAL]: ['statistics', 'manage'],
  [Roles.USER_TYPE_DEPARTMENT]: ['statistics', 'self-reporting', 'manage'],
  [Roles.USER_TYPE_CLINICIAN]: ['statistics', 'self-reporting'],
};

function Header({ session }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const renderLinks = () => {
    const role = session.roles[0]; // TODO do we want to support multiple roles?
    const pathsForRole = paths[role];
    if (!pathsForRole) return <span />;

    return pathsForRole.map((path, i) => (
      <Link key={i} href={'/'.concat(path)}>
        <Nav.Item active={router.pathname === `/${path}`}>{path}</Nav.Item>
      </Link>
    ));
  };

  useEffect(() => {
    const handleClickOutside = event =>
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      setIsOpen(false);

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuRef]);

  return (
    <Nav className={styles.header}>
      <Link href="/">
        <Nav.Item className={styles.logoWrapper}>
          <span className={styles.logo}>CQ Dashboard</span>
        </Nav.Item>
      </Link>
      {session && (
        <div className={styles.navbarExpandIcon}>
          <Icon icon="bars" onClick={() => setIsOpen(!isOpen)} />
        </div>
      )}
      <div
        ref={mobileMenuRef}
        className={`${styles.links} ${isOpen ? styles.open : ''}`}>
        {session && renderLinks()}
        <div className={styles.profile}>
          {session ? (
            <ProfileButton session={session} />
          ) : (
            <Nav.Item onClick={() => signIn('keycloak')}>Log in</Nav.Item>
          )}
        </div>
      </div>
    </Nav>
  );
}

export default Header;
