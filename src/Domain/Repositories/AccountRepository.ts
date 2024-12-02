import { User } from '@domain/Models';
import { Invite } from '@domain/Models/Invite';
import { IDatabase } from '@infrastructure/Database';
import { PaginationResponse } from '.';
import { UserAccountStatus, UserType } from '@domain/Enums';

export interface IAccountRepository {
    readonly db: IDatabase;
    getDashboard(): Promise<any>;
    saveInvite(invite: Invite): Promise<void>;
    getInvite(inviteId: string): Promise<Invite>;
    getInvites(
        filters: UserFilters,
    ): Promise<PaginationResponse<Invite, 'invites'>>;
    getInviteByEmail(email: string): Promise<Invite>;

    saveUser(user: User, inviteId: string): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUsers(filters: UserFilters): Promise<PaginationResponse<User, 'users'>>;
    updateUserStatus(
        userId: string,
        status: UserAccountStatus,
        date: number,
    ): Promise<void>;
    updateUser(user: User): Promise<void>;
    updatePassword(
        userId: string,
        password: string,
        date: number,
    ): Promise<void>;
}

type UserSort = 'orders' | 'name-desc' | 'name-asc';

export interface UserFilters {
    userType?: UserType;
    search?: string;
    pageLimit?: number;
    pageNumber?: number;
    sort?: UserSort;
}
