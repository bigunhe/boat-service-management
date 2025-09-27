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

    // Create PDF with proper margins and layout
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="repair-confirmation-${repair.bookingId}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Helper function to add section with proper spacing
    const addSection = (title, y) => {
      doc.fontSize(16).fillColor('#0d9488').text(title, 50, y);
      doc.moveDown(0.5);
      return y + 30;
    };

    // Helper function to add field with label and value
    const addField = (label, value, y, color = '#374151') => {
      doc.fontSize(11).fillColor('#6b7280').text(label + ':', 50, y);
      doc.fontSize(11).fillColor(color).text(value || 'N/A', 200, y);
      return y + 20;
    };

    // Helper function to add multiline text
    const addMultilineText = (label, text, y, maxWidth = 450) => {
      doc.fontSize(11).fillColor('#6b7280').text(label + ':', 50, y);
      const textHeight = doc.heightOfString(text, { width: maxWidth });
      doc.fontSize(10).fillColor('#374151').text(text, 50, y + 15, { width: maxWidth });
      return y + textHeight + 25;
    };

    let currentY = 50;

    // Company Header - Compact
    doc.rect(50, currentY, 500, 50).fillColor('#f0fdfa').fill();
    doc.rect(50, currentY, 500, 50).strokeColor('#0d9488').lineWidth(1).stroke();
    
    // Logo placeholder (smaller)
    doc.rect(60, currentY + 8, 35, 35).fillColor('#0d9488').fill();
    doc.fontSize(6).fillColor('white').text('LOGO', 65, currentY + 20, { width: 25, align: 'center' });
    
    // Company details - compact
    doc.fontSize(16).fillColor('#0d9488').text('Boat Service Management', 110, currentY + 8);
    doc.fontSize(9).fillColor('#374151').text('Professional Marine Services', 110, currentY + 25);
    doc.fontSize(8).fillColor('#6b7280').text('Email: info@boatservice.lk | Phone: +94 11 234 5678', 110, currentY + 35);
    
    currentY += 70;

    // Document Title
    doc.fontSize(24).fillColor('#0d9488').text('Repair Service Confirmation', 50, currentY, { align: 'center' });
    currentY += 40;

    // Booking ID and Status (highlighted)
    doc.rect(50, currentY, 500, 30).fillColor('#fef3c7').fill();
    doc.fontSize(14).fillColor('#92400e').text(`Booking ID: ${repair.bookingId}`, 60, currentY + 8);
    doc.fontSize(12).fillColor('#92400e').text(`Status: ${repair.status.toUpperCase()}`, 350, currentY + 10);
    currentY += 50;

    // Customer Information Section
    currentY = addSection('Customer Information', currentY);
    currentY = addField('Full Name', repair.customer.name, currentY);
    currentY = addField('Phone Number', repair.customer.phone, currentY);
    currentY = addField('Email Address', repair.customer.email, currentY);
    currentY += 20;

    // Boat Information Section
    currentY = addSection('Boat Information', currentY);
    currentY = addField('Boat Type', repair.boatDetails.boatType.replace('_', ' ').toUpperCase(), currentY);
    currentY = addField('Make', repair.boatDetails.boatMake, currentY);
    currentY = addField('Model', repair.boatDetails.boatModel, currentY);
    currentY = addField('Year', repair.boatDetails.boatYear.toString(), currentY);
    
    if (repair.boatDetails.engineType) {
      currentY = addField('Engine Type', repair.boatDetails.engineType.replace('_', ' ').toUpperCase(), currentY);
    }
    
    if (repair.boatDetails.engineModel) {
      currentY = addField('Engine Model', repair.boatDetails.engineModel, currentY);
    }
    
    if (repair.boatDetails.hullMaterial) {
      currentY = addField('Hull Material', repair.boatDetails.hullMaterial.replace('_', ' ').toUpperCase(), currentY);
    }
    currentY += 20;

    // Service Information Section
    currentY = addSection('Service Information', currentY);
    currentY = addField('Service Type', repair.serviceType.replace('_', ' ').toUpperCase(), currentY);
    
    // Problem Description (multiline)
    currentY = addMultilineText('Problem Description', repair.problemDescription, currentY);
    
    // Service Description (if exists)
    if (repair.serviceDescription) {
      currentY = addMultilineText('Service Requirements', repair.serviceDescription, currentY);
    }
    currentY += 20;

    // Appointment Details Section
    currentY = addSection('Appointment Details', currentY);
    currentY = addField('Scheduled Date', repair.scheduledDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), currentY);
    currentY = addField('Scheduled Time', repair.scheduledDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }), currentY);
    
    if (repair.calendlyEventId) {
      currentY = addField('Calendly Event ID', repair.calendlyEventId, currentY);
    }
    
    // Service Location
    if (repair.serviceLocation) {
      if (repair.serviceLocation.type === 'customer_location' && repair.serviceLocation.address) {
        const address = repair.serviceLocation.address;
        const fullAddress = `${address.street || ''}, ${address.city || ''}, ${address.district || ''} ${address.postalCode || ''}`.trim();
        currentY = addField('Service Location', 'Customer Location', currentY);
        if (fullAddress) {
          currentY = addField('Address', fullAddress, currentY);
        }
      } else if (repair.serviceLocation.type === 'marina' && repair.serviceLocation.marinaName) {
        currentY = addField('Service Location', 'Marina', currentY);
        currentY = addField('Marina Name', repair.serviceLocation.marinaName, currentY);
        if (repair.serviceLocation.dockNumber) {
          currentY = addField('Dock Number', repair.serviceLocation.dockNumber, currentY);
        }
      } else if (repair.serviceLocation.type === 'service_center') {
        currentY = addField('Service Location', 'Our Service Center - Colombo Marina', currentY);
      }
    }
    currentY += 20;

    // Files Information Section
    if (repair.photos && repair.photos.length > 0) {
      currentY = addSection('Files Uploaded', currentY);
      currentY = addField('Number of Files', `${repair.photos.length} file(s)`, currentY);
      
      // List file names
      repair.photos.forEach((photo, index) => {
        currentY = addField(`File ${index + 1}`, photo.originalName, currentY);
      });
      currentY += 20;
    }

    // Additional Notes Section
    if (repair.customerNotes) {
      currentY = addSection('Additional Notes', currentY);
      currentY = addMultilineText('Customer Notes', repair.customerNotes, currentY);
      currentY += 20;
    }

    // Assigned Technician (if any)
    if (repair.assignedTechnician) {
      currentY = addSection('Assigned Technician', currentY);
      currentY = addField('Technician Name', repair.assignedTechnician.name, currentY);
      currentY = addField('Contact Email', repair.assignedTechnician.email, currentY);
      currentY += 20;
    }

    // Footer - dynamic positioning to avoid overlap
    const footerY = Math.max(currentY + 40, 750);
    doc.rect(50, footerY, 500, 30).fillColor('#f9fafb').fill();
    doc.fontSize(9).fillColor('#6b7280').text(`Generated on: ${new Date().toLocaleString('en-US')}`, 60, footerY + 10);
    doc.fontSize(9).fillColor('#6b7280').text('Boat Service Management System - Professional Marine Services', 60, footerY + 20);

    // Finalize PDF
    doc.end();

  } catch (error) {
    next(error);
  }
};

