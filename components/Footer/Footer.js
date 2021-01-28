import Link from 'next/link';
import { Footer as FooterComponent } from 'rsuite';
import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.footer}>
      <FooterComponent>
        <div className={styles.About}>
          <p>CQ Dashboard Team 20 UCL</p>
          <p>UCL IXN Exchange Program</p>
          <Link href="https://comp0016-team-20.github.io/blog/">
            <a>Blog</a>
          </Link>
        </div>
      </FooterComponent>
    </div>
  );
}

export default Footer;
