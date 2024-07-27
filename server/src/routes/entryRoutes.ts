import { Router } from 'express';
import { createEntry, getEntries, getEntryById, updateEntry, deleteEntry, deleteAllEntries } from '../controllers/entryController';
import { authMiddleware } from '../middleware/middleware';

const router = Router();

router.post('/create',authMiddleware, createEntry);
router.get('/',authMiddleware, getEntries);
router.get('/:id',authMiddleware, getEntryById);
router.put('/:id',authMiddleware, updateEntry);
router.delete('/:id', authMiddleware, deleteEntry);
router.delete('/deleteAllEntries/:id', authMiddleware, deleteAllEntries);

export default router;
