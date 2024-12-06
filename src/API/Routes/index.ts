import {
    AccountController,
    ClientController,
    ContactController,
    ReportController,
} from '@api/Controller';
import { Router } from 'express';
import { Server } from 'socket.io';
import { Database as db } from '@infrastructure/Database';
import {
    AccountRepository,
    ActivityRepository,
    ClientRepository,
    ContactRepository,
    OTPRepository,
    ReportRepository,
} from '@domain/Repositories';
import { AccountNotification } from 'Handlers/Notification';
import {
    AccountService,
    ClientService,
    ContactService,
    ReportService,
} from 'Service';
import AccountRoutes from './AccountRoutes';
import { Authentication } from '@api/Middleware';
import ClientRoutes from './ClientRoutes';
import ContactRoutes from './ContactRoutes';
import ReportRoutes from './ReportRoutes';

const router = Router();

db.sequelize.sync().then(() => console.log('synced'));
const acctrepo = new AccountRepository(db);
const activityrepo = new ActivityRepository(db);
const clientrepo = new ClientRepository(db);
const contactrepo = new ContactRepository(db);
const otprepo = new OTPRepository(db);
const reportrepo = new ReportRepository(db);

const acctNotification = new AccountNotification();

const acctctr = new AccountController(
    new AccountService(acctrepo, otprepo, acctNotification, activityrepo),
);
const clientctr = new ClientController(
    new ClientService(clientrepo, activityrepo),
);
const contactctr = new ContactController(
    new ContactService(contactrepo, clientrepo, activityrepo),
);
const reportctr = new ReportController(
    new ReportService(reportrepo, clientrepo, contactrepo, activityrepo),
);
const io = new Server();

// const io_obj = new IO(io);

const auth = Authentication(acctrepo);

router.use('/account', AccountRoutes(acctctr, auth));
router.use('/client', ClientRoutes(clientctr, auth));
router.use('/contact', ContactRoutes(contactctr, auth));
router.use('/report', ReportRoutes(reportctr, auth));

export { router, io };
