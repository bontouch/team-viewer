import styles from '../Team/Team.module.scss';
import { useSearchStore } from '../NavBar/NavBar';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useState } from 'react';

const Avatar = memo(({ isLoading, url, fullName, className }) => {
    return (
        <>
            {isLoading ? (
                <div className={styles.loading}>Loading</div>
            ) : !url ? (
                <div className={styles.loading}>no image</div>
            ) : (
                <img className={className} src={url} alt="employee avatar" />
            )}
            <span style={{ color: 'white' }}>{fullName}</span>
        </>
    );
});

const EmployeeAvatarAndName = ({ fullName, url, isLoading }) => {
    //const searchQuery = useSearchStore((state) => state.searchQuery);
    const selected = useSearchStore((state) => state.selected);
    console.log('selected', selected);
    const [className, setClassName] = useState('');

    const handleMouseEnter = useCallback(() => {
        setClassName(classNames([styles.avatar]));
    }, []);

    useEffect(() => {
        //setHovered(false)
        console.log(selected);
        setClassName(
            classNames([
                styles.avatar,
                selected !== null &&
                selected.length >= 3 &&
                fullName.toLowerCase() === selected.toLowerCase()
                    ? styles.highlight
                    : ''
            ])
            // classNames([
            //     styles.avatar,
            //     searchQuery !== '' &&
            //     searchQuery.length >= 3 &&
            //     fullName.toLowerCase().includes(searchQuery.toLowerCase())
            //         ? styles.highlight
            //         : ''
            // ])
        );
    }, [selected, fullName]);

    return (
        <div onMouseEnter={handleMouseEnter}>
            <Avatar isLoading={isLoading} url={url} fullName={fullName} className={className} />
        </div>
    );
};
export default EmployeeAvatarAndName;
