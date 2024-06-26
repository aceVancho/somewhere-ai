import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { SystemMessage } from "@langchain/core/messages";
import { Session, ZepClient, Message } from "@getzep/zep-js";
import { ZepChatMessageHistory } from "@getzep/zep-js/langchain";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

import { JsonOutputFunctionsParser, StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { handleToolCalls, tools } from "./tools";
import readline from "readline";
import { pineconeQuery } from "./query";

class CompletionHandler {
    private static instance: CompletionHandler
    private static model = process.env.OPEN_AI_CHAT_MODEL!;

    constructor() {

      }
    
    public static getInstance(): CompletionHandler {
      if (!CompletionHandler.instance) {
          CompletionHandler.instance = new CompletionHandler();
      }
      return CompletionHandler.instance;
    }

    public async getTitle(text: string) {
      const llm = new ChatOpenAI({
        modelName: CompletionHandler.model,
        temperature: 1.2,
        maxTokens: 4095,
        topP: 1,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
      })

      const parser = StructuredOutputParser.fromZodSchema(
        z.object({ title: z.string() })
      )

      const systemMessage = `
        You are an AI assistant that, given a user's journal entry, returns a clever, descriptive title.
        Responses must be in JSON format. {format_instructions}
      `

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemMessage],
        ['user', text]
      ])

      const options = { format_instructions: parser.getFormatInstructions() }
      const chain = prompt.pipe(llm).pipe(parser);

      try {
        return await chain.invoke(options)
      } catch (error) {
        console.error(error)
      }
    }

    public async getQuestions(text: string) {
      const llm = new ChatOpenAI({
        modelName: CompletionHandler.model,
        temperature: 1.2,
        maxTokens: 4095,
        topP: 1,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
      })

      const parser = StructuredOutputParser.fromZodSchema(
        z.object({ questions: z.array(z.string()) })
      )

      const systemMessage = `  
      Based off the given user entry, suggest some thought-provoking questions the user could use to dive deeper into themselves. 
        - Questions should be highly specific, referencing notable excerpts from the text. 
        - Questions can also be asked from the persona of a "devil's advocate" — suggesting counterpoints and alternative perspectives that challenge what the user wrote.
      Further instructions: Max 5 Questions. 
      Responses must be in JSON format. {format_instructions}
      `

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemMessage],
        ['user', text]
      ])

      const options = { format_instructions: parser.getFormatInstructions() }
      const chain = prompt.pipe(llm).pipe(parser);

      try {
        return await chain.invoke(options)
      } catch (error) {
        console.error(error)
      }
    }

}

dotenv.config({ path: path.resolve("../.env") });
export default CompletionHandler.getInstance();