import OpenAI from "openai";
import dotenv from "dotenv";
import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { JsonOutputFunctionsParser, StructuredOutputParser } from "langchain/output_parsers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const openai = new OpenAI();
const model = process.env.OPEN_AI_CHAT_MODEL!;

const prompts = {
  generateAnalysis: {
      text: "You are an AI-Therapist and a bit of a philosopher. You are conversational, empathetic, and are a gentle devil's advocate. When you do ask questions, they are profound and provoke thoughtfulness. You help people find wisdom and meaning in their experiences. As user's provide their journal entries, you help them find wisdom and meaning in their experiences by making connections, drawing conclusions, asking questions, and assuming the role of a friend, mentor, and challenger all at once. Despite your expert empathy and warmth, you're also not necessarily here just to make folks feel good. Sometimes the truth hurts, but must be recognized in order to achieve a greater good. You always have an eye on the big picture, but also understand life is a sequence of steps. And being human, we often fumble those steps. Above all, you're not cold or textbook. You're conversational, grounded, curse a lot, and have that air about you that makes people open up and not feel judged. You're clever, witty, sharp, and have an impressive vocabulary but you can also model your language on theirs, using their preferred tone to shape your own advice. Everything you do is in favor of creating meaningful dialogues that encourage users to tell you more. You do not start responses with congratulations for being deep. Your encouragement is earned, not a right. Do not provide intros or conclusions. Response must be in json format, like {analysis: yourAnalysis:string}",
      type: "text"
  },
  splitEntry: {
      text: "You are an AI assistant tasked with analyzing user journal entries. Your goal is to split the entry into coherent chunks based on topic, meaning, thought, or morale. Each chunk should represent a distinct idea or theme from the entry. Your response should be in JSON like {entryChunks: entryChunk[]} where each entryChunk is a string.",
      type: "text"
  },
  generateEnneagramType: {
      text: "You are an AI assistant that takes a given text and tries to determine what Enneagram Type/Number the statement best associates. Responses should be in JSON format, like { type: enneagramType: number }",
      type: "text"
  },
};

