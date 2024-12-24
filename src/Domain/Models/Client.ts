import {
    AutoIncrement,
    Column,
    Model,
    DataType,
    HasMany,
    PrimaryKey,
    Table,
    Unique,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User, UserTable } from './User';
import { ContactTable } from './Contact';
import { ClientType } from '@domain/Enums';

export interface Client {
    id?: number;
    clientId: string;
    logoUrl: string;
    name: string;
    industry: string;
    email: string;
    phone: string;
    type: ClientType;
    bankingDetails: string;
    responsibleUserId: string;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
}

@Table({
    tableName: 'clients',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class ClientTable extends Model implements Client {
    @Unique
    @AutoIncrement
    @Column
    declare id: number;

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    declare clientId: string;

    @HasMany(() => ContactTable, 'clientId')
    declare contacts: ContactTable[];

    @Column({ type: DataType.STRING, allowNull: true })
    declare logoUrl: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare industry: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare phone: string;

    @Column({ type: DataType.TINYINT, allowNull: true })
    declare type: ClientType;

    @Column({ type: DataType.STRING, allowNull: true })
    declare bankingDetails: string;

    @ForeignKey(() => UserTable)
    @Column({ type: DataType.UUID, allowNull: true })
    declare responsibleUserId: string;

    @BelongsTo(() => UserTable, 'responsibleUserId')
    declare responsibleUser: UserTable;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare lastModifiedOn: number;

    @ForeignKey(() => UserTable)
    @Column({ type: DataType.STRING, allowNull: true })
    declare createdBy: string;

    @BelongsTo(() => UserTable, 'createdBy')
    declare creator: UserTable;

    @ForeignKey(() => UserTable)
    @Column({ type: DataType.STRING, allowNull: true })
    declare modifiedBy: string;

    @BelongsTo(() => UserTable, 'modifiedBy')
    declare modifier: UserTable;
}