// @desc    Update repair request (customer edit)
// @route   PUT /api/boat-repairs/:id/customer-edit
// @access  Private (Customer - owner only)
export const updateRepairByCustomer = async (req, res, next) => {
  try {
    const repair = await BoatRepair.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair request not found'
      });
    }

    // Check if user is the owner
    if (repair.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this repair request'
      });
    }

    // Check if repair can be edited (until appointment date)
    if (repair.scheduledDateTime) {
      const appointmentDate = new Date(repair.scheduledDateTime);
      const today = new Date();
      
      if (appointmentDate <= today) {
        return res.status(400).json({
          success: false,
          message: 'Cannot edit repair request. Appointment date has passed.'
        });
      }
    }

    // Check if repair is already cancelled
    if (repair.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit cancelled repair request.'
      });
    }

    const {
      serviceType,
      problemDescription,
      serviceDescription,
      boatDetails,
      photos,
      serviceLocation,
      customerNotes
    } = req.body;

    // Update allowed fields
    if (serviceType) repair.serviceType = serviceType;
    if (problemDescription) repair.problemDescription = problemDescription;
    if (serviceDescription) repair.serviceDescription = serviceDescription;
    if (boatDetails) repair.boatDetails = { ...repair.boatDetails, ...boatDetails };
    if (photos) repair.photos = photos;
    if (serviceLocation) repair.serviceLocation = { ...repair.serviceLocation, ...serviceLocation };
    if (customerNotes !== undefined) repair.customerNotes = customerNotes;

    // Note: Status update logging removed as statusUpdates field doesn't exist in model

    await repair.save();

    // Populate and return updated repair
    const updatedRepair = await BoatRepair.findById(repair._id)
      .populate('customer', 'name phone email')
      .populate('assignedTechnician', 'name email');

    res.status(200).json({
      success: true,
      message: 'Repair request updated successfully',
      data: updatedRepair
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Cancel repair request (customer)
// @route   PATCH /api/boat-repairs/:id/cancel
// @access  Private (Customer - owner only)
export const cancelRepairByCustomer = async (req, res, next) => {
  try {
    const repair = await BoatRepair.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair request not found'
      });
    }

    // Check if user is the owner
    if (repair.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this repair request'
      });
    }

    // Check if repair can be cancelled
    if (['completed', 'cancelled'].includes(repair.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel repair request. Service is already completed or cancelled.'
      });
    }

    // Check if cancellation is allowed (max 3 days before appointment)
    if (repair.scheduledDateTime) {
      const appointmentDate = new Date(repair.scheduledDateTime);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
      
      if (appointmentDate <= threeDaysFromNow) {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel repair request. Cancellation must be made at least 3 days before the appointment.'
        });
      }
    }

    // Cancel Calendly appointment if exists
    if (repair.calendlyEventId) {
      try {
        // TODO: Implement Calendly cancellation API call
        // For now, we'll just log it
        console.log(`Would cancel Calendly event: ${repair.calendlyEventId}`);
        // const calendlyResponse = await cancelCalendlyEvent(repair.calendlyEventId);
      } catch (calendlyError) {
        console.error('Error cancelling Calendly appointment:', calendlyError);
        // Continue with cancellation even if Calendly fails
      }
    }

    // Update status to cancelled
    repair.status = 'cancelled';
    repair.statusUpdates.push({
      status: 'cancelled',
      updatedBy: req.user.id,
      updatedAt: new Date(),
      notes: 'Repair request cancelled by customer'
    });

    await repair.save();

    res.status(200).json({
      success: true,
      message: 'Repair request cancelled successfully',
      data: repair
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete repair request (customer)
// @route   DELETE /api/boat-repairs/:id/customer-delete
// @access  Private (Customer - owner only)
export const deleteRepairByCustomer = async (req, res, next) => {
  try {
    const repair = await BoatRepair.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair request not found'
      });
    }

    // Check if user is the owner
    if (repair.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this repair request'
      });
    }

    // Check if repair can be deleted (max 3 days before appointment)
    if (repair.scheduledDateTime) {
      const appointmentDate = new Date(repair.scheduledDateTime);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
      
      if (appointmentDate <= threeDaysFromNow) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete repair request. Deletion must be made at least 3 days before the appointment.'
        });
      }
    }
    // If no scheduled date, allow deletion

    // Cancel Calendly appointment if exists
    if (repair.calendlyEventId) {
      try {
        // TODO: Implement Calendly cancellation API call
        console.log(`Would cancel Calendly event: ${repair.calendlyEventId}`);
      } catch (calendlyError) {
        console.error('Error cancelling Calendly appointment:', calendlyError);
      }
    }

    // Delete the repair request
    await BoatRepair.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Repair request deleted successfully'
    });

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