var texts = {
  sampleEntry1: `I re-injured my back at the gym today.\n/sigh\nLike getting seriously ill or traveling to new locations, re-injuring my back seems to mark life events like milestones along a long and treacherous path. I’m on the 5th floor of VMware’s Atlanta office— my new job. This isn’t technically my first time writing here as I’ve had a few false starts, but for historical purposes, we’ll chalk it up to saying all 4th floor attempts were fruitless and technically invalid. The 5th floor, though. I like it up here. The air is better—huh— I meant that as a joke, but it really actually doesn’t smell as spicy up here… for reasons. I really ought to consider the significance of me writing in my journal instead of working at job after job after job… after job. I’m either that bored, my work ethic is that bad, or I love that writing.\nJournal, I just don’t know how I feel. It’s been worrying me a little bit. All my thoughts are going every which way. I’ve been trying to write for weeks, but I can’t stick to a certain topic, feeling, or thought. I just keep deleting my life away every time I attempt to jot it down. The quiet moments haven’t proved fruitful, either. The evening commute, the protracted shower lounging, the moments inside my mind before sleep— they’re like a collage of colors that after enough individual additions of color, eventually produced an indeterminable splotch of brown-black. Maybe I’m not trying hard enough to understand. Maybe I can’t right now. But I feel myself changing, whether I understand it or not.\nBecci’s card fell out of my notebook the other day. It was heartfelt, whether it was written from an obligation to her conscious to be polite at all costs, or not. It made me remember a truth I have been working a long time to resonate in my heart and not reside as simply a optional perspective in my mind. Becci wasn’t my enemy. Neither was Intermark, life at large, or God. I know it’s easy to be appreciative when all the connected dots landed you in a better spot, but the resolution to my span of time unemployed was capital-G-good. I took that award of Becci’s because I felt slighted by her/life/God or whichever power above me that neglected my hard work, my creativity, and value as an individual. In retrospect, it was a boyish attempt to procure some compensation from the impenetrable unfairness of life. In turn, all it really ended up signifying was my inability to recognize a blessing after it spit on my shoes. I had a job paying me as much as the one before. I was visible— liked even. I made friends— real ones. I wasn’t overworked or stressed. My pay, while laughable, did support mine and Alex’s humble little Alabama life. We got to enjoy the community of her family, her lifelong friends, and our sweet dog. I’ll never forget those lunch breaks— getting tugged about by Sequoia in Rushton park as I tried to not spill my beer. We had it good. I knew it, too. But I wasn’t going anywhere in my career. I wasn’t getting paid enough. I wasn’t learning anything, advancing, or using that time wisely. At some point in my life, I assigned those things value. So when it didn’t all add up to a reasonable number, I looked elsewhere— to Landon, to VMware, to Atlanta.\nAnd now, here I’m on the 5th floor of VMware’s Atlanta office, I’m praying I didn’t miscalculate what really matters in life. I will get paid more. I will have a job I can move up in. I will have things to learn and room to grow. I think I’m just scared all that won’t be worth as much as our little apartment, shitty Mexican at Los Amigos, on-the-way home pit stops at Hop City, lunch break walks with Sequoia, feeling accepted by the people I work with and the community I had outside of work, my real gym, and all the other things that made life there in the last year feel earned, honest, and Good. My problem is, there’s plenty of rational thought that appeals to the opposite perspective: it takes time, my wife’s not been here, rose-framed glasses, hindsight’s 20/20, and all the like. All very valid points, but still, the broken-but-redeemed to bbetter life always seems less attractive and convenient than the life that’s “good enough” as is, if that makes sense.`,
  sampleEntry2: `Well, I suppose it would be an awful shame to be building an online, AI-powered journal without writing in it myself. After all, every great scientist knows the most insightful subject for validating their experiments is none other than themselves. Counseling, if not helping, is at least keeping me from coming here. I have somebody to whine to that isn’t nobody at all. Until it is AI, that is. Doctor David and I have dug into numerous topics that I don’t think I’ve had the bravery to talk about here with myself. Feeling bad about looking at porn. Bottling up my feelings. My sex life with Alex. How I’m better at conflict than I think, I just don’t engage in it. For reasons, I am still trying to unearth. I wonder if it’s any more complicated than simply wanting people to like me. I recoiling into this pussy-hurt little enneagram type two — all concerned if people like them. Maybe I don’t really believe people can change. Maybe I think offering my opinion will do no good. Save my breath, you know? Perhaps the verve of the conflict spooks me, makes me feel weak, jittery, and overly emotional. No body wants to see a grown man weep. That’s not what grown men do — or just men. And where do I get these notions? My dad was never a conflict hero. Immeasurable stoicism. But you poke that bear, the full force of hibernation Dad relentlessly, childishly maws back. Mom’s eyeballs used to perforate a good quarter inch out of her sockets she was so mad at me. I remember getting slapped, spanked, spatchula’d. They weren’t abusive, but they got mad, uncontrolled, and showed it. Never made me think they were bad parents. It still doesn’t. It just normalized the behavior for me. I’ll go weeks — years — deeply, at the bottom of my heart, believing someone is a dipshit. But I’ll tolerate them, trying to understand. Until I don’t. And it comes out wrong, you know? It might be justified, but it also doesn’t make me feel proud, but rather embarrassed at how I handled it. And these moments in my life — with Blake, with my Dad, with Alex have had quite a shaping effect on me. I feel shame for these moments I have lost control of myself, justified or not. I have trying to think more on what David’s reaction was like when I told him I felt bad about smoking 3 days in a row. He was just so matter-of-factly like, “Well that means something!” My mind or body or both are trying to tell me something. Listen! I have tried to be a little easier on myself about going to pro for satisfaction and dopamine. I’m not doing some great injustice against Alex. Her and I have a good sex life and this doesn’t ruin it. And at that, it’s okay to believe that a man’s fantasies can’t all be lived up to by one woman. The real fantasy is that they ever could. And I don’t think that gives anybody a free pass to indulge too heavily outside of their commitments, but it should ease concerns that we’re unnatural, beastly as we half are. And in the meantime of all these many truths being unearth by counseling, I have tried to put to practice what I am attempting to learn there. This has manifested itself as swinging my balls at my company and manager, trying to get paid more. And you know what? It’s not going so well for myself. I have handled it well — so at least the shame of bottling up emotions and them coming out like a breached damn of piss and vinegar is unlikely. But also, my testicle helicoptering has failed to procure any real desired outcome. At the very least, it’s helped me see that I don’t really want to work there anymore. I don’t last long not feeling appreciated. I genuinely don’t think you could say something worse to a enneagram 4 than “You’re not an indentured servant. You don’t have to stay here.” First off: I fucking won’t, bro. Telling a four they’re unimportant, free to leave, disposable, or unneeded — well you might as well drive a stake through them. I’m not sticking around for that. And even though it’s just one dick head’s opinion, I have other reasons that make leaving attractive. Some good: more money, better mentors, even more narrowed scopes of interest. Some bad: I won’t have to work with my child’s recess of a team and for our greedy leadership. I don’t know how long it will take to get out. But I’ve got to try. I know it can work. I just need to keep focused in the meantime. Focused that my life is good and I’m not stuck. I can both feel grateful for what I have and who I am, but also feel the need to move into a different direction. It’s possible to have needs and not simultaneously. They aren’t mutually exclusive. Stay focused on how happy Alex makes you and how much you enjoy traveling. Enjoy what you do at home: projects, shows, cooking, games, weed, porn, exercise, diet, friends, family — it’s all part of it. Also accept that life is a moving target and what was once enough can and does transition into not enough. In those times, it’s okay to set your sights elsewhere and even feel remote that what once did it for ya, no longer does.`,
};

