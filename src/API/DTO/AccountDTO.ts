import { User } from '@domain/Models';

export interface LogInDTO {
    email: string;
    password: string;
}

export interface LogInResponse {
    token: string;
    user: User;
    role: Role;
}

export interface UpdateInfoDTO {
    firstName?: string;
    lastName?: string;
}
export interface UpdatePassWordDTO {
    password: string;
}

export interface VerifyOtpDTO {
    email: string;
    otp: string;
}
export interface ResetPasswordDTO {
    otpToken: string;
    newPassword: string;
}

export interface UserDTO {
    firstName: string;
    lastName: string;
    password: string;
}

export interface InviteDTO {
    roleId: string;
    email: string;
}
