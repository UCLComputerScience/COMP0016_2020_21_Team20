import styles from './Header.module.css';
import { Button } from '@material-ui/core';
//Logo
//statistics
//self assessment
// profile page

const paths = ['statistics', 'self-assessment', 'manage'];

function Header(props) {
  return (
    <nav className={styles.header}>
      {/*logo on the left*/}
      <h1 className={styles.header__nav}>NHSW Safety and Care Standards</h1>
      {/*3 links: Statistics, Self Assessment */}

      <div className={styles.header__nav}>
        {paths.map(path => (
          <Button href={'/'.concat(path)} className={styles.header__link}>
            <div
              className={
                path.localeCompare(props.curPath)
                  ? styles.header__option
                  : styles.header__selected__option
              }>
              <span className={styles.header__optionLineTwo}> {path}</span>
            </div>
          </Button>
        ))}
      </div>
    </nav>
  );
}

export default Header;
