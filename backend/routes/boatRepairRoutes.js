import express from 'express';
import {
  createBoatRepair,
  getAllBoatRepairs,
  getBoatRepairById,
  getBoatRepairByBookingId,
  getMyBoatRepairs,
  updateBoatRepair,
  deleteBoatRepair,
  generatePDFConfirmation,
  getRepairStats
} from '../controllers/boatRepairController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Customer routes
router.route('/')
  .post(createBoatRepair) // Create new repair request
  .get(getAllBoatRepairs); // Get all repairs (Employee/Admin only)

// Customer specific routes
router.route('/my-repairs')
  .get(getMyBoatRepairs); // Get customer's own repairs

// Statistics route (Employee/Admin only)
router.route('/stats')
  .get(getRepairStats);

// Individual repair routes
router.route('/:id')
  .get(getBoatRepairById) // Get single repair by ID
  .put(updateBoatRepair) // Update repair (Employee/Admin only)
  .delete(deleteBoatRepair); // Delete repair (Admin only)

// Booking ID route
router.route('/booking/:bookingId')
  .get(getBoatRepairByBookingId); // Get repair by booking ID

// PDF generation route
router.route('/:id/pdf')
  .get(generatePDFConfirmation); // Generate PDF confirmation

export default router;
