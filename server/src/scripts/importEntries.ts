import mongoose from 'mongoose';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import Entry from '../models/Entry'; // Adjust the path as needed
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_CONNECTION_STRING as string;

async function run() {
  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB');

    const results: any[] = [];

    fs.createReadStream(path.resolve(__dirname, '../docs/cleaned_entries.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const entries = results.map(entry => ({
            title: entry['Entry Number'],
            text: entry['Content'],
            createdAt: entry['Post Date'] ? new Date(entry['Post Date']) : new Date(),
            updatedAt: new Date(),
            tags: []
          }));

          await Entry.insertMany(entries);
          console.log('Entries imported successfully');
        } catch (error) {
          console.error('Error importing entries:', error);
        } finally {
          mongoose.connection.close();
        }
      });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

run();
