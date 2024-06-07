// completions.ts

import OpenAI from "openai";
import dotenv from 'dotenv';
import { prompts } from './prompts';

dotenv.config();

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

export const createEntryMetadata = async (entry: IEntry): Promise<{ title: string; tags: string[]; analysis: string; sentiment: number }> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompts.entryMetadata },
        { role: "user", content: `Entry: ${entry.text}` },
      ],
      model,
    });

    const response = completion?.choices[0]?.message?.content;

    if (!response) {
      throw new Error('OpenAI API returned an empty response');
    }

    const metadata = JSON.parse(response);

    const splitTexts = await getSplitTexts(entry.text);
    const sentimentPromises = splitTexts.map(sentence => analyzeSentiment(sentence));
    const sentiments = await Promise.all(sentimentPromises);
    const overallSentiment = aggregateSentiments(sentiments);

    return { ...metadata, sentiment: overallSentiment };
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    throw new Error('Failed to create entry metadata');
  }
};
