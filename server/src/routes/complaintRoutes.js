import express from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  triageComplaint,
  getAdminAnalytics,
  getStudentStats,
} from '../controllers/complaintController.js';
import { protect, adminOnly, studentOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All complaint routes require valid authentication

router.get('/analytics/overview', adminOnly, getAdminAnalytics);
router.get('/student/stats', studentOnly, getStudentStats);

router.get('/', getComplaints);
router.post('/', studentOnly, createComplaint);
router.get('/:id', getComplaintById);
router.put('/:id/triage', adminOnly, triageComplaint);

export default router;
