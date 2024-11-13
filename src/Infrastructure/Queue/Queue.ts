import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';

interface IQueue {
    publish(queueName: string, payload: any): Promise<boolean>;
    consume(
        queueName: string,
        callback: (msg: ConsumeMessage | null) => void,
        noAck: boolean,
    ): Promise<void>;
}

export class Queue implements IQueue {
    private url: string;
    private connection?: Connection;
    private channel?: Channel;
    private isConnected: boolean;

    constructor(queueUrl: string) {
        this.url = queueUrl;
        this.isConnected = false;
    }

    private async createConnection(): Promise<void> {
        try {
            this.connection = await amqp.connect(this.url);
            this.isConnected = true;

            this.connection.on('close', (err) => {
                console.error('Connection closed', err);
                this.isConnected = false;
                this.connection = undefined;
                this.channel = undefined;
            });
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    private async getConnection(): Promise<void> {
        try {
            if (!this.connection) {
                await this.createConnection();
            }
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    private async getChannel(): Promise<Channel> {
        try {
            await this.getConnection();

            if (!this.channel || this.channel.connection === null) {
                this.channel = await this.connection!.createChannel();
            }

            return this.channel!;
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    public async publish(queueName: string, payload: any): Promise<boolean> {
        try {
            const channel = await this.getChannel();

            await channel.assertQueue(queueName, { durable: true });

            const send = channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(payload)),
            );

            return send;
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    public async consume(
        queueName: string,
        callback: (msg: ConsumeMessage | null) => void,
        noAck: boolean,
    ): Promise<void> {
        try {
            const channel = await this.getChannel();

            console.log(`Listening to consume ${queueName} data.....`);

            await channel.assertQueue(queueName, { durable: true });

            await channel.consume(queueName, (msg) => callback(msg), { noAck });
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }
}
