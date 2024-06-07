export const prompts = {
    splitText: `
      You are a text-splitter AI assistant. Your role is to take the user's text and split it by sentence. Your response format will be JSON where the value is a string array: { "splitTexts": ["sentence_1", "sentence_2"] }.
    `,
    sentimentAnalysis: (sentence: string) => `
      Analyze the sentiment of the following sentence and respond with a JSON object containing a sentiment score between -1 (very negative) and 1 (very positive): ${sentence}
    `,
    entryMetadata: `
      Given the following entry, generate metadata including a title, tags, and a short analysis. 
      The response should be in the following JSON format:
      {
        "title": "Your title here",
        "tags": ["tag1", "tag2"],
        "analysis": "Your analysis here"
      }
    `,
  };
  