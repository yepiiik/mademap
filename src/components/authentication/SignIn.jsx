import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { authController } from '../../config/base';
import ActionButton from '../buttons/ActionButton';


const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const onLogin = (e) => {
        e.preventDefault();
        authController.signIn(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
    }

    const onLoginUsingGoogle = (e) => {
        e.preventDefault();
        console.log(e)
        authController.signInWithGoogle()
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
    }

    return(
        <div className="auth_block">                     
            <form className="auth_form">                                              
                <div className="form_field">
                    <label htmlFor="email-address">
                        Email address
                    </label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"                                    
                        required                                                                                
                        placeholder="example@google.com"
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>

                <div className="form_field">
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"                                    
                        required                                                                                
                        placeholder="••••••••••"
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <ActionButton onClick={onLogin}>
                        Login
                    </ActionButton>
                </div>
                <div>
                    <ActionButton onClick={onLoginUsingGoogle}>
                        Login with Google
                    </ActionButton>
                </div>                                
            </form>

            <span>
                No account yet? {' '}
                <NavLink to="/signup">
                    Sign up
                </NavLink>
            </span>

        </div>
    )
}

export default SignIn