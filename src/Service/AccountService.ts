import {
    LogInDTO,
    LogInResponse,
    ResetPasswordDTO,
    SignUpDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    VerifyOtpDTO,
} from '@api/DTO';
import { User } from '@domain/Models';

export interface IAccountService {
    SignUp(data: SignUpDTO): Promise<void>;
    LogIn(data: LogInDTO): Promise<LogInResponse>;
    GetUser(userId: string): Promise<User>;
    UserNameAvailable(userName: string): Promise<boolean>;
    UpdateInfo(data: UpdateInfoDTO, userId: string): Promise<void>;
    UpdatePassword(data: UpdatePassWordDTO, userId: string): Promise<void>;
    DeleteUser(userId: string): Promise<void>;
    ForgotPassword(email: string): Promise<void>;
    VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }>;
    ResetPassword(data: ResetPasswordDTO): Promise<void>;
}
