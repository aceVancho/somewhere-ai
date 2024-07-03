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

interface SummaryItem {
  summary: string;
  quote: string;
}

interface SummaryResponse {
  summaries: SummaryItem[];
}

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
        modelKwargs: {
          response_format: {
            type: "json_object"
          }
        }
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

    public async getTags(text: string) {
      const llm = new ChatOpenAI({
        modelName: CompletionHandler.model,
        temperature: 1.2,
        maxTokens: 4095,
        topP: 1,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
        modelKwargs: {
          response_format: {
            type: "json_object"
          }
        }
      });
    
      const parser = StructuredOutputParser.fromZodSchema(
        z.object({ tags: z.array(z.string()) })
      );
    
      const systemMessage = `
        You are an AI assistant that, given a user's journal entry, returns relevant tags.
        Responses must be in JSON format. {format_instructions}
      `;
    
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemMessage],
        ['user', text]
      ]);
    
      const options = { format_instructions: parser.getFormatInstructions() };
      const chain = prompt.pipe(llm).pipe(parser);
    
      try {
        return await chain.invoke(options);
      } catch (error) {
        console.error(error);
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
        modelKwargs: {
          response_format: {
            type: "json_object"
          }
        }
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

    public async getSummary(text: string): Promise<SummaryResponse> {
      const llm = new ChatOpenAI({
        modelName: CompletionHandler.model,
        temperature: 1.2,
        maxTokens: 4095,
        topP: 1,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
        modelKwargs: {
          response_format: {
            type: "json_object"
          }
        }
      });
    
      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          summaries: z.array(
            z.object({
              summary: z.string(),
              quote: z.string(),
            })
          )
        })
      );
    
      const systemMessage = `
        You are an AI assistant contributing to a memory and pattern recognition system embedded into an AI-powered online journal. 
        The goal is to use AI to assess patterns over the course of many journal entries. To provide the AI with as many entries as possible, 
        entries must be distilled to their essential information. Your task is to reduce the user's text to a minimal state, 
        retaining crucial information about the entry's knowledge content, the user's feelings, and any significant events or patterns. 
        Please use excerpts from the entry to back up each summarized point. 
        Responses must be in JSON format. {format_instructions}
      `;
    
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemMessage],
        ['user', text]
      ]);
    
      const options = { format_instructions: parser.getFormatInstructions() };
      const chain = prompt.pipe(llm).pipe(parser);
    
      try {
        const response = await chain.invoke(options);
        if (!response || !Array.isArray(response.summaries)) {
          throw new Error('Invalid response');
        }
        return response as SummaryResponse;
      } catch (error) {
        console.error(error);
        throw new Error('Error getting summary');
      }
    }

    public async getSentimentScore(text: string) {
      const llm = new ChatOpenAI({
        modelName: CompletionHandler.model,
        temperature: 1.2,
        maxTokens: 4095,
        topP: 1,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
        modelKwargs: {
          response_format: {
            type: "json_object"
          }
        }
      })
      // .withStructuredOutput({ method: "jsonMode"});
    
      const splitSystemMessage = `
        You are an AI assistant tasked with analyzing user journal entries. Your goal is to split the entry into coherent chunks based on topic, meaning, thought, or morale. Each chunk should represent a distinct idea or theme from the entry.
        Responses must be in JSON format like: sections: string[]
      `;
    
      const splitPrompt = ChatPromptTemplate.fromMessages([
        ['system', splitSystemMessage],
        ['user', text]
      ]);

      const splitChain = splitPrompt.pipe(llm);

    
      let sectionsResponse;
      try {
        sectionsResponse = await splitChain.invoke({ input: ''});
      } catch (error) {
        console.log('This error 1')
        console.error(error);
      }
    
      if (!sectionsResponse) return
      const sections = sectionsResponse.content;
    
      const sentimentSystemMessage = `
        You are an AI assistant that, given a section of a user's journal entry, returns a sentiment score for the section. Scores should be on a scale from -1 (very negative) to 1 (very positive).
        Responses must be in JSON format like: scores: string[]
      `;
    
      const sentimentScores: string[] = [];
    
      for (const section of sections) {
        const sentimentPrompt = ChatPromptTemplate.fromMessages([
          ['system', sentimentSystemMessage],
          ['user', section]
        ]);
    
        const sentimentChain = sentimentPrompt.pipe(llm);
    
        let sentimentResponse;
        try {
          sentimentResponse = await sentimentChain.invoke('');
          sentimentScores.push(...sentimentResponse.scores);
        } catch (error) {
          console.log('This error 2')
          console.error(error);
          sentimentScores.push("0"); // Default score if there's an error
        }
      }
    
      // Calculate aggregate score
      const aggregateScore = sentimentScores
        .reduce((acc, score) => acc + parseFloat(score), 0) / sentimentScores.length;
    
      return aggregateScore.toFixed(2);
    }
}

dotenv.config({ path: path.resolve("../.env") });
export default CompletionHandler.getInstance();