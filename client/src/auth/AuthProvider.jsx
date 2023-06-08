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
        localStorage.setItem('bonTouchHiBobLoginToken', signInToken);
        setToken(signInToken);
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
