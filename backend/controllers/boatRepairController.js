import BoatRepair from '../models/boatRepairModel.js';
import User from '../models/userModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Helper function to check permissions
const checkPermission = (user, requiredRole) => {
  if (!user || user.role !== requiredRole) {
    throw new Error('Not authorized to perform this action');
  }
};

// @desc    Create new boat repair request
// @route   POST /api/boat-repairs
// @access  Private (Customer)
export const createBoatRepair = async (req, res, next) => {
  try {
    checkPermission(req.user, 'customer');

    const {
      serviceType,
      problemDescription,
      serviceDescription,
      boatDetails,
      photos,
      scheduledDateTime,
      calendlyEventId,
      calendlyEventUri,
      serviceLocation,
      customerNotes
    } = req.body;

    // Create the repair request
    const boatRepair = await BoatRepair.create({
      customer: req.user.id,
      serviceType,
      problemDescription,
      serviceDescription,
      boatDetails,
      photos: photos || [],
      scheduledDateTime: new Date(scheduledDateTime),
      calendlyEventId,
      calendlyEventUri,
      serviceLocation,
      customerNotes,
      status: 'pending'
    });

    // Populate customer info for response
    const populatedRepair = await BoatRepair.findById(boatRepair._id)
      .populate('customer', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Boat repair request created successfully',
      data: populatedRepair,
      bookingId: boatRepair.bookingId
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all boat repairs (for employees/admins)
// @route   GET /api/boat-repairs
// @access  Private (Employee/Admin)
export const getAllBoatRepairs = async (req, res, next) => {
  try {
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
      throw new Error('Not authorized to view all boat repairs');
    }

    const repairs = await BoatRepair.find({})
      .populate('customer', 'name phone email')
      .populate('assignedTechnician', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: repairs.length,
      data: repairs
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single boat repair by ID
// @route   GET /api/boat-repairs/:id
// @access  Private (Customer/Employee/Admin)
export const getBoatRepairById = async (req, res, next) => {
  try {
    const repair = await BoatRepair.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('assignedTechnician', 'name email')
      .populate('assignedBy', 'name email');

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Boat repair request not found'
      });
    }

    // Check if user has access to this repair
    if (
      repair.customer._id.toString() !== req.user.id &&
      (repair.assignedTechnician && repair.assignedTechnician._id.toString() !== req.user.id) &&
      req.user.role !== 'admin'
    ) {
      throw new Error('Not authorized to view this repair request');
    }

    res.status(200).json({
      success: true,
      data: repair
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get boat repair by booking ID
// @route   GET /api/boat-repairs/booking/:bookingId
// @access  Private (Customer/Employee/Admin)
export const getBoatRepairByBookingId = async (req, res, next) => {
  try {
    const repair = await BoatRepair.findOne({ bookingId: req.params.bookingId })
      .populate('customer', 'name phone email')
      .populate('assignedTechnician', 'name email')
      .populate('assignedBy', 'name email');

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Boat repair request not found'
      });
    }

    // Check if user has access to this repair
    if (
      repair.customer._id.toString() !== req.user.id &&
      (repair.assignedTechnician && repair.assignedTechnician._id.toString() !== req.user.id) &&
      req.user.role !== 'admin'
    ) {
      throw new Error('Not authorized to view this repair request');
    }

    res.status(200).json({
      success: true,
      data: repair
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's boat repairs
// @route   GET /api/boat-repairs/my-repairs
// @access  Private (Customer)
export const getMyBoatRepairs = async (req, res, next) => {
  try {
    checkPermission(req.user, 'customer');

    const repairs = await BoatRepair.find({ customer: req.user.id })
      .populate('assignedTechnician', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: repairs.length,
      data: repairs
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update boat repair (for employees/admins)
// @route   PUT /api/boat-repairs/:id
// @access  Private (Employee/Admin)
export const updateBoatRepair = async (req, res, next) => {
  try {
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
      throw new Error('Not authorized to update boat repairs');
    }

    const {
      status,
      assignedTechnician,
      estimatedCost,
      finalCost,
      internalNotes,
      priority,
      workPerformed,
      partsUsed,
      laborHours,
      laborRate
    } = req.body;

    const repair = await BoatRepair.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Boat repair request not found'
      });
    }

    // Update fields
    if (status && status !== repair.status) {
      repair.status = status;
    }

    if (assignedTechnician) {
      const technician = await User.findById(assignedTechnician);
      if (!technician || technician.role !== 'employee') {
        return res.status(400).json({
          success: false,
          message: 'Assigned technician must be an employee'
        });
      }
      repair.assignedTechnician = assignedTechnician;
      repair.assignedBy = req.user.id;
      repair.assignedAt = new Date();
    }

    if (estimatedCost !== undefined) repair.estimatedCost = estimatedCost;
    if (finalCost !== undefined) repair.finalCost = finalCost;
    if (internalNotes !== undefined) repair.internalNotes = internalNotes;
    if (priority !== undefined) repair.priority = priority;
    if (workPerformed !== undefined) repair.workPerformed = workPerformed;
    if (partsUsed !== undefined) repair.partsUsed = partsUsed;
    if (laborHours !== undefined) repair.laborHours = laborHours;
    if (laborRate !== undefined) repair.laborRate = laborRate;

    await repair.save();

    // Populate and return updated repair
    const updatedRepair = await BoatRepair.findById(repair._id)
      .populate('customer', 'name phone email')
      .populate('assignedTechnician', 'name email')
      .populate('assignedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Boat repair updated successfully',
      data: updatedRepair
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete boat repair
// @route   DELETE /api/boat-repairs/:id
// @access  Private (Admin)
export const deleteBoatRepair = async (req, res, next) => {
  try {
    checkPermission(req.user, 'admin');

    const repair = await BoatRepair.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Boat repair request not found'
      });
    }

    await repair.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Boat repair request deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Generate PDF confirmation
// @route   GET /api/boat-repairs/:id/pdf
// @access  Private (Customer/Employee/Admin)
export const generatePDFConfirmation = async (req, res, next) => {
  try {
    const repair = await BoatRepair.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('assignedTechnician', 'name email');

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Boat repair request not found'
      });
    }

    // Check if user has access to this repair
    if (
      repair.customer._id.toString() !== req.user.id &&
      (repair.assignedTechnician && repair.assignedTechnician._id.toString() !== req.user.id) &&
      req.user.role !== 'admin'
    ) {
      throw new Error('Not authorized to view this repair request');
    }

    // Create PDF
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="repair-confirmation-${repair.bookingId}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // PDF Content
    doc.fontSize(20).text('Boat Repair Service Confirmation', 50, 50);
    
    // Customer Information
    doc.fontSize(14).text('Customer Information:', 50, 100);
    doc.fontSize(12).text(`Name: ${repair.customer.name}`, 50, 120);
    doc.fontSize(12).text(`Phone: ${repair.customer.phone}`, 50, 140);
    doc.fontSize(12).text(`Email: ${repair.customer.email}`, 50, 160);

    // Boat Information
    doc.fontSize(14).text('Boat Information:', 50, 200);
    doc.fontSize(12).text(`Type: ${repair.boatDetails.boatType.replace('_', ' ').toUpperCase()}`, 50, 220);
    doc.fontSize(12).text(`Make: ${repair.boatDetails.boatMake}`, 50, 240);
    doc.fontSize(12).text(`Model: ${repair.boatDetails.boatModel}`, 50, 260);
    doc.fontSize(12).text(`Year: ${repair.boatDetails.boatYear}`, 50, 280);
    
    if (repair.boatDetails.engineType) {
      doc.fontSize(12).text(`Engine Type: ${repair.boatDetails.engineType.replace('_', ' ').toUpperCase()}`, 50, 300);
    }
    
    if (repair.boatDetails.engineModel) {
      doc.fontSize(12).text(`Engine Model: ${repair.boatDetails.engineModel}`, 50, 320);
    }

    // Service Information
    doc.fontSize(14).text('Service Information:', 50, 360);
    doc.fontSize(12).text(`Service Type: ${repair.serviceType.replace('_', ' ').toUpperCase()}`, 50, 380);
    doc.fontSize(12).text(`Problem Description:`, 50, 400);
    doc.fontSize(10).text(repair.problemDescription, 50, 420, { width: 500 });
    
    if (repair.serviceDescription) {
      doc.fontSize(12).text(`Service Requirements:`, 50, 480);
      doc.fontSize(10).text(repair.serviceDescription, 50, 500, { width: 500 });
    }

    // Appointment Details
    doc.fontSize(14).text('Appointment Details:', 50, 560);
    doc.fontSize(12).text(`Scheduled Date: ${repair.scheduledDateTime.toLocaleDateString()}`, 50, 580);
    doc.fontSize(12).text(`Scheduled Time: ${repair.scheduledDateTime.toLocaleTimeString()}`, 50, 600);
    doc.fontSize(12).text(`Booking ID: ${repair.bookingId}`, 50, 620);
    doc.fontSize(12).text(`Status: ${repair.status.toUpperCase()}`, 50, 640);

    // Files Information
    if (repair.photos && repair.photos.length > 0) {
      doc.fontSize(14).text('Files Uploaded:', 50, 680);
      doc.fontSize(12).text(`${repair.photos.length} file(s) uploaded`, 50, 700);
    }

    // Footer
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 750);
    doc.fontSize(10).text('Boat Service Management System', 50, 770);

    // Finalize PDF
    doc.end();

  } catch (error) {
    next(error);
  }
};

// @desc    Get repair statistics (for dashboard)
// @route   GET /api/boat-repairs/stats
// @access  Private (Employee/Admin)
export const getRepairStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
      throw new Error('Not authorized to view repair statistics');
    }

    const stats = await BoatRepair.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRepairs = await BoatRepair.countDocuments();
    const pendingRepairs = await BoatRepair.countDocuments({ status: 'pending' });
    const completedRepairs = await BoatRepair.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      data: {
        total: totalRepairs,
        pending: pendingRepairs,
        completed: completedRepairs,
        byStatus: stats
      }
    });

  } catch (error) {
    next(error);
  }
};
