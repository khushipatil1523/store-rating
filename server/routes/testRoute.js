import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'You accessed a protected route!',
    user: req.user,
  });
});

export default router;
