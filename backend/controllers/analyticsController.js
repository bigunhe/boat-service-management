import User from '../models/userModel.js';
import BoatRepair from '../models/boatRepairModel.js';
import Appointment from '../models/appointmentBooking.model.js';
import Boat from '../models/productModel.js';
import { UserVisit, CategoryView, Engagement } from '../models/analytics.model.js';

// Get user registration trends
export const getUserRegistrationTrends = async (req, res) => {
  try {
    const { period } = req.query; // '24h', '7d', '30d', '6m', '1y'
    
    let startDate = new Date();
    let groupBy = 'hour';
    
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        groupBy = 'hour';
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = 'day';
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        groupBy = 'day';
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        groupBy = 'month';
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = 'month';
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
        groupBy = 'day';
    }

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            hour: { $hour: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
      }
    ];

    const trends = await User.aggregate(pipeline);
    
    res.json({
      success: true,
      data: trends,
      period,
      groupBy
    });
  } catch (error) {
    console.error('Error getting registration trends:', error);
    res.status(500).json({ success: false, message: 'Failed to get registration trends' });
  }
};

// Get user distribution (active/inactive)
export const getUserDistribution = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    res.json({
      success: true,
      data: {
        active: activeUsers,
        inactive: inactiveUsers,
        total: activeUsers + inactiveUsers
      }
    });
  } catch (error) {
    console.error('Error getting user distribution:', error);
    res.status(500).json({ success: false, message: 'Failed to get user distribution' });
  }
};

// Get geographic distribution by district
export const getGeographicDistribution = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          'address.district': { $exists: true, $ne: null, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$address.district',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ];

    const distribution = await User.aggregate(pipeline);
    
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Error getting geographic distribution:', error);
    res.status(500).json({ success: false, message: 'Failed to get geographic distribution' });
  }
};

// Get service requests by type
export const getServiceRequestsByType = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ];

    const serviceTypes = await BoatRepair.aggregate(pipeline);
    
    res.json({
      success: true,
      data: serviceTypes
    });
  } catch (error) {
    console.error('Error getting service requests by type:', error);
    res.status(500).json({ success: false, message: 'Failed to get service requests by type' });
  }
};

// Get monthly service volume
export const getMonthlyServiceVolume = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ];

    const monthlyVolume = await BoatRepair.aggregate(pipeline);
    
    res.json({
      success: true,
      data: monthlyVolume
    });
  } catch (error) {
    console.error('Error getting monthly service volume:', error);
    res.status(500).json({ success: false, message: 'Failed to get monthly service volume' });
  }
};

// Get revenue trends
export const getRevenueTrends = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          status: 'completed',
          totalCost: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$totalCost' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ];

    const revenueTrends = await BoatRepair.aggregate(pipeline);
    
    res.json({
      success: true,
      data: revenueTrends
    });
  } catch (error) {
    console.error('Error getting revenue trends:', error);
    res.status(500).json({ success: false, message: 'Failed to get revenue trends' });
  }
};

// Get repair status breakdown
export const getRepairStatusBreakdown = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ];

    const statusBreakdown = await BoatRepair.aggregate(pipeline);
    
    // Get current month/year data
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const currentMonthPipeline = [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: '$createdAt' }, currentYear] },
              { $eq: [{ $month: '$createdAt' }, currentMonth] }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ];

    const currentMonthData = await BoatRepair.aggregate(currentMonthPipeline);
    
    res.json({
      success: true,
      data: {
        allTime: statusBreakdown,
        currentMonth: currentMonthData
      }
    });
  } catch (error) {
    console.error('Error getting repair status breakdown:', error);
    res.status(500).json({ success: false, message: 'Failed to get repair status breakdown' });
  }
};

// Get technician performance data
export const getTechnicianPerformance = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          assignedTechnician: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTechnician',
          foreignField: '_id',
          as: 'technician'
        }
      },
      {
        $unwind: '$technician'
      },
      {
        $group: {
          _id: {
            technicianId: '$assignedTechnician',
            technicianName: '$technician.name',
            position: '$technician.employeeData.position'
          },
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'assigned'] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$completed', '$totalAssigned'] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $sort: { totalAssigned: -1 }
      }
    ];

    const technicianPerformance = await BoatRepair.aggregate(pipeline);
    
    res.json({
      success: true,
      data: technicianPerformance
    });
  } catch (error) {
    console.error('Error getting technician performance:', error);
    res.status(500).json({ success: false, message: 'Failed to get technician performance' });
  }
};

