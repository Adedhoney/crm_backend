import {
    AutoIncrement,
    Column,
    Model,
    DataType,
    HasMany,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Gender, UserAccountStatus, UserType } from '@domain/Enums';

export interface User {
    id?: number;
    userId: string;
    sessionId?: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: Gender;
    DOB?: Date;
    phone?: string;
    location?: string;
    status: UserAccountStatus;
    userType: UserType;
    password?: string;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
}

// Database Table
@Table({
    tableName: 'users',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class UserTable extends Model implements User {
    @AutoIncrement
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @Column({ type: DataType.UUID, allowNull: true })
    declare sessionId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare firstName: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare middleName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare lastName: string;

    @Column({ type: DataType.TINYINT, allowNull: false })
    declare gender: Gender;

    @Column({ type: DataType.DATEONLY, allowNull: true })
    declare DOB: Date;

    @Column({ type: DataType.STRING, allowNull: true })
    declare phone: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare location: string;

    @Column({ type: DataType.TINYINT, allowNull: false })
    declare status: number;

    @Column({ type: DataType.TINYINT, allowNull: false })
    declare userType: UserType;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare lastModifiedOn: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare createdBy: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare modifiedBy: string;
}
