import { Footer as FooterComponent } from 'rsuite';
import styles from './Footer.module.css';

function Footer() {
  return (
    <FooterComponent className={styles.footer}>
      <a
        className={styles.link}
        target="_blank"
        rel="noopener noreferer"
        href="https://comp0016-team-20.github.io/blog/">
        Development Blog
      </a>
      <a
        className={styles.link}
        target="_blank"
        rel="noopener noreferer"
        href="https://abuhb.nhs.wales/use-of-site/privacy-policy/">
        Privacy Policy
      </a>
      <a
        className={styles.link}
        target="_blank"
        rel="noopener noreferer"
        href="https://forms.office.com/Pages/ResponsePage.aspx?id=_oivH5ipW0yTySEKEdmlwqQsVN_qV_tIhIq5N2SskKtUNU1XTkZUVlFPUVhJQ0o2UEFQNTM1NVg5Ti4u">
        Please share your feedback!
      </a>
      <i>
        Developed as part of the{' '}
        <a
          target="_blank"
          rel="noopener noreferer"
          href="https://www.ucl.ac.uk/computer-science/collaborate/ucl-industry-exchange-network-ucl-ixn">
          UCL Industry Exchange Network
        </a>
      </i>
    </FooterComponent>
  );
}

export default Footer;
