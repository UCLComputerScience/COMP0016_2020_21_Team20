import { Icon } from 'rsuite';

import PropTypes from 'prop-types';
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

Info.propTypes = {
  /** The (training) url this info icon links to */
  url: PropTypes.string.isRequired,
};

export default Info;
