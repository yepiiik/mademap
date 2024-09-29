import UserModel from "./UserModel";


export default class CustomUserModel extends UserModel {
    getUserData = (userId) => {
        return fetch(`/api/users/${userId}`).then(res => res.json());
    };
    
    updateUserData = (userId, data) => {
        return fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    };
}