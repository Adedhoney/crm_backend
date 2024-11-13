import http from 'http';

import app from './app';
import config from '@application/config';
import { io } from 'API/Routes';

const port: number = config.PORT || 8080;

const httpServer = new http.Server(app);

io.attach(httpServer, { cors: { origin: '*' } });

const server: http.Server = httpServer.listen(port, () => {
    console.log(`Server listening on ${port} `);
});

server.on('error', (err) => {
    console.error(`Server failed to start: ${err.message}`);
    process.exit();
});

const unexpectedErrorHandler = (error: Error) => {
    console.log('unexpectedErrorHandler', error);
    // exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
