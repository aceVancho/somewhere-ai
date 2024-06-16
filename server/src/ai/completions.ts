// import OpenAI from "openai";
// import dotenv from 'dotenv';
// import path from "path";
// import { Storage } from '@google-cloud/storage';
// import { v4 as uuidv4 } from 'uuid';
// import { IWord } from "../types/types"; 

// dotenv.config({ path: path.resolve(".env") });
// const storage = new Storage();
// const BUCKET_NAME = 'lexiconai-media';
// const openai = new OpenAI();
// const model = "gpt-4o"
// // const model = "gpt-4-0125-preview"

// const prompt = `
// I'm enhancing a web platform that merges dictionary and thesaurus functionalities, aiming to provide a rich, engaging linguistic experience. I need you, ChatGPT, to output an array of JSON objects for each English word I input. Each object should cover a distinct meaning of the word and include: a practical and easy-to-understand definition, two usage examples, part of speech, easy-to-understand phonetic pronunciation, a concise etymology, 20-30 rhymes, an antonym section, a collocations section, a word family section, a related words section, and a thesaurus section. The rhymes section should contain three levels: one-syllable, two-syllable, and 3 syllable rhymes. Rhymes may be multi-worded. The thesaurus should be divided into three obscurity levels: level1, level2, level3, and level4 with 20-30 synonyms in each category. The collocations section should list common phrases or combinations in which the word is used. The word family section should include variations of the word such as different forms, tenses, or derived words. The related words section should list words that are associated or have a connection with the main word. Focus on delivering succinct, engaging content that pushes the limits of synonym variety for a deep exploration of the English language. Only respond with the plain JSON object array with no markdown. The array should possess multiple objects if the word has multiple meanings (e.g., words like "dark" or "key" that represent different parts of speech depending on how they are used). An example is as follows:

// [
//   {
//     "word": "exampleWord",
//     "definition": "A practical, easy-to-understand definition.",
//     "usages": ["First, humorous and dirty usage.", "Second, creative usage"],
//     "partOfSpeech": "noun/verb/etc.",
//     "pronunciation": "user-friendly phonetic spelling",
//     "etymology": "A paragraph-long origin story of the word.",
//     "rhymesWith": {
//       "syllable1": ["a list of one-syllable, rhyming words"],
//       "syllable2": ["a list of two-syllable, rhyming words"],
//       "syllable3": ["a list of three-syllable, rhyming words"],
//       "syllable4": ["a list of four-syllable, rhyming words"],
//     },
//     "antonyms": ["a comprehensive list of 20-30 antonyms"],
//     "collocations": ["a list of 20 common collocations"],
//     "wordFamily": ["a list of 20 related word forms"],
//     "relatedWords": ["a list of 20  words related to the main word"],
//     "thesaurus": {
//       "level1": ["a comprehensive list of 20 or more synonyms"],
//       "level2": ["a similarly extensive list of 20 or more obscure synonyms"],
//       "level3": ["an ambitious list of 20 or more ultra-rare synonyms"],
//       "level4": ["a list of 20 or more extremely obscure synonyms"],
//     }
//   }
// ]
// `


// export async function createWord(word: string) {
//   const completion = await openai.chat.completions.create({
//     messages: [
//         {"role": "system", "content": prompt},
//         {"role": "user", "content": `Define: ${word}`},
//       ],
//     model,
//   });

//   const response = completion?.choices[0]?.message?.content;
//   return response;
// };

// interface ITextToSpeechURLs {
//   word: string;
//   definition: string;
//   usages: string[];
//   pronunciation: string;
// }

// interface IUploadFileFromMemoryParams {
//   buffer: Buffer;
//   inputType: string
//   word: string;
//   meaningId: string;
// }

// export async function createTTSUrls(wordDetailsArray: IWord[]) {
//   console.log('Creating text-to-speech urls...')
//   const model = "tts-1";
//   const voice = "alloy";

//   for (const wordDetailsObject of wordDetailsArray) {
//     let ttsUrls: ITextToSpeechURLs = { word: '', definition: '', usages: [], pronunciation: '' };

//     for (const [key, value] of Object.entries(wordDetailsObject)) {
//       const { word, meaningId } = wordDetailsObject;
//       switch (key) {
//         case 'word':
//         case 'definition':
//         case 'pronunciation':
//           const mp3 = await openai.audio.speech.create({ model, voice, input: value as string });
//           const buffer = Buffer.from(await mp3.arrayBuffer());

//           try {
//             if (!buffer) throw new Error('Array buffer undefined');
//             const url = await uploadFileFromMemory({
//               buffer: buffer,
//               inputType: key,
//               word,
//               meaningId,
//             });
//             ttsUrls[key] = url;
//           } catch (error) {
//             console.error('An error occurred while uploading to Google Cloud Storage:', error);
//           }
//           break;
//         case 'usages':
//           const urls = [];
//           for (const [index, usage] of (value as string[]).entries()) {
//             const usageMp3 = await openai.audio.speech.create({ model, voice, input: usage });
//             const usageBuffer = Buffer.from(await usageMp3.arrayBuffer());

//             try {
//               if (!usageBuffer) throw new Error('Array buffer undefined');
//               const url = await uploadFileFromMemory({
//                 buffer: usageBuffer,
//                 inputType: `${key}-${index}`,
//                 word,
//                 meaningId,
//               });
//               urls.push(url);
//             } catch (error) {
//               console.error('An error occurred while uploading to Google Cloud Storage:', error);
//             }
//           }
//           ttsUrls[key] = urls;
//           break;
//       }
//     }

//     wordDetailsObject['ttsUrls'] = ttsUrls;
//   }

//   return wordDetailsArray;
// }

// async function uploadFileFromMemory(params: IUploadFileFromMemoryParams): Promise<string> {
//   const bucket = storage.bucket(BUCKET_NAME);
//   const baseUrl = 'https://storage.googleapis.com'
//   const urlPath = `${params.word}/${params.meaningId}/${params.inputType}.mp3`
//   const file = bucket.file(urlPath);

//   try {
//     await file.save(params.buffer, { metadata: { contentType: 'audio/mpeg', }});
//     // await file.makePublic();
//   } catch (error) {
//     console.error(`Error while uploading tts to Google Cloud Storage: ${error}`);
//   }

//   console.log(`Content for "${urlPath}" uploaded to ${BUCKET_NAME}.`);
//   const publicUrl = `${baseUrl}/${BUCKET_NAME}/${urlPath}`
//   return publicUrl;
// }

