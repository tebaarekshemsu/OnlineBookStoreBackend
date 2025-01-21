import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/',auth, addToCart);
router.get('/',auth, getCart);
router.put('/:id',auth, updateCartItem);
router.delete('/:id',auth, removeFromCart);
router.delete('/', auth,clearCart);

export default router;