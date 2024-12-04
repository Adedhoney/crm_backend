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
import { ClientTable } from './Client';
import { ReportFile, ReportFileTable } from './ReportFile';

export interface Report {
    id?: number;
    reportId: string;
    userId: string;
    clientId: string;
    contactId: string;
    title: string;
    text: string;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
}

@Table({
    tableName: 'reports',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class ReportTable extends Model implements Report {
    @Unique
    @AutoIncrement
    @Column
    declare id: number;

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    declare reportId: string;

    @HasMany(() => ReportFileTable, 'reportId')
    declare reportFiles: ReportFile[];

    @ForeignKey(() => UserTable)
    @Column({ type: DataType.STRING, allowNull: false })
    declare userId: string;

    @ForeignKey(() => ClientTable)
    @Column({ type: DataType.STRING, allowNull: true })
    declare clientId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare title: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare text: string;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare lastModifiedOn: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare createdBy: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare modifiedBy: string;
}
