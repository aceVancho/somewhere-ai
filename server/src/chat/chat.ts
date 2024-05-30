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
const initZepClient = async () => {
    try {
        zepClient = await ZepClient.init(ZEP_API_KEY);
    } catch (error) {
        console.error('Error initializing ZepClient:', error);
    }
};

const systemPrompt = `As an assistant designed to provide therapy, advice, critical thinking, and deep questions, I am here to support you in your journey of self-discovery and growth. Utilizing advanced techniques, your queries are processed through a Retrieval-Augmented Generation (RAG) tool that retrieves matches from a Pinecone Database populated by your past journal entries. This approach allows me to incorporate relevant details from your history, helping me to better understand your past, your thinking patterns, and specific facts from your life. This enriched understanding enables me to offer more personalized and insightful responses to your questions.`

const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["system", 'Here are relevant past entries: {inputMatches}'],
    new MessagesPlaceholder("inputMatches"),
    ["system", 'Here are db matches from conversation history past entries: {historyMatches}'],
    new MessagesPlaceholder("historyMatches"),
    ["system", 'Current conversation {history}:'],
    new MessagesPlaceholder("history"),
    ["human", "{question}"],
]);

const buildChain = (sessionId: string) => {
    const llm = new ChatOpenAI({
        temperature: 0.8,
        modelName: process.env.OPEN_AI_CHAT_MODEL,
    }).bind({ tools })

    // const llmWithTools = llm.bind({ tools })
    const chain = prompt.pipe(llm);

    const chainWithHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: async (sessionId) => new ZepChatMessageHistory({
            client: zepClient,
            sessionId: sessionId,
            memoryType: "perpetual",
        }),
        inputMessagesKey: "question",
        historyMessagesKey: "history",
    });

    return chainWithHistory;
}

const initZepSession = async (session_id: string, data?: any) => {
    zepClient.memory.addSession(new Session({ session_id, metadata: data || {} }))
}

const getConversationHistory = async (sessionId: string): Promise<string[]> => {
    const history = await zepClient.memory.getMemory(sessionId);
    return history?.messages?.map((message) => {
        if (message.content) return `${message.role}: ${message.content}`;
    }).filter((message): message is string => message !== undefined) || [];
};

export const run = async () => {
    const session_id: string = uuidv4();
    const chain = buildChain(session_id)
    await initZepClient();
    await initZepSession(session_id);

    while (true) {
        const inputText = await inputPrompt('Input: ')
        const conversationHistory = await getConversationHistory(session_id)
        const matches = await pineconeQuery(inputText, conversationHistory)
    
        const inputMatches = matches.inputMatches.map((match) => {
            return new SystemMessage({ 
                content: match?.metadata?.text as string,
                response_metadata: {}
            })
        });

        const historyMatches = matches.historyMatches.map((match) => {
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
            inputMatches,
            historyMatches,
            // dataFromDB: new SystemMessage({ 
            //     content: formatDataForSystemMessage(data), 
            //     response_metadata: {} 
            // }) 
         }
    
        const result = await chain.invoke(input, options); 
        handleToolCalls(result);

        console.log(`\nAI: ${result.content}\n`);
        // console.log(result)
        // console.log(result.lc_kwargs.additional_kwargs.tool_calls)
        //  console.log('lovely ',conversationHistory)
    }
}

run()









