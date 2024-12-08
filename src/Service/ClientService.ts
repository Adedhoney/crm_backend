import { ClientDTO } from '@api/DTO';
import { CustomError } from '@application/error';
import {
    generateRandomId,
    getCurrentTimeStamp,
    StatusCode,
} from '@application/utilities';
import { ActivityTypes, Client, User } from '@domain/Models';
import {
    ClientFilters,
    IAccountRepository,
    IClientRepository,
    PaginationResponse,
} from '@domain/Repositories';
import { IActivityRepository } from '@domain/Repositories/ActivityRepository';

export interface IClientService {
    CreateClient(
        data: ClientDTO,
        logo: Express.MulterS3.File,
        auth: User,
    ): Promise<void>;
    GetClient(clientId: string): Promise<Client>;
    GetClients(
        filters: ClientFilters,
    ): Promise<Promise<PaginationResponse<Client, 'clients'>>>;
    DeleteClient(clientId: string, auth: User): Promise<void>;
    UpdateClient(clientId: string, data: ClientDTO, auth: User): Promise<void>;
    UpdateClientLogo(
        clientId: string,
        logo: Express.MulterS3.File,
        auth: User,
    ): Promise<void>;
}

export class ClientService implements IClientService {
    constructor(
        private clientrepo: IClientRepository,
        private accountrepo: IAccountRepository,
        private activityrepo: IActivityRepository,
    ) {}

    async CreateClient(
        data: ClientDTO,
        logo: Express.MulterS3.File,
        auth: User,
    ): Promise<void> {
        const exists = await this.clientrepo.getClientByName(data.name);
        if (exists) {
            throw new CustomError(
                'Client name must be unique',
                StatusCode.BAD_REQUEST,
            );
        }
        if (data.responsibleUserId) {
            const user = await this.accountrepo.getUserById(
                data.responsibleUserId,
            );
            if (!user) {
                throw new CustomError(
                    'Responsible User not found',
                    StatusCode.BAD_REQUEST,
                );
            }
        }

        const clientId = generateRandomId();

        const date = getCurrentTimeStamp();

        const client = {
            clientId,
            name: data.name,
            industry: data.industry,
            logoUrl: logo?.location,
            email: data.email,
            phone: data.phone,
            bankingDetails: data.bankingDetails,
            responsibleUserId: data.responsibleUserId || auth.userId,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: auth.userId,
            modifiedBy: auth.userId,
        };
        await this.clientrepo.saveClient(client);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.CLIENT,
            description: `New Client of clientId ${clientId} created by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async GetClient(clientId: string): Promise<Client> {
        const client = await this.clientrepo.getClientById(clientId);
        return client;
    }
    async DeleteClient(clientId: string, auth: User): Promise<void> {
        await this.clientrepo.deleteClient(clientId);

        const date = getCurrentTimeStamp();

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.CLIENT,
            description: `Client of clientId ${clientId} deleted by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async GetClients(
        filters: ClientFilters,
    ): Promise<Promise<PaginationResponse<Client, 'clients'>>> {
        const client = await this.clientrepo.getClients(filters);
        return client;
    }
    async UpdateClient(
        clientId: string,
        data: ClientDTO,
        auth: User,
    ): Promise<void> {
        const client = await this.clientrepo.getClientById(clientId);
        if (!client) {
            throw new CustomError('Client not found', StatusCode.NOT_FOUND);
        }

        if (data.responsibleUserId) {
            const user = await this.accountrepo.getUserById(
                data.responsibleUserId,
            );
            if (!user) {
                throw new CustomError(
                    'Responsible User not found',
                    StatusCode.BAD_REQUEST,
                );
            }
        }

        const date = getCurrentTimeStamp();

        const newClient = {
            clientId,
            name: data.name,
            industry: data.industry,
            logoUrl: client.logoUrl,
            email: data.email,
            phone: data.phone,
            bankingDetails: data.bankingDetails,
            responsibleUserId: data.responsibleUserId,
            createdOn: client.createdOn,
            lastModifiedOn: date,
            createdBy: client.createdBy,
            modifiedBy: auth.userId,
        };
        await this.clientrepo.updateClient(newClient);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.CLIENT,
            description: `Client of clientId ${clientId} updated by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }

    async UpdateClientLogo(
        clientId: string,
        logo: Express.MulterS3.File,
        auth: User,
    ): Promise<void> {
        const client = await this.clientrepo.getClientById(clientId);
        if (!client) {
            throw new CustomError('Client not found', StatusCode.NOT_FOUND);
        }

        const date = getCurrentTimeStamp();

        const newClient = {
            ...client,
            logoUrl: logo.location,
            lastModifiedOn: date,
            modifiedBy: auth.userId,
        };
        await this.clientrepo.updateClient(newClient);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.CLIENT,
            description: `Client logo of clientId ${clientId} updated by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
}
