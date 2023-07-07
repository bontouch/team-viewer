import styles from './Slider.module.scss';

const Slider = ({ callback, defaultChecked }) => (
    <label className={styles.switch}>
        <input type="checkbox" onChange={callback} defaultChecked={defaultChecked} />
        <span className={styles.slider}></span>
        <div className={styles.wrapper}>
            <p className={styles.name}>Name</p>
            <p className={styles.ca}>CA</p>
        </div>
    </label>
);

export default Slider;
