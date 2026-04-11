import React, { useContext, useRef } from 'react'
import { authController } from '../../config/base'
import SignOut from '../authentication/SignOut'
import SignIn from '../authentication/SignIn'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../authentication/Auth'

function HeaderNav() {
    const {currentUser} = useContext(AuthContext)
    const dropdownBlockRef = useRef();
    const openButtonRef = useRef();

    const openDropdownBlock = (e) => {
        dropdownBlockRef.current.classList.toggle('active')
        openButtonRef.current.classList.toggle('active')
    }

    return (
        <nav className='header_nav'>
            <div className='header_nav_preview'>
                    { currentUser
                        ? 
                        <img src={currentUser.photoURL} alt="Profile picture" />
                        :
                        <img src='https://secure.gravatar.com/avatar/15f8001624bd5b624aa2c00d0d25b1f4?s=168&d=mm&r=g' alt="Guest picture" />
                    }
                <span className='open_btn' onClick={openDropdownBlock} ref={openButtonRef}></span>
            </div>

            <div className='dropdown_block' ref={dropdownBlockRef}>
                { currentUser
                    ?
                    <ul className='dropdown_list'>
                        <li className='dropdown_item'>
                            <SignOut />
                        </li>
                    </ul>
                    :
                    <ul className='dropdown_list'>
                        <li className='dropdown_item'>
                        <NavLink to="/signin">
                            Sign in
                        </NavLink>
                        </li>
                    </ul>
                }
            </div>
        </nav>
    )
}

export default HeaderNav