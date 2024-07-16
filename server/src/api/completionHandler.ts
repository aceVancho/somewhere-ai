import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { prompts } from "./prompts";
import Entry from "../models/Entry";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
dotenv.config({ path: path.resolve("../.env") });

interface SummaryItem {
  summary: string;
  quote: string;
}

interface SummaryResponse {
  summaries: SummaryItem[];
}

interface MetadataOptions {
  title: string;
}

const openai = new OpenAI();
const model = process.env.OPEN_AI_CHAT_MODEL!;

class CompletionHandler {
  private static instance: CompletionHandler;
  private static model = process.env.OPEN_AI_CHAT_MODEL!;

  constructor() {}

  public static getInstance(): CompletionHandler {
    if (!CompletionHandler.instance) {
      CompletionHandler.instance = new CompletionHandler();
    }
    return CompletionHandler.instance;
  }

  public async getTitle(text: string): Promise<{ title: string }> {
    console.log("1: Generating title.")
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getTitle },
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
        console.log('%%%', response);
  
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
    const userId = entry.user;
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
      return { trends: 'No entries found for user.'}
    }

    userEntries = userEntries.filter(e => e._id.toString() !== entry._id.toString());

    // TODO: need to parse out _ids
    const combinedSummaries = userEntries.map((e) => ({
      [e.createdAt.toISOString()]: e.summaries,
    }));

    const formattedSummaries = JSON.stringify(combinedSummaries, null, 2)

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompts.getTrends,
          },
          { role: "user", content: `Summaries: ${formattedSummaries}` },
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

      if (!response) throw new Error("OpenAI API returned an empty response");
      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating trends:", error);
      throw new Error("Failed to generate trends");
    }
  }

  public async createEntryMetadata(
    entry: IEntry,
    options: MetadataOptions
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
    try {
      const title = options.title
      ? options.title
      : await this.getTitle(entry.text).then((res) => res.title);
      const tags = await this.getTags(entry.text).then((res) => res.tags);
      const goals = await this.getGoals(entry.text).then((res) => res.goals);
      const questions = await this.getQuestions(entry.text).then(
        (res) => res.questions
      );
      const analysis = await this.getAnalysis(entry.text).then((res) => res.analysis);
      const summaries = await this.getSummary(entry.text).then(
        (res) => res.summaries
      );
      const trends = await this.getTrends(entry).then((res) => res.trends);
      const sentiment = await this.getSentimentScore(entry.text).then((res) => res)

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
export default CompletionHandler.getInstance();
