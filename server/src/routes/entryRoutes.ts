import { Router } from 'express';
import { createEntry, getEntries, getEntryById, updateEntry, deleteEntry } from '../controllers/entryController';

const router = Router();

router.post('/entries', createEntry);
router.get('/entries', getEntries);
router.get('/entries/:id', getEntryById);
router.put('/entries/:id', updateEntry);
router.delete('/entries/:id', deleteEntry);

export default router;
