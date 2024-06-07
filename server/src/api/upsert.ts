import { Pinecone, PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const createChunks = async ({ userId, entryId, text, date }: UpsertProps): Promise<EntryChunk[]> => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 20,
  });

  const splitTextArray = await textSplitter.splitText(text);

  return splitTextArray.map((text, index) => ({
    id: uuidv4(),
    content: text,
    parentEntryId: entryId,
    userId,
    createdDate: date,
    chunkNumber: index + 1,
    metadata: {
      id: uuidv4(),
      content: text,
      parentEntryId: entryId,
      userId,
      createdDate: date,
      chunkNumber: index + 1,
    },
  }));
};

const createEmbeddings = async (entryChunks: EntryChunk[]): Promise<PineconeRecord<RecordMetadata>[]> => {
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY! });
  const pineconeRecords: PineconeRecord<RecordMetadata>[] = [];
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (const [index, chunk] of entryChunks.entries()) {
    let embeddingObj;
    let finished = false;

    while (!finished) {
      try {
        embeddingObj = await openai.embeddings.create({
          model: process.env.OPEN_AI_EMBEDDING_MODEL!,
          encoding_format: 'float',
          input: chunk.content,
        });
        finished = true;
        console.log(`Created embedding for chunk ${index + 1}/${entryChunks.length}`);
      } catch (error) {
        console.error(`CreateEmbedding Error for entry ${index + 1}:`, error);
        await sleep(1000);
      }
    }

    if (embeddingObj) {
      pineconeRecords.push({
        id: chunk.id,
        values: embeddingObj.data[0].embedding,
        metadata: chunk.metadata,
      });
    }
  }

  console.log(`Finished creating embeddings for ${entryChunks.length} chunks.`);
  return pineconeRecords;
};

const upsertBatch = async (
  index: ReturnType<typeof Pinecone.prototype.index>,
  records: PineconeRecord<RecordMetadata>[],
  userId: string,
): Promise<void> => {
  try {
    await index.namespace(userId).upsert(records);
    console.log(`Successfully upserted ${records.length} records`);
  } catch (error) {
    console.error(`Error upserting batch: ${error}`);
  }
};

export const upsert = async ({ userId, entryId, text, date }: UpsertProps): Promise<void> => {
  try {
    const chunkedEntries = await createChunks({ userId, entryId, text, date });
    const pineconeRecords = await createEmbeddings(chunkedEntries);

    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.index(process.env.PINECONE_INDEX!);

    const BATCH_SIZE = 10;
    for (let i = 0; i < pineconeRecords.length; i += BATCH_SIZE) {
      const batch = pineconeRecords.slice(i, i + BATCH_SIZE);
      await upsertBatch(index, batch, userId);
    }
  } catch (error) {
    console.error(`Error in upsert process: ${error}`);
  }
};
