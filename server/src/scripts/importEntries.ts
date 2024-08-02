import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import fetch from 'node-fetch';

const xmlFilePath = path.join(__dirname, '../docs/entries_sample.xml');
const serverUrl = 'http://localhost:4001/api/entries/create';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmE3YzQ1OTgwMmQ4NGI4NGRjMGU5YzciLCJpYXQiOjE3MjI2MTI0NDJ9.g1hP5sWq-a7BZR01MPouOOCTLJr7qQN30X33J0pQmiY'

interface JournalEntry {
  title: string;
  content: string;
}

const readXmlFile = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const parseXmlData = async (xmlData: string): Promise<any> => {
  return parseStringPromise(xmlData);
};

const stripHtmlTags = (content: string): string => {
  return content.replace(/<\/?[^>]+(>|$)/g, "");
};

const extractJournalEntries = (parsedData: any): JournalEntry[] => {
  const items = parsedData.rss.channel[0].item;
  return items.map((item: any) => {
    const title = item['title'][0];
    const content = stripHtmlTags(item['content:encoded'][0]);
    return { title, content };
  });
};

const postJournalEntry = async (entry: JournalEntry) => {
  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ text: entry.content, title: entry.title }),
      timeout: 10000 // 10 seconds
    });

    if (!response.ok) {
      console.error(`Failed to post entry: ${entry.title}`, await response.text());
    }
  } catch (error) {
    console.error(`Error posting entry: ${entry.title}`, error);
  }
};

const testServerConnection = async () => {
  try {
    const testResponse = await fetch("http://localhost:4001/api/test", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    if (!testResponse.ok) {
      throw new Error(`Test request failed: ${await testResponse.text()}`);
    }
    console.log('Server connection test passed.');
  } catch (error) {
    console.error('Server connection test failed:', error);
  }
};

const main = async () => {
  try {
    // await testServerConnection();

    const xmlData = await readXmlFile(xmlFilePath);
    const parsedData = await parseXmlData(xmlData);
    const journalEntries = extractJournalEntries(parsedData);

    for (const entry of journalEntries) {
      await postJournalEntry(entry);
    }

    console.log('All journal entries have been posted successfully.');
  } catch (error) {
    console.error('Error processing journal entries:', error);
  }
};

main();
