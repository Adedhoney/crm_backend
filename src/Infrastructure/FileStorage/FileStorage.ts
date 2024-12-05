import config from '@application/config';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

export interface IFileStorage {
    getConnection(): S3Client;
    deleteKey(Key: string): Promise<void>;
}

export enum SignedURLType {
    UPLOAD = 0,
    GET = 1,
}

export class FIleStorage implements IFileStorage {
    private s3: S3Client;

    constructor() {
        this.s3 = this.connect();
    }

    private connect() {
        const s3 = new S3Client({
            endpoint: config.S3.endpoint,
            region: config.S3.region,
            credentials: {
                accessKeyId: config.S3.accessKey,
                secretAccessKey: config.S3.secretKey,
            },
        });
        return s3;
    }

    getConnection(): S3Client {
        return this.s3;
    }

    async deleteKey(Key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: config.S3.bucket,
            Key,
        });
        await this.s3.send(command);
    }
}
