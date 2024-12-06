import { InviteStatus, UserType } from '@domain/Enums';
import {
    Table,
    Column,
    Model,
    AutoIncrement,
    Unique,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

export interface Invite {
    id?: number;
    inviteId: string;
    email: string;
    userType: UserType;
    expiresAt: number;
    status: InviteStatus;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
}

@Table({
    tableName: 'invites',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class InviteTable extends Model implements Invite {
    @AutoIncrement
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    declare inviteId: string;

    @Unique
    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ type: DataType.TINYINT, allowNull: false })
    declare userType: UserType;

    @Column({ type: DataType.BIGINT, allowNull: false })
    declare expiresAt: number;

    @Column({ type: DataType.TINYINT, allowNull: false })
    declare status: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare lastModifiedOn: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare createdBy: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare modifiedBy: string;
}
