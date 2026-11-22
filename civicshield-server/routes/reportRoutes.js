import express from 'express';
import { getReports, createReport, getStats, updateReportStatus } from '../controllers/reportController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/stats', getStats);
router.route('/')
  .get(getReports)
  .post(upload.single('image'), createReport);

router.patch('/:id', updateReportStatus);

export default router;