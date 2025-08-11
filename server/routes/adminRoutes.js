import express from 'express';
import { 
  createStoreByAdmin, 
  createUserByAdmin, 
  getAllStores, 
  getAllUsers, 
  getDashboardStats, 
  getStoreOwners
} from '../controllers/adminController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';

const router = express.Router();

// Apply token and admin verification to all routes
router.use(verifyToken, verifyAdmin);

// Routes
router.post('/create-user', createUserByAdmin);
router.post('/create-store', createStoreByAdmin);
router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/stores', getAllStores);
router.get('/store-owners', getStoreOwners);


export default router;