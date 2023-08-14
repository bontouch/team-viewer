import { useSearchStore } from '../NavBar/NavBar';
import classNames from 'classnames';
import { memo, useRef, useMemo, useCallback, forwardRef } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { scrollIntoViewWithOffset } from '../../helpers/utils';
import styles from './EmployeeAvatarAndName.module.scss';
import { useEmployeeToScrollToStore } from '../../pages/Teams/Teams';

const AvatarAndName = memo(
    forwardRef(({ isLoading, url, fullName, role, highlight }, ref) => {
        return (
            <li
                className={classNames([styles['employee-item'], highlight ? styles.highlight : ''])}
                ref={ref}>
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
                <div className={styles['name-and-role-container']}>
                    <p className={classNames([styles.name, highlight ? styles.highlight : ''])}>
                        {fullName}
                    </p>
                    <p className={classNames([styles.role, highlight ? styles.highlight : ''])}>
                        {role}
                    </p>
                </div>
            </li>
        );
    })
);

const EmployeeAvatarAndName = ({ fullName, url, isLoading, role, department, teamName }) => {
    const selected = useSearchStore((state) => state.selected);
    const { employeeToScrollTo, teamKey } = useEmployeeToScrollToStore(
        (state) => state.employeeToScrollTo
    );
    const ref = useRef(null);
    const highlight = useMemo(
        () =>
            selected !== null &&
            selected.length >= 3 &&
            (fullName.toLowerCase() === selected.toLowerCase() ||
                department.toLowerCase().includes(selected.toLowerCase())),
        [selected]
    );

    const scroll = useCallback(() => {
        if (highlight) {
            if (
                employeeToScrollTo &&
                teamKey &&
                employeeToScrollTo.toLowerCase() === fullName.toLowerCase() &&
                teamKey.toLowerCase() === teamName.toLowerCase()
            )
                scrollIntoViewWithOffset(ref.current, 45);
        }
    }, [highlight, employeeToScrollTo]);

    scroll();
    return (
        <AvatarAndName
            isLoading={isLoading}
            url={url}
            fullName={fullName}
            role={role}
            department={department}
            highlight={highlight}
            ref={ref}
        />
    );
};
export default EmployeeAvatarAndName;
