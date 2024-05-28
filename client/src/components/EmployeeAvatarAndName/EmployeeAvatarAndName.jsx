import { useSearchStore } from '../NavBar/NavBar';
import classNames from 'classnames';
import { memo, useRef, useMemo, useCallback, forwardRef } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { normalizeString, scrollIntoViewWithOffset } from '../../helpers/utils';
import styles from './EmployeeAvatarAndName.module.scss';
import { useEmployeeToScrollToStore } from '../../pages/Teams/Teams';
import { ReactComponent as ParentalLeaveIcon } from 'images/parental-leave.svg';
import { ReactComponent as VacationIcon } from 'images/vacation.svg';
import { ReactComponent as LoadingAvatar } from 'images/loading.svg';

const PolicyIcon = ({ leavePolicy }) => {
    switch (leavePolicy) {
        case 'Parental leave':
            return (
                <li>
                    <ParentalLeaveIcon />
                </li>
            );

        case 'Vacation':
            return (
                <li>
                    <VacationIcon />
                </li>
            );
        default:
            null;
    }
};

const StatusList = ({ title, leavePolicy }) => (
    <ul className={classNames([styles['status-list']])}>
        <PolicyIcon leavePolicy={leavePolicy} />
        {title ? (
            <li>
                <span className={classNames([styles.pill, styles.title])}>
                    <p className={styles.role}>{title}</p>
                </span>
            </li>
        ) : null}
    </ul>
);

const SlackAndHiBobLinks = ({ slackLink, hiBobLink }) => {
    if (!(slackLink || hiBobLink)) return null;
    return (
        <div className={styles['slack-and-hiBob-links']}>
            <ul>
                {slackLink ? (
                    <li>
                        <a
                            href={slackLink}
                            className={classNames([styles['link-icon'], styles['slack']])}
                        />
                    </li>
                ) : null}
                {hiBobLink ? (
                    <li>
                        <a
                            target="_blank"
                            href={hiBobLink}
                            className={classNames([styles['link-icon'], styles['hiBob']])}
                            rel="noreferrer"
                        />
                    </li>
                ) : null}
            </ul>
        </div>
    );
};

const AvatarAndName = memo(
    forwardRef(
        (
            { isLoading, url, fullName, role, highlight, title, leavePolicy, slackLink, hiBobLink },
            ref
        ) => {
            return (
                <li
                    className={classNames([
                        styles['employee-item'],
                        highlight ? styles.highlight : ''
                    ])}
                    ref={ref}>
                    <StatusList title={title} leavePolicy={leavePolicy} />
                    {isLoading ? (
                        <div className={styles['avatar-icon-container']}>
                            <LoadingAvatar
                                className={classNames([styles['loading-icon'], styles.icon])}
                            />
                        </div>
                    ) : !url ? (
                        <div className={styles['avatar-icon-container']}>
                            <FontAwesomeIcon icon={faUser} size="7x" className={styles.icon} />
                        </div>
                    ) : (
                        <img className={styles.avatar} src={url} alt="employee avatar" />
                    )}
                    <SlackAndHiBobLinks slackLink={slackLink} hiBobLink={hiBobLink} />
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
        }
    )
);

const EmployeeAvatarAndName = ({
    fullName,
    url,
    isLoading,
    role,
    department,
    teamName,
    title,
    leavePolicy,
    slackLink,
    hiBobLink
}) => {
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
            leavePolicy={leavePolicy}
            slackLink={slackLink}
            hiBobLink={hiBobLink}
            ref={ref}
        />
    );
};
export default EmployeeAvatarAndName;
