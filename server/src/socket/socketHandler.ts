import { Server as SocketIOServer, Socket } from 'socket.io';
import { socketAuthMiddleware } from '../middleware/middleware';

class SocketHandler {
    private io: SocketIOServer;

    constructor(server: any) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: 'http://localhost:4002',
                methods: ['GET', 'POST']
            }
        });

        this.io.use(socketAuthMiddleware);

        this.io.on('connection', this.handleConnection.bind(this));
    }

    private handleConnection(socket: Socket) {
        console.log('New client connected...');

        socket.on('joinSession', this.handleJoinSession.bind(this, socket));
        socket.on('message', this.handleMessage.bind(this, socket));
        socket.on('disconnect', this.handleDisconnect.bind(this, socket));
    }

    private handleJoinSession(socket: Socket, data: { sessionId: string }) {
        const { sessionId } = data;
        socket.join(sessionId);
        console.log(`Client joined session: ${sessionId}`);
    }

    private handleMessage(socket: Socket, data: { sessionId: string, message: string }) {
        const { sessionId, message } = data;
        console.log('New Message:', data);

        const response = {
            text: 'Hell yeah brother.',
            timestamp: new Date(),
            user: 'AI-Therapist'
        };

        this.io.to(sessionId).emit('message', response);
    }

    private handleDisconnect(socket: Socket) {
        console.log('Client disconnected');
    }
}

export default SocketHandler;
