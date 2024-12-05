import { ContactController } from 'API/Controller';
import { Validation } from 'API/Middleware';
import { ClientSchema } from 'API/Schemas';
import { RequestHandler, Router } from 'express';

const router = Router();

export default (acctctr: ContactController, auth: RequestHandler) => {
    router.post('/', auth, Validation(ClientSchema), acctctr.createContact);
    router.get('/', auth, acctctr.getContacts);
    router.get('/:contactId', auth, acctctr.getContact);
    router.delete('/:contactId', auth, acctctr.deleteContact);
    router.put(
        '/:contactId',
        auth,
        Validation(ClientSchema),
        acctctr.updateContact,
    );

    return router;
};
