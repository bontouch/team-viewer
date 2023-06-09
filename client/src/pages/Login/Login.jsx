import { useEffect, useState } from 'react';
import { useAuth } from '../../helpers/useAuth';
import styles from '../Teams/Teams.module.scss';
import Loader from '../../components/Loader/Loader';

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
                            client_id:
                                '520089236563-8kp9d3cpoejc6q9mt0aqmbm5oicg8pus.apps.googleusercontent.com',
                            callback: handleCallbackResponse,
                            prompt_parent_id: 'signinDiv',
                            cancel_on_tap_outside: false,
                            error_callback: handleError
                        });
                        google.accounts.id.renderButton(document.getElementById('signinDiv'), {
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
        return (
            <div className={styles.load}>
                <span>
                    <Loader />
                </span>
            </div>
        );
    }

    return (
        <div
            id="signinDiv"
            data-cancel_on_tap_outside="false"
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                zIndex: 1001
            }}></div>
    );
};

export default Login;
