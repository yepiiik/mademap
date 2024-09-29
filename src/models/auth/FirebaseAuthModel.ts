import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import AuthModel from "./AuthModel.ts";


export default class FirebaseAuthModel extends AuthModel {
    signIn = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    signUp = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        const result = signInWithPopup(auth, provider)
    
        return result
    };

    signOut = async () => {
        return auth.signOut();
    };
}