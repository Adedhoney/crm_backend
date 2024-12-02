import {
    InviteDTO,
    LogInDTO,
    LogInResponse,
    ResetPasswordDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    VerifyOtpDTO,
} from '@api/DTO';
import { User } from '@domain/Models';

export interface IAccountService {
    StartUp(email: string): Promise<void>;
    SendAdminInvite(data: InviteDTO, auth: User): Promise<void>;
    DeactivateAdmin(adminId: string, auth: User): Promise<void>;
    ResendAdminInvite(inviteId: string, auth: User): Promise<void>;
    ActivateAdmin(data: AdminDTO, inviteId: string): Promise<void>;
    GetAdminInvite(inviteId: string): Promise<AdminInvite>;
    GetAdminInvites(): Promise<AdminInvite[]>;
    LogIn(data: LogInDTO): Promise<LogInResponse>;
    GetAdmin(authUser: Admin): Promise<Admin>;
    GetAdminById(adminId: string): Promise<Admin>;
    GetAdmins(filter: AdminFilters): Promise<Admin[]>;
    UpdateInfo(data: UpdateInfoDTO, auth: User): Promise<void>;
    UpdatePassword(data: UpdatePassWordDTO, auth: User): Promise<void>;
    ForgotPassword(email: string): Promise<void>;
    VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }>;
    ResetPassword(data: ResetPasswordDTO): Promise<void>;
}
