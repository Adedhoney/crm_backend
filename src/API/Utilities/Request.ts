import { Request } from 'express';

export interface RequestWithUserId extends Request {
    userId?: string;
}

export interface IBaseRequest<T> extends RequestWithUserId {
    body: {
        data: T;
    };
}

export interface IBaseQueryRequest<T> extends Request<any, any, any, T> {}
