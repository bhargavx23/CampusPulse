import express from 'express';
import { getAllStudents } from '../controllers/studentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/', getAllStudents);

export default router;
