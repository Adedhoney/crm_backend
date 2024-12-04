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
import { ReportTable } from './Report';

export interface ReportFile {
    id?: number;
    fileId: string;
    reportId: string;
    originalName: string;
    s3FileName: string;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
}

@Table({
    tableName: 'reports-files',
    timestamps: false, // If you want to manage createdAt and updatedAt timestamps
})
export class ReportFileTable extends Model implements ReportFile {
    @Unique
    @AutoIncrement
    @Column
    declare id: number;

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    declare fileId: string;

    @ForeignKey(() => ReportTable)
    @Column({ type: DataType.STRING, allowNull: false })
    declare reportId: string;

    @BelongsTo(() => ReportTable, {
        foreignKey: 'reportId',
        onDelete: 'CASCADE',
    })
    declare report: Report;

    @Column({ type: DataType.STRING, allowNull: false })
    declare originalName: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare s3FileName: string;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare createdOn: number;

    @Column({ type: DataType.BIGINT, allowNull: true })
    declare lastModifiedOn: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare createdBy: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare modifiedBy: string;
}
