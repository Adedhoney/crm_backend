import { IDatabase } from '@infrastructure/Database';
import { OTP } from '../Models';
import { OTPStatus } from '@domain/Enums';

export interface IOTPRepository {
    saveOTP(otp: OTP): Promise<void>;
    getOTP(email: string, otp: string): Promise<OTP>;
    useOTP(email: string, otp: string, date: number): Promise<void>;
    addWrongTrial(email: string, number: number, date: number): Promise<void>;
}

export class OTPRepository implements IOTPRepository {
    constructor(readonly db: IDatabase) {}

    async saveOTP(OTP: OTP): Promise<void> {
        await this.db.otp.upsert(
            { ...OTP },
            { fields: ['otp', 'expiresAt', 'status', 'lastModifiedOn'] },
        );
    }

    async getOTP(email: string, otp: string): Promise<OTP> {
        const otpInfo = await this.db.otp.findOne({
            where: { email, otp },
        });
        return otpInfo as OTP;
    }

    async addWrongTrial(
        email: string,
        number: number,
        date: number,
    ): Promise<void> {
        await this.db.otp.update(
            { wrongTrials: number, lastModifiedOn: date },
            { where: { email } },
        );
    }

    async useOTP(email: string, otp: string, date: number): Promise<void> {
        await this.db.otp.update(
            { otp, status: OTPStatus.USED, lastModifiedOn: date },
            { where: { email } },
        );
    }
}
