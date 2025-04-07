import dotenv from 'dotenv';
import path from 'path';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import http from 'http';
import userRoutes from './routes/userRoutes';
import entryRoutes from './routes/entryRoutes';
import SocketHandler from './socket/socketHandler';

dotenv.config({ path: path.resolve("../.env") });
const morgan = require('morgan');
const cors = require('cors');

const app: Express = express();
const PORT = process.env.PORT || 4001;
const uri = process.env.MONGODB_CONNECTION_STRING as string;
const server = http.createServer(app);

async function run(): Promise<void> {
  try {
    // Mongo Connection
    await mongoose.connect(uri);
    console.log("Connected successfully to MongoDB with Mongoose");

    // Routes
    app.use(cors({ origin: 'http://localhost:4002' }))
    app.use(morgan('dev'));
    app.use(express.json());
    app.use('/api/users', userRoutes);
    app.use('/api/entries', entryRoutes);

    // Init Socket
    new SocketHandler(server);

    // Check fetch and listen
    app.get('/', (req: Request, res: Response) => res.send('Somewhere-AI server is running.'));
    server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to MongoDB with Mongoose", error);
    process.exit(1);
  }
}

run().catch(console.error);

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB disconnected on app termination');
  process.exit(0);
});

// TODO:
// - Switch to Okta
// - Pricing models
// - Prompts
