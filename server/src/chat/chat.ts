import path from 'path';
import { ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { SystemMessage } from "@langchain/core/messages";
import { Session, ZepClient } from "@getzep/zep-js";
import { ZepChatMessageHistory } from "@getzep/zep-js/langchain";
import { ChatPromptTemplate, MessagesPlaceholder, } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { pineconeQuery } from "./query";
import { handleToolCalls, tools } from "../tools/tools";
import readline from 'readline';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const inputPrompt = (question: string) => new Promise<string>((resolve) => rl.question(question, resolve));

const ZEP_API_KEY = process.env.ZEP_API_KEY!

let zepClient: ZepClient;
const initializeZepClient = async () => {
    try {
        zepClient = await ZepClient.init(ZEP_API_KEY);
        console.log('ZepClient initialized');
    } catch (error) {
        console.error('Error initializing ZepClient:', error);
    }
};

const systemPrompt = `As an assistant designed to provide therapy, advice, critical thinking, and deep questions, I am here to support you in your journey of self-discovery and growth. Utilizing advanced techniques, your queries are processed through a Retrieval-Augmented Generation (RAG) tool that retrieves matches from a Pinecone Database populated by your past journal entries. This approach allows me to incorporate relevant details from your history, helping me to better understand your past, your thinking patterns, and specific facts from your life. This enriched understanding enables me to offer more personalized and insightful responses to your questions.`

const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["system", 'Here are relevant past entries: {additionalContext}'],
    new MessagesPlaceholder("additionalContext"),
    ["system", 'Current conversation history:'],
    new MessagesPlaceholder("history"),
    ["human", "{question}"],
]);

const buildChain = (sessionId: string) => {
    const llm = new ChatOpenAI({
        temperature: 0.8,
        modelName: process.env.OPEN_AI_CHAT_MODEL,
    }).bind({ tools })

    const chain = prompt.pipe(llm);

    const chainWithHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: async (sessionId) => {
            const messageHistory = new ZepChatMessageHistory({
                client: zepClient,
                sessionId: sessionId,
                memoryType: "perpetual",
            })
            return messageHistory
        },
        inputMessagesKey: "question",
        historyMessagesKey: "history",
    });

    return chainWithHistory;
}

const initSession = async (session_id: string, data?: any) => {
    const session: Session = new Session({
        session_id,
        metadata: data || {}
    });
    
    zepClient.memory.addSession(session)
}

export const run = async () => {
    await initializeZepClient();
    const session_id: string = uuidv4();
    const chain = buildChain(Date.now().toString())
    initSession(session_id);

    while (true) {
        const inputText = await inputPrompt('Input: ')
        const matches = await pineconeQuery(inputText)
    
        const additionalContext = matches.map((match) => {
            return new SystemMessage({ 
                content: match?.metadata?.text as string,
                response_metadata: {}
            })
        });
    
        const options = {
            configurable: {
                sessionId: session_id,
            },
        };
        const input = { 
            question: inputText + '\n', 
            additionalContext,
            // dataFromDB: new SystemMessage({ 
            //     content: formatDataForSystemMessage(data), 
            //     response_metadata: {} 
            // }) 
         }
    
        const result = await chain.invoke(input, options); 
        handleToolCalls(result);

        console.log(`\nAI Proctor: ${result.content}\n`);
        // console.log(result)
        // console.log(result.lc_kwargs.additional_kwargs.tool_calls)
    
    }
}

run()









