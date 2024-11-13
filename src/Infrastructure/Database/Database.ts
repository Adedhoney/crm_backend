import config from '@application/config';
import { readFileSync } from 'fs';
import mysql, {
    Pool,
    PoolConnection,
    PoolOptions,
    ResultSetHeader,
} from 'mysql2/promise';

export type QueryParams = string | number | boolean | undefined | null;

export interface IDatabase {
    getConnection(): Promise<PoolConnection>;
    execute(query: string, params?: QueryParams[]): Promise<any[]>;
}

export class Database implements IDatabase {
    private connection: Pool;
    private connectionObject: PoolOptions = {
        host: config.DATABASE.host,
        user: config.DATABASE.user,
        password: config.DATABASE.password,
        database: config.DATABASE.database,
        port: config.DATABASE.port,
    };

    constructor() {
        // add azure db connection cert
        if (config.DATABASE.pemDir) {
            this.connectionObject.ssl = {
                rejectUnauthorized: true,
                ca: [readFileSync(String(config.DATABASE.pemDir))],
            };
        }

        this.connection = mysql.createPool(this.connectionObject);
    }

    async getConnection(): Promise<PoolConnection> {
        return await this.connection.getConnection();
    }

    async execute(query: string, params: QueryParams[] = []): Promise<any[]> {
        const [rows] = await this.connection.execute(query, params);
        return rows.constructor === Array ? rows : [rows];
    }
}
