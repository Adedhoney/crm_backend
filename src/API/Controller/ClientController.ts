import { User } from '@domain/Models';
import {
    IBaseQueryRequest,
    IBaseRequest,
    RequestWithAuth,
} from '../Utilities/Request';
import { successResponse } from '../Utilities/Response';
import { ClientDTO } from 'API/DTO';
import { IClientService } from 'Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientFilters } from '@domain/Repositories';

export class ClientController {
    constructor(private service: IClientService) {
        this.service = service;
    }

    createClient: RequestHandler = async (
        req: IBaseRequest<ClientDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.CreateClient(
                req.body.data,
                req.file as Express.MulterS3.File,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    getClients: RequestHandler = async (
        req: IBaseQueryRequest<ClientFilters>,
        res: Response,
        next: NextFunction,
    ) => {
        const { search, pageLimit, pageNumber, sort } = req.query;
        try {
            const clients = await this.service.GetClients({
                search,
                pageLimit,
                pageNumber,
                sort,
            });

            return successResponse(res, 'Successful', { clients });
        } catch (err) {
            next(err);
        }
    };

    getClient: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const client = await this.service.GetClient(req.params.clientId);

            return successResponse(res, 'Successful', { client });
        } catch (err) {
            next(err);
        }
    };

    deleteClient: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeleteClient(
                req.params.clientId,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updateClient: RequestHandler = async (
        req: IBaseRequest<ClientDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdateClient(
                req.params.clientId,
                req.body.data,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updateClientLogo: RequestHandler = async (
        req: IBaseRequest<ClientDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdateClientLogo(
                req.params.clientId,
                req.file as Express.MulterS3.File,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };
}
