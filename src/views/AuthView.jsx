import React, { useContext } from 'react'
import SignIn from '../components/authentication/SignIn'
import SignUp from '../components/authentication/SignUp'
import { AuthContext } from '../components/authentication/Auth'
import SignOut from '../components/authentication/SignOut';
import { useLocation } from 'react-router-dom';


function AuthView() {
    const {currentUser} = useContext(AuthContext);
    const location = useLocation();
    console.dir(location)

    return (
        <>
            {/* <section className='left_section'>
                <h2>Your accounts</h2>
                <div className='accounts_list'>
                    { currentUser ? <li><span>{currentUser.email}</span><SignOut /></li> : ''}
                </div>
            </section> */}

            <section className='right_section'>
                {location.pathname === '/signin'
                    ? 
                    <SignIn />
                    :
                    <SignUp />
                }
                
            </section>
        </>
    )
}

export default AuthView