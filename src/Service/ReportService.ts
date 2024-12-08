import { ReportDTO } from '@api/DTO';
import { CustomError } from '@application/error';
import {
    generateRandomId,
    getCurrentTimeStamp,
    StatusCode,
} from '@application/utilities';
import { ActivityTypes, User, Report } from '@domain/Models';
import {
    IClientRepository,
    IContactRepository,
    IReportRepository,
    PaginationResponse,
    ReportFilters,
} from '@domain/Repositories';
import { IActivityRepository } from '@domain/Repositories/ActivityRepository';

export interface IReportService {
    CreateReport(
        data: ReportDTO,
        images: Express.Multer.File[],
        auth: User,
    ): Promise<void>;
    GetReport(reportId: string): Promise<Report>;
    GetReports(
        filters: ReportFilters,
    ): Promise<Promise<PaginationResponse<Report, 'reports'>>>;
    DeleteReport(reportId: string, auth: User): Promise<void>;
    UpdateReport(reportId: string, data: ReportDTO, auth: User): Promise<void>;
    AddReportFile(
        reportId: string,
        image: Express.MulterS3.File,
        auth: User,
    ): Promise<void>;
    DeleteReportFile(
        reportId: string,
        fileId: string,
        auth: User,
    ): Promise<void>;
}

export class ReportService implements IReportService {
    constructor(
        private reportrepo: IReportRepository,
        private clientrepo: IClientRepository,
        private contactrepo: IContactRepository,
        private activityrepo: IActivityRepository,
    ) {}

    async CreateReport(
        data: ReportDTO,
        images: Express.MulterS3.File[],
        auth: User,
    ): Promise<void> {
        if (data.clientId) {
            const client = await this.clientrepo.getClientById(data.clientId);
            if (!client) {
                throw new CustomError(
                    `Client with clientId: ${data.clientId} not found`,
                );
            }
        }
        if (data.contactId) {
            const contact = await this.contactrepo.getContactById(
                data.contactId,
            );
            if (!contact) {
                throw new CustomError(
                    `Contact with contactId: ${data.contactId} not found`,
                );
            }
        }
        const reportId = generateRandomId();

        const date = getCurrentTimeStamp();

        const report = {
            reportId,
            userId: auth.userId,
            clientId: data.clientId,
            contactId: data.contactId,
            title: data.title,
            text: data.text,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: auth.userId,
            modifiedBy: auth.userId,
        };
        const reportFiles = [];

        for (let image of images) {
            const fileId = generateRandomId();
            const reportFile = {
                fileId,
                reportId,
                originalName: image.originalname,
                location: image.location,
                createdOn: date,
                lastModifiedOn: date,
                createdBy: auth.userId,
                modifiedBy: auth.userId,
            };
            reportFiles.push(reportFile);
        }
        await this.reportrepo.saveReport(report, reportFiles);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.REPORT,
            description: `New Report of reportId ${reportId} created by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }

    async GetReport(reportId: string): Promise<Report> {
        const report = await this.reportrepo.getReportById(reportId);
        return report;
    }
    async DeleteReport(reportId: string, auth: User): Promise<void> {
        await this.reportrepo.deleteReport(reportId);

        const date = getCurrentTimeStamp();

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.REPORT,
            description: `Report of reportId ${reportId} deleted by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async GetReports(
        filters: ReportFilters,
    ): Promise<Promise<PaginationResponse<Report, 'reports'>>> {
        const report = await this.reportrepo.getReports(filters);
        return report;
    }
    async UpdateReport(
        reportId: string,
        data: ReportDTO,
        auth: User,
    ): Promise<void> {
        const report = await this.reportrepo.getReportById(reportId);
        if (!report) {
            throw new CustomError('Report not found', StatusCode.NOT_FOUND);
        }

        const date = getCurrentTimeStamp();

        const newReport = {
            reportId,
            userId: report.userId,
            clientId: report.clientId,
            contactId: report.contactId,
            title: data.title,
            text: data.text,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: auth.userId,
            modifiedBy: auth.userId,
        };
        await this.reportrepo.updateReport(newReport);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.REPORT,
            description: `Report of reportId ${reportId} updated by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async AddReportFile(
        reportId: string,
        image: Express.MulterS3.File,
        auth: User,
    ): Promise<void> {
        const report = await this.reportrepo.getReportById(reportId);
        if (!report) {
            throw new CustomError('Report not found', StatusCode.NOT_FOUND);
        }

        const fileId = generateRandomId();

        const date = getCurrentTimeStamp();
        const reportFile = {
            fileId,
            reportId,
            originalName: image.originalname,
            location: image.location,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: auth.userId,
            modifiedBy: auth.userId,
        };
        await this.reportrepo.addReportFile(reportFile);
        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.REPORT,
            description: `Added file to report ${reportId} by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async DeleteReportFile(
        reportId: string,
        fileId: string,
        auth: User,
    ): Promise<void> {
        await this.reportrepo.deleteReportFile(reportId, fileId);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.REPORT,
            description: `Deleted file to report ${reportId} by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: getCurrentTimeStamp(),
        });
    }
}
