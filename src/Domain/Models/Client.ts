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
import { UserTable } from './User';

export interface Client {
    id?: number;
    clientId: string;
    logoUrl: string;
    name: string;
    industry: string;
    email: string;
    phone: string;
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
    @Column({ type: DataType.STRING, allowNull: false })
    declare clientId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare logoUrl: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare industry: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare phone: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare bankingDetails: string;
    
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
