import express from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  triageComplaint,
  getAdminAnalytics,
  getStudentStats,
  uploadEvidence,
} from '../controllers/complaintController.js';
import { protect, adminOnly, studentOnly } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.use(protect); // All complaint routes require valid authentication

router.get('/analytics/overview', adminOnly, getAdminAnalytics);
router.get('/student/stats', studentOnly, getStudentStats);

router.get('/', getComplaints);
router.post('/', studentOnly, createComplaint);
router.get('/:id', getComplaintById);
router.put('/:id/triage', adminOnly, triageComplaint);

// Evidence image upload — student only, own complaint, via Cloudinary
router.post('/:id/evidence', studentOnly, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'Image is too large. Maximum allowed size is 5 MB.',
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, uploadEvidence);

export default router;
