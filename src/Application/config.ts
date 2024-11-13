import dotenv from 'dotenv';

dotenv.config();

const envs = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    // 'DB_PASSWORD',
    'DB_NAME',
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'TWILIO_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE',
    'RABBIT_MQ_URL',
];

envs.forEach((value, index) => {
    if (!process.env[envs[index]]) {
        const message = 'Fatal Error: env ' + envs[index] + ' not define';

        throw new Error(message);
    }
});

export default {
    ENVIRONMENT: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    DATABASE: {
        port: Number(process.env.DB_PORT) || 3306,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        pemDir: process.env.DB_PEM_DIR, // for ssl connections
    },
    JWT: { secret: process.env.JWT_SECRET },
    SMTP: {
        HOST: process.env.SMTP_HOST as string,
        PORT: Number(process.env.SMTP_PORT),
        EMAIL: process.env.SMTP_EMAIL as string,
        PASSWORD: process.env.SMTP_PASSWORD as string,
    },
    TWILIO: {
        SID: process.env.TWILIO_SID as string,
        AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
        PHONE: process.env.TWILIO_PHONE as string,
    },
    RABBIT_MQ_URL: process.env.RABBIT_MQ_URL as string,
};