// ==================== EMPLOYEE ENDPOINTS ====================

// @desc    Get all repair requests for employee management
// @route   GET /api/boat-repairs/employee/all
// @access  Private (Employee/Admin)
export const getAllRepairsForEmployee = async (req, res, next) => {
  try {
    // Check if user is employee or admin
    if (!req.user || (req.user.role !== 'employee' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee or admin role required.'
      });
    }

    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get repairs with populated customer and technician data
    const repairs = await BoatRepair.find(query)
      .populate('customer', 'name email phone')
      .populate('assignedTechnician', 'name email employeeData.position')
      .populate('assignedBy', 'name email')
      .populate('receivedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await BoatRepair.countDocuments(query);

    res.status(200).json({
      success: true,
      data: repairs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get technicians list
// @route   GET /api/users/technicians
// @access  Private (Employee/Admin)
export const getTechnicians = async (req, res, next) => {
  try {
    // Check if user is employee or admin
    if (!req.user || (req.user.role !== 'employee' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee or admin role required.'
      });
    }

    // Get all employees with technician positions
    const technicians = await User.find({
      role: { $in: ['employee', 'admin'] },
      'employeeData.position': { $regex: /technician|mechanic|repair/i }
    }).select('name email employeeData.position employeeData.employeeId');

    res.status(200).json({
      success: true,
      data: technicians
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Assign technician to repair request
// @route   PUT /api/boat-repairs/:id/assign-technician
// @access  Private (Employee/Admin)
export const assignTechnician = async (req, res, next) => {
  try {
    // Check if user is employee or admin
    if (!req.user || (req.user.role !== 'employee' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee or admin role required.'
      });
    }

    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: 'Technician ID is required'
      });
    }

    // Verify technician exists and is valid
    const technician = await User.findById(technicianId);
    if (!technician || (technician.role !== 'employee' && technician.role !== 'admin')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid technician'
      });
    }

    // Find the repair request
    const repair = await BoatRepair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair request not found'
      });
    }

    // Update repair with technician assignment
    repair.assignedTechnician = technicianId;
    repair.assignedBy = req.user.id;
    repair.assignedAt = new Date();
    repair.status = 'assigned';

    // Add status update
    repair.statusUpdates.push({
      status: 'assigned',
      notes: `Technician assigned: ${technician.name}`
    });

    await repair.save();

    // Populate and return updated repair
    const updatedRepair = await BoatRepair.findById(repair._id)
      .populate('customer', 'name email phone')
      .populate('assignedTechnician', 'name email employeeData.position')
      .populate('assignedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Technician assigned successfully',
      data: updatedRepair
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Mark boat as received
// @route   PUT /api/boat-repairs/:id/mark-received
// @access  Private (Employee/Admin)
export const markBoatReceived = async (req, res, next) => {
  try {
    // Check if user is employee or admin
    if (!req.user || (req.user.role !== 'employee' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee or admin role required.'
      });
    }

    // Find the repair request
    const repair = await BoatRepair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair request not found'
      });
    }

    // Check if boat is already received
    if (repair.boatReceivedAt) {
      return res.status(400).json({
        success: false,
        message: 'Boat has already been marked as received'
      });
    }

    // Mark boat as received
    repair.boatReceivedAt = new Date();
    repair.receivedBy = req.user.id;
    repair.status = 'in_progress';

    // Add status update
    repair.statusUpdates.push({
      status: 'in_progress',
      notes: 'Boat received and repair work started'
    });

    await repair.save();

    // Populate and return updated repair
    const updatedRepair = await BoatRepair.findById(repair._id)
      .populate('customer', 'name email phone')
      .populate('assignedTechnician', 'name email employeeData.position')
      .populate('receivedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Boat marked as received successfully',
      data: updatedRepair
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update repair status
// @route   PUT /api/boat-repairs/:id/update-status
// @access  Private (Employee/Admin)
export const updateRepairStatus = async (req, res, next) => {
  try {
    // Check if user is employee or admin
    if (!req.user || (req.user.role !== 'employee' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee or admin role required.'
      });
    }

    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'assigned', 'confirmed', 'in_progress', 'waiting_parts', 'completed', 'cancelled', 'rescheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Find the repair request
    const repair = await BoatRepair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair request not found'
      });
    }

    // Update status
    const oldStatus = repair.status;
    repair.status = status;

    // Add status update
    repair.statusUpdates.push({
      status: status,
      notes: notes || `Status changed from ${oldStatus} to ${status}`
    });

    await repair.save();

    // Populate and return updated repair
    const updatedRepair = await BoatRepair.findById(repair._id)
      .populate('customer', 'name email phone')
      .populate('assignedTechnician', 'name email employeeData.position')
      .populate('receivedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: updatedRepair
    });

  } catch (error) {
    next(error);
  }
};
