import {
    AutoIncrement,
    Model,
    Column,
    DataType,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

export interface ActivityLog {
    id?: number;
    userId: string;
    activity: string;
    description: string;
    createdOn?: number;
    lastModifiedOn?: number;
}

export enum ActivityTypes {
    SETUP = 'Setup',
    INVITE = 'Invite',
    INVITE_ACCEPTANCE = 'Invite Accepted',
    LOGIN = 'Login',
    SETTINGS = 'Settings',
    CLIENT = 'Client',
    CONTACT = 'Contact',
    REPORT = 'Report',
}

@Table({
    tableName: 'activities',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class ActivityLogTable extends Model implements ActivityLog {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id?: number;

    @Column({ type: DataType.UUID, allowNull: true })
    declare userId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare activity: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare description: string;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;
}
