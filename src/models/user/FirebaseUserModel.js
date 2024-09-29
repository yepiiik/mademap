import firebase from "firebase/compat/app";
import UserModel from "./UserModel";


export class FirebaseUserModel extends UserModel {
    getUserData = (userId) => {
        return firebase.firestore().collection('users').doc(userId).get();
    };

    updateUserData = (userId, data) => {
        return firebase.firestore().collection('users').doc(userId).update(data);
    };
}