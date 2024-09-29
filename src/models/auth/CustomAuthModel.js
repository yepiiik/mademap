import AuthModel from "./AuthModel";


export class CustomAuthModel extends AuthModel {
    signIn = async (email, password) => {
        const passwordHash = password.hash('sha256');

        return fetch('/api/signin', {
            method: 'POST',
            body: JSON.stringify({ email, passwordHash }),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json());
    };

    signInWithGoogle = async () => {
        return;
    }

    signUp = async (email, password) => {
        const passwordHash = password.hash('sha256');

        return fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({ email, passwordHash }),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json());
    };

    signOut = async () => {
        return fetch('/api/signout', { method: 'POST' });
    };
}