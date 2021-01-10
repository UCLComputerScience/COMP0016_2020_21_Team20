import { Icon } from 'rsuite';
import styles from './Info.module.css';

function Info(props) {
  return (
    <a
      className={styles.trainingUrlButton}
      href={props.url}
      target="_blank"
      rel="noopener noreferer">
      <Icon size="lg" icon="info" />
    </a>
  );
}

export default Info;
