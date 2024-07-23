import express from 'express';
import { register, update, deleteUser, changePassword, signin, verify, requestPasswordReset } from '../controllers/userController';
import { authMiddleware } from '../middleware/middleware';

const router = express.Router();

router.post('/register', register);
router.put('/update/:id', update);
router.delete('/:id', deleteUser);
router.post('/changePassword', changePassword);
router.post('/signin', signin);
router.get('/verify', authMiddleware, verify);
router.post('/requestPasswordReset/:id', authMiddleware, requestPasswordReset);

export default router;
