import { UploadFile } from '@api/Middleware/FileUpload';
import { ClientController } from 'API/Controller';
import { Validation } from 'API/Middleware';
import { ClientSchema } from 'API/Schemas';
import { RequestHandler, Router } from 'express';

const router = Router();

export default (acctctr: ClientController, auth: RequestHandler) => {
    router.post(
        '/',
        auth,
        Validation(ClientSchema),
        UploadFile.single('file'),
        acctctr.createClient,
    );
    router.get('/', auth, acctctr.getClients);
    router.get('/:clientId', auth, acctctr.getClient);
    router.delete('/:clientId', auth, acctctr.deleteClient);
    router.put(
        '/:clientId',
        auth,
        Validation(ClientSchema),
        acctctr.updateClient,
    );
    router.put(
        '/:clientId/logo',
        auth,
        UploadFile.single('file'),
        acctctr.updateClientLogo,
    );

    return router;
};
