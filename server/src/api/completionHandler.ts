import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { prompts } from './prompts';
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
    private static instance: CompletionHandler
    private static model = process.env.OPEN_AI_CHAT_MODEL!;

    constructor() {

      }
    
    public static getInstance(): CompletionHandler {
      if (!CompletionHandler.instance) {
          CompletionHandler.instance = new CompletionHandler();
      }
      return CompletionHandler.instance;
    }

    public async getTitle(text: string): Promise<{ title: string }> {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getTitle },
            { role: "user", content: `Entry: ${text}` },
          ],
          model,
          temperature: 1.2,
          max_tokens: 4095,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          response_format: {'type': 'json_object'}
        });
    
        const response = completion?.choices[0]?.message?.content;
        
        if (!response) {
          throw new Error('OpenAI API returned an empty response');
        }
        
        return JSON.parse(response);
      } catch (error) {
    
        console.error('Error generating title:', error);
        throw new Error('Failed to generate title');
      }
    }

    public async getTags(text: string): Promise<{ tags: string[] }> {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getTags },
            { role: "user", content: `Entry: ${text}` },
          ],
          model,
          temperature: 1.2,
          max_tokens: 4095,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          response_format: {'type': 'json_object'}
        });
    
        const response = completion?.choices[0]?.message?.content;
    
        if (!response) throw new Error('OpenAI API returned an empty response')
        return JSON.parse(response);
      } catch (error) {
        console.error('Error generating tags:', error);
        throw new Error('Failed to generate tags');
      }
    }
    

    public async getQuestions(text: string): Promise<{ questions: string[] }> {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getQuestions },
            { role: "user", content: `Entry: ${text}` },
          ],
          model,
          temperature: 1.2,
          max_tokens: 4095,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          response_format: {'type': 'json_object'}
        });
    
        const response = completion?.choices[0]?.message?.content;
    
        if (!response) {
          throw new Error('OpenAI API returned an empty response');
        }
    
        return JSON.parse(response);
      } catch (error) {
        console.error('Error generating questions:', error);
        throw new Error('Failed to generate questions');
      }
    }
    
    public async getGoals(text: string): Promise<{ goals: string[] }> {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getGoals },
            { role: "user", content: `Entry: ${text}` },
          ],
          model,
          temperature: 1.2,
          max_tokens: 4095,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          response_format: {'type': 'json_object'}
        });
    
        const response = completion?.choices[0]?.message?.content;
    
        if (!response) throw new Error('OpenAI API returned an empty response');
        return JSON.parse(response);
      } catch (error) {
        console.error('Error generating goals:', error);
        throw new Error('Failed to generate goals');
      }
    }
    

    public async getSummary(text: string): Promise<SummaryResponse> {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getSummary },
            { role: "user", content: `Entry: ${text}` },
          ],
          model,
          temperature: 1,
          max_tokens: 2000,
          top_p: 1,
          response_format: { type: 'json_object' }
        });
    
        const response = completion?.choices[0]?.message?.content;
    
        if (!response) throw new Error('OpenAI API returned an empty response');
        return JSON.parse(response);
      } catch (error) {
        console.error('Error generating summaries:', error);
        throw new Error('Failed to generate summaries');
      }
    }

    public async getSentimentScore(text: string): Promise<string> {
      let sections: string[] = [];
    
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompts.getEntrySections },
            { role: "user", content: `Entry: ${text}` },
          ],
          model,
          temperature: 1.2,
          max_tokens: 4095,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          response_format: { type: 'json_object' }
        });
    
        const response = completion?.choices[0]?.message?.content;
    
        if (!response) throw new Error('OpenAI API returned an empty response');
        sections = JSON.parse(response).sections;
      } catch (error) {
        console.error('Error generating sections:', error);
        throw new Error('Failed to generate sections');
      }
    
      const sentimentScores: string[] = [];
    
      for (const section of sections) {
        try {
          const completion = await openai.chat.completions.create({
            messages: [
              { role: "system", content: prompts.getSentimentScore },
              { role: "user", content: `Entry: ${section}` },
            ],
            model,
            temperature: 1.2,
            max_tokens: 4095,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            response_format: { type: 'json_object' }
          });
    
          const response = completion?.choices[0]?.message?.content;

    
          if (!response) throw new Error('OpenAI API returned an empty response');
          const parsedResponse = JSON.parse(response);
          if (typeof parsedResponse.score !== 'string') {
            throw new Error('Invalid response structure for score');
          }
          sentimentScores.push(parsedResponse.score);
        } catch (error) {
          console.error('Error generating sentiment score:', error);
          sentimentScores.push("0");
        }
      }
    
      const aggregateScore = sentimentScores
        .reduce((acc, score) => acc + parseFloat(score), 0) / sentimentScores.length;
    
      return aggregateScore.toFixed(2);
    }
    
}

dotenv.config({ path: path.resolve("../.env") });
export default CompletionHandler.getInstance();