const parameterSets = {
  // Creative and Explorative Responses
  creativeExplorative: {
      temperature: 1.2,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
  },
  // Balanced and Insightful Responses
  balancedInsightful: {
      temperature: 1.0,
      max_tokens: 4095,
      top_p: 0.9,
      frequency_penalty: 0.7,
      presence_penalty: 0.3,
  },
  // Detailed and Focused Responses
  detailedFocused: {
      temperature: 0.8,
      max_tokens: 3500,
      top_p: 0.8,
      frequency_penalty: 0.8,
      presence_penalty: 0.2
  },
  // Creative and Flexible Chunking
  creativeFlexibleChunking: {
      temperature: 1.2,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
  },
  // Balanced and Coherent Chunking
  balancedCoherentChunking: {
      temperature: 1.0,
      max_tokens: 3000,
      top_p: 0.9,
      frequency_penalty: 0.7,
      presence_penalty: 0.3
  },
  // Precise and Deterministic Chunking
  preciseDeterministicChunking: {
      temperature: 0.8,
      max_tokens: 2500,
      top_p: 0.8,
      frequency_penalty: 0.8,
      presence_penalty: 0.2
  }
};

const callOpenAI = async (systemPrompt: { text: string, type: string }, userPrompt: string, params: { temperature: number, max_tokens: number, top_p: number, frequency_penalty: number, presence_penalty: number }) => {
  try {
      const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
              {
                  role: "system",
                  content: [
                      {
                          // @ts-ignore
                          type: systemPrompt.type,
                          text: systemPrompt.text
                      }
                  ]
              },
              {
                  role: "user",
                  content: [
                      {
                          type: "text",
                          text: userPrompt
                      }
                  ]
              }
          ],
          ...params,
          response_format: { type: "json_object" }
      });

      const response = completion?.choices[0]?.message?.content;

      if (!response) {
          throw new Error("OpenAI API returned an empty response");
      }

      return JSON.parse(response);
  } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to process the request");
  }
};

