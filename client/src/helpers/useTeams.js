import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const useTeams = () =>
    useQuery(
        ['teams'],
        ({ signal }) =>
            axios
                .get(`/teams`, {
                    signal,
                })
                .then((res) => res.data),
        { staleTime: 1000 * 60 * 60, refetchInterval: 1000 * 60 * 60 * 24 }
    )

export default useTeams
