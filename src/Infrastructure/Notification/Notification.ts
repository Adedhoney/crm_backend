import config from '@application/config';
import { Transporter, createTransport } from 'nodemailer';
import Twilio from 'twilio';

export class Notification {
    public async sms(params: SmsParams): Promise<void> {
        const client = Twilio(config.TWILIO.SID, config.TWILIO.AUTH_TOKEN);
        await client.messages.create({
            from: config.TWILIO.PHONE,
            to: params.to,
            body: params.message,
        });
    }

    public async email(params: MailParams): Promise<void> {
        const mail = new MailService();
        const options = {
            from: config.SMTP.EMAIL!,
            to: params.to,
            subject: params.subject as string,
            text: params.text,
            html: params.html as string,
        };

        await mail.sendMail(options);
    }
}

export type MailParams = {
    to: string;
    message: string;
    subject?: string;
    text?: string;
    html?: string;
};

export type SmsParams = {
    to: string;
    message: string;
};

type MailInterface = {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html: string;
};

class MailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: config.SMTP.HOST,
            auth: {
                user: config.SMTP.EMAIL,
                pass: config.SMTP.PASSWORD,
            },
            //   secure: config.NOTIFICATION.SMTP.secure,
            //   requireTLS: config.NOTIFICATION.SMTP.tls,
            //   debug: true,
            //   logger: true,
        });
    }

    async sendMail(options: MailInterface): Promise<void> {
        try {
            const send = await this.transporter.sendMail(options);
            console.log('Mail sent successfully!!');
            console.log(
                `[Mail response=] ${send.response} [MessageId=] ${send.messageId}`,
            );
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }
}
