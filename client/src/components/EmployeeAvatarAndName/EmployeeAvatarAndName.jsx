import { useSearchStore } from '../NavBar/NavBar';
import classNames from 'classnames';
import { memo, useEffect, useState, useRef } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { scrollIntoViewWithOffset } from '../../helpers/utils';
import styles from './EmployeeAvatarAndName.module.scss';

const Avatar = memo(({ isLoading, url, fullName, role, highlight }) => {
    return (
        <>
            {isLoading ? (
                <div className={styles['avatar-icon-container']}>
                    <FontAwesomeIcon icon={faUser} fade size="7x" className={styles.icon} />
                </div>
            ) : !url ? (
                <div className={styles['avatar-icon-container']}>
                    <FontAwesomeIcon icon={faUser} size="7x" className={styles.icon} />
                </div>
            ) : (
                <img className={styles.avatar} src={url} alt="employee avatar" />
            )}
            <p className={classNames([styles.name, highlight ? styles.highlight : ''])}>
                {fullName}
            </p>
            <p className={classNames([styles.role, highlight ? styles.highlight : ''])}>{role}</p>
        </>
    );
});

const EmployeeAvatarAndName = ({ fullName, url, isLoading, role }) => {
    const selected = useSearchStore((state) => state.selected);
    const [highlight, setHighlight] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const highlight =
            selected !== null &&
            selected.length >= 3 &&
            fullName.toLowerCase() === selected.toLowerCase();

        setHighlight(highlight);

        if (highlight && document.body.getBoundingClientRect().width <= 900) {
            scrollIntoViewWithOffset(ref.current, 130);
        }
    }, [selected, fullName]);

    return (
        <li
            className={classNames([styles['employee-item'], highlight ? styles.highlight : ''])}
            ref={ref}>
            <Avatar
                isLoading={isLoading}
                url={url}
                fullName={fullName}
                role={role}
                highlight={highlight}
            />
        </li>
    );
};
export default EmployeeAvatarAndName;
