import express from 'express';
import {
  getUserRegistrationTrends,
  getUserDistribution,
  getGeographicDistribution,
  getServiceRequestsByType,
  getMonthlyServiceVolume,
  getRevenueTrends,
  getRepairStatusBreakdown,
  getTechnicianPerformance
} from '../controllers/analyticsController.js';
import { getAnalyticsDashboard, getRealtimeAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// Analytics dashboard routes
router.get('/dashboard', getAnalyticsDashboard);
router.get('/realtime', getRealtimeAnalytics);

// User analytics
router.get('/users/registration-trends', getUserRegistrationTrends);
router.get('/users/distribution', getUserDistribution);
router.get('/users/geographic', getGeographicDistribution);

// Service analytics
router.get('/services/by-type', getServiceRequestsByType);
router.get('/services/monthly-volume', getMonthlyServiceVolume);
router.get('/services/revenue-trends', getRevenueTrends);
router.get('/services/status-breakdown', getRepairStatusBreakdown);
router.get('/services/technician-performance', getTechnicianPerformance);

export default router;
