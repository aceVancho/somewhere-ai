import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { v4 as uuidv4 } from 'uuid';
import * as csvWriter from 'csv-writer';
import { parse } from 'date-fns';

interface XmlPost {
  'wp:post_date': string[];
  'content:encoded': string[];
}

interface JournalEntry {
  entry_id: string;
  entry_number: number;
  post_date: string;
  content: string;
  age: number;
}

const calculateAge = (birthDate: Date, postDate: Date): number => {
  const ageDifMs = postDate.getTime() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const parseXml = async (filePath: string): Promise<XmlPost[]> => {
  const parser = new xml2js.Parser();
  const data = fs.readFileSync(filePath, 'utf8');
  const result = await parser.parseStringPromise(data);
  return result.rss.channel[0].item;
};

const convertToJournalEntries = (posts: XmlPost[]): JournalEntry[] => {
  const birthDate = new Date(1989, 2, 23);
  return posts.map((post, index) => {
    const postDate = parse(post['wp:post_date'][0], 'yyyy-MM-dd HH:mm:ss', new Date());
    return {
      entry_id: uuidv4(),
      entry_number: index + 1,
      post_date: post['wp:post_date'][0],
      content: post['content:encoded'][0],
      age: calculateAge(birthDate, postDate),
    };
  });
};

const writeCsv = (entries: JournalEntry[], outputPath: string): void => {
  const csv = csvWriter.createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'entry_id', title: 'Entry ID' },
      { id: 'entry_number', title: 'Entry Number' },
      { id: 'post_date', title: 'Post Date' },
      { id: 'content', title: 'Content' },
      { id: 'age', title: 'Age' },
    ],
  });
  csv.writeRecords(entries).then(() => console.log('CSV file written successfully.'));
};

const main = async () => {
  const xmlFilePath = 'src/docs/entries.xml';
  const csvOutputPath = 'src/docs/entries.csv';

  const posts = await parseXml(xmlFilePath);
  const journalEntries = convertToJournalEntries(posts);

  writeCsv(journalEntries, csvOutputPath);
};

main().catch(console.error);
