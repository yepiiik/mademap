export default abstract class UserModel {
    abstract getUserData(userId: number);
    abstract updateUserData(userId: number, data: any);
}