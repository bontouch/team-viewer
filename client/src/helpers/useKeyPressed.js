import { useEffect } from 'react'

const useKeyPressed = (targetKey, callback) => {
    const handleKey = (e) => {
        if (e.key === targetKey) callback(e)
    }
    useEffect(() => {
        window.addEventListener('keydown', handleKey)

        return () => {
            window.removeEventListener('keydown', handleKey)
        }
    }, [callback, handleKey])
}

export default useKeyPressed
