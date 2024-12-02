import config from '@application/config';

import {
    ActivityLogTable,
    ClientTable,
    ContactTable,
    InviteTable,
    OTPTable,
    ReportTable,
    ReportFileTable,
    UserTable,
} from '@domain/Models';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

export interface IDatabase {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    activityLog: typeof ActivityLogTable;
    client: typeof ClientTable;
    contact: typeof ContactTable;
    invite: typeof InviteTable;
    otp: typeof OTPTable;
    report: typeof ReportTable;
    reportFile: typeof ReportFileTable;
    user: typeof UserTable;
}

const models = [
    ActivityLogTable,
    ClientTable,
    ContactTable,
    InviteTable,
    OTPTable,
    ReportTable,
    ReportFileTable,
    UserTable,
];

const options: SequelizeOptions = {
    host: config.DATABASE.host,
    port: config.DATABASE.port,
    database: config.DATABASE.database,
    dialect: 'mysql',
    username: config.DATABASE.user,
    password:
        config.ENVIRONMENT === 'local_development'
            ? undefined
            : config.DATABASE.password,
    storage: ':memory:',
    models,
};

const sequelize = new Sequelize(options);

const Database: IDatabase = {
    sequelize,
    Sequelize: Sequelize,
    activityLog: ActivityLogTable,
    client: ClientTable,
    contact: ContactTable,
    invite: InviteTable,
    otp: OTPTable,
    report: ReportTable,
    reportFile: ReportFileTable,
    user: UserTable,
};

export { Database };
