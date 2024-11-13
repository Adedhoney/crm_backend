import { User } from '@domain/Models';
import { IDatabase } from '@infrastructure/Database';

export interface IAccountRepository {
    readonly db: IDatabase;
    saveUser(user: User): Promise<void>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    BanUser(userId: string): Promise<void>;
    getUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    userNameAvailable(username: string): Promise<boolean>;
    updateUser(user: User): Promise<void>;
    updatePassword(
        userId: string,
        password: string,
        date: number,
    ): Promise<void>;
}
