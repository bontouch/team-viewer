import styles from '../Team/Team.module.scss';
import { useSearchStore } from '../NavBar/NavBar';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useState } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Avatar = memo(({ isLoading, url, fullName, className }) => {
    return (
        <>
            {isLoading ? (
                <div
                    style={{
                        width: '16rem',
                        height: '16rem',
                        position: 'relative',
                        display: 'inline-block'
                    }}>
                    <FontAwesomeIcon
                        icon={faUser}
                        fade
                        size="10x"
                        style={{
                            color: '#37a3e6',
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
                        width: '16rem',
                        height: '16rem',
                        position: 'relative',
                        display: 'inline-block'
                    }}>
                    <FontAwesomeIcon
                        icon={faUser}
                        size="10x"
                        style={{
                            color: 'white',
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate3d(-50%, -50%, 0)'
                        }}
                    />
                </div>
            ) : (
                <img className={className} src={url} alt="employee avatar" />
            )}
            <span style={{ color: 'white' }}>{fullName}</span>
        </>
    );
});

const EmployeeAvatarAndName = ({ fullName, url, isLoading }) => {
    const selected = useSearchStore((state) => state.selected);
    const [className, setClassName] = useState('');

    const handleMouseEnter = useCallback(() => {
        setClassName(classNames([styles.avatar]));
    }, []);

    useEffect(() => {
        setClassName(
            classNames([
                styles.avatar,
                selected !== null &&
                selected.length >= 3 &&
                fullName.toLowerCase() === selected.toLowerCase()
                    ? styles.highlight
                    : ''
            ])
        );
    }, [selected, fullName]);

    return (
        <div onMouseEnter={handleMouseEnter}>
            <Avatar isLoading={isLoading} url={url} fullName={fullName} className={className} />
        </div>
    );
};
export default EmployeeAvatarAndName;
