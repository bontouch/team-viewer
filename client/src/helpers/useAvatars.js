import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from './useAuth';

const useAvatar = () => {
    const { onLogout } = useAuth();

    return useQuery(
        ['avatars'],
        ({ signal }) =>
            axios
                .get(
                    `${
                        process.env.NODE_ENV === 'production'
                            ? process.env.REACT_APP_API_DOMAIN
                            : ''
                    }/avatars`,
                    {
                        signal
                    }
                )
                .catch((e) => {
                    if (e.code !== 'ERR_CANCELED') onLogout();
                })
                .then((res) => res.data),
        { staleTime: 1000 * 60 * 60, refetchInterval: 1000 * 60 * 60 * 24 }
    );
};

export default useAvatar;
