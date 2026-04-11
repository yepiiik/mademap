import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authController } from '../../config/base';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

const GoogleIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-2 h-4 w-4"
    fill="currentColor"
  >
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.172-1.224 1.224-3.136 2.552-6.712 2.552-5.44 0-9.76-4.4-9.76-9.84s4.32-9.84 9.76-9.84c2.96 0 5.12 1.168 6.712 2.664l2.304-2.304C18.216 1.496 15.56 0 12.48 0 6.904 0 2.25 4.512 2.25 10.08s4.654 10.08 10.23 10.08c3.016 0 5.28-.984 7.048-2.816 1.816-1.816 2.384-4.416 2.384-6.504 0-.624-.048-1.216-.144-1.76H12.48z" />
  </svg>
);

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        authController.signIn(email, password)
            .then((userCredential) => {
                navigate("/");
            })
            .catch((error) => {
                console.error(error.code, error.message);
            })
            .finally(() => setIsLoading(false));
    }

    const onLoginUsingGoogle = (e) => {
        e.preventDefault();
        setIsLoading(true);
        authController.signInWithGoogle()
            .then((userCredential) => {
                navigate("/");
            })
            .catch((error) => {
                console.error(error.code, error.message);
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-[var(--transperant-background)] border-[var(--primary-border)] shadow-none">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-[var(--primary-color)] text-center">Sign in</CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                    Enter your email to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={onLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[var(--primary-color)]">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-transparent border-[var(--primary-border)] text-[var(--primary-color)] focus-visible:ring-secondary/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" title="Password" className="text-[var(--primary-color)]">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-transparent border-[var(--primary-border)] text-[var(--primary-color)] focus-visible:ring-secondary/50"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
                
                <div className="space-y-4 pt-2">
                    <div className="flex flex-col items-center">
                        <span className="text-xs uppercase text-muted-foreground font-medium">Or sign in with</span>
                    </div>
                    <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full border-[var(--primary-border)] bg-transparent text-[var(--primary-color)] hover:bg-secondary/10" 
                        onClick={onLoginUsingGoogle}
                        disabled={isLoading}
                    >
                        <GoogleIcon />
                        Google
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
                Don't have an account?{" "}
                <NavLink to="/signup" className="text-secondary hover:underline font-medium">
                    Sign up
                </NavLink>
            </CardFooter>
        </Card>
    );
}

export default SignIn;
