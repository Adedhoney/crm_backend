import { AccountController } from 'API/Controller';
import { Validation } from 'API/Middleware';
import {
    InviteSchema,
    LogInSchema,
    ResetPasswordSchema,
    UpdateInfoSchema,
    UpdatePassWordSchema,
    UserSchema,
    VerifyOtpSchema,
} from 'API/Schemas';
import { RequestHandler, Router } from 'express';

const router = Router();

export default (acctctr: AccountController, auth: RequestHandler) => {
    router.post('/setup/:email', acctctr.setup);
    router.post(
        '/send-invite',
        auth,
        Validation(InviteSchema),
        acctctr.sendInvite,
    );
    router.post('/resend-invite/:inviteId', auth, acctctr.resendInvite);
    router.post(
        '/accept-invite/:inviteId',
        Validation(UserSchema),
        acctctr.activateUser,
    );
    router.post('/login', Validation(LogInSchema), acctctr.logIn);

    router.get('/invites/:inviteId', acctctr.getInvite);
    router.get('/invites', auth, acctctr.getInvites);

    router.put('/', auth, Validation(UpdateInfoSchema), acctctr.updateInfo);
    // router.put(
    //     '/:userId/role',
    //     auth,
    //     Validation(UpdateuserRoleSchema),
    //     acctctr.updateuserRole,
    // );
    router.put(
        '/update-password',
        auth,
        Validation(UpdatePassWordSchema),
        acctctr.updatePassword,
    );

    router.get('/', auth, acctctr.getUser);
    // router.get('/dashboard', auth, acctctr.dashboard);
    router.get('/users', auth, acctctr.getUsers);
    router.get('/:userId', auth, acctctr.getUserById);

    router.post('/forgot-password/:email', acctctr.forgotPassword);
    router.post('/verify-otp', Validation(VerifyOtpSchema), acctctr.verifyOTP);
    router.post(
        '/reset-password',
        Validation(ResetPasswordSchema),
        acctctr.resetPassword,
    );

    router.delete('/:userId', auth, acctctr.deactivateUser);
    // router.post('/:userId/reactivate', auth, acctctr.re);

    return router;
};
