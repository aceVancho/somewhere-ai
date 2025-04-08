import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { prompts } from "./prompts";
import Entry from "../models/Entry";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { io, Socket } from"socket.io-client"
import { pineconeQuery } from "./query";
dotenv.config({ path: path.resolve("../.env") });

interface SummaryItem {
  summary: string;
  quote: string;
}

interface SummaryResponse {
  summaries: SummaryItem[];
}

const openai = new OpenAI();
const model = process.env.OPEN_AI_CHAT_MODEL!;

class CompletionHandler {
  private static model = process.env.OPEN_AI_CHAT_MODEL!;
  private socket: Socket

  constructor(authToken: string) {
    this.socket = io("http://localhost:4001", { auth: { token: authToken }})
    this.socket.on('connect', () => console.log('Completion Handler connected to socket.'))
  }



  public async getPrompts(latestEntriesProps: ILatestEntriesProps[]): Promise<{ title: string }> {
    const formattedEntriesProps = latestEntriesProps.map((entry, idx) => (`
      Entry ${idx + 1}:
      Title: ${entry.title}
      Tags: ${entry.tags.join(", ")}
      Text: ${entry.text}
      `)).join("\n");
      // console.log("1: Generating prompts...", formattedEntriesProps)

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getPrompts },
          { role: "user", content: `Latest Entry Props: ${formattedEntriesProps}` },
        ],
        model,
        temperature: .8,
        max_tokens: 4095,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) {
        throw new Error("OpenAI API returned an empty response");
      }

      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating prompts:", error);
      throw new Error("Failed to generate prompts");
    }
  }

  public async getTitle(entry: IEntry): Promise<{ title: string }> {
    console.log("1: Generating title.")
    if (entry.title) return { title: entry.title }

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getTitle },
          { role: "user", content: `Entry: ${entry.text}` },
        ],
        model,
        temperature: .8,
        max_tokens: 4095,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) {
        throw new Error("OpenAI API returned an empty response");
      }

      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating title:", error);
      throw new Error("Failed to generate title");
    }
  }

  public async getTags(text: string): Promise<{ tags: string[] }> {
    console.log("2: Generating tags.")
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getTags },
          { role: "user", content: `Entry: ${text}` },
        ],
        model,
        temperature: .8,
        max_tokens: 4095,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) throw new Error("OpenAI API returned an empty response");
      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating tags:", error);
      throw new Error("Failed to generate tags");
    }
  }

  public async getQuestions(text: string): Promise<{ questions: string[] }> {
    console.log("4: Generating questions.")
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getQuestions },
          { role: "user", content: `Entry: ${text}` },
        ],
        model,
        temperature: .8,
        max_tokens: 4095,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) {
        throw new Error("OpenAI API returned an empty response");
      }

      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating questions:", error);
      throw new Error("Failed to generate questions");
    }
  }

  public async getGoals(text: string): Promise<{ goals: string[] }> {

    console.log("3: Generating goals.")
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getGoals },
          { role: "user", content: `Entry: ${text}` },
        ],
        model,
        temperature: .8,
        max_tokens: 4095,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) throw new Error("OpenAI API returned an empty response");
      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating goals:", error);
      throw new Error("Failed to generate goals");
    }
  }

  public async getAnalysis(text: string): Promise<{ analysis: string }> {
    console.log("7: Generating analysis.")
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getAnalysis },
          { role: "user", content: `Entry: ${text}` },
        ],
        model,
        temperature: .8,
        max_tokens: 4095,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) throw new Error("OpenAI API returned an empty response");
      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating goals:", error);
      throw new Error("Failed to generate goals");
    }
  }

  public async getSummary(text: string): Promise<SummaryResponse> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,  // Adjust the chunk size as needed
      chunkOverlap: 50, // Overlap to ensure coherence between chunks
    });
  
    const chunks = await textSplitter.splitText(text);
  
    console.log("5: Generating summary.");
  
    const summaryPromises = chunks.map(async (chunk) => {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getSummary },
            { role: "user", content: `Entry: ${chunk}` },
          ],
          model,
          temperature: 1,
          max_tokens: 2048,
          top_p: 0.9,
          frequency_penalty: 0.2,
          presence_penalty: 0,
          response_format: { type: "json_object" },
        });
  
        const response = completion?.choices[0]?.message?.content;
  
        if (!response) {
          throw new Error('OpenAI API returned an empty response');
        }
  
        const parsedResponse = JSON.parse(response);
        if (!parsedResponse.summaries || !Array.isArray(parsedResponse.summaries)) {
          throw new Error('Invalid response structure');
        }
  
        return parsedResponse.summaries;
      } catch (error) {
        console.error('Error generating summaries:', error);
        throw new Error('Failed to generate summaries');
      }
    });
  
    try {
      const summariesArray = await Promise.all(summaryPromises);
      const summaries = summariesArray.flat(); // Flatten the array of arrays
      return { summaries };
    } catch (error) {
      console.error('Error aggregating summaries:', error);
      throw new Error('Failed to aggregate summaries');
    }
  }

  public async getSentimentScore(text: string): Promise<string> {
    console.log("8: Generating sentiment.");

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,  // Adjust the chunk size as needed
      chunkOverlap: 50, // Overlap to ensure coherence between chunks
    });
  
    const chunks = await textSplitter.splitText(text);
  
    const sentimentPromises = chunks.map(async (chunk) => {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getEntrySections },
            { role: "user", content: `Entry: ${chunk}` },
          ],
          model,
          temperature: .5,
          max_tokens: 2048,
          top_p: .8,
          frequency_penalty: 0.2,
          presence_penalty: 0,
          response_format: { type: "json_object" },
        });

        const response = completion?.choices[0]?.message?.content;
        if (!response) throw new Error("OpenAI API returned an empty response");
        return JSON.parse(response).sections;
      } catch (error) {
        console.error("Error generating sections:", error);
        throw new Error("Failed to generate sections");
      }
    });

    try {
      const sectionsArray = await Promise.all(sentimentPromises);
      const sections = sectionsArray.flat();

      const sentimentScorePromises = sections.map(async (section) => {
        try {
          const completion = await openai.chat.completions.create({
            messages: [
              { role: "system", content: prompts.getSentimentScore },
              { role: "user", content: `Entry: ${section}` },
            ],
            model,
            temperature: .8,
            max_tokens: 2048,
            top_p: .8,
            frequency_penalty: 0.5,
            presence_penalty: 0.3,
            response_format: { type: "json_object" },
          });

          const response = completion?.choices[0]?.message?.content;
          if (!response) throw new Error("OpenAI API returned an empty response");
          const parsedResponse = JSON.parse(response);
          if (typeof parsedResponse.score !== "string") {
            throw new Error("Invalid response structure for score");
          }
          return parseFloat(parsedResponse.score);
        } catch (error) {
          console.error("Error generating sentiment score:", error);
          return 0;  // Return 0 as a fallback sentiment score
        }
      });

      const sentimentScores = await Promise.all(sentimentScorePromises);

      const aggregateScore =
        sentimentScores.reduce((acc, score) => acc + score, 0) / sentimentScores.length;

      return aggregateScore.toFixed(2).toString();
    } catch (error) {
      console.error("Error aggregating sentiment scores:", error);
      throw new Error("Failed to aggregate sentiment scores");
    }
  }

  public async getTrends(entry: IEntry): Promise<{ trends: string }> {
    console.log("6: Generating trends.")
    const userId = entry.user.toString();
    let userEntries;

    try {
      userEntries = await Entry.find({ user: userId });
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user entries");
    }

    if (!userEntries || userEntries.length === 0) {
      console.error("No entries found for user")
      // TODO: Fix
      return { trends: 'Trends require at least one entry to be generated.'}
    }

    userEntries = userEntries.filter(e => e._id.toString() !== entry._id.toString());

    // TODO: need to parse out _ids
    const combinedSummaries = userEntries.map((e) => ({ [e.createdAt.toISOString()]: e.summaries }));
    const formattedSummaries = JSON.stringify(combinedSummaries, null, 2)

    // Matches
    const matches = await pineconeQuery({ type: 'trends', userId, entryText: entry.text });
    
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompts.getTrends,
          },
          { role: "user", content: `Entry: ${entry.text}` },
          { role: "user", content: `Matches: ${matches}` },
          { role: "user", content: `Summaries: ${formattedSummaries}` },
        ],
        model,
        temperature: .8,
        max_tokens: 4095,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) throw new Error("OpenAI API returned an empty response");
      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating trends:", error);
      throw new Error("Failed to generate trends");
    }
  }

  public async createEntryMetadata(
    entry: IEntry,
  ): Promise<{
    title: string;
    tags: string[];
    analysis: string;
    sentiment: string;
    goals: string[];
    questions: string[];
    summaries: SummaryItem[];
    trends: string;
  }> {
    this.socket.emit('newEntryProgress', { progress: 69, email: entry.user, message: 'Hello!' });
  
    try {
      const titlePromise = this.getTitle(entry);
      const tagsPromise = this.getTags(entry.text);
      const goalsPromise = this.getGoals(entry.text);
      const questionsPromise = this.getQuestions(entry.text);
      const analysisPromise = this.getAnalysis(entry.text);
      const summariesPromise = this.getSummary(entry.text);
      const trendsPromise = this.getTrends(entry);
      const sentimentPromise = this.getSentimentScore(entry.text);
  
      const [
        titleResponse,
        tagsResponse,
        goalsResponse,
        questionsResponse,
        analysisResponse,
        summariesResponse,
        trendsResponse,
        sentiment,
      ] = await Promise.all([
        titlePromise,
        tagsPromise,
        goalsPromise,
        questionsPromise,
        analysisPromise,
        summariesPromise,
        trendsPromise,
        sentimentPromise,
      ]);
  
      const title = titleResponse.title;
      const tags = tagsResponse.tags;
      const goals = goalsResponse.goals;
      const questions = questionsResponse.questions;
      const analysis = analysisResponse.analysis;
      const summaries = summariesResponse.summaries;
      const trends = trendsResponse.trends;
  
      return {
        title,
        tags,
        analysis,
        sentiment,
        goals,
        questions,
        summaries,
        trends,
      };
    } catch (error) {
      console.error("Error during metadata creation:", error);
      throw new Error("Failed to create entry metadata");
    }
  }
  
}

dotenv.config({ path: path.resolve("../.env") });
export default CompletionHandler;