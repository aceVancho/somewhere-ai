import { Server as SocketIOServer, Socket } from 'socket.io';
import { socketAuthMiddleware } from '../middleware/middleware';
import SessionHandler from '../api/sessionHandler';
import Entry from '../models/Entry';

class SocketHandler {
    private io: SocketIOServer;
    private SessionHandler: typeof SessionHandler
    private newEntryProgressMap: Map<string, number>

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
        this.newEntryProgressMap = new Map()
    }

    private handleConnection(socket: Socket) {
        socket.on('joinSession', this.handleJoinSession.bind(this, socket));
        socket.on('message', this.handleMessage.bind(this, socket));
        socket.on('disconnect', this.handleDisconnect.bind(this, socket));
        socket.on('newEntry', this.handleNewEntry.bind(this, socket))
        socket.on('newEntryProgress', this.handleProgress.bind(this, socket))
    }

    private async handleNewEntry(socket: Socket, data: { email: string}) {
        const { email } = data;
        console.log(`New entry from ${email}`)
        this.newEntryProgressMap.set(email, 0)
    }

    private async handleProgress(socket: Socket, data: { progress: number, email: string }) {
        const { progress, email } = data;
        console.log('Progress made: ', progress)
    }

    private async handleJoinSession(socket: Socket, data: { sessionId: string, email: string }) {
        const { sessionId, email } = data;
        socket.join(sessionId);
        socket.data.sessionId = sessionId;
        console.log(`Client ${email} joined session: ${sessionId}`);

        const entry = await Entry.findById(sessionId).populate('user')
        if (!entry) return console.error('No Entry Found.')

        void this.SessionHandler.createChain(entry!);

        // If conversation exists, emit a new message with history
        const history = await this.SessionHandler.getMemory(sessionId, email)
        this.io.to(sessionId).emit('history', history);
    }

    private async handleMessage(socket: Socket, data: { sessionId: string, message: string }) {
        const { sessionId, message } = data;

        try {
            const payload = await this.SessionHandler.chat(sessionId, message)
            this.io.to(sessionId).emit('message', payload);
        } catch (error: unknown) {
            console.error(error);
            const message = (error as Error)?.message || 'An unknown error occurred.';
            this.io.to(sessionId).emit('error', { message })
        }
    }

    private handleDisconnect(socket: Socket) {
        this.SessionHandler.removeChain(socket.data.sessionId);
        console.log('Client disconnected');
    }
}

export default SocketHandler;
