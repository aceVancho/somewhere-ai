import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { prompts } from "./prompts";
import Entry from "../models/Entry";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { io, Socket } from"socket.io-client"
import { pineconeQuery } from "./query";
import { get_encoding, encoding_for_model } from "tiktoken";

dotenv.config({ path: path.resolve("../.env") });

type IEntryTagsById = Pick<IEntry, 'id' | 'tags'>
const openai = new OpenAI();
const model = process.env.OPEN_AI_CHAT_MODEL!;

class CompletionHandler {
  private socket: Socket
  private entry: IEntry;

  constructor(authToken: string, entry: IEntry) {
    this.socket = io("http://localhost:4001", { auth: { token: authToken }})
    this.socket.on('connect', () => console.log('Completion Handler connected to socket.'))
    this.entry = entry;
  }

  public async getTitle(): Promise<void> {
    if (this.entry.title) return console.log('Title already exists.')

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getTitle },
          { role: "user", content: `Entry: ${this.entry.text}` },
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
      const { title } = JSON.parse(response);
      this.entry.set({ title });
      // await // await this.saveEntry();
    } catch (error) {
      console.error("Error generating title:", error);
      throw new Error("Failed to generate title");
    }
  }

  public async getTags(): Promise<void> {

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getTags },
          { role: "user", content: `Entry: ${this.entry.text}` },
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
      const { tags } = JSON.parse(response);
      this.entry.set({ tags });
    } catch (error) {
      console.error("Error generating tags:", error);
      throw new Error("Failed to generate tags");
    }
  }

  public async getQuestions(): Promise<void> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getQuestions },
          { role: "user", content: `Entry: ${this.entry.text}` },
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
      const { questions } = JSON.parse(response);
      this.entry.questions = questions;
      // await // await this.saveEntry();

    } catch (error) {
      console.error("Error generating questions:", error);
      throw new Error("Failed to generate questions");
    }
  }

  public async getGoals(): Promise<void> {

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getGoals },
          { role: "user", content: `Entry: ${this.entry.text}` },
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
      const { goals } = JSON.parse(response);
      this.entry.set({ goals });
      // await // await this.saveEntry();
    } catch (error) {
      console.error("Error generating goals:", error);
      throw new Error("Failed to generate goals");
    }
  }

  public async getAnalysis(): Promise<void> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompts.getAnalysis },
          { role: "user", content: `Entry: ${this.entry.text}` },
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
      const { analysis } = JSON.parse(response);
      this.entry.set({ analysis });

    } catch (error) {
      console.error("Error generating goals:", error);
      throw new Error("Failed to generate goals");
    }
  }

  public async getSentimentScore(): Promise<void> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 50,
    });
  
    const chunks = await textSplitter.splitText(this.entry.text);
  
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
      const aggregateScore = sentimentScores
      .reduce((acc, score) => acc + score, 0) / sentimentScores.length;
      const formattedScore = parseFloat(aggregateScore.toFixed(2));

      this.entry.set({ sentiment: formattedScore });

    } catch (error) {
      console.error("Error aggregating sentiment scores:", error);
      throw new Error("Failed to aggregate sentiment scores");
    }
  }

  public async createEntryMetadata(): Promise<void> {
    
    // const { email } = this.entry.user;

    this.socket.emit('newEntryProgress', { 
      id: this.entry.id, 
      progress: 100, 
      email: 'thisdoesntwork@fuckme.com', 
      message: 'Progress message' 
    });
    try {
      await this.getTags(),
      await Promise.all([
        this.getTitle(),
        this.getGoals(),
        this.getQuestions(),
        this.getAnalysis(),
        this.getSummary(),
        this.getTrends(),
        this.getSentimentScore(),
      ]);
    } catch (error) {
      console.error("Error during metadata creation:", error);
      throw new Error("Failed to create entry metadata");
    }
  }
  
  // TESTS

  public getRelatedEntriesByTag = async(entryTagsById: IEntryTagsById[]): Promise<{ relatedEntryIds: string[] }> => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
            You are an AI assistant that helps users analyze their journal entries. Given a new journal entry and its tags, your task is to compare these tags with a list of past journal entry tags and return the IDs of the journal entries whose tags most closely relate to the current entry's tags.

            ### Instructions
            - Compare the tags of the new journal entry with the tags of each past journal entry.
            - Return the IDs of the past journal entries whose tags most closely relate to the tags of the new journal entry.
            - Determine the closeness of tags by relevancy.

            ### Output Format
            Response should be in JSON format, like:
            { "relatedEntryIds": ["entryId1", "entryId2", "entryId3"] }
            `
          },
          { 
            role: "user", 
            content: `
            Current entry tags: ${this.entry.tags}\n
            Past entry tags by id: ${JSON.stringify(entryTagsById)}
            ` 
          },
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
      console.error("Error getRelatedEntriesByTag:", error);
      throw new Error("Failed to getRelatedEntriesByTag");
    }
  }

  public findEntriesForTrends = async (type: 'tags' | 'recency') => {
    // @ts-ignore
    const userId = this.entry?.user.toString()
    if (!userId) throw new Error(`Entry or user not found.`);
    
    const entryIdsForTrends = []
    switch (type) {
      case 'tags':
        const allEntryTagsById: IEntryTagsById[] = (await Entry.find({ user: userId })).map((e) => ({ id: e.id, tags: e.tags}))
        const relatedEntryIdsByTag = (await this.getRelatedEntriesByTag(allEntryTagsById)).relatedEntryIds
        entryIdsForTrends.push(...relatedEntryIdsByTag)
        break;
      case 'recency':
        const entries = await Entry.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
        entries.forEach((e) => entryIdsForTrends.push(e.id));
        break;
    }

    const summaries = await Promise.all(entryIdsForTrends.map(async (id) => {
      const response = await this.getTrendsSummary(id);
      return response;
    }));

    return summaries;
  }

  public getTrends = async (): Promise<void> => {
    const userId = this.entry?.user.toString()
    let userEntries;

    try {
      userEntries = await Entry.find({ user: userId });
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user entries");
    }

    if (!userEntries || userEntries.length === 0) {
      console.error("No entries found for user")
      this.entry.set({ trends: 'Trends require at least one entry to be generated.' });
      return;
    }

    const summaries = await this.findEntriesForTrends('tags');
    const enc = encoding_for_model('gpt-4');
    const totalTexts1 = this.entry.summary + summaries.join(' ')
    const tokenIds1 = enc.encode(totalTexts1);
    const tokenCount1 = tokenIds1.length;
    const totalTexts2 = this.entry.text + summaries.join(' ')
    const tokenIds2 = enc.encode(totalTexts2);
    const tokenCount2 = tokenIds2.length;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompts.getTrends
          },
          { 
            role: "user", 
            content: `
              Current Entry: ${this.entry.summary}\n
              Past entries: ${summaries}
              ` 
          },
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
      const { trends } = JSON.parse(response);
      this.entry.set({ trends });
      // await // await this.saveEntry();

    } catch (error) {
      console.error("Error getTrends:", error);
      throw new Error("Failed to getTrends");
    }
  }

  public getSummary = async (): Promise<void> => {
    const { text } = this.entry;
    const enc = encoding_for_model('gpt-4');
    const tokenIds = enc.encode(text);
    const tokenCount = tokenIds.length;
    const bufferTokenCount = 400;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
            You are an AI assistant that helps shorten user journal entries. For the given entry, return an abridged version that leaves the most valuable or pertinent information.

            ### Instructions
            - Evaluate the journal entry.
            - Return a shortened version of the entry.

            ### Output Format
            Response should be in JSON format, like:
            { "summary": "Summary of entry." }
            `
          },
          { 
            role: "user", 
            content: `Current entry text: ${text}` 
          },
        ],
        model,
        temperature: .8,
        max_tokens: tokenCount + bufferTokenCount,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;
      if (!response) throw new Error("OpenAI API returned an empty response");
      const { summary } = JSON.parse(response);
      this.entry.set({ summary });
      // await // await this.saveEntry();
    } catch (error) {
      console.error("Error getSummary:", error);
      throw new Error("Failed to getSummary");
    }
  }

  public getTrendsSummary = async (id: string): Promise<string> => {

    const entry = await Entry.findById(id);
    if (!entry) throw new Error(`Entry not found for ${id} and ${entry}`);

    const { text } = entry;
    const enc = encoding_for_model('gpt-4');
    const tokenIds = enc.encode(text);
    const tokenCount = tokenIds.length;
    const bufferTokenCount = 400;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
            You are an AI assistant that helps shorten user journal entries. For the given entry, return an abridged version that leaves the most valuable or pertinent information.

            ### Instructions
            - Evaluate the journal entry.
            - Return a shortened version of the entry.

            ### Output Format
            Response should be in JSON format, like:
            { "summary": "Summary of entry." }
            `
          },
          { 
            role: "user", 
            content: `Current entry text: ${text}` 
          },
        ],
        model,
        temperature: .8,
        max_tokens: tokenCount + bufferTokenCount,
        top_p: .8,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
      });

      const response = completion?.choices[0]?.message?.content;
      if (!response) throw new Error("OpenAI API returned an empty response");
      const { summary } = JSON.parse(response);
      return summary;
    } catch (error) {
      console.error("Error getSummary:", error);
      throw new Error("Failed to getSummary");
    }
  }
  
  
  // TESTS
}

dotenv.config({ path: path.resolve("../.env") });

export default CompletionHandler;