import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authController } from '../../config/base';
import ActionButton from '../buttons/ActionButton';

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()
        authController.signUp(email, password, repeatPassword)
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

  return (
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
                <label htmlFor="create password">
                    Password
                </label>
                <input
                    type="password"
                    label="create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    placeholder="••••••••••"
                />
            </div>

            <div className="form_field">
                <label htmlFor="repeat password">
                    Repeat password
                </label>
                <input
                    type="password"
                    label="repeat password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)} 
                    required
                    placeholder="••••••••••"
                />
            </div>

            <div>
                <ActionButton onClick={onSubmit}>
                    Create Account
                </ActionButton>
            </div>
            <div>
                <ActionButton onClick={onLoginUsingGoogle}>
                    Login with Google
                </ActionButton>
            </div>                               
        </form>

        <span>
            Already have account? {' '}
            <NavLink to="/signin">
                Sign in
            </NavLink>
        </span>

    </div>
  )
}

export default Signup