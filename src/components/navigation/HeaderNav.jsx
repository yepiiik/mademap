import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../authentication/Auth'
import SignOut from '../authentication/SignOut'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"

function HeaderNav() {
    const { currentUser } = useContext(AuthContext)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-transparent">
            <NavLink to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                mademap
            </NavLink>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <img 
                                src={currentUser?.photoURL || 'https://secure.gravatar.com/avatar/15f8001624bd5b624aa2c00d0d25b1f4?s=168&d=mm&r=g'} 
                                alt="Profile" 
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {currentUser ? (currentUser.displayName || currentUser.email) : 'Guest'}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {currentUser?.email || 'Sign in to sync your maps'}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {currentUser ? (
                            <>
                                <DropdownMenuItem asChild>
                                    <NavLink to={`/${currentUser.displayName || 'profile'}`}>
                                        Profile
                                    </NavLink>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <SignOut />
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <DropdownMenuItem asChild>
                                <NavLink to="/signin">
                                    Sign in
                                </NavLink>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default HeaderNav
