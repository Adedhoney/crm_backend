import config from '@application/config';
import { CustomError } from '@application/error';
import { StatusCode } from '@application/utilities';
import { Client } from '@domain/Models';
import { IDatabase } from '@infrastructure/Database';
import { Op, OrderItem, QueryTypes } from 'sequelize';
import { PaginationResponse } from '.';

export interface IClientRepository {
    readonly db: IDatabase;
    saveClient(client: Client): Promise<void>;
    getClientById(clientId: string): Promise<Client>;
    deleteClient(clientId: string): Promise<void>;
    getClientByName(name: string): Promise<Client>;
    getClients(
        filters: ClientFilters,
    ): Promise<PaginationResponse<Client, 'clients'>>;
    updateClient(client: Client): Promise<void>;
}

type ClientSort = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

export interface ClientFilters {
    responsibleUserId?: string;
    search?: string;
    pageLimit?: number;
    pageNumber?: number;
    sort?: ClientSort;
}

export class ClientRepository implements IClientRepository {
    constructor(readonly db: IDatabase) {}

    async saveClient(client: Client): Promise<void> {
        await this.db.client.create({ ...client });
    }

    async getClientById(clientId: string): Promise<Client> {
        const client = await this.db.client.findOne({
            where: { clientId },
            include: [{ model: this.db.user, as: 'responsibleUser' }],
        });
        return client?.dataValues as Client;
    }

    async deleteClient(clientId: string): Promise<void> {
        try {
            await this.db.client.destroy({
                where: { clientId },
            });
        } catch (error) {
            const message = (error as Error).message;
            const list = message.split(':');
            if (list[0] === 'Cannot delete or update a parent row') {
                throw new CustomError(
                    'Migrate or delete all products under the Client to delete',
                    StatusCode.BAD_REQUEST,
                );
            }
            throw error;
        }
    }

    async getClientByName(name: string): Promise<Client> {
        const client = await this.db.client.findOne({ where: { name } });
        return client?.dataValues as Client;
    }

    async getClients(
        filters: ClientFilters,
    ): Promise<PaginationResponse<Client, 'clients'>> {
        const { sort, responsibleUserId, search, pageLimit, pageNumber } =
            filters;

        const limit = Number(pageLimit)
            ? Number(pageLimit)
            : config.QUERY_LIMIT;
        const page = Number(pageNumber) ? Number(pageNumber) : 1;
        const offset = (page - 1) * limit;

        let sorting: OrderItem = ['name', 'ASC'];
        if (sort === 'name-desc') {
            sorting = ['name', 'DESC'];
        } else if (sort === 'name-asc') {
            sorting = ['name', 'ASC'];
        }

        const clients = await this.db.client.findAll({
            where: {
                ...(search && {
                    email: { [Op.like]: search },
                    name: { [Op.like]: search },
                }),
                ...(responsibleUserId && { responsibleUserId }),
            },
            order: [sorting],
            limit,
            offset,
        });
        const totalData = await this.db.invite.count({
            where: {
                ...(search && {
                    email: { [Op.like]: search },
                    name: { [Op.like]: search },
                }),
            },
        });

        const totalPages = Math.ceil(totalData / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        return {
            clients: clients as Client[],
            totalPages,
            page,
            prevPage,
            nextPage,
            limit,
            returnedData: clients.length,
            totalData,
        };
    }

    async updateClient(client: Client): Promise<void> {
        await this.db.client.update(
            { ...client },
            { where: { clientId: client.clientId } },
        );
    }
}
