import User from '../models/userModel.js';
import BoatRepair from '../models/boatRepairModel.js';

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
