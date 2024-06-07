import OpenAI from "openai";
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.resolve(".env") });

export const createEntryMetadata = async (entry: IEntry): Promise<{ title: string; tags: string[]; analysis: string }> => {
  const openai = new OpenAI();
  const model = process.env.OPEN_AI_CHAT_MODEL!;
  const prompt = `
  Given the following entry, generate metadata including a title, tags, and a short analysis. 
  The response should be in the following JSON format:
  {
    "title": "Your title here",
    "tags": ["tag1", "tag2"],
    "analysis": "Your analysis here"
  }
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: `Entry: ${entry.text}` },
    ],
    model,
    response_format: { "type": "json_object" }
  });

  const response = completion?.choices[0]?.message?.content;

  if (!response) {
    throw new Error('OpenAI API returned an empty response');
  }

  let metadata;
  try {
    metadata = JSON.parse(response);
    console.log(metadata)
  } catch (error) {
    console.error(error)
  }

  return metadata
};


  