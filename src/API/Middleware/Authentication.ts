// import { RequestWithUserId } from '@api/Utilities/Request';
// import {
//     CustomError,
//     InvalidTokenError,
//     TokenExpiredError,
// } from '@application/error';
// import { StatusCode, verifyAuthToken } from '@application/utilities';
// import { IAccountRepository } from '@domain/Repository';

// import { NextFunction, Request, Response } from 'express';
// import { JsonWebTokenError } from 'jsonwebtoken';

// export const Authentication =
//     (acctrepo: IAccountRepository) =>
//     async (req: RequestWithUserId, res: Response, next: NextFunction) => {
//         try {
//             const token = req.headers['authorization']?.split(' ')[1];
//             if (!token) {
//                 return next(
//                     new CustomError('Unauthorized', StatusCode.UNAUTHORIZED),
//                 );
//             }
//             const validate = verifyAuthToken(token);
//             const authData = await acctrepo.getUserById(validate.userId);
//             if (!authData || authData.sessionId !== validate.sessionId)
//                 return next(
//                     new CustomError('Unauthorized', StatusCode.UNAUTHORIZED),
//                 );

//             req.userId = authData.userId;
//             next();
//         } catch (err: JsonWebTokenError | any) {
//             if (
//                 err instanceof JsonWebTokenError &&
//                 err.message == 'invalid signature'
//             ) {
//                 return next(new InvalidTokenError());
//             }

//             return next(new TokenExpiredError());
//         }
//     };
