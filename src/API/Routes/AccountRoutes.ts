import { AccountController } from 'API/Controller';
import { Validation } from 'API/Middleware';
import {
    LogInSchema,
    ResetPasswordSchema,
    SignUpSchema,
    UpdateInfoSchema,
    UpdatePassWordSchema,
    VerifyOtpSchema,
} from 'API/Schemas';
import { RequestHandler, Router } from 'express';

const router = Router();

export default (acctctr: AccountController, authentication: RequestHandler) => {
    router.post('/signup', Validation(SignUpSchema), acctctr.signUp);
    router.post('/login', Validation(LogInSchema), acctctr.logIn);
    router.put(
        '/',
        authentication,
        Validation(UpdateInfoSchema),
        acctctr.updateInfo,
    );
    router.post(
        '/update-password',
        authentication,
        Validation(UpdatePassWordSchema),
        acctctr.updatePassword,
    );

    router.get('/', authentication, acctctr.getUser);
    router.get('/:userId', authentication, acctctr.getUserById);
    router.delete('/', authentication, acctctr.deleteUser);

    router.post('/forgot-password/:email', acctctr.forgotPassword);
    router.post('/verify-otp', Validation(VerifyOtpSchema), acctctr.verifyOTP);
    router.post(
        '/reset-password',
        Validation(ResetPasswordSchema),
        acctctr.resetPassword,
    );

    //get subscriptions

    return router;
};
