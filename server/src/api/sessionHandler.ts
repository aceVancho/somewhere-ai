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
import { handleToolCalls, tools } from "./tools";
import readline from "readline";
import { pineconeQuery } from "./query";


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
  
  buildChain = (sessionId: string) => {
    const llm = new ChatOpenAI({
      temperature: 0.4,
      modelName: process.env.OPEN_AI_CHAT_MODEL,
    })
    // .bind({ tools });
    // const llmWithTools = llm.bind({ tools })

    const systemPrompt = `You are helping Adam write an AI-powered online journal program and test prompts. Answer his questions. 
    `;
    // You are an AI tool designed to give users the ability to chat with their journal entries via retrieval augmented generation and cosign similarity queries against a vector database. 

    // From now on, act as a therapist. You are emotionally intelligent, a devil's advocate, compassionate, a critical thinker, lax, conversational, lightly humorous, curious, wise, a strategic question asker, thoughtful, and insightful. Your tone should remain conversational and you should fashion our language around how the author has written their own journal entries in order to better speak their language. You will use exerts from their entries to prove your points, provide analysis, and ask follow-up questions. DO NOT USE BULLET POINTS. Direct your tone as if you were speaking from the present (${Date.now()}). 
    
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", `${systemPrompt}`],
      ["system", "Original entry text: {entryText}"],
      ["system", "Context from past entries (vector DB matches): {context}"],
      new MessagesPlaceholder('context'),
      ["system", "Conversation history: {history}"],
      new MessagesPlaceholder('history'),
      ["human", "{question}"],
    ]);

    const chain = promptTemplate.pipe(llm);

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

  public async createChain(entry: IEntry): Promise<RunnableWithMessageHistory<any, any>> {
    const { id: sessionId, user, tags, title, text } = entry;

    try {
      // Attempt to retrieve the session
      await SessionHandler.zepClient!.memory.getSession(sessionId);
  } catch (error) {
      // If session does not exist, create a new one
      await SessionHandler.zepClient!.memory.addSession(new Session({ 
          session_id: sessionId,
          user_id: user.toString(),
          metadata: { title, tags, text } || {} 
      }));
  } finally {
      // Build the chain regardless of whether the session exists or is newly created
      const chain = this.buildChain(sessionId);
      this.sessionChains.set(sessionId, chain);
      return chain;
  }
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

  public async chat(sessionId: string, message: string) {
    const chain = this.getChain(sessionId)
    const session = await SessionHandler.zepClient?.memory.getSession(sessionId);
    
    if (!session || !session.metadata) throw new Error('No session or session metadata found.')
    const sessionMessages = (await SessionHandler.zepClient?.message.getSessionMessages(sessionId))
      ?.filter((message): message is Message => message === undefined) || [];
    const mergedMetadata = { ...session.metadata, userId: session.user_id };
    const pineconeResponse = await pineconeQuery(message, sessionMessages, mergedMetadata)
    const context = pineconeResponse.map((match) => {
        return new SystemMessage({ 
            content: match?.metadata?.content as string || '',
            response_metadata: {}
        })
    });

    const options = { configurable: { sessionId } };
    const input = { question: message, context, entryText: session.metadata.text }
    const response = await chain?.invoke(input, options)

    return {
      text: response?.content,
      timestamp: new Date().toLocaleString(),
      user: 'AI-Therapist'
    }
  }
}
dotenv.config({ path: path.resolve("../.env") });
export default SessionHandler.getInstance(process.env.ZEP_API_KEY!);
