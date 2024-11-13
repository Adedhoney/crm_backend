import { StatusCode } from '@application/utilities';

import { Response } from 'express';

export enum ResponseStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    ERROR = 'error',
}

export interface IResponse<T extends object> {
    status: ResponseStatus;
    message: string;
    data: T;
}

export class ResponseDTO implements IResponse<object> {
    status: ResponseStatus;
    message: string;
    data: object;

    constructor(status: ResponseStatus, message: string, data: object = {}) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export const successResponse = (
    res: Response,
    message: string,
    data: object = {},
    code?: number,
) => {
    if (!code) code = StatusCode.SUCCESS;
    return res
        .status(code)
        .send(new ResponseDTO(ResponseStatus.SUCCESS, message, data));
};

export const errorResponse = (
    res: Response,
    message: string,
    code?: number,
) => {
    if (!code) code = StatusCode.SUCCESS;
    return res
        .status(code)
        .send(new ResponseDTO(ResponseStatus.ERROR, message));
};
