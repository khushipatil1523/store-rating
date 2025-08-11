import express from 'express';
import { changePassword, login, signup } from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.put('/change-password', verifyToken, changePassword);
export default router;
