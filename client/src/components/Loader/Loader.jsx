import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './Loader.module.scss';

const Loader = () => (
    <div className={styles.load}>
        <span>
            <FontAwesomeIcon icon={faSpinner} spin size="10x" className={styles.icon} />
        </span>
    </div>
);

export default Loader;
