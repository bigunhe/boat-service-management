import express from "express";
import { 
  createAppointment, 
  deleteAppointment, 
  getAppointments, 
  getAppointmentById, 
  updateAppointment,
  getAvailableTimeSlots,
  updateAppointmentStatus,
  getCalendarData
} from "../controllers/appointmentBooking.controller.js";

const router = express.Router();

// Basic CRUD operations
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

// Special appointment operations
router.get("/available-slots/:date", getAvailableTimeSlots);
router.get("/calendar/:year/:month", getCalendarData);
router.patch("/:id/status", updateAppointmentStatus);

export default router;
