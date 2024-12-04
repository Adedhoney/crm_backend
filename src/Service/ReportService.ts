import { ReportDTO } from '@api/DTO';
import { User } from '@domain/Models';
import { ReportFilters } from '@domain/Repositories';

export interface IReportService {
    CreateReport(
        data: ReportDTO,
        images: Express.Multer.File[],
        auth: User,
    ): Promise<void>;
    GetReportById(ReportId: string): Promise<Report>;
    GetReports(filters: ReportFilters): Promise<Report[]>;
    DeleteReport(ReportId: string, auth: User): Promise<void>;
    UpdateReport(ReportId: string, data: ReportDTO, auth: User): Promise<void>;
}

export class ReportService implements IReportService {
    constructor(
        private Reportrepo: IReportRepository,
        private clientrepo: IClientRepository,
        private activityrepo: IActivityRepository,
    ) {}

    async CreateReport(data: ReportDTO, auth: User): Promise<void> {
        if (data.clientId) {
            const client = await this.clientrepo.getClientById(data.clientId);
            if (!client) {
                throw new CustomError(
                    `Client with clientId: ${data.clientId} not found`,
                );
            }
        }
        const ReportId = generateRandomId();

        const date = getCurrentTimeStamp();

        const Report = {
            ReportId,
            clientId: data.clientId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            title: data.title,
            responsibleUserId: data.responsibleUserId,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: auth.userId,
            modifiedBy: auth.userId,
        };
        await this.Reportrepo.saveReport(Report);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.Report,
            description: `New Report of ReportId ${ReportId} created by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async GetReport(ReportId: string): Promise<Report> {
        const Report = await this.Reportrepo.getReportById(ReportId);
        return Report;
    }
    async DeleteReport(ReportId: string, auth: User): Promise<void> {
        await this.Reportrepo.deleteReport(ReportId);

        const date = getCurrentTimeStamp();

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.Report,
            description: `Report of ReportId ${ReportId} deleted by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async GetReports(
        filters: ReportFilters,
    ): Promise<Promise<PaginationResponse<Report, 'Reports'>>> {
        const Report = await this.Reportrepo.getReports(filters);
        return Report;
    }
    async UpdateReport(
        ReportId: string,
        data: ReportDTO,
        auth: User,
    ): Promise<void> {
        const Report = await this.Reportrepo.getReportById(ReportId);
        if (!Report) {
            throw new CustomError('Report not found', StatusCode.NOT_FOUND);
        }

        const date = getCurrentTimeStamp();

        const newReport = {
            ReportId,
            clientId: data.clientId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            title: data.title,
            responsibleUserId: data.responsibleUserId,
            createdOn: Report.createdOn,
            lastModifiedOn: date,
            createdBy: Report.createdBy,
            modifiedBy: auth.userId,
        };
        await this.Reportrepo.updateReport(newReport);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.Report,
            description: `Report of ReportId ${ReportId} updated by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
}
