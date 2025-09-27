import express from 'express';
import {
  createBoatRepair,
  getAllBoatRepairs,
  getBoatRepairById,
  getBoatRepairByBookingId,
  getMyBoatRepairs,
  updateBoatRepair,
  updateRepairByCustomer,
  cancelRepairByCustomer,
  deleteRepairByCustomer,
  deleteBoatRepair,
  generatePDFConfirmation,
  getRepairStats,
  getAllRepairsForEmployee,
  getTechnicians,
  assignTechnician,
  markBoatReceived,
  updateRepairStatus
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

// Customer edit routes
router.route('/:id/customer-edit')
  .put(updateRepairByCustomer); // Update repair (Customer - owner only)

router.route('/:id/cancel')
  .patch(cancelRepairByCustomer); // Cancel repair (Customer - owner only)

router.route('/:id/customer-delete')
  .delete(deleteRepairByCustomer); // Delete repair (Customer - owner only)

// Booking ID route
router.route('/booking/:bookingId')
  .get(getBoatRepairByBookingId); // Get repair by booking ID

// PDF generation route
router.route('/:id/pdf')
  .get(generatePDFConfirmation); // Generate PDF confirmation

// ==================== EMPLOYEE ROUTES ====================

// Employee repair management routes
router.route('/employee/all')
  .get(authMiddleware, getAllRepairsForEmployee); // Get all repairs for employee management

// Technician routes
router.route('/technicians')
  .get(authMiddleware, getTechnicians); // Get technicians list

// Repair management routes
router.route('/:id/assign-technician')
  .put(authMiddleware, assignTechnician); // Assign technician to repair

router.route('/:id/mark-received')
  .put(authMiddleware, markBoatReceived); // Mark boat as received

router.route('/:id/update-status')
  .put(authMiddleware, updateRepairStatus); // Update repair status

export default router;
