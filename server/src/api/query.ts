import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { Session, ZepClient, Message } from "@getzep/zep-js";
import OpenAI from "openai";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const openai = new OpenAI();

const formatInput = (input: string): string => {
  let cleanedInput = input.toLowerCase();
  cleanedInput = cleanedInput.replace(/[^\w\s]/gi, "");
  const stopWords = [
    "is",
    "the",
    "and",
    "of",
    "in",
    "to",
    "a",
    "with",
    "that",
    "on",
    "for",
    "it",
  ];
  cleanedInput = cleanedInput
    .split(" ")
    .filter((word) => !stopWords.includes(word))
    .join(" ");
  return cleanedInput;
};

const preprocessInput = async (
  query: string,
  conversationHistory: string[]
): Promise<string> => {
  const cleanedQueryInput = formatInput(query);
  const cleanedConversationHistory = conversationHistory
    .map(formatInput)
    .join(" ");
  const combinedInput = `${cleanedConversationHistory} ${cleanedQueryInput}`;
  return combinedInput;
};

export const pineconeQuery = async (
  query: string,
  sessionMessages: Message[],
  metadata: Session["metadata"]
) => {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(process.env.PINECONE_INDEX!);

  // const preprocessedInput = await preprocessInput(query, conversationHistory);
  const formattedSessionMessages = sessionMessages.map(
    (message) => `${message.role}: ${message.content}`
  );

  const combinedInput = `
    ${query}
    ${formattedSessionMessages}
    ${metadata.tags}
    ${metadata.title}
    ${metadata.text}
  `

  const inputEmbeddings = await openai.embeddings.create({
    model: process.env.OPEN_AI_EMBEDDING_MODEL!,
    encoding_format: "float",
    input: combinedInput,
  });


  const pineconeQueryResponse = await index.namespace(metadata.userId).query({
    vector: inputEmbeddings.data[0].embedding,
    topK: 3,
    includeMetadata: true,
  });

  pineconeQueryResponse.matches.map((match, i) => console.log(`Match ${i}:`, match, '\n'))
  return pineconeQueryResponse.matches;
};
