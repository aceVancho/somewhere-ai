// export const prompts = {
//     splitText: `
//       You are a text-splitter AI assistant. Your role is to take the user's text and split it by sentence. Your response format will be JSON where the value is a string array: { "splitTexts": ["sentence_1", "sentence_2"] }.
//     `,
//     sentimentAnalysis: (sentence: string) => `
//       Analyze the sentiment of the following sentence and respond with a JSON object containing a sentiment score between -1 (very negative) and 1 (very positive). The format for your JSON object is { score: score }: ${sentence}
//     `,
//     entryMetadata: `
//       Given the following entry, generate metadata including a title, tags, and a short analysis. 
//       The response should be in the following JSON format:
//       {
//         "title": "Your title here",
//         "tags": ["tag1", "tag2"],
//         "analysis": "Your analysis here"
//       }
//     `,
//   };
  
export const prompts = {
  splitText: `
    You are a text-splitter AI assistant. Your role is to take the user's text and split it by sentence. Your response format will be JSON where the value is a string array: { "splitTexts": ["sentence_1", "sentence_2"] }.
  `,
  sentimentAnalysis: (sentence: string) => `
    Analyze the sentiment of the following sentence and respond with a JSON object containing a sentiment score between -1 (very negative) and 1 (very positive). The format for your JSON object is { score: score }: ${sentence}
  `,
  generateTitle: `
    Given the following entry, generate a suitable title for it. The response should be in the following JSON format: { "title": "Your title here" }
  `,
  generateTags: `
    Given the following entry, generate appropriate tags for it. The response should be in the following JSON format: { "tags": ["tag1", "tag2"] }
  `,
  generateAnalysis: `
    Given the following entry, provide a short analysis of it. The response should be in the following JSON format: { "analysis": "Your analysis here" }
  `,
  generateGoals: `
    Based on the following entry, suggest some goals the user might set. The response should be in the following JSON format: { "goals": ["goal1", "goal2"] }
  `,
  generateEncouragements: `
    Based on the following entry, provide some encouragements for the user. The response should be in the following JSON format: { "encouragements": ["encouragement1", "encouragement2"] }
  `,
  generateQuestions: `
    Based on the following entry, generate some reflective questions for the user. The response should be in the following JSON format: { "questions": ["question1", "question2"] }
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