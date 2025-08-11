import express from 'express';
import {
  getMyStore,
  getStoreOwnerDashboard,
  createStore,
} from '../controllers/storeOwnerController.js';
import verifyToken from '../middlewares/verifyToken.js';
import isStoreOwner from '../middlewares/isStoreOwner.js';

const router = express.Router();

router.get('/dashboard', verifyToken, isStoreOwner, getStoreOwnerDashboard);

router.get('/my-store', verifyToken, isStoreOwner, getMyStore);
router.post('/create-store', verifyToken, isStoreOwner, createStore); 


export default router;
