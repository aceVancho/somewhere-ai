import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { SystemMessage } from "@langchain/core/messages";
import { Session, ZepClient } from "@getzep/zep-js";
import { ZepChatMessageHistory } from "@getzep/zep-js/langchain";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { handleToolCalls, tools } from "./tools";
import readline from "readline";


class SessionHandler {
    private static instance: SessionHandler;
    private static zepClient: ZepClient | null = null;
    private sessionChains: Map<string, RunnableWithMessageHistory<any, any>> = new Map();
  

  constructor(zepApiKey: string) {
    this.initZepClient(zepApiKey);
  }

  public static getInstance(zepApiKey: string): SessionHandler {
    if (!SessionHandler.instance) {
      SessionHandler.instance = new SessionHandler(zepApiKey);
    }
    return SessionHandler.instance;
  }

  async initZepClient(zepApiKey: string): Promise<void> {
    try {
        SessionHandler.zepClient = await ZepClient.init(zepApiKey);
      console.log("ZepClient initialized successfully");
    } catch (error) {
      console.error("Error initializing ZepClient:", error);
    }
  }

  systemPrompt = `
    You are a tool designed for an online ai-powered journal. One of its defining features is to allow users to chat with their journal. This is accomplished via retrieval augmented generation and AI. A user will input text and this text along with the current conversation history will be passed to function designed to query a vector database using cosign similarity. The below context is the result of this combined input and conversation history query. Your role is to use this context to address the needs, questions, or concerns of the user. 

    From now on, act as a therapist. You are emotionally intelligent, a devil's advocate, compassionate, a critical thinker, lax, conversational, lightly humorous, curious, wise, a strategic question asker, thoughtful, and insightful. Your tone should remain conversational and you should fashion our language around how the author has written their own journal entries in order to better speak their language. You will use exerts from their entries to prove your points, provide analysis, and ask follow-up questions. DO NOT USE BULLET POINTS. Direct your tone as if you were speaking from the present (${Date.now()}).
    `;

  prompt = ChatPromptTemplate.fromMessages([
    ["system", `${this.systemPrompt}`],
    // ["system", `${this.systemPrompt}: {additionalContext}`],
    // new MessagesPlaceholder("additionalContext"),
    ["system", "Current conversation {history}:"],
    new MessagesPlaceholder("history"),
    ["human", "{question}"],
  ]);

  buildChain = (sessionId: string) => {
    const llm = new ChatOpenAI({
      temperature: 0.4,
      modelName: process.env.OPEN_AI_CHAT_MODEL,
    })
    // .bind({ tools });

    // const llmWithTools = llm.bind({ tools })
    const chain = this.prompt.pipe(llm);

    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: () =>
        new ZepChatMessageHistory({
          client: SessionHandler.zepClient!,
          sessionId: sessionId,
          memoryType: "perpetual",
        }),
      inputMessagesKey: "question",
      historyMessagesKey: "history",
    });

    return chainWithHistory;
  };

  public createChain(sessionId: string): RunnableWithMessageHistory<any, any> {
    const chain = this.buildChain(sessionId);
    this.sessionChains.set(sessionId, chain);
    return chain;
  }

  public getChain(sessionId: string): RunnableWithMessageHistory<any, any> | undefined {
    return this.sessionChains.get(sessionId);
  }

  public deleteChain(sessionId: string): void {
    if (this.sessionChains.delete(sessionId)) {
        console.log(`Chain with id:${sessionId} successfully removed.`)
    } else {
        console.error(`Could not remove chain with id:${sessionId}. Not found.`)
    }
  }

  public async getMemory(sessionId: string) {
    if (!SessionHandler.zepClient) {
      throw new Error("ZepClient not initialized");
    }
    const history = await SessionHandler.zepClient.memory.getMemory(sessionId);
    // TODO: use names over roles
    return history?.messages.map((message) => ({
            text: message.content,
            user: message.role,
            timestamp: new Date(message.created_at || '').toLocaleString()
        })
  )}
}
dotenv.config({ path: path.resolve("../.env") });
export default SessionHandler.getInstance(process.env.ZEP_API_KEY!);