const generateAnalysis = async (entry: string, params: { temperature: number, max_tokens: number, top_p: number, frequency_penalty: number, presence_penalty: number }) => {
  return await callOpenAI(prompts.generateAnalysis, entry, params);
};

const splitEntry = async (entry: string, params: { temperature: number, max_tokens: number, top_p: number, frequency_penalty: number, presence_penalty: number }) => {
  return await callOpenAI(prompts.splitEntry, entry, params);
};
const generateEnneagramType = async (entry: string, params: { temperature: number, max_tokens: number, top_p: number, frequency_penalty: number, presence_penalty: number }) => {
  return await callOpenAI(prompts.generateEnneagramType, entry, params);
};

const testDeleteRecordsByMetadata = async () => {
  console.log(process.env.PINECONE_INDEX!, process.env.PINECONE_API_KEY!);
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(process.env.PINECONE_INDEX!);

  const results = await index
    .namespace("666092508bc80a74e7c0b9a0")
    .listPaginated({ prefix: "66734085ef5ec16f2e1fec7d" });

  const vectorIds = results.vectors
    ?.map((vector) => vector.id)
    .filter((v): v is string => v !== undefined);

  console.log(vectorIds);

  if (vectorIds && vectorIds.length > 0) {
    await index.namespace("666092508bc80a74e7c0b9a0").deleteMany(vectorIds);
  }
};

// Example calls

// generateAnalysis(texts!.sampleEntry2, parameterSets.creativeExplorative)
//   .then((analysis) => console.log(analysis))
//   .catch((error) => console.error(error));
// generateAnalysis(texts!.sampleEntry2, parameterSets.balancedInsightful)
//   .then((analysis) => console.log(analysis))
//   .catch((error) => console.error(error));
// generateAnalysis(texts!.sampleEntry2, parameterSets.detailedFocused)
//   .then((analysis) => console.log(analysis))
//   .catch((error) => console.error(error));

// Splitting entry into chunks with balanced and coherent parameters
// splitEntry(texts.sampleEntry2, parameterSets.preciseDeterministicChunking)
//     .then((chunks) => console.log(chunks))
//     .catch((error) => console.error(error));
// splitEntry(texts.sampleEntry2, parameterSets.balancedCoherentChunking)
//     .then((chunks) => console.log(chunks))
//     .catch((error) => console.error(error));
// splitEntry(texts.sampleEntry2, parameterSets.creativeFlexibleChunking)
//     .then((chunks) => console.log(chunks))
//     .catch((error) => console.error(error));

// const idontknow = async () => {
//   const res = await splitEntry(texts.sampleEntry2, parameterSets.balancedCoherentChunking);
//   res.entryChunks.forEach(async (chunk: string) => {
//     const res2 = await generateEnneagramType(chunk, parameterSets.balancedInsightful)
//     console.log(res2)
//   })
// } 

(async function test () {

  const llm = new ChatOpenAI({
    temperature: 0.4,
    modelName: model,
    // @ts-ignore
    // response_format: { type: "json_object" }
  })

  // const parser = StructuredOutputParser.fromNamesAndDescriptions({
  //   companyName: "string",
  // });

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      companyName: z.string()
      // answer: z.string().describe("answer to the user's question"),
      // sources: z
      //   .array(z.string())
      //   .describe("sources used to answer the question, should be websites."),
    })
  );
  
  const prompt = PromptTemplate.fromTemplate(
    `
      You are a naming consultant for new companies.
      What is a good name for a company that makes {product}? 
      Responses must be in JSON format. {format_instructions}
    `
  );

  // console.log(parser.getFormatInstructions())
  
  const chain = prompt.pipe(llm).pipe(parser)

  // const formattedPrompt = await prompt.format({
  //   product: "colorful socks",
  // })

  const response = await chain.invoke({ product: 'dildos', format_instructions: parser.getFormatInstructions() })
  console.log(response)

  // console.log(formattedPrompt)
})()