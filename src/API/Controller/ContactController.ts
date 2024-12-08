import { User } from '@domain/Models';
import {
    IBaseQueryRequest,
    IBaseRequest,
    RequestWithAuth,
} from '../Utilities/Request';
import { successResponse } from '../Utilities/Response';
import { ContactDTO } from 'API/DTO';
import { IContactService } from 'Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ContactFilters } from '@domain/Repositories';

export class ContactController {
    constructor(private service: IContactService) {
        this.service = service;
    }

    createContact: RequestHandler = async (
        req: IBaseRequest<ContactDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.CreateContact(req.body.data, req.auth as User);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    getContacts: RequestHandler = async (
        req: IBaseQueryRequest<ContactFilters>,
        res: Response,
        next: NextFunction,
    ) => {
        const { search, pageLimit, pageNumber, sort } = req.query;
        try {
            const contacts = await this.service.GetContacts({
                search,
                pageLimit,
                pageNumber,
                sort,
            });

            return successResponse(res, 'Successful', { contacts });
        } catch (err) {
            next(err);
        }
    };

    getContact: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const contact = await this.service.GetContact(req.params.contactId);

            return successResponse(res, 'Successful', { contact });
        } catch (err) {
            next(err);
        }
    };

    deleteContact: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeleteContact(
                req.params.contactId,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updateContact: RequestHandler = async (
        req: IBaseRequest<ContactDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdateContact(
                req.params.contactId,
                req.body.data,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };
}
