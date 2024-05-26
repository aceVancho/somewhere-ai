import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Pinecone, PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// const ENTRIES_CSV_PATH = 'src/docs/sample.csv';
const ENTRIES_CSV_PATH = 'src/docs/cleaned_entries.csv';

interface Entry {
    entryId: string;
    entryNumber: number;
    postDate: string;
    content: string;
    age: number;
}

interface ChunkedEntry {
    id: string;
    entryId: string;
    chunkNumber: number;
    metadata: Record<string, any>;
    content: string;
    embedding?: number[];
}

const loadEntriesFromCsv = (csvFilePath: string): Promise<Entry[]> => {
    return new Promise<Entry[]>((resolve, reject) => {
        const entries: Entry[] = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const formattedRow = Object.fromEntries(
                    Object.entries(row).map(([key, value]) => [key.trim(), value || ''])
                );
                const entry: Entry = {
                    entryId: formattedRow['Entry ID'] as string || uuidv4(),
                    entryNumber: parseInt(formattedRow['Entry Number'] as string, 10) || 0,
                    postDate: formattedRow['Post Date'] as string || '',
                    content: formattedRow['Content'] as string || '',
                    age: parseInt(formattedRow['Age'] as string, 10) || 0
                };
                entries.push(entry);
            })
            .on('end', () => resolve(entries))
            .on('error', (error) => reject(error));
    });
};

const createChunks = async (entries: Entry[]): Promise<ChunkedEntry[]> => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 20,
    });

    const chunkedEntries: ChunkedEntry[] = [];

    for (const entry of entries) {
        const content = entry.content;
        const splitTextArray = await textSplitter.splitText(content);

        splitTextArray.forEach((text, index) => {
            const chunkedEntry: ChunkedEntry = {
                entryId: entry.entryId,
                chunkNumber: index + 1,
                metadata: {
                    entryNumber: entry.entryNumber,
                    postDate: entry.postDate,
                    age: entry.age,
                    text
                },
                content: text,
                id: uuidv4()
            };
            chunkedEntries.push(chunkedEntry);
        });
    }

    return chunkedEntries;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createEmbeddings = async (entries: ChunkedEntry[]) => {
    const openai = new OpenAI();
    const pineconeRecords: PineconeRecord<RecordMetadata>[] = [];

    console.log(`Starting to create embeddings for ${entries.length} entries`);

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        let embeddingObj: any; // @type CreateEmbeddingResponse
        let finished = false;

        console.log(`Creating embedding for entry ${i + 1} of ${entries.length}`);

        while (!finished) {
            try {
                embeddingObj = await openai.embeddings.create({
                    model: process.env.OPEN_AI_EMBEDDING_MODEL!,
                    encoding_format: "float",
                    input: entry.content,
                });
                finished = true;
                console.log(`Successfully created embedding for entry ${i + 1}`);
            } catch (error) {
                console.error(`CreateEmbedding Error for entry ${i + 1}:`, error);
                await sleep(1000);
            }
        }

        if (embeddingObj) {
            const record = {
                id: entry.id,
                values: embeddingObj.data[0].embedding,
                metadata: entry.metadata,
            };

            pineconeRecords.push(record);
        }
    }

    console.log(`Finished creating embeddings for ${entries.length} entries`);
    return pineconeRecords;
};

const upsertBatch = async (index: ReturnType<typeof Pinecone.prototype.index>, records: PineconeRecord<RecordMetadata>[]) => {
    try {
        await index.upsert(records);
        console.log(`Successfully upserted ${records.length} records`);
    } catch (error) {
        console.error(`Error upserting batch: ${error}`);
    }
};

const upsert = async () => {
    const entries = await loadEntriesFromCsv(ENTRIES_CSV_PATH);
    const chunkedEntries = await createChunks(entries);
    const pineconeRecords = await createEmbeddings(chunkedEntries);

    console.log(process.env.PINECONE_API_KEY!)
    console.log(process.env.PINECONE_INDEX!)
    
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.index(process.env.PINECONE_INDEX!);
    console.log(await index.describeIndexStats())
    const BATCH_SIZE = 10; 
    for (let i = 0; i < pineconeRecords.length; i += BATCH_SIZE) {
        const batch = pineconeRecords.slice(i, i + BATCH_SIZE);
        await upsertBatch(index, batch);
        console.log('Upserted', i)
    }
};

upsert();
