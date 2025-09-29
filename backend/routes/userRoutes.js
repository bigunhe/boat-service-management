import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { registerUser, loginUser, updateProfile, updatePassword, getUserProfile, getAllUsers, getAllUsersDebug, deleteUser, updateUser, searchUsers, getUserById, getDashboardStats } from '../controllers/userController.js';
import { getUserRegistrationTrends, getUserDistribution, getGeographicDistribution, getServiceRequestsByType, getMonthlyServiceVolume, getRevenueTrends } from '../controllers/analyticsController.js';

const router = express.Router();


// GET requests

// Specific routes FIRST (before parameterized routes)
router.get('/profile', authMiddleware, getUserProfile);
router.get('/all', authMiddleware, getAllUsers);
router.get('/search', authMiddleware, searchUsers);
router.get('/stats', authMiddleware, getDashboardStats);

// Analytics routes
router.get('/analytics/registration-trends', authMiddleware, getUserRegistrationTrends);
router.get('/analytics/user-distribution', authMiddleware, getUserDistribution);
router.get('/analytics/geographic-distribution', authMiddleware, getGeographicDistribution);
router.get('/analytics/service-requests-by-type', authMiddleware, getServiceRequestsByType);
router.get('/analytics/monthly-service-volume', authMiddleware, getMonthlyServiceVolume);
router.get('/analytics/revenue-trends', authMiddleware, getRevenueTrends);

// Debug route - no auth required
router.get('/debug/all', getAllUsersDebug);


// Parameterized route LAST (catches everything else)
router.get('/:id', authMiddleware, getUserById);


// POST requests


router.post('/auth/register', registerUser);

router.post('/auth/login',  loginUser);


// use middleware for protected routes (update profile and update password)


router.post('/profile/update', authMiddleware, updateProfile);

router.post('/profile/update-password', authMiddleware, updatePassword);

// PUT requests
router.put('/:id', authMiddleware, updateUser);

// DELETE requests


router.delete('/:id', authMiddleware, deleteUser);








export default router;