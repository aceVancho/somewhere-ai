import CompletionHandler from '../../src/api/completionHandler';
import { testTexts } from "../../src/docs/texts";

interface SummaryItem {
    summary: string;
    quote: string;
  }
  
  interface SummaryResponse {
    summaries: SummaryItem[];
  }
  
  describe('CompletionHandler Integration Tests', () => {
    jest.setTimeout(30000); // 30 seconds

    it('should return metadata title from API', async () => {
      const response = await CompletionHandler.getTitle(testTexts.sampleEntry2);
      console.log('API Response for Title:', response);
  
      expect(response).toHaveProperty('title');
      expect(typeof response?.title).toBe('string');
    });
  
    it('should return metadata questions from API', async () => {
      const response = await CompletionHandler.getQuestions(testTexts.sampleEntry2);
      console.log('API Response for Questions:', response);
  
      expect(response).toHaveProperty('questions');
      expect(Array.isArray(response?.questions)).toBe(true);
      response?.questions.forEach(question => {
        expect(typeof question).toBe('string');
      });
    });
  
    it('should return a summary from API', async () => {
      const response = await CompletionHandler.getSummary(testTexts.sampleEntry2);
      console.log('API Response for Summary:', response);
  
      if (!response || !Array.isArray(response.summaries)) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response structure');
      }
  
      response.summaries.forEach(item => {
        expect(item).toHaveProperty('summary');
        expect(item).toHaveProperty('quote');
        expect(typeof item.summary).toBe('string');
        expect(typeof item.quote).toBe('string');
      });
    });
  });