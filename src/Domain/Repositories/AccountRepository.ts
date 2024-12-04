import { User } from '@domain/Models';
import { Invite } from '@domain/Models/Invite';
import { IDatabase } from '@infrastructure/Database';
import { PaginationResponse } from '.';
import { InviteStatus, UserAccountStatus, UserType } from '@domain/Enums';
import config from '@application/config';
import { Op, OrderItem } from 'sequelize';

export interface IAccountRepository {
    readonly db: IDatabase;
    getSuperAdmin(): Promise<User>;
    getDashboard(): Promise<any>;
    saveInvite(invite: Invite): Promise<void>;
    getInvite(inviteId: string): Promise<Invite>;
    getInvites(
        filters: UserFilters,
    ): Promise<PaginationResponse<Invite, 'invites'>>;
    getInviteByEmail(email: string): Promise<Invite>;

    saveUser(user: User, inviteId: string): Promise<void>;
    updateSessionId(userId: string, sessionId: string): Promise<void>;
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

type UserSort = 'name-desc' | 'name-asc' | 'date-asc' | 'date-desc';

export interface UserFilters {
    userType?: UserType;
    search?: string;
    pageLimit?: number;
    pageNumber?: number;
    sort?: UserSort;
}

export class AccountRepository implements IAccountRepository {
    constructor(readonly db: IDatabase) {}

    async getSuperAdmin(): Promise<User> {
        const user = await this.db.user.findOne({
            where: { userType: UserType.SUPERADMIN },
        });
        return user?.dataValues as User;
    }

    async getDashboard(): Promise<any> {}

    async saveInvite(invite: Invite): Promise<void> {
        await this.db.invite.upsert(
            { ...invite },
            { fields: ['expiresAt', 'lastModifiedOn', 'modifiedBy'] },
        );
    }

    async updateSessionId(userId: string, sessionId: string): Promise<void> {
        await this.db.user.update({ sessionId }, { where: { userId } });
    }

    async getInvite(inviteId: string): Promise<Invite> {
        const Invite = await this.db.invite.findOne({
            where: { inviteId },
        });
        return Invite?.dataValues as Invite;
    }

    async deactivateUser(userId: string): Promise<void> {
        await this.db.user.update(
            { status: UserAccountStatus.DEACTIVATED },
            {
                where: { userId },
            },
        );
    }

    async getInvites(
        filters: UserFilters,
    ): Promise<PaginationResponse<Invite, 'invites'>> {
        const { pageLimit, search, pageNumber } = filters;

        const limit = Number(pageLimit)
            ? Number(pageLimit)
            : config.QUERY_LIMIT;
        const page = Number(pageNumber) ? Number(pageNumber) : 1;
        const offset = (page - 1) * limit;

        const sorting: OrderItem = ['createdOn', 'DESC'];

        const invites = await this.db.invite.findAll({
            where: {
                status: InviteStatus.PENDING,
                ...(search && {
                    email: { [Op.like]: search },
                }),
            },
            order: [sorting],
            limit,
            offset,
        });
        const totalData = await this.db.invite.count({
            where: {
                status: InviteStatus.PENDING,
                ...(search && {
                    email: { [Op.like]: search },
                }),
            },
        });

        const totalPages = Math.ceil(totalData / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        return {
            invites: invites as Invite[],
            totalPages,
            page,
            prevPage,
            nextPage,
            limit,
            returnedData: invites.length,
            totalData,
        };
    }

    async getInviteByEmail(email: string): Promise<Invite> {
        const invite = await this.db.invite.findOne({
            where: { email },
        });
        return invite?.dataValues as Invite;
    }

    async saveUser(user: User, inviteId: string): Promise<void> {
        const transaction = await this.db.sequelize.transaction();
        try {
            await this.db.user.create({ ...user }, { transaction });

            await this.db.invite.update(
                { status: InviteStatus.ACCEPTED },
                { where: { inviteId }, transaction },
            );
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error; // re-throw the error after rolling back the transaction
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.db.user.findOne({ where: { email } });
        return user?.dataValues as User;
    }

    async getUserById(userId: string): Promise<User> {
        const user = await this.db.user.findOne({
            where: { userId },
        });
        return user?.dataValues as User;
    }

    async getUsers(
        filters: UserFilters,
    ): Promise<PaginationResponse<User, 'users'>> {
        const { sort, pageLimit, search, pageNumber } = filters;

        const limit = Number(pageLimit)
            ? Number(pageLimit)
            : config.QUERY_LIMIT;
        const page = Number(pageNumber) ? Number(pageNumber) : 1;
        const offset = (page - 1) * limit;

        let sorting: OrderItem = ['lastName', 'ASC'];
        if (sort === 'name-desc') {
            sorting = ['lastName', 'DESC'];
        } else if (sort === 'name-asc') {
            sorting = ['lastName', 'ASC'];
        } else if (sort === 'date-desc') {
            sorting = ['createdOn', 'DESC'];
        } else if (sort === 'date-asc') {
            sorting = ['createdOn', 'ASC'];
        }

        const users = await this.db.user.findAll({
            where: {
                ...(search && {
                    firstName: { [Op.like]: search },
                    lastName: { [Op.like]: search },
                }),
                status: UserAccountStatus.ACTIVE,
            },
            attributes: { exclude: ['password'] },
            order: [sorting],
            limit,
            offset,
        });
        const totalData = await this.db.user.count({
            where: {
                ...(search && {
                    firstName: { [Op.like]: search },
                    lastName: { [Op.like]: search },
                }),
            },
        });

        const totalPages = Math.ceil(totalData / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        return {
            users: users as User[],
            totalPages,
            page,
            prevPage,
            nextPage,
            limit,
            returnedData: users.length,
            totalData,
        };
    }

    async updateUser(user: User): Promise<void> {
        await this.db.user.update(
            { ...user },
            { where: { userId: user.userId } },
        );
    }

    async updateUserStatus(
        userId: string,
        status: UserAccountStatus,
        date: number,
    ): Promise<void> {
        await this.db.user.update(
            { status, lastModifiedOn: date },
            { where: { userId } },
        );
    }

    async updatePassword(
        userId: string,
        password: string,
        date: number,
    ): Promise<void> {
        await this.db.user.update(
            { password, lastModifiedOn: date },
            { where: { userId } },
        );
    }
}
