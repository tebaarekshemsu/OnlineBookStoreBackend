import express from 'express';
import { getAllBooks, getBookById, getTopRatedBooks } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/top-rated', getTopRatedBooks);
router.get('/:id', getBookById);

export default router;