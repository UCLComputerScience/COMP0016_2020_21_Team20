import { Link } from '@material-ui/core';
import { Footer as FooterComponent } from 'rsuite';
import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.footer}>
      <FooterComponent>
        <div className={styles.About}>
          <p>CQ Dashboard Team 20 UCL</p>
          <p>UCL Team 20 - IXN Exchange Program</p>
          <Link>https://comp0016-team-20.github.io/blog/</Link>
        </div>
      </FooterComponent>
    </div>
  );
}

export default Footer;
