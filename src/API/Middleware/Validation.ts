import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@application/error';
import { StatusCode } from '@application/utilities';
import { ObjectSchema } from 'joi';

export const Validation =
    (schema: ObjectSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        let data = req.body.data;
        if (typeof req.body.data === 'string') {
            data = JSON.parse(req.body.data);
            req.body.data = data;
        }
        if (!data) {
            return next(
                new CustomError('Invalid request data', StatusCode.BAD_REQUEST),
            );
        }

        const { error } = schema.validate(data);
        if (error) {
            return next(new CustomError(error.message, StatusCode.BAD_REQUEST));
        }

        next();
    };