// Get analytics dashboard data
export const getAnalyticsDashboard = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    console.log('📊 Getting analytics dashboard data for', days, 'days');

    // Get appointment metrics
    const totalAppointments = await Appointment.countDocuments({
      createdAt: { $gte: startDate }
    });

    const uniqueCustomers = await Appointment.distinct('customerEmail', {
      createdAt: { $gte: startDate }
    });

    const completedAppointments = await Appointment.countDocuments({
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const pendingAppointments = await Appointment.countDocuments({
      status: 'pending',
      createdAt: { $gte: startDate }
    });

    // Get boat category performance
    const categoryStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'boats',
          localField: 'boatId',
          foreignField: '_id',
          as: 'boat'
        }
      },
      {
        $unwind: '$boat'
      },
      {
        $group: {
          _id: '$boat.category',
          totalViews: { $sum: 1 },
          uniqueViewers: { $addToSet: '$customerEmail' },
          averageTime: { $avg: '$estimatedDuration' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalViews: 1,
          uniqueViewers: { $size: '$uniqueViewers' },
          averageTime: { $round: ['$averageTime', 2] }
        }
      },
      {
        $sort: { totalViews: -1 }
      }
    ]);

    // Get top boats by appointments
    const topBoats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'boats',
          localField: 'boatId',
          foreignField: '_id',
          as: 'boat'
        }
      },
      {
        $unwind: '$boat'
      },
      {
        $group: {
          _id: '$boatId',
          boatName: { $first: '$boat.name' },
          views: { $sum: 1 }
        }
      },
      {
        $sort: { views: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get user engagement levels (simplified)
    const engagementStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$customerEmail',
          appointmentCount: { $sum: 1 },
          totalDuration: { $sum: '$estimatedDuration' }
        }
      },
      {
        $addFields: {
          engagementLevel: {
            $cond: [
              { $gte: ['$appointmentCount', 3] },
              'high',
              {
                $cond: [
                  { $gte: ['$appointmentCount', 2] },
                  'medium',
                  'low'
                ]
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$engagementLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate revenue (simplified - using estimated costs)
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$estimatedCost' }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        metrics: {
          totalVisitors: totalAppointments,
          uniqueVisitors: uniqueCustomers.length,
          returningVisitors: completedAppointments,
          averageSessionDuration: 1800, // 30 minutes default
          inquiries: pendingAppointments
        },
        categoryStats,
        topBoats,
        engagementStats,
        revenue: totalRevenue
      }
    });

  } catch (error) {
    console.error('❌ Error getting analytics dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics dashboard',
      error: error.message
    });
  }
};

// Get real-time analytics
export const getRealtimeAnalytics = async (req, res) => {
  try {
    const last5Minutes = new Date();
    last5Minutes.setMinutes(last5Minutes.getMinutes() - 5);

    console.log('📊 Getting real-time analytics');

    // Get recent appointments
    const recentAppointments = await Appointment.find({
      createdAt: { $gte: last5Minutes }
    })
    .populate('boatId', 'name category')
    .sort({ createdAt: -1 })
    .limit(10);

    // Get today's summary
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          uniqueCustomers: { $addToSet: '$customerEmail' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        recentVisits: recentAppointments.map(apt => ({
          userName: apt.customerName,
          userEmail: apt.customerEmail,
          deviceType: 'desktop', // Default
          visitDate: apt.createdAt
        })),
        recentViews: recentAppointments.map(apt => ({
          boatName: apt.boatId?.name || 'Unknown Boat',
          category: apt.boatId?.category || 'Unknown',
          viewDate: apt.createdAt
        })),
        todayStats: todayStats[0] || { 
          totalVisitors: 0, 
          uniqueVisitors: [] 
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting real-time analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get real-time analytics',
      error: error.message
    });
  }
};
