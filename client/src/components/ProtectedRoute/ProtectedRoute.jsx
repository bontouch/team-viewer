import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../helpers/useAuth';
import { getTokenFromLocalStorage } from '../../auth/AuthProvider';
import useUrl from 'helpers/useUrl';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const { token, setToken } = useAuth();
    const location = useLocation();
    useUrl();

    if (!token) {
        const localStorageToken = getTokenFromLocalStorage();
        if (localStorageToken) {
            setToken(localStorageToken);
            axios.defaults.headers.common['Authorization'] = localStorageToken;
        } else {
            return <Navigate to="/" replace state={{ from: location }} />;
        }
    }

    return children;
};

export default ProtectedRoute;
