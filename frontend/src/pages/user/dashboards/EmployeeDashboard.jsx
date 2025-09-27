import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaTools, 
  FaShip, 
  FaCar, 
  FaShoppingCart, 
  FaUser, 
  FaHeadset,
  FaBell,
  FaChartBar
} from 'react-icons/fa';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(' ')[0] || 'Employee';

  const mainFunctions = [
    { 
      name: 'Repair Management', 
      icon: <FaTools />, 
      description: 'Manage repair requests, assign technicians, and update status', 
      color: 'bg-orange-500',
      route: '/employee/repair-management'
    },
    { 
      name: 'Ride Management', 
      icon: <FaShip />, 
      description: 'Manage boat ride bookings, assign captains, and track schedules', 
      color: 'bg-blue-500',
      route: '/employee/ride-management'
    },
    { 
      name: 'Purchase Management', 
      icon: <FaCar />, 
      description: 'Manage boat purchase visits, assign sales reps, and follow up', 
      color: 'bg-green-500',
      route: '/employee/purchase-management'
    },
    { 
      name: 'Spare Parts Management', 
      icon: <FaShoppingCart />, 
      description: 'Manage inventory, process orders, and handle shipping', 
      color: 'bg-purple-500',
      route: '/employee/spare-parts-management'
    },
    { 
      name: 'Customer Support', 
      icon: <FaHeadset />, 
      description: 'Respond to customer inquiries and provide support', 
      color: 'bg-indigo-500',
      route: '/employee/customer-support'
    }
  ];

  const employeeAccountFunctions = [
    { 
      name: 'My Profile', 
      icon: <FaUser />, 
      description: 'View and update your employee profile information', 
      color: 'bg-teal-500',
      route: '/employee/profile'
    }
  ];

  const quickStats = [
    { label: 'Pending Repairs', value: '12', color: 'text-orange-600' },
    { label: 'Active Rides', value: '8', color: 'text-blue-600' },
    { label: 'Purchase Visits', value: '5', color: 'text-green-600' },
    { label: 'Orders to Process', value: '7', color: 'text-purple-600' }
  ];

  const recentActivity = [
    { id: 1, type: 'Repair Request', description: 'New repair request from Jane Doe', time: '2 hours ago' },
    { id: 2, type: 'Ride Booking', description: 'Boat ride confirmed for John Smith', time: '5 hours ago' },
    { id: 3, type: 'Order', description: 'New spare parts order from Alex Lee', time: '1 day ago' },
  ];

  const handleFunctionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl text-teal-600">
                <FaUser />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {firstName}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Employee Dashboard - Manage your tasks and serve customers
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    Employee Account
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaBell className="text-gray-400 text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className={`mt-1 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-4xl text-gray-300">
                <FaChartBar /> 
              </div>
            </div>
          ))}
        </div>

        {/* Main Functions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Main Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFunctions.map((func, index) => (
              <div
                key={index}
                onClick={() => handleFunctionClick(func.route)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              >
                <div className="p-6">
                  <div className={`${func.color} text-white p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-200`}>
                    {func.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {func.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {func.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Account Functions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employeeAccountFunctions.map((func, index) => (
              <div
                key={index}
                onClick={() => handleFunctionClick(func.route)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              >
                <div className="p-6 text-center">
                  <div className={`${func.color} text-white p-4 rounded-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {func.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors mb-2">
                    {func.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {func.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center justify-between text-gray-700">
                <p>
                  <span className="font-medium">{activity.type}:</span> {activity.description}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
