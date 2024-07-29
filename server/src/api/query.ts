import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { Session, ZepClient, Message } from "@getzep/zep-js";
import OpenAI from "openai";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const openai = new OpenAI();

export const pineconeQuery = async (props: IPineconeQueryProps) => {

  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(process.env.PINECONE_INDEX!);
  if (!pc || !index) throw new Error('Vector database unreachable.')

  try {
    const input = props.type === 'chat' ? props.message ?? '' : props.entryText ?? '';

    console.log('@@@ input:\n\n', input)
    const inputEmbeddings = await openai.embeddings.create({
      model: process.env.OPEN_AI_EMBEDDING_MODEL!,
      encoding_format: "float",
      input, 
    });

    const pineconeQueryResponse = await index.namespace(props.userId).query({
      vector: inputEmbeddings.data[0].embedding,
      topK: 3,
      includeMetadata: true,
    });
  
    pineconeQueryResponse.matches.map((match, i) => console.log(`Match ${i}:`, match, '\n'))
    return pineconeQueryResponse.matches;
  } catch (error) {

  }
}