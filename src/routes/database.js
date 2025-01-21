import express from 'express';
import { createTables, populateDatabase } from '../controllers/databaseController.js';

const router = express.Router();

router.post('/create-tables', createTables);
router.post('/populate-database', populateDatabase);

export default router;