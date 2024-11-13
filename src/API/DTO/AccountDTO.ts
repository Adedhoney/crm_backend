import { User } from '@domain/Models';

export interface SignUpDTO {
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    DOB: string;
    password: string;
}

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
    DOB: number;
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
