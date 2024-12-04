import {
    InviteDTO,
    LogInDTO,
    LogInResponse,
    ResetPasswordDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    UserDTO,
    VerifyOtpDTO,
} from '@api/DTO';
import { CustomError } from '@application/error';
import {
    decryptPassword,
    encryptPassword,
    generateAuthToken,
    generateOtpToken,
    generateRandomId,
    generateRandomOTP,
    getCurrentTimeStamp,
    StatusCode,
    verifyOtpToken,
} from '@application/utilities';
import {
    InviteStatus,
    OTPStatus,
    UserAccountStatus,
    UserType,
} from '@domain/Enums';
import { ActivityTypes, Invite, User } from '@domain/Models';
import {
    IAccountRepository,
    IOTPRepository,
    PaginationResponse,
    UserFilters,
} from '@domain/Repositories';
import { IActivityRepository } from '@domain/Repositories/ActivityRepository';
import { IAccountNotification } from 'Handlers/Notification';

export interface IAccountService {
    StartUp(email: string): Promise<void>;
    SendInvite(data: InviteDTO, auth: User): Promise<void>;
    DeactivateUser(userId: string, auth: User): Promise<void>;
    ResendInvite(inviteId: string, auth: User): Promise<void>;
    ActivateUser(data: UserDTO, inviteId: string): Promise<void>;
    GetInvite(inviteId: string): Promise<Invite>;
    GetInvites(
        filters: UserFilters,
    ): Promise<PaginationResponse<Invite, 'invites'>>;
    LogIn(data: LogInDTO): Promise<LogInResponse>;
    GetUser(authUser: User): Promise<User>;
    GetUserById(userId: string): Promise<User>;
    GetUsers(filter: UserFilters): Promise<PaginationResponse<User, 'users'>>;
    UpdateInfo(data: UpdateInfoDTO, auth: User): Promise<void>;
    // UpdatePicture(data: UpdateInfoDTO, auth: User): Promise<void>;
    UpdatePassword(data: UpdatePassWordDTO, auth: User): Promise<void>;
    ForgotPassword(email: string): Promise<void>;
    VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }>;
    ResetPassword(data: ResetPasswordDTO): Promise<void>;
}

export class AccountService implements IAccountService {
    constructor(
        private accountrepo: IAccountRepository,
        private otprepo: IOTPRepository,
        private accountnotif: IAccountNotification,
        private activityrepo: IActivityRepository,
    ) {
        this.accountrepo = accountrepo;
        this.accountnotif = accountnotif;
        this.activityrepo = activityrepo;
    }

    // async GetDashboard(): Promise<any> {
    //     return await this.accountrepo.getDashboard();
    // }

