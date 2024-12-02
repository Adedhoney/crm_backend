import { OTPStatus } from '@domain/Enums';
import {
    Table,
    Column,
    Model,
    AutoIncrement,
    Unique,
    DataType,
    PrimaryKey,
} from 'sequelize-typescript';

export interface OTP {
    id?: number;
    email: string;
    otp: string;
    expiresAt: number;
    wrongTrials: number;
    status: OTPStatus;
    createdOn?: number;
    lastModifiedOn?: number;
}

@Table({
    tableName: 'otps',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class OTPTable extends Model implements OTP {
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id?: number;

    @Unique
    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare otp: string;

    @Column({ type: DataType.BIGINT, allowNull: false })
    declare expiresAt: number;

    @Column({ type: DataType.TINYINT, allowNull: false })
    declare wrongTrials: number;

    @Column({ type: DataType.TINYINT, allowNull: false })
    declare status: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare lastModifiedOn: number;
}
