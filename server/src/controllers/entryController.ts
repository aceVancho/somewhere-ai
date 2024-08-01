import { Request, Response } from 'express';
import Entry from '../models/Entry';
import User from '../models/Users';
import { upsert } from '../api/upsert';
import { Pinecone } from '@pinecone-database/pinecone';
import CompletionHandler from '../api/completionHandler';
import SessionHandler from '../api/sessionHandler';

const startTransaction = async () => {
  const session = await Entry.startSession();
  session.startTransaction();
  return session;
};

const commitTransaction = async (session: any) => {
  await session.commitTransaction();
  session.endSession();
};

const abortTransaction = async (session: any) => {
  await session.abortTransaction();
  session.endSession();
};

export const createEntry = async (req: Request, res: Response): Promise<void> => {
  const session = await startTransaction();
  
  try {
    let { authorization: authToken } = req.headers
    if (!authToken) throw new Error('User not logged in.')
    authToken = authToken?.split(' ')[1]

    const { text, title } = req.body;
    const userId = req.user.id;
    const date = new Date().toLocaleString();

    const newEntry = new Entry({ text, title, user: userId });
    const completionHandler = new CompletionHandler(authToken, newEntry);
    await completionHandler.createEntryMetadata();

    await newEntry.save({ session });
    // const newEntry = new Entry({ text, title, user: userId });
    // const completionHandler = new CompletionHandler(authToken)
    // const metadata = await completionHandler.createEntryMetadata(newEntry);
    
    // newEntry.set(metadata);
    // await newEntry.save({ session });
    
    // Upsert to Pinecone
    await upsert({ userId, entryId: newEntry.id, text, date });

    // Create Zep Session
    await SessionHandler.createSession(newEntry);

    await commitTransaction(session);
    res.status(201).json(newEntry);
  } catch (error) {
    // TODO: Need to delete Pinecone chunks here too
    await abortTransaction(session);
    console.error(error);
    res.status(500).json({ error: `Error creating journal entry: ${error}` });
  }
};

export const getEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const entries = await Entry.find({ user: userId });
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Error fetching journal entries' });
  }
};

export const getEntryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const entry = await Entry.findOne({ _id: req.params.id, user: userId });
    if (!entry) {
      res.status(404).json({ error: 'Journal entry not found' });
    } else {
      res.status(200).json(entry);
    }
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Error fetching journal entry' });
  }
};

// Update a journal entry by ID
export const updateEntry = async (req: Request, res: Response): Promise<void> => {
  const session = await startTransaction();

  try {
    const { title, text, tags } = req.body;
    const entry = await Entry.findByIdAndUpdate(
      req.params.id, 
      { title, text, tags, updatedAt: Date.now() }, 
      { new: true, session }
    );

    if (!entry) {
      await abortTransaction(session);
      res.status(404).json({ error: 'Journal entry not found' });
      return;
    }

    await commitTransaction(session);
    res.status(200).json(entry);
  } catch (error) {
    await abortTransaction(session);
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Error updating journal entry' });
  }
};

const deleteEntryById = async (entryId: string, userId: string, session: any): Promise<void> => {
  try {
    // Delete Mongoose Record
    const entry = await Entry.findByIdAndDelete(entryId, { session });
    if (!entry) {
      throw new Error('Journal entry not found');
    }
    
    // Delete Zep Sessions
    await SessionHandler.deleteSession(entryId);

    // Delete Pinecone Records
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.index(process.env.PINECONE_INDEX!);
    
    const results = await index.namespace(userId).listPaginated({ prefix: `${entryId}#` });
    const vectorIds = results.vectors?.map((vector) => vector.id).filter((v): v is string => v !== undefined);

    if (vectorIds && vectorIds.length > 0) {
      await index.namespace(userId).deleteMany(vectorIds);
    }
  } catch (error: any) {
    throw new Error(`Error deleting entry ${entryId}: ${error.message}`);
  }
};


export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
  const session = await startTransaction();

  try {
    await deleteEntryById(req.params.id, req.user.id, session);
    await commitTransaction(session);
    res.status(200).json({ message: 'Journal entry and associated vectors deleted' });
  } catch (error) {
    await abortTransaction(session);
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Error deleting journal entry' });
  }
};


export const deleteAllEntries = async (req: Request, res: Response): Promise<void> => {
  const session = await startTransaction();

  try {
    const userId = req.user._id;
    // Find all entries for the user
    const entries = await Entry.find({ user: userId }, null, { session });
    if (!entries || entries.length === 0) {
      await abortTransaction(session);
      res.status(404).json({ error: 'No journal entries found' });
      return;
    }

    for (const entry of entries) {
      // Call the helper function for each entry
      await deleteEntryById(entry._id.toString(), userId.toString(), session);
    }

    await commitTransaction(session);
    res.status(200).json({ message: 'All journal entries and associated vectors deleted' });
  } catch (error) {
    await abortTransaction(session);
    console.error('Error deleting all journal entries:', error);
    res.status(500).json({ error: 'Error deleting all journal entries' });
  }
};

export const deleteUserAndEntries = async (req: Request, res: Response): Promise<void> => {
  const session = await startTransaction();

  try {
    const { id: userId } = req.params;

    // Find all entries for the user
    const entries = await Entry.find({ user: userId }, null, { session });
    
    // Delete all entries
    for (const entry of entries) {
      await deleteEntryById(entry._id.toString(), userId, session);
    }

    // Delete Zep User
    if (!userId) throw new Error('User not found.')
    await SessionHandler.deleteUser(userId);
    // Delete the user
    await User.findByIdAndDelete(userId, { session });

    // Commit the transaction
    await commitTransaction(session);
    res.status(200).json({ message: 'User and all associated entries deleted successfully.' });
  } catch (error) {
    await abortTransaction(session);
    console.error('Error deleting user and associated entries:', error);
    res.status(500).json({ error: 'Error deleting user and associated entries.' });
  }
};


