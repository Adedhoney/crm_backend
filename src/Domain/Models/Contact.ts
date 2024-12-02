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
} from 'sequelize-typescript';
import { ClientTable } from './Client';
import { UserTable } from './User';

export interface Contact {
    id: number;
    contactId: string;
    clientId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    title: string;
    responsibleUserId: string;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
}

@Table({
    tableName: 'contacts',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class ContactTable extends Model implements Contact {
    @Unique
    @AutoIncrement
    @Column
    declare id: number;

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    declare contactId: string;

    @ForeignKey(() => ClientTable)
    @Column({ type: DataType.STRING, allowNull: false })
    declare clientId: string;
    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare phone: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare role: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare title: string;

    @ForeignKey(() => UserTable)
    @Column({ type: DataType.STRING, allowNull: true })
    declare responsibleUserId: string;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare lastModifiedOn: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare createdBy: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare modifiedBy: string;
}
