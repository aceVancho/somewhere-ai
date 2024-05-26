import fs from 'fs';
import csvParser from 'csv-parser';
import * as csvWriter from 'csv-writer';
import sanitizeHtml from 'sanitize-html';
import { resolve } from 'path';

interface JournalEntry {
  entry_id: string;
  entry_number: number;
  post_date: string;
  content: string;
  age: number;
}

const inputCsvPath = resolve(__dirname, '../docs/entries.csv');
const outputCsvPath = resolve(__dirname, '../docs/cleaned_entries.csv');

const cleanContent = (content: string): string => {
  const cleanHtml = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return cleanHtml.replace(/&nbsp;/g, ' ').trim();
};

const readAndCleanCsv = async (): Promise<JournalEntry[]> => {
  const entries: JournalEntry[] = [];

  return new Promise<JournalEntry[]>((resolve, reject) => {
    fs.createReadStream(inputCsvPath)
      .pipe(csvParser())
      .on('data', (row) => {
        const entryId = row['Entry ID'] || '';
        const entryNumber = parseInt(row['Entry Number'], 10) || 0;
        const postDate = row['Post Date'] || '';
        const content = row['Content'] || '';
        const age = parseInt(row['Age'], 10) || 0;

        const cleanedContent = cleanContent(content);
        console.log('Original Content:', content);
        console.log('Cleaned Content:', cleanedContent);

        entries.push({
          entry_id: entryId,
          entry_number: entryNumber,
          post_date: postDate,
          content: cleanedContent,
          age: age
        });
      })
      .on('end', () => {
        resolve(entries);
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
};

const writeCleanedCsv = async (entries: JournalEntry[]) => {
  const csv = csvWriter.createObjectCsvWriter({
    path: outputCsvPath,
    header: [
      { id: 'entry_id', title: 'Entry ID' },
      { id: 'entry_number', title: 'Entry Number' },
      { id: 'post_date', title: 'Post Date' },
      { id: 'content', title: 'Content' },
      { id: 'age', title: 'Age' },
    ],
  });

  await csv.writeRecords(entries);
  console.log('Cleaned CSV file written successfully.');
};

const main = async () => {
  try {
    const entries = await readAndCleanCsv();
    await writeCleanedCsv(entries);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
