import { useEffect, useState } from 'react';

import { useAuth } from '../../helpers/useAuth';

import Loader from '../../components/Loader/Loader';

import SignInImage from '../../images/singInImage.png';
import { ReactComponent as BTLogo } from '../../images/BTLogo.svg';

import styles from './Login.module.scss';

const loadGoogleScript = () =>
    new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="https://accounts.google.com/gsi/client"]`))
            return resolve();
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
    });

const Login = () => {
    const { onLogin } = useAuth();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!scriptLoaded) {
            loadGoogleScript().then(() => {
                const handleCallbackResponse = async (response) => {
                    setIsLoading(true);
                    const status = await onLogin(response.credential);
                    if (status !== 200) setIsLoading(false);
                };
                const handleError = (response) => {
                    console.error(response);
                };

                try {
                    /*eslint-disable no-undef*/
                    if (window.google !== undefined) {
                        google.accounts.id.initialize({
                            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                            callback: handleCallbackResponse,
                            prompt_parent_id: 'signInDiv',
                            cancel_on_tap_outside: false,
                            error_callback: handleError
                        });
                        google.accounts.id.renderButton(document.getElementById('signInDiv'), {
                            theme: 'outline',
                            size: 'large'
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            });
            setScriptLoaded(true);
        }
    }, [onLogin]);
    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={styles.container}>
            <img className={styles.image} src={SignInImage} alt="" />
            <BTLogo className={styles.logo} />
            <h1 className={styles.title}>Bontouch Team Viewer</h1>
            {/* <p className={styles.text}>Let’s find some people...</p> */}
            <div className={styles.wrapper}>
                <div
                    id="signInDiv"
                    data-cancel_on_tap_outside="false"
                    className={styles.google}></div>
            </div>
        </div>
    );
};

export default Login;
