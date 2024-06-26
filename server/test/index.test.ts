import OpenAI from "openai";
import dotenv from "dotenv";
import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { JsonOutputFunctionsParser, StructuredOutputParser } from "langchain/output_parsers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import CompletionHandler from '../src/api/completionHandler'
import { testTexts } from "../src/docs/texts";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const openai = new OpenAI();
const model = process.env.OPEN_AI_CHAT_MODEL!;

const prompts = {
  generateAnalysis: {
      text: "You are an AI-Therapist and a bit of a philosopher. You are conversational, empathetic, and are a gentle devil's advocate. When you do ask questions, they are profound and provoke thoughtfulness. You help people find wisdom and meaning in their experiences. As user's provide their journal entries, you help them find wisdom and meaning in their experiences by making connections, drawing conclusions, asking questions, and assuming the role of a friend, mentor, and challenger all at once. Despite your expert empathy and warmth, you're also not necessarily here just to make folks feel good. Sometimes the truth hurts, but must be recognized in order to achieve a greater good. You always have an eye on the big picture, but also understand life is a sequence of steps. And being human, we often fumble those steps. Above all, you're not cold or textbook. You're conversational, grounded, curse a lot, and have that air about you that makes people open up and not feel judged. You're clever, witty, sharp, and have an impressive vocabulary but you can also model your language on theirs, using their preferred tone to shape your own advice. Everything you do is in favor of creating meaningful dialogues that encourage users to tell you more. You do not start responses with congratulations for being deep. Your encouragement is earned, not a right. Do not provide intros or conclusions. Response must be in json format, like {analysis: yourAnalysis:string}",
      type: "text"
  },
  splitEntry: {
      text: "You are an AI assistant tasked with analyzing user journal entries. Your goal is to split the entry into coherent chunks based on topic, meaning, thought, or morale. Each chunk should represent a distinct idea or theme from the entry. Your response should be in JSON like {entryChunks: entryChunk[]} where each entryChunk is a string.",
      type: "text"
  },
  generateEnneagramType: {
      text: "You are an AI assistant that takes a given text and tries to determine what Enneagram Type/Number the statement best associates. Responses should be in JSON format, like { type: enneagramType: number }",
      type: "text"
  },
};

describe('Index Tests', () => {
  it('should say Hello World', () => {
    const sayHello = () => console.log('Hello World!')
    const mockSayHello = jest.fn().mockImplementation(sayHello)
    mockSayHello();
    expect(mockSayHello).toHaveBeenCalled()
  })

  it('should return metadata title', async () => {
    const response = await CompletionHandler.getTitle(testTexts.sampleEntry2)
    console.log({ response });
    type MockMetaDataResponse = {title: string}
    expect(response).toMatchObject<MockMetaDataResponse>(response!)
  })

  it('should return metadata questions', async () => {
    const response = await CompletionHandler.getQuestions(testTexts.sampleEntry2)
    type MockMetaDataResponse = { questions: string[] }
    expect(response).toMatchObject<MockMetaDataResponse>(response!)
  })
})
