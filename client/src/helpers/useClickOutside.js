import { useEffect, useRef } from 'react';

const useClickOutside = (callback) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback(event);
            }
        };

        document.addEventListener('mousedown', handleClick, true);

        return () => {
            document.removeEventListener('mousedown', handleClick, true);
        };
    }, [ref, callback]);

    return ref;
};

export default useClickOutside;
