import { useSearchStore } from '../NavBar/NavBar';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { scrollIntoViewWithOffset } from '../../helpers/utils';
import styles from '../Team/Team.module.scss';

const Avatar = memo(({ isLoading, url, fullName, className, role }) => {
    return (
        <>
            {isLoading ? (
                <div
                    style={{
                        width: '14rem',
                        height: '14rem',
                        position: 'relative',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                    }}>
                    <FontAwesomeIcon
                        icon={faUser}
                        fade
                        size="7x"
                        style={{
                            color: '#4db66b',
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate3d(-50%, -50%, 0)'
                        }}
                    />
                </div>
            ) : !url ? (
                <div
                    style={{
                        width: '14rem',
                        height: '14rem',
                        position: 'relative',
                        display: 'inline-block'
                    }}>
                    <FontAwesomeIcon
                        icon={faUser}
                        size="7x"
                        style={{
                            color: '#4db66b',
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate3d(-50%, -50%, 0)',
                            marginBottom: '0.5rem'
                        }}
                    />
                </div>
            ) : (
                <img className={className} loading="lazy" src={url} alt="employee avatar" />
            )}
            <p className={styles.name}>{fullName}</p>
            <p className={styles.role}>{role}</p>
        </>
    );
});

const EmployeeAvatarAndName = ({ fullName, url, isLoading, role }) => {
    const selected = useSearchStore((state) => state.selected);
    const [className, setClassName] = useState('');
    const ref = useRef(null);

    const handleMouseEnter = useCallback(() => {
        setClassName(classNames([styles.avatar]));
    }, []);

    useEffect(() => {
        const highlight =
            selected !== null &&
            selected.length >= 3 &&
            fullName.toLowerCase() === selected.toLowerCase();

        setClassName(classNames([styles.avatar, highlight ? styles.highlight : '']));

        if (highlight && document.body.getBoundingClientRect().width <= 900) {
            scrollIntoViewWithOffset(ref.current, 130);
        }
    }, [selected, fullName]);

    return (
        <div onMouseEnter={handleMouseEnter} ref={ref}>
            <Avatar
                isLoading={isLoading}
                url={url}
                fullName={fullName}
                className={className}
                role={role}
            />
        </div>
    );
};
export default EmployeeAvatarAndName;
