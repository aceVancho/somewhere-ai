import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { SystemMessage } from "@langchain/core/messages";
import { Session, ZepClient, Message } from "@getzep/zep-js";
import { ZepChatMessageHistory } from "@getzep/zep-js/langchain";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { pineconeQuery } from "./query";

class SessionHandler {
  private static instance: SessionHandler;
  private static zepClient: ZepClient | null = null;
  private sessionChains: Map<string, RunnableWithMessageHistory<any, any>> =
    new Map();

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
    });
    // .bind({ tools });
    // const llmWithTools = llm.bind({ tools })

    const systemPrompt = `
    You are an AI tool designed to give users the ability to chat with their journal entries via retrieval augmented generation and cosign similarity queries against a vector database. 

    From now on, act as a therapist. You are emotionally intelligent, a devil's advocate, compassionate, a critical thinker, lax, conversational, lightly humorous, curious, wise, a strategic question asker, thoughtful, and insightful. Your tone should remain conversational and you should fashion your language around how the author has written their own journal entries in order to better speak their language. You will use exerts from their entries to prove your points, provide analysis, and ask follow-up questions. 
    
    - DO NOT USE BULLET POINTS. 
    - Direct your tone as if you were speaking from the present (${Date.now()}).
    `;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", `${systemPrompt}`],
      ["system", "Original entry text: {entryText}"],
      ["system", "Context from past entries (vector DB matches): {context}"],
      new MessagesPlaceholder("context"),
      ["system", "Conversation history: {history}"],
      new MessagesPlaceholder("history"),
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

  public async createUser(email: string, entryId: Pick<IEntry, "id">) {
    try {
      try {
        await SessionHandler.zepClient!.user.add({
          user_id: entryId as string,
          email,
        });
        console.log(`New Zep user created: ${email}`);
      } catch (error: any) {
        console.log(`User ${email} already exists.`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  public async deleteUser(userId: string) {
    try {
      await SessionHandler.zepClient!.user.delete(userId);
    } catch (error) {
      console.error("Could not delete Zep user:", error);
    }
  }

  private async updateConversation(sessionId: string) {
    let memory;

    try {
      memory = await SessionHandler.zepClient!.memory.getMemory(sessionId);
    } catch (e) {
      console.error(e);
    }

    // TODO: Use memory facts and/or user messages to upsert Pinecone DB
    // console.log(memory?.facts)
  }

  public async createChain(entry: IEntry): Promise<void> {
    try {
      const { id: sessionId } = entry;
      const chain = this.buildChain(sessionId);
      this.sessionChains.set(sessionId, chain);
    } catch (error) {
      console.error("Problem building or setting chain", error);
    }
  }

  public getChain(
    sessionId: string
  ): RunnableWithMessageHistory<any, any> | undefined {
    return this.sessionChains.get(sessionId);
  }

  public async removeChain(sessionId: string) {
    if (this.sessionChains.delete(sessionId)) {
      console.log(`Chain with id:${sessionId} successfully removed.`);
      // this.updateConversation(sessionId);
    } else {
      console.error(`Could not remove chain with id:${sessionId}. Not found.`);
    }
  }

  public async createSession(entry: IEntry): Promise<void> {
    const { id: sessionId, user, tags, title, text } = entry;

    const newSession = new Session({
      session_id: sessionId,
      user_id: user.toString(),
      metadata: { title, tags, text } || {},
    });

    try {
      await SessionHandler.zepClient!.memory.addSession(newSession);
      console.log(`New Zep Session ${sessionId} created.`);
    } catch (error) {
      console.error("Failed to create new Zep Session:", error);
    }
  }

  public async deleteSession(sessionId: string): Promise<void> {
    try {
      const memory = await SessionHandler.zepClient!.memory.getMemory(sessionId);
      if (!memory)
        throw new Error("No Zep Memories found for this Session Id.");
    } catch (e) { console.log(e);}

    try {
      await SessionHandler.zepClient?.memory.deleteMemory(sessionId);
    } catch (e) { console.error("No memory to delete:", e); }

    try {
      this.sessionChains.delete(sessionId);
    } catch (e) { console.error("No chain to delete:", e); }
  }

  public async getMemory(sessionId: string, email: string) {
    if (!SessionHandler.zepClient) {
      throw new Error("ZepClient not initialized");
    }

    const username = email.split("@")[0];
    const history = await SessionHandler.zepClient.memory.getMemory(sessionId);
    if (!history) console.log("No history here!");
    return history?.messages.map((message) => ({
      text: message.content,
      user: message.role === "ai" ? "AI-Therapist" : username,
      timestamp: new Date(message.created_at || "").toLocaleString(),
    }));
  }

  public async chat(sessionId: string, message: string) {
    const chain = this.getChain(sessionId);
    // TODO: Don't call this every time. Instead, set SessionHandler.sessions map to include sessionId, chain, and zep session
    const session = await SessionHandler.zepClient?.memory.getSession(sessionId);

    if (!session || !session.metadata) throw new Error("No session or session metadata found.");

    // let conversationHistory = await SessionHandler.zepClient?.message.getSessionMessages(sessionId);
    // conversationHistory?.push(new Message({ role_type: 'user', content: message, role: 'human' }))
    // conversationHistory = conversationHistory?.filter((message): message is Message => message === undefined)
    // console.log('after history:', { conversationHistory })

    const pineconeQueryProps: IPineconeQueryProps = { 
      type: 'chat',
      userId: session.user_id!,
      message,
    }

    const pineconeResponse = await pineconeQuery(pineconeQueryProps);
    let context;

    if (pineconeResponse) {
      context = pineconeResponse.map((match) => {
        return new SystemMessage({
          content: (match?.metadata?.content as string) || "",
          response_metadata: {},
        });
      });
    }
    const options = { configurable: { sessionId } };
    const input = {
      question: message,
      entryText: session.metadata.text,
      context,
    };
    const response = await chain?.invoke(input, options);

    return {
      text: response?.content,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      user: "AI-Therapist",
      type: "ai",
    };
  }
}
dotenv.config({ path: path.resolve("../.env") });
export default SessionHandler.getInstance(process.env.ZEP_API_KEY!);
