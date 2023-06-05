import React, { useEffect } from 'react'
import { useAuth } from '../../helpers/useAuth'

const Login = () => {
    const { onLogin } = useAuth()

    useEffect(() => {
        const handleCallbackResponse = (response) => {
            console.log('Encoded JWT ID token: ' + response.credential)
            //onLogin(jwt_decode(response.credential))
            onLogin(response.credential)
        }
        const handleError = (response) => {
            console.log('response')
            console.log(response)
        }
        /*eslint-disable no-undef*/
        try {
            google.accounts.id.initialize({
                client_id:
                    '520089236563-8kp9d3cpoejc6q9mt0aqmbm5oicg8pus.apps.googleusercontent.com',
                callback: handleCallbackResponse,
                prompt_parent_id: 'signinDiv',
                cancel_on_tap_outside: false,
                error_callback: handleError,
            })
            google.accounts.id.renderButton(
                document.getElementById('signinDiv'),
                {
                    theme: 'outline',
                    size: 'large',
                    //click_listener: onClickHandler
                }
            )
        } catch (e) {
            console.log(e)
            console.log('error')
        }
    }, [onLogin])

    return (
        <div
            id="signinDiv"
            data-cancel_on_tap_outside="false"
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                zIndex: 1001,
            }}
        ></div>
    )
}

export default Login
