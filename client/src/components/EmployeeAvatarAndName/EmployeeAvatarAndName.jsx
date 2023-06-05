import styles from '../Team/Team.module.scss'
import { useSearchStore } from '../NavBar/NavBar'
import classNames from 'classnames'
import { memo, useCallback, useEffect, useState } from 'react'

const Component = memo(({ isLoading, url, fullName, className }) => {
    console.log('rendering', fullName)
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
    )
})

const EmployeeAvatarAndName = ({ fullName, id, url, isLoading }) => {
    const searchQuery = useSearchStore((state) => state.searchQuery)
    const [className, setClassName] = useState('')

    const handleMouseEnter = useCallback(() => {
        setClassName(classNames([styles.avatar]))
    }, [])

    useEffect(() => {
        //setHovered(false)
        setClassName(
            classNames([
                styles.avatar,
                searchQuery !== '' &&
                searchQuery.length >= 3 &&
                fullName.toLowerCase().includes(searchQuery.toLowerCase())
                    ? styles.highlight
                    : '',
            ])
        )
    }, [searchQuery, fullName])

    return (
        <div onMouseEnter={handleMouseEnter}>
            <Component
                isLoading={isLoading}
                url={url}
                fullName={fullName}
                className={className}
            />
        </div>
    )
}
export default EmployeeAvatarAndName
