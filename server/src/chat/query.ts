import dotenv from 'dotenv';
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const openai = new OpenAI();

// import { PineconeStore } from "@langchain/pinecone";
// import { OpenAI as langchainOpenAI, OpenAIEmbeddings } from "@langchain/openai";
// export const langchainQuery = async (query: string) => {
//   const pinecone = new Pinecone();
//   const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
//   const vectorStore = await PineconeStore.fromExistingIndex(
//     new OpenAIEmbeddings(),
//     { pineconeIndex }
//   );
//   const vectorStoreResults = await vectorStore.similaritySearch(query, 1, { });
//   console.log('vectorStoreResults:', vectorStoreResults);
// }

const preprocessInput = (input: string): string => {
  // Convert to lowercase
  let cleanedInput = input.toLowerCase();

  // Remove punctuation
  cleanedInput = cleanedInput.replace(/[^\w\s]/gi, '');

  // Remove stop words (example with a few common stop words)
  const stopWords = ["is", "the", "and", "of", "in", "to", "a", "with", "that", "on", "for", "it"];
  cleanedInput = cleanedInput
    .split(' ')
    .filter(word => !stopWords.includes(word))
    .join(' ');

  // Return the cleaned input
  return cleanedInput;
};

const formatInput = async (input: string): Promise<string> => {
  // Preprocess the input
  const cleanedInput = preprocessInput(input);

  // Define the prompt for refining the query
  const prompt = `
  You are an AI designed to refine and optimize queries for a vector database search using cosine similarity (3072 dimension).
  Given the cleaned input: "${cleanedInput}",
  generate a query that is most likely to return relevant and accurate results from a vector database.
  Make the query clear and specific, avoiding unnecessary words.
  `;

  // Call OpenAI to refine the query
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": prompt},
    ],
    model: process.env.OPEN_AI_CHAT_MODEL!,
  });

  // Return the refined query
  return completion?.choices[0]?.message?.content ?? "";
};


export const pineconeQuery = async (query: string, conversationHistory: string[]) => {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(process.env.PINECONE_INDEX!);
  const formattedQuery = await formatInput(query)

  console.log({ formattedQuery })

  // Generate embedding for the input query
  const inputEmbeddings = await openai.embeddings.create({
    model: process.env.OPEN_AI_EMBEDDING_MODEL!,
    encoding_format: "float",
    input: formattedQuery,
    // input: query,
  });

  const inputQueryResponse = await index.query({
    vector: inputEmbeddings.data[0].embedding,
    topK: 3,
    includeMetadata: true,
  });

  const inputMatches = inputQueryResponse.matches;

  // Function to generate embeddings for conversation history
  const getHistoryEmbeddings = async (conversationHistory: string[]) => {
    const validHistory = conversationHistory.filter((messageContent) => messageContent !== undefined && messageContent !== '');
    return Promise.all(validHistory.map(async (messageContent) => {
      const response = await openai.embeddings.create({
        model: process.env.OPEN_AI_EMBEDDING_MODEL!,
        encoding_format: "float",
        input: messageContent,
      });
      return response.data[0].embedding;
    }));
  };

  // Function to query Pinecone with history embeddings
  const getHistoryMatches = async (historyEmbeddings: number[][]) => {
    return Promise.all(historyEmbeddings.map(async (embedding) => {
      const response = await index.query({
        vector: embedding,
        topK: 3,
        includeMetadata: true,
      });
      return response.matches;
    }));
  };

  // Generate embeddings and matches for conversation history
  const historyEmbeddings = await getHistoryEmbeddings(conversationHistory);
  const historyMatchesResponses = await getHistoryMatches(historyEmbeddings);

  // Flatten the array of matches
  const historyMatches = historyMatchesResponses.flat();

  // Return both input matches and history matches in the same format
  return { inputMatches, historyMatches };
};