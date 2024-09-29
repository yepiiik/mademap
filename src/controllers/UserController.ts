import UserModel from '../models/user/UserModel';


export default class UserController {
    model: UserModel

    constructor(model: UserModel) {
        this.model = model;
    }

    getUserData = (userId) => {
        return this.model.getUserData(userId);
    }

    updateUserData = (userId, data) => {
        return this.model.updateUserData(userId, data);
    };
}