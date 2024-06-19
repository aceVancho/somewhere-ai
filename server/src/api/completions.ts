// completions.ts

import OpenAI from "openai";
import dotenv from 'dotenv';
import path from "path";
import { prompts } from './prompts';

dotenv.config({ path: path.resolve("../.env") });


const openai = new OpenAI();
const model = process.env.OPEN_AI_CHAT_MODEL!;

export const getSplitTexts = async (text: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompts.splitText },
        { role: "user", content: `Entry: ${text}` },
      ],
      model,
      temperature: 0.5,
      response_format: {'type': 'json_object'}
    });

    const response = completion?.choices[0]?.message?.content;

    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }
    return JSON.parse(response).splitTexts;
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    throw new Error('OpenAI API call failed');
  }
};

export const analyzeSentiment = async (sentence: string): Promise<number> => {
  try {
    const prompt = prompts.sentimentAnalysis(sentence);
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a sentiment analysis assistant." },
        { role: "user", content: prompt },
      ],
      model,
      temperature: 0.5,
      response_format: {'type': 'json_object'}
    });

    const response = completion?.choices[0]?.message?.content?.trim();

    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }

    return JSON.parse(response).score;
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    throw new Error('Failed to analyze sentiment');
  }
};

export const aggregateSentiments = (sentiments: number[]): number => {
  const total = sentiments.reduce((sum, score) => sum + score, 0);
  return total / sentiments.length;
};

const generateTitle = async (text: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompts.generateTitle },
        { role: "user", content: `Entry: ${text}` },
      ],
      model,
      temperature: 0.5,
      response_format: {'type': 'json_object'}
    });

    const response = completion?.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }
    
    return JSON.parse(response).title;
  } catch (error) {

    console.error('Error generating title:', error);
    throw new Error('Failed to generate title');
  }
};

const generateTags = async (text: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompts.generateTags },
        { role: "user", content: `Entry: ${text}` },
      ],
      model,
      temperature: 0.5,
      response_format: {'type': 'json_object'}
    });

    const response = completion?.choices[0]?.message?.content;

    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }

    return JSON.parse(response).tags;
  } catch (error) {
    console.error('Error generating tags:', error);
    throw new Error('Failed to generate tags');
  }
};

const generateAnalysis = async (text: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        // { role: "system", content: prompts.generateAnalysis },
        // { role: "user", content: `Entry: ${text}` },
        {
          "role": "system",
          // @ts-ignore
          "content": [
            {
              "text": prompts.generateAnalysis,
              "type": "text"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": text
            }
          ]
        },
      ],
      model,
      temperature: 1.1,
      max_tokens: 4095,
      top_p: 1,
      frequency_penalty: .69,
      presence_penalty: .1,
      // response_format: {'type': 'json_object'}
    });

    const response = completion?.choices[0]?.message?.content;

    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }

    return response;
    // return JSON.parse(response).analysis;
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw new Error('Failed to generate analysis');
  }
};

const generateGoals = async (text: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompts.generateGoals },
        { role: "user", content: `Entry: ${text}` },
      ],
      model,
      temperature: 0.8,
      response_format: {'type': 'json_object'}
    });

    const response = completion?.choices[0]?.message?.content;

    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }

    return JSON.parse(response).goals;
  } catch (error) {
    console.error('Error generating goals:', error);
    throw new Error('Failed to generate goals');
  }
};

const generateQuestions = async (text: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompts.generateQuestions },
        { role: "user", content: `Entry: ${text}` },
      ],
      model,
      temperature: 0.9,
      response_format: {'type': 'json_object'}
    });

    const response = completion?.choices[0]?.message?.content;

    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }

    return JSON.parse(response).questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
};

interface MetadataOptions {
  title: string
}

export const createEntryMetadata = async (entry: IEntry, options: MetadataOptions): Promise<{ title: string; tags: string[]; analysis: string; sentiment: number; goals: string[]; questions: string[] }> => {
  try {
    const title = options.title ? options.title : await generateTitle(entry.text);
    const tags = await generateTags(entry.text);
    const analysis = await generateAnalysis(entry.text);
    const splitTexts = await getSplitTexts(entry.text);
    const sentimentPromises = splitTexts.map(sentence => analyzeSentiment(sentence));
    const sentiments = await Promise.all(sentimentPromises);
    const overallSentiment = aggregateSentiments(sentiments);
    const goals = await generateGoals(entry.text);
    const questions = await generateQuestions(entry.text);

    return { title, tags, analysis, sentiment: overallSentiment, goals, questions };
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    throw new Error('Failed to create entry metadata');
  }
};
