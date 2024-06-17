import { Server as SocketIOServer, Socket } from 'socket.io';
import { socketAuthMiddleware } from '../middleware/middleware';
import SessionHandler from '../api/sessionHandler';

class SocketHandler {
    private io: SocketIOServer;
    private SessionHandler: typeof SessionHandler

    constructor(server: any) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: 'http://localhost:4002',
                methods: ['GET', 'POST']
            }
        });

        this.io.use(socketAuthMiddleware);
        this.io.on('connection', this.handleConnection.bind(this));
        this.SessionHandler = SessionHandler
    }

    private handleConnection(socket: Socket) {
        console.log('New client connected...');

        socket.on('joinSession', this.handleJoinSession.bind(this, socket));
        socket.on('message', this.handleMessage.bind(this, socket));
        socket.on('disconnect', this.handleDisconnect.bind(this, socket));
    }

    private async handleJoinSession(socket: Socket, data: { sessionId: string }) {
        const { sessionId } = data;
        socket.join(sessionId);
        socket.data.sessionId = sessionId;
        this.SessionHandler.createChain(sessionId);
        console.log(`Client joined session: ${sessionId}`);

        // If conversation exists, emit a new message with history
        const history = await this.SessionHandler.getMemory(sessionId)
        this.io.to(sessionId).emit('history', history);
    }

    private async handleMessage(socket: Socket, data: { sessionId: string, message: string }) {
        const { sessionId, message } = data;
        const chain = this.SessionHandler.getChain(sessionId)

        try {
            // TODO: put invoke/options logic in SessionHandler
            const options = { configurable: { sessionId } };
            const input = { 
                question: message
             }
            const response = await chain?.invoke(input, options)

            this.io.to(sessionId).emit('message', {
                text: response?.content,
                timestamp: new Date().toLocaleString(),
                user: 'AI-Therapist'
            });
        } catch (error: unknown) {
            console.error(error);
            const message = (error as Error)?.message || 'An unknown error occurred.';
            this.io.to(sessionId).emit('error', { message })
        }
    }

    private handleDisconnect(socket: Socket) {
        this.SessionHandler.deleteChain(socket.data.sessionId);
        console.log('Client disconnected');
    }
}

export default SocketHandler;
