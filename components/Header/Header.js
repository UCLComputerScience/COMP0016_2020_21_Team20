import { useRef, useState, useEffect } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Icon, Nav, Button } from 'rsuite';
import Link from 'next/link';

import styles from './Header.module.css';

import { Roles } from '../../lib/constants';
import { ProfileButton } from '..';

const paths = {
  [Roles.USER_TYPE_HEALTH_BOARD]: ['statistics'],
  [Roles.USER_TYPE_HOSPITAL]: ['statistics', 'manage'],
  [Roles.USER_TYPE_DEPARTMENT]: ['statistics', 'self-reporting', 'manage'],
  [Roles.USER_TYPE_CLINICIAN]: ['statistics', 'self-reporting'],
  [Roles.USER_TYPE_ADMIN]: ['admin'],
};

function Header({ session }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const renderLinks = () => {
    const userPaths = [];
    Object.entries(paths).forEach(([role, paths]) => {
      if (!session.user.roles.includes(role)) return;
      userPaths.push(...paths);
    });

    return userPaths.map((path, i) => (
      <Link key={i} href={'/'.concat(path)}>
        <Nav.Item active={router.pathname === `/${path}`}>{path}</Nav.Item>
      </Link>
    ));
  };

  useEffect(() => {
    //to ensure the right mode that is saved is displayed
    if (window.localStorage.getItem('dark') === 'true') {
      document.body.classList.toggle('dark-mode', true);
    } else {
      document.body.classList.toggle('dark-mode', false);
    }

    const handleClickOutside = event => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      } else if (event.target.id === 'navbar-expand-icon') {
        setIsOpen(isOpen => !isOpen);
      }

      event.stopPropagation();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuRef, isOpen]);

  const toggleDark = () => {
    const wasLight = window.localStorage.getItem('dark') === 'false';
    window.localStorage.setItem('dark', wasLight ? 'true' : 'false');
    if (wasLight) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <Nav className={styles.header}>
      <Link href="/">
        <Nav.Item className={styles.logoWrapper}>
          <span className={styles.logo}>CQ Dashboard</span>
        </Nav.Item>
      </Link>
      {session && (
        <Icon
          id="navbar-expand-icon"
          className={styles.navbarExpandIcon}
          icon="bars"
        />
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
          <Button
            className={styles.themeToggle}
            appearance="ghost"
            onClick={() => toggleDark()}>
            <Icon icon="moon-o" />
          </Button>
        </div>
      </div>
    </Nav>
  );
}

export default Header;
