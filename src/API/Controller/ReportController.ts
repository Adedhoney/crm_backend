import { User } from '@domain/Models';
import {
    IBaseQueryRequest,
    IBaseRequest,
    RequestWithAuth,
} from '../Utilities/Request';
import { successResponse } from '../Utilities/Response';
import { ReportDTO } from 'API/DTO';
import { IReportService } from 'Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ReportFilters } from '@domain/Repositories';

export class ReportController {
    constructor(private service: IReportService) {
        this.service = service;
    }

    createReport: RequestHandler = async (
        req: IBaseRequest<ReportDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.CreateReport(
                req.body.data,
                req.files as Express.MulterS3.File[],
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    getReports: RequestHandler = async (
        req: IBaseQueryRequest<ReportFilters>,
        res: Response,
        next: NextFunction,
    ) => {
        const { search, pageLimit, pageNumber, sort } = req.query;
        try {
            const reports = await this.service.GetReports({
                search,
                pageLimit,
                pageNumber,
                sort,
            });

            return successResponse(res, 'Successful', { ...reports });
        } catch (err) {
            next(err);
        }
    };

    getReport: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const report = await this.service.GetReport(req.params.reportId);

            return successResponse(res, 'Successful', { report });
        } catch (err) {
            next(err);
        }
    };

    deleteReport: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeleteReport(
                req.params.reportId,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updateReport: RequestHandler = async (
        req: IBaseRequest<ReportDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdateReport(
                req.params.reportId,
                req.body.data,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    addReportFile: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.AddReportFile(
                req.params.reportId,
                req.file as Express.MulterS3.File,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    deleteReportFile: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeleteReportFile(
                req.params.reportId,
                req.params.fileId,
                req.auth as User,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };
}