    async StartUp(email: string): Promise<void> {
        const setUpExists = await this.accountrepo.getSuperAdmin();
        if (setUpExists) {
            throw new CustomError('Setup already done');
        }

        const date = getCurrentTimeStamp();

        const expiresAt = date + 86400;

        const inviteId = generateRandomId();
        const invite = {
            inviteId,
            email,
            userType: UserType.SUPERADMIN,
            expiresAt,
            status: InviteStatus.PENDING,
            createdOn: date,
            lastModifiedOn: date,
        };
        await this.accountnotif.sendInvite(email, inviteId);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: '',
            activity: ActivityTypes.SETUP,
            description: `Set up invite sent to ${email}`,
            createdOn: date,
        });
    }

    async SendInvite(data: InviteDTO, auth: User): Promise<void> {
        const emailExists = await this.accountrepo.getUserByEmail(data.email);

        if (emailExists) {
            throw new CustomError(
                'Account email already exists',
                StatusCode.BAD_REQUEST,
            );
        }

        const inviteSent = await this.accountrepo.getInviteByEmail(data.email);
        if (inviteSent) {
            throw new CustomError(
                'Invite already sent. Resend invite instead',
                StatusCode.BAD_REQUEST,
            );
        }

        const inviteId = generateRandomId();

        const date = getCurrentTimeStamp();
        const expiresAt = date + 86400;
        const invite = {
            inviteId,
            email: data.email,
            userType: data.userType,
            expiresAt,
            status: InviteStatus.PENDING,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: auth.userId,
            modifiedBy: auth.userId,
        };

        await this.accountrepo.saveInvite(invite);

        await this.accountnotif.sendInvite(
            data.email,
            inviteId,
            `${auth.firstName} ${auth.lastName}`,
        );

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.INVITE,
            description: `New invite sent to ${data.email} by userId: ${auth.userId}`,
            createdOn: date,
        });
    }

    async ResendInvite(inviteId: string, auth: User): Promise<void> {
        const invite = await this.accountrepo.getInvite(inviteId);

        if (!invite) {
            throw new CustomError('Invite not found', StatusCode.BAD_REQUEST);
        }

        if (invite.status === InviteStatus.ACCEPTED) {
            throw new CustomError(
                'Invite already accepted',
                StatusCode.BAD_REQUEST,
            );
        }

        const date = getCurrentTimeStamp();

        await this.accountnotif.sendInvite(
            invite.email,
            inviteId,
            `${auth.firstName} ${auth.lastName}`,
        );
        await this.accountrepo.saveInvite({
            ...invite,
            expiresAt: date + 86400,
            lastModifiedOn: date,
            modifiedBy: auth.userId,
        });

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.INVITE,
            description: `Invite resent to ${invite.email} by userid: ${auth.userId}`,
            createdOn: date,
        });
    }

    async ActivateUser(data: UserDTO, inviteId: string): Promise<void> {
        const invite = await this.accountrepo.getInvite(inviteId);
        if (!invite) {
            throw new CustomError('Invite not found', StatusCode.BAD_REQUEST);
        }
        if (invite.status === InviteStatus.ACCEPTED) {
            throw new CustomError('Invite already', StatusCode.BAD_REQUEST);
        }

        const emailExists = await this.accountrepo.getUserByEmail(invite.email);

        if (emailExists) {
            throw new CustomError(
                'user email already exists',
                StatusCode.BAD_REQUEST,
            );
        }
        const password = await encryptPassword(data.password);
        const userId = generateRandomId();

        const date = getCurrentTimeStamp();
        const user = {
            userId,
            email: invite.email,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            gender: data.gender,
            DOB: data.DOB,
            phone: data.phone,
            location: data.location,
            status: UserAccountStatus.ACTIVE,
            userType: invite.userType,
            password,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: userId,
            modifiedBy: userId,
        };

        await this.accountrepo.saveUser(user, inviteId);
        // save activity
        this.activityrepo.saveActivityLog({
            userId,
            activity: ActivityTypes.INVITE_ACCEPTANCE,
            description: `user sign up by ${data.firstName} ${data.lastName} userId: ${userId}`,
            createdOn: date,
        });
    }

    async LogIn(data: LogInDTO): Promise<LogInResponse> {
        const user = await this.accountrepo.getUserByEmail(data.email);
        if (!user) {
            throw new CustomError('user not found', StatusCode.BAD_REQUEST);
        }
        if (user.status === UserAccountStatus.DEACTIVATED) {
            throw new CustomError(
                'User has been deactivated',
                StatusCode.BAD_REQUEST,
            );
        }
        const validPassword = await decryptPassword(
            data.password as string,
            user.password as string,
        );
        const sessionId = generateRandomId();
        user.sessionId = sessionId;

        if (!validPassword) {
            throw new CustomError(
                'Invalid username or password',
                StatusCode.BAD_REQUEST,
            );
        }
        const token = generateAuthToken(user.userId, sessionId);

        delete user.password;

        // save activity
        this.activityrepo.saveActivityLog({
            userId: user.userId,
            activity: ActivityTypes.LOGIN,
            description: `user ${user.userId} login`,
            createdOn: getCurrentTimeStamp(),
        });
        await this.accountrepo.updateSessionId(user.userId, sessionId);

        return { token, user };
    }

    async GetInvite(inviteId: string): Promise<Invite> {
        const invite = await this.accountrepo.getInvite(inviteId);
        if (invite.status === InviteStatus.ACCEPTED) {
            throw new CustomError(
                'Invite has already been accepted',
                StatusCode.BAD_REQUEST,
            );
        }
        if (invite.expiresAt < getCurrentTimeStamp()) {
            throw new CustomError('Invite has expired', StatusCode.BAD_REQUEST);
        }
        return invite;
    }

    async GetInvites(
        filters: UserFilters,
    ): Promise<PaginationResponse<Invite, 'invites'>> {
        const invites = await this.accountrepo.getInvites(filters);
        return invites;
    }

    async GetUser(auth: User): Promise<User> {
        const user = auth;
        delete user.password;
        return user;
    }

    async DeactivateUser(userId: string, auth: User): Promise<void> {
        const date = getCurrentTimeStamp();

        await this.accountrepo.updateUserStatus(
            userId,
            UserAccountStatus.DEACTIVATED,
            date,
        );
        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.SETTINGS,
            description: `User ${userId} deactivated by userId: ${auth.userId}`,
            createdOn: date,
        });
    }

    async GetUserById(userId: string): Promise<User> {
        const user = await this.accountrepo.getUserById(userId);
        return user;
    }

    async GetUsers(
        filter: UserFilters,
    ): Promise<PaginationResponse<User, 'users'>> {
        const users = await this.accountrepo.getUsers(filter);
        return users;
    }

    async UpdateInfo(data: UserDTO, auth: User): Promise<void> {
        const user = auth;
        if (!user) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        const newuserInfo = {
            userId: auth.userId,
            email: user.email,
            phone: data.phone || user.phone,
            firstName: data.firstName || user.firstName,
            middleName: data.middleName || user.middleName,
            lastName: data.lastName || user.lastName,
            gender: data.gender || user.gender,
            DOB: data.DOB || user.DOB,
            location: data.location || user.location,
            status: user.status,
            userType: user.userType,
            password: user.password,
            lastModifiedOn: date,
        };
        await this.accountrepo.updateUser(newuserInfo);
        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.SETTINGS,
            description: `User account update`,
            createdOn: date,
        });
    }

    async MakeUserAdmin(userId: string, auth: User): Promise<void> {
        const user = await this.accountrepo.getUserById(userId);
        if (!user) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        const newuserInfo = {
            ...user,
            userType: UserType.ADMIN,
            lastmodifiedOn: date,
            modifiedBy: auth.userId,
        };
        await this.accountrepo.updateUser(newuserInfo);
        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.SETTINGS,
            description: `User ${userId} update to admin`,
            createdOn: date,
        });
    }

    async UpdatePassword(data: UpdatePassWordDTO, auth: User): Promise<void> {
        const user = auth;

        if (!user) {
            throw new CustomError('user not found', StatusCode.UNAUTHORIZED);
        }
        const password = await encryptPassword(data.password);

        const date = getCurrentTimeStamp();
        await this.accountrepo.updatePassword(auth.userId, password, date);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.SETTINGS,
            description: `User password update`,
            createdOn: date,
        });
    }

    async ForgotPassword(email: string): Promise<void> {
        const user = await this.accountrepo.getUserByEmail(email);
        if (!user) {
            return;
        }

        const otp = generateRandomOTP();
        const expiresAt = getCurrentTimeStamp() + 600; // expires in 10 minutes

        await this.otprepo.saveOTP({
            email,
            otp,
            expiresAt,
            wrongTrials: 0,
            status: OTPStatus.UNUSED,
        });

        // add message queue
        this.accountnotif.forgotPasswordEmail(email, otp, user.firstName);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: '',
            activity: ActivityTypes.SETTINGS,
            description: `Forget password request by ${email}`,
            createdOn: getCurrentTimeStamp(),
        });
    }

    async VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }> {
        const savedOtp = await this.otprepo.getOTP(data.email, data.otp);
        const date = getCurrentTimeStamp();
        console.log(savedOtp);
        if (
            !savedOtp ||
            date > savedOtp.expiresAt ||
            savedOtp.status === OTPStatus.USED
        )
            throw new CustomError(
                'Invalid OTP or expired',
                StatusCode.BAD_REQUEST,
            );
        await this.otprepo.useOTP(data.email, data.otp, date);

        const token = generateOtpToken(data.email);
        return { token };
    }

    public async ResetPassword(data: ResetPasswordDTO): Promise<void> {
        const { email } = verifyOtpToken(data.otpToken);
        if (!email) {
            throw new CustomError(
                'Token invalid or expired',
                StatusCode.BAD_REQUEST,
            );
        }
        const user = await this.accountrepo.getUserByEmail(email);

        if (!user) {
            throw new CustomError('user not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        const password = await encryptPassword(data.newPassword);

        await this.accountrepo.updatePassword(user.userId, password, date);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: '',
            activity: ActivityTypes.SETTINGS,
            description: `Password reset by email ${email}`,
            createdOn: date,
        });
    }

    // async GetUsers(filters: UserFilters): Promise<User[]> {}
}
