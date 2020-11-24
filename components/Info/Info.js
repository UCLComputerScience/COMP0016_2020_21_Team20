import { Info as InfoIcon } from '@material-ui/icons';

import styles from './Info.module.css';

function Info(props) {
  return (
    <a
      className={styles.trainingUrlButton}
      href={props.url}
      target="_blank"
      rel="noopener noreferer">
      <InfoIcon />
    </a>
  );
}

export default Info;
