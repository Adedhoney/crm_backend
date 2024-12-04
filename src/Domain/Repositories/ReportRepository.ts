import config from '@application/config';
import { CustomError } from '@application/error';
import { StatusCode } from '@application/utilities';
import { Report, ReportFile } from '@domain/Models';
import { IDatabase } from '@infrastructure/Database';
import { Op, Optional, OrderItem, QueryTypes } from 'sequelize';
import { PaginationResponse } from '.';

export interface IReportRepository {
    readonly db: IDatabase;
    saveReport(report: Report, files: ReportFile[]): Promise<void>;
    getReportById(reportId: string): Promise<Report>;
    deleteReport(reportId: string): Promise<void>;
    deleteReportFile(reportId: string, fileId: string): Promise<void>;
    addReportFile(file: ReportFile): Promise<void>;
    getReports(
        filters: ReportFilters,
    ): Promise<PaginationResponse<Report, 'reports'>>;
    updateReport(report: Report): Promise<void>;
}

type ReportSort = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

export interface ReportFilters {
    search?: string;
    clientId?: string;
    userId?: string;
    pageLimit?: number;
    pageNumber?: number;
    sort?: ReportSort;
}

export class ReportRepository implements IReportRepository {
    constructor(readonly db: IDatabase) {}

    async saveReport(report: Report, files: ReportFile[]): Promise<void> {
        const transaction = await this.db.sequelize.transaction();
        const reportFileAttributes: Optional<ReportFile, 'id'>[] = files;
        try {
            await this.db.report.create({ ...report }, { transaction });

            await this.db.reportFile.bulkCreate([...reportFileAttributes], {
                transaction,
            });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error; // re-throw the error after rolling back the transaction
        }
    }

    async getReportById(reportId: string): Promise<Report> {
        const report = await this.db.report.findOne({
            where: { reportId },
            include: { model: this.db.reportFile },
        });
        return report?.dataValues as Report;
    }

    async addReportFile(file: ReportFile): Promise<void> {
        await this.db.reportFile.create({ ...[file] });
    }

    async deleteReport(reportId: string): Promise<void> {
        await this.db.report.destroy({
            where: { reportId },
        });
    }

    async deleteReportFile(reportId: string, fileId: string): Promise<void> {
        await this.db.reportFile.destroy({
            where: { fileId, reportId },
        });
    }

    async getReports(
        filters: ReportFilters,
    ): Promise<PaginationResponse<Report, 'reports'>> {
        const { sort, userId, clientId, search, pageLimit, pageNumber } =
            filters;

        const limit = Number(pageLimit)
            ? Number(pageLimit)
            : config.QUERY_LIMIT;
        const page = Number(pageNumber) ? Number(pageNumber) : 1;
        const offset = (page - 1) * limit;

        let sorting: OrderItem = ['name', 'ASC'];
        if (sort === 'name-desc') {
            sorting = ['name', 'DESC'];
        } else if (sort === 'name-asc') {
            sorting = ['name', 'ASC'];
        }

        const reports = await this.db.report.findAll({
            where: {
                ...(search && {
                    title: { [Op.like]: search },
                }),
                ...(userId && { userId }),
                ...(clientId && { clientId }),
            },
            order: [sorting],
            limit,
            offset,
        });
        const totalData = await this.db.invite.count({
            where: {
                ...(search && {
                    title: { [Op.like]: search },
                }),
                ...(userId && { userId }),
                ...(clientId && { clientId }),
            },
        });

        const totalPages = Math.ceil(totalData / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        return {
            reports: reports as Report[],
            totalPages,
            page,
            prevPage,
            nextPage,
            limit,
            returnedData: reports.length,
            totalData,
        };
    }

    async updateReport(report: Report): Promise<void> {
        await this.db.report.update(
            { ...report },
            { where: { reportId: report.reportId } },
        );
    }
}
