import AuthModel from '../models/auth/AuthModel';

export default class AuthController {
    model: AuthModel;

    constructor(model: AuthModel) {
        this.model = model;
    }

    signIn = (email: string, password: string) => {
        return this.model.signIn(email, password); // Switchable
    };

    signInWithGoogle = () => {
        console.log('authWithGoogle')
        return this.model.signInWithGoogle(); // Switchable
    };

    signUp = (email: string, password: string, repeatPassword: string) => {
        if (password !== repeatPassword) return;
        
        return this.model.signUp(email, password); // Switchable
    };

    signOut = () => {
        return this.model.signOut();
      };
}
