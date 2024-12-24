import { User } from '@domain/Models';
import {
    IBaseQueryRequest,
    IBaseRequest,
    RequestWithAuth,
} from '../Utilities/Request';
import { successResponse } from '../Utilities/Response';
import {
    InviteDTO,
    LogInDTO,
    ResetPasswordDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    UpdateUserDTO,
    UserDTO,
    VerifyOtpDTO,
} from 'API/DTO';
import { IAccountService } from 'Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserFilters } from '@domain/Repositories';

export class AccountController {
    constructor(private service: IAccountService) {
        this.service = service;
    }
    setup: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.StartUp(req.params.email);

            return successResponse(
                res,
                `Invite email sent to ${req.params.email}`,
            );
        } catch (err) {
            next(err);
        }
    };

    sendInvite: RequestHandler = async (
        req: IBaseRequest<InviteDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.SendInvite(req.body.data, req.auth as User);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    resendInvite: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ResendInvite(
                req.params.inviteId,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    activateUser: RequestHandler = async (
        req: IBaseRequest<UserDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ActivateUser(req.body.data, req.params.inviteId);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    makeUserAdmin: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.MakeUserAdmin(
                req.params.userId,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    logIn: RequestHandler = async (
        req: IBaseRequest<LogInDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.LogIn(req.body.data);

            return successResponse(res, 'Successful', { ...user });
        } catch (err) {
            next(err);
        }
    };

    getInvite: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const invite = await this.service.GetInvite(req.params.inviteId);

            return successResponse(res, 'Successful', { invite });
        } catch (err) {
            next(err);
        }
    };

    getInvites: RequestHandler = async (
        req: IBaseQueryRequest<UserFilters>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { search, pageLimit, pageNumber, sort } = req.query;
            const invites = await this.service.GetInvites({
                search,
                pageLimit,
                pageNumber,
                sort,
            });

            return successResponse(res, 'Successful', { ...invites });
        } catch (err) {
            next(err);
        }
    };

    getUser: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUser(req.auth as User);

            return successResponse(res, 'Successful', { user });
        } catch (err) {
            next(err);
        }
    };

    getUserById: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUserById(req.params.userId);

            return successResponse(res, 'Successful', { user });
        } catch (err) {
            next(err);
        }
    };

    getUsers: RequestHandler = async (
        req: IBaseQueryRequest<UserFilters>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { search, pageLimit, pageNumber, sort, userType } = req.query;
            const admins = await this.service.GetUsers({
                search,
                pageLimit,
                pageNumber,
                sort,
                userType,
            });

            return successResponse(res, 'Successful', { ...admins });
        } catch (err) {
            next(err);
        }
    };

    deactivateUser: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeactivateUser(
                req.params.userId,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updateInfo: RequestHandler = async (
        req: IBaseRequest<UpdateUserDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdateInfo(req.body.data, req.auth as User);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updatePassword: RequestHandler = async (
        req: IBaseRequest<UpdatePassWordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdatePassword(req.body.data, req.auth as User);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    forgotPassword: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ForgotPassword(req.params.email);

            return successResponse(
                res,
                `If ${req.params.email} has a valid account, it will receive an OTP shortly`,
            );
        } catch (err) {
            next(err);
        }
    };
    verifyOTP: RequestHandler = async (
        req: IBaseRequest<VerifyOtpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const token = await this.service.VerifyOTP(req.body.data);

            return successResponse(res, `OTP verified successfully`, {
                otpToken: token.token,
            });
        } catch (err) {
            next(err);
        }
    };

    resetPassword: RequestHandler = async (
        req: IBaseRequest<ResetPasswordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ResetPassword(req.body.data);
            return successResponse(res, `Password reset successful`);
        } catch (err) {
            next(err);
        }
    };
}
