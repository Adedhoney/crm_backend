import { CustomError } from '@application/error';
import { verifyAuthToken } from '@application/utilities';
import { Server, Socket } from 'socket.io';

// export interface IIO {
//     sendMessage(accountId: string, message: Message): Promise<void>;
// }

export class IO {
    constructor(private io: Server) {
        this.io = io;
        this.io.use(this.authenticateConnection);
        this.listenForConnections();
    }

    private userRoom = (accountId: string) => {
        return `user:${accountId}`;
    };

    private authenticateConnection(
        socket: Socket,
        next: (err?: Error) => void,
    ) {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                new CustomError('Invalid token');
            }
            const validate = verifyAuthToken(token);

            socket.handshake.auth.accountId = validate.accountId;
            next();
        } catch (error) {
            next(new CustomError('Invalid token'));
        }
    }

    private async listenForConnections(): Promise<void> {
        this.io.on('connection', (socket) => {
            const { accountId } = socket.handshake.auth;
            const userRoom = this.userRoom(accountId);
            console.log(`${userRoom} connected`);
            socket.join(userRoom);
        });
    }
}
