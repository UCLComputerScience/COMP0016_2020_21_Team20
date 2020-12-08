import styles from './Header.module.css';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { ProfileButton } from '..';

const paths = ['statistics', 'self-assessment', 'manage'];

function Header(props) {
  // TODO show different links depending on logged in user
  const router = useRouter();

  return (
    <nav className={styles.header}>
      <h1 className={styles.logo}>NHSW Safety and Care Standards</h1>

      <ul className={styles.links}>
        {paths.map((path, i) => (
          <Link key={i} href={'/'.concat(path)}>
            <li
              className={`${styles.link} ${
                router.pathname === `/${path}` && styles.active
              }`}>
              {path}
            </li>
          </Link>
        ))}
      </ul>

      <ProfileButton />
    </nav>
  );
}

export default Header;
