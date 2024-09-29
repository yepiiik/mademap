export default abstract class AuthModel {
    abstract signIn(email: string, password: string): Promise<any>;
    abstract signUp(email: string, password: string): Promise<any>;
    abstract signInWithGoogle(): Promise<any>;
    abstract signOut(): Promise<any>;
}