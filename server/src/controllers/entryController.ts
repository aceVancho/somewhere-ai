import { Request, Response } from 'express';
import Entry from '../models/Entrys';
import { v4 as uuidv4 } from 'uuid';
import { upsert } from '../api/upsert';
import { createEntryMetadata } from '../api/openAi';

// Create a new journal entry
export const createEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const userId = req.user.id;
    const date = new Date().toLocaleString();

    // Create the new entry with just the text and userId
    const newEntry = new Entry({ text, user: userId });
    await newEntry.save();
    
    // Upsert chunks into Pinecone using the new entry's ID
    await upsert({ userId, entryId: newEntry._id.toString(), text, date });

    // Call OpenAI API to get the title, tags, and analysis
    const { title, tags, analysis } = await createEntryMetadata(newEntry);

    // Update the entry with the completion response
    newEntry.set({ title, tags, analysis });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
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
    res.status(500).json({ error: 'Error fetching journal entry' });
  }
};

// Update a journal entry by ID
export const updateEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, text, tags } = req.body;
    const entry = await Entry.findByIdAndUpdate(req.params.id, { title, text, tags, updatedAt: Date.now() }, { new: true });
    if (!entry) {
      res.status(404).json({ error: 'Journal entry not found' });
    } else {
      res.status(200).json(entry);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating journal entry' });
  }
};

// Delete a journal entry by ID
export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) {
      res.status(404).json({ error: 'Journal entry not found' });
    } else {
      res.status(200).json({ message: 'Journal entry deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting journal entry' });
  }
};
