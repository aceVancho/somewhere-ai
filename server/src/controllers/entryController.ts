// import { Request, Response } from 'express';
// import Entry from '../models/Entry';
// import { upsert } from '../api/upsert';
// import { createEntryMetadata } from '../api/completions';
// import { Pinecone } from '@pinecone-database/pinecone';

// export const createEntry = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { text, title } = req.body;
//     const userId = req.user.id;
//     const date = new Date().toLocaleString();

//     const newEntry = new Entry({ text, user: userId });
    
//     await upsert({ userId, entryId: newEntry._id.toString(), text, date });

//     const metadata = await createEntryMetadata(newEntry, { title });

//     newEntry.set(metadata);
//     await newEntry.save();

//     res.status(201).json(newEntry);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: `Error creating journal entry: ${error}` });
//   }
// };


// // Get all journal entries
// export const getEntries = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const entries = await Entry.find();
//     res.status(200).json(entries);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching journal entries' });
//   }
// };

// // Get a specific journal entry by ID
// export const getEntryById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const entry = await Entry.findById(req.params.id);
//     if (!entry) {
//       res.status(404).json({ error: 'Journal entry not found' });
//     } else {
//       res.status(200).json(entry);
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching journal entry' });
//   }
// };

// // Update a journal entry by ID
// export const updateEntry = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { title, text, tags } = req.body;
//     const entry = await Entry.findByIdAndUpdate(req.params.id, { title, text, tags, updatedAt: Date.now() }, { new: true });
//     if (!entry) {
//       res.status(404).json({ error: 'Journal entry not found' });
//     } else {
//       res.status(200).json(entry);
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating journal entry' });
//   }
// };

// export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Find and delete the entry from MongoDB
//     const entry = await Entry.findByIdAndDelete(req.params.id);

//     if (!entry) {
//       res.status(404).json({ error: 'Journal entry not found' });
//       return;
//     }

//     // Initialize Pinecone client
//     const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
//     const index = pc.index(process.env.PINECONE_INDEX!);

//     // List vectors with the given prefix (entryId)
//     const results = await index.namespace(entry.user.toString()).listPaginated({ prefix: `${req.params.id}#` });

//     // Get vector IDs
//     const vectorIds = results.vectors?.map((vector) => vector.id).filter((v): v is string => v !== undefined);

//     // Delete vectors if they exist
//     if (vectorIds && vectorIds.length > 0) {
//       const userId = entry.user.toString();
//       await index.namespace(userId).deleteMany(vectorIds);
//     }

//     res.status(200).json({ message: 'Journal entry and associated vectors deleted' });
//   } catch (error) {
//     console.error('Error deleting journal entry:', error);
//     res.status(500).json({ error: 'Error deleting journal entry' });
//   }
// };

import { Request, Response } from 'express';
import Entry from '../models/Entry';
import { upsert } from '../api/upsert';
import { createEntryMetadata } from '../api/completions';
import { Pinecone } from '@pinecone-database/pinecone';

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

// Create a new journal entry
export const createEntry = async (req: Request, res: Response): Promise<void> => {
  const session = await startTransaction();

  try {
    const { text, title } = req.body;
    const userId = req.user.id;
    const date = new Date().toLocaleString();

    const newEntry = new Entry({ text, user: userId });

    await upsert({ userId, entryId: newEntry.id, text, date });

    const metadata = await createEntryMetadata(newEntry, { title });

    newEntry.set(metadata);
    await newEntry.save({ session });

    await commitTransaction(session);
    res.status(201).json(newEntry);
  } catch (error) {
    await abortTransaction(session);
    console.error(error);
    res.status(500).json({ error: `Error creating journal entry: ${error}` });
  }
};

// Get all journal entries
export const getEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const entries = await Entry.find();
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Error fetching journal entries' });
  }
};

// Get a specific journal entry by ID
export const getEntryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await Entry.findById(req.params.id);
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

export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
  const session = await startTransaction();

  try {
    const entry = await Entry.findByIdAndDelete(req.params.id, { session });

    if (!entry) {
      await abortTransaction(session);
      res.status(404).json({ error: 'Journal entry not found' });
      return;
    }

    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.index(process.env.PINECONE_INDEX!);

    const results = await index.namespace(entry.user.toString()).listPaginated({ prefix: `${req.params.id}#` });
    const vectorIds = results.vectors?.map((vector) => vector.id).filter((v): v is string => v !== undefined);

    if (vectorIds && vectorIds.length > 0) {
      await index.namespace(entry.user.toString()).deleteMany(vectorIds);
    }

    await commitTransaction(session);
    res.status(200).json({ message: 'Journal entry and associated vectors deleted' });
  } catch (error) {
    await abortTransaction(session);
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Error deleting journal entry' });
  }
};
