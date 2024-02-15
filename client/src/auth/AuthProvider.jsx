import { useNavigate, useLocation } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const getTokenFromLocalStorage = () => {
    return localStorage.getItem('bonTouchHiBobLoginToken');
};

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(() => getTokenFromLocalStorage());

    const handleLogin = async (signInToken) => {
        let response;
        try {
            response = await axios.post(
                `${
                    process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_DOMAIN : ''
                }/token`,
                { signInToken }
            );
            const bonTouchToken = response?.data?.token;
            if (bonTouchToken) {
                localStorage.setItem('bonTouchHiBobLoginToken', `Bearer ${bonTouchToken}`);
                setToken(`Bearer ${bonTouchToken}`);
            }
        } catch (e) {
            console.error(e);
            return e;
        }
        return response.status;
    };

    const handleLogout = () => {
        localStorage.removeItem('bonTouchHiBobLoginToken');
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
        setToken
    };

    useEffect(() => {
        let origin = '/';
        if (token !== null) {
            axios.defaults.headers.common['Authorization'] = token;
            origin =
                location.state?.from?.pathname === undefined
                    ? '/teams'
                    : location.state?.from?.pathname;
        }
        navigate(origin);
    }, [token, location.state?.from?.pathname, navigate]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
