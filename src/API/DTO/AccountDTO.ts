import { User } from '@domain/Models';

export interface LogInDTO {
    email: string;
    password: string;
}

export interface LogInResponse {
    token: string;
    user: User;
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
    gender: number;
    lastName: string;
    password: string;
    middleName?: string;
    DOB: Date;
    phone: string;
    location: string;
}

export interface InviteDTO {
    userType: number;
    email: string;
}
