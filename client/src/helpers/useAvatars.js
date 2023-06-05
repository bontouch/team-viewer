import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const useAvatar = () => {
    return useQuery(
        ['avatars'],
        ({ signal }) =>
            axios
                .get(`/avatars`, {
                    signal,
                })
                .then((res) => res.data),
        { staleTime: 1000 * 60 * 60, refetchInterval: 1000 * 60 * 60 * 24 }
    )
}

export default useAvatar
