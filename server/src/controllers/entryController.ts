import { Request, Response } from 'express';
import Entry from '../models/Entry';
import { upsert } from '../api/upsert';
import { createEntryMetadata } from '../api/completions';

export const createEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, title } = req.body;
    const userId = req.user.id;
    const date = new Date().toLocaleString();

    const newEntry = new Entry({ text, user: userId });
    await newEntry.save();
    
    await upsert({ userId, entryId: newEntry._id.toString(), text, date });

    const metadata = await createEntryMetadata(newEntry, { title });

    newEntry.set(metadata);
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
