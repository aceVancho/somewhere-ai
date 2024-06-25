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

    public static async getTitle(text: string) {
      const llm = new ChatOpenAI({
        modelName: CompletionHandler.model,
        temperature: 0.5,
      })

      const parser = StructuredOutputParser.fromZodSchema(
        z.object({ title: z.string() })
      )

      const systemInstruction = `
        You are an AI assistant that, given a user's journal entry, returns a clever, descriptive title.
        Responses must be in JSON format. {format_instructions}
      `

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemInstruction],
        ['user', text]
      ])

      const invokeOptions = {
        format_instructions: parser.getFormatInstructions(),
      }

      const chain = prompt.pipe(llm).pipe(parser);

      try {
        return await chain.invoke(invokeOptions)
      } catch (error) {
        console.error(error)
      }
    }

}

dotenv.config({ path: path.resolve("../.env") });
export default CompletionHandler.getInstance();