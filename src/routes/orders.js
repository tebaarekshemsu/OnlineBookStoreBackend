import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/',auth, createOrder);
router.get('/', auth,getOrders);
router.put('/:id/status', auth,updateOrderStatus);

export default router;