import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import isUser from '../middlewares/isUser.js';
import { submitRating } from '../controllers/userController.js';
import { getAllStoresForUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/stores', verifyToken, isUser, getAllStoresForUser);
router.post('/submit-rating', verifyToken, isUser, submitRating);
export default router;
