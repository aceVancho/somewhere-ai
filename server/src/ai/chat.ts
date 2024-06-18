// import path from 'path';
// import { ChatOpenAI } from "@langchain/openai";
// import dotenv from 'dotenv';
// import { v4 as uuidv4 } from 'uuid';
// import { SystemMessage } from "@langchain/core/messages";
// import { Session, ZepClient } from "@getzep/zep-js";
// import { ZepChatMessageHistory } from "@getzep/zep-js/langchain";
// import { ChatPromptTemplate, MessagesPlaceholder, } from "@langchain/core/prompts";
// import { RunnableWithMessageHistory } from "@langchain/core/runnables";
// import { pineconeQuery } from "../api/query";
// import { handleToolCalls, tools } from "./tools";
// import readline from 'readline';

// dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// export const inputPrompt = (question: string) => new Promise<string>((resolve) => rl.question(question, resolve));

// const ZEP_API_KEY = process.env.ZEP_API_KEY!

// let zepClient: ZepClient;
// const initZepClient = async () => {
//     try {
//         zepClient = await ZepClient.init(ZEP_API_KEY);
//     } catch (error) {
//         console.error('Error initializing ZepClient:', error);
//     }
// };

// const systemPrompt = `
// You are an AI tool designed to give users the ability to chat with their journal entries via retrieval augmented generation and cosign similarity queries against a vector database. 

// From now on, act as a therapist. You are emotionally intelligent, a devil's advocate, compassionate, a critical thinker, lax, conversational, lightly humorous, curious, wise, a strategic question asker, thoughtful, and insightful. Your tone should remain conversational and you should fashion our language around how the author has written their own journal entries in order to better speak their language. You will use exerts from their entries to prove your points, provide analysis, and ask follow-up questions. DO NOT USE BULLET POINTS. Direct your tone as if you were speaking from the present (${Date.now()}). Additional Context: {additionalContext}
// `;

// const prompt = ChatPromptTemplate.fromMessages([
//     ["system", `${systemPrompt}: {additionalContext}`],
//     new MessagesPlaceholder("additionalContext"),
//     ["system", 'Current conversation {history}:'],
//     new MessagesPlaceholder("history"),
//     ["human", "{question}"],
// ]);

// const buildChain = (sessionId: string) => {
//     const llm = new ChatOpenAI({
//         temperature: 0.4,
//         modelName: process.env.OPEN_AI_CHAT_MODEL,
//     }).bind({ tools })

//     // const llmWithTools = llm.bind({ tools })
//     const chain = prompt.pipe(llm);

//     const chainWithHistory = new RunnableWithMessageHistory({
//         runnable: chain,
//         getMessageHistory: async (sessionId) => new ZepChatMessageHistory({
//             client: zepClient,
//             sessionId: sessionId,
//             memoryType: "perpetual",
//         }),
//         inputMessagesKey: "question",
//         historyMessagesKey: "history",
//     });

//     return chainWithHistory;
// }

// const initZepSession = async (session_id: string, data?: any) => {
//     zepClient.memory.addSession(new Session({ session_id, metadata: data || {} }))
//     zepClient.memory.getMemory
//     zepClient.memory.getSession
// }

// const getConversationHistory = async (sessionId: string): Promise<string[]> => {
//     const history = await zepClient.memory.getMemory(sessionId);
//     return history?.messages?.map((message) => {
//         if (message.content) return `${message.role}: ${message.content}`;
//     }).filter((message): message is string => message !== undefined) || [];
// };

// export const run = async () => {
//     const session_id: string = '0001';
//     const chain = buildChain(session_id)
//     await initZepClient();
//     // await initZepSession(session_id);
//     // console.log('getMemory -- ', await zepClient.memory.getMemory(session_id))
//     // console.log('getSession -- ', await zepClient.memory.getSession(session_id))

//     while (true) {
//         const inputText = await inputPrompt('Input: ')
//         const conversationHistory = await getConversationHistory(session_id)
//         const response = await pineconeQuery(inputText, conversationHistory)
    
//         const additionalContext = response.map((match) => {
//             return new SystemMessage({ 
//                 content: match?.metadata?.text as string,
//                 response_metadata: {}
//             })
//         });
    
//         const options = {
//             configurable: {
//                 sessionId: session_id,
//             },
//         };
//         const input = { 
//             question: inputText + '\n',
//             additionalContext 
//          }
    
//          console.log('before', await zepClient.memory.getMemory(session_id))
//          console.log('after', await zepClient.memory.getMemory(session_id))
//         const chainResponse = await chain.invoke(input, options); 
//         handleToolCalls(chainResponse);

//         // console.log(`\nAI: ${chainResponse.content}\n`);
//         console.log(JSON.stringify(chainResponse, null, 4))

//         // console.log(chainResponse.lc_kwargs.additional_kwargs.tool_calls)
//     }
// }

// run()









