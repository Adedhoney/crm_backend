import { AccountController } from '@api/Controller';
import { Database } from '@infrastructure/Database';
import { IO } from '@infrastructure/Websocket';
import { Router } from 'express';
import { Server } from 'socket.io';

const router = Router();

const database = new Database();
// const acctrepo = new AccountRepository(database);

// const otprepo = new OTPRepository(database);

// const acctNotification = new AccountNotification();

// const acctctr = new AccountController(
//     new AccountService(acctrepo, otprepo, acctNotification),
// );

const io = new Server();

// const io_obj = new IO(io);

// router.use('/users', AccountRoutes(acctctr, Auth));

export { router, io };
