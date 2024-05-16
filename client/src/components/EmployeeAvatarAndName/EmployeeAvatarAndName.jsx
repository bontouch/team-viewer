import { useSearchStore } from '../NavBar/NavBar';
import classNames from 'classnames';
import { memo, useRef, useMemo, useCallback, forwardRef } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { normalizeString, scrollIntoViewWithOffset } from '../../helpers/utils';
import styles from './EmployeeAvatarAndName.module.scss';
import { useEmployeeToScrollToStore } from '../../pages/Teams/Teams';

const AvatarAndName = memo(
    forwardRef(({ isLoading, url, fullName, role, highlight, title }, ref) => {
        return (
            <li
                className={classNames([styles['employee-item'], highlight ? styles.highlight : ''])}
                ref={ref}>
                {title ? (
                    <span className={classNames([styles.pill, styles.title])}>
                        <p className={styles.role}>{title}</p>
                    </span>
                ) : null}
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
                    <span className={styles.pill}>
                        <p className={styles.role}>{role}</p>
                    </span>
                </div>
            </li>
        );
    })
);

const EmployeeAvatarAndName = ({ fullName, url, isLoading, role, department, teamName, title }) => {
    const selected = useSearchStore((state) => state.selected);
    const [{ employeeToScrollTo, teamKey }, shouldScroll] = useEmployeeToScrollToStore((state) => [
        state.employeeToScrollTo,
        state.shouldScroll
    ]);
    const ref = useRef(null);
    const highlight = useMemo(
        () =>
            selected !== null &&
            selected.length >= 3 &&
            (normalizeString(fullName) === normalizeString(selected) ||
                normalizeString(department).includes(normalizeString(selected))),
        [selected]
    );

    const scroll = useCallback(() => {
        if (highlight && ref.current && shouldScroll) {
            if (
                employeeToScrollTo &&
                teamKey &&
                normalizeString(employeeToScrollTo) === normalizeString(fullName) &&
                normalizeString(teamKey) === normalizeString(teamName)
            )
                scrollIntoViewWithOffset(ref.current, 45);
        }
    }, [highlight, employeeToScrollTo, ref.current, shouldScroll]);

    scroll();
    return (
        <AvatarAndName
            isLoading={isLoading}
            url={url}
            fullName={fullName}
            role={role}
            department={department}
            highlight={highlight}
            title={title}
            ref={ref}
        />
    );
};
export default EmployeeAvatarAndName;
