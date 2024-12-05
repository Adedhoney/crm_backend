import { UploadFile } from '@api/Middleware/FileUpload';
import { ReportController } from 'API/Controller';
import { Validation } from 'API/Middleware';
import { ReportSchema } from 'API/Schemas';
import { RequestHandler, Router } from 'express';

const router = Router();

export default (acctctr: ReportController, auth: RequestHandler) => {
    router.post(
        '/',
        auth,
        Validation(ReportSchema),
        UploadFile.array('files'),
        acctctr.createReport,
    );
    router.get('/', auth, acctctr.getReports);
    router.get('/:reportId', auth, acctctr.getReport);
    router.delete('/:reportId', auth, acctctr.deleteReport);
    router.put(
        '/:reportId',
        auth,
        Validation(ReportSchema),
        acctctr.updateReport,
    );
    router.put(
        '/:reportId/file',
        auth,
        UploadFile.single('file'),
        acctctr.addReportFile,
    );
    router.delete('/:reportId/file/:fileId', auth, acctctr.deleteReportFile);

    return router;
};
