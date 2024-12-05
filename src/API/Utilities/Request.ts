import { User } from '@domain/Models';
import { Request } from 'express';

export interface RequestWithAuth extends Request {
    auth?: User;
}

export interface IBaseRequest<T> extends RequestWithAuth {
    body: {
        data: T;
    };
}

export interface IBaseQueryRequest<T> extends Request<any, any, any, T> {}
