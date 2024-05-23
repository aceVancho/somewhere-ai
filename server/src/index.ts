import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve("../.env") });

import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';

const morgan = require('morgan');
const cors = require('cors');

const app: Express = express();
const PORT = process.env.PORT || 4001;
const uri = process.env.MONGODB_CONNECTION_STRING as string;


async function run(): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully to MongoDB with Mongoose");

    app.use(cors({ origin: 'http://localhost:4002' }))
    app.use(morgan('dev'));
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    app.get('/', (req: Request, res: Response) => res.send('LexiconAI server is running.'));
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
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
