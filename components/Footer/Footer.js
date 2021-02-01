import Link from 'next/link';
import { Footer as FooterComponent } from 'rsuite';
import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.footer}>
      <FooterComponent>
        <Link href="https://comp0016-team-20.github.io/blog/">
          <a>Blog</a>
        </Link>
        <p>CQ Dashboard Team 20 UCL</p>
        <Link href="https://abuhb.nhs.wales/use-of-site/privacy-policy/">
          <a>Privacy Policy</a>
        </Link>
        <p>UCL IXN Exchange Program</p>
        <Link href=" https://forms.office.com/Pages/ResponsePage.aspx?id=_oivH5ipW0yTySEKEdmlwqQsVN_qV_tIhIq5N2SskKtUNU1XTkZUVlFPUVhJQ0o2UEFQNTM1NVg5Ti4u">
          <a>Please give us your Feedback!</a>
        </Link>
      </FooterComponent>
    </div>
  );
}

export default Footer;
