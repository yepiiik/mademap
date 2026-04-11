import React, { useContext } from 'react'
import SignIn from '../components/authentication/SignIn'
import SignUp from '../components/authentication/SignUp'
import { AuthContext } from '../components/authentication/Auth'
import SignOut from '../components/authentication/SignOut';
import { useLocation } from 'react-router-dom';


function AuthView() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md">
                {location.pathname === '/signin'
                    ? 
                    <SignIn />
                    :
                    <SignUp />
                }
            </div>
        </div>
    )
}

export default AuthView