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
  FaChartBar,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTasks
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
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      route: '/employee/repair-management',
      status: 'urgent',
      count: 12
    },
    { 
      name: 'Ride Management', 
      icon: <FaShip />, 
      description: 'Manage boat ride bookings, assign captains, and track schedules', 
      color: 'bg-gradient-to-br from-amber-500 to-orange-500',
      route: '/employee/ride-management',
      status: 'active',
      count: 8
    },
    { 
      name: 'Boat Purchase Management', 
      icon: <FaCar />, 
      description: 'Manage customer service appointments and boat bookings', 
      color: 'bg-gradient-to-br from-yellow-500 to-amber-500',
      route: '/admin/appointment-management',
      status: 'pending',
      count: 5
    },
    { 
      name: 'Spare Parts (Inventory) Management', 
      icon: <FaShoppingCart />, 
      description: 'Manage spare parts inventory, add products, and update stock', 
      color: 'bg-gradient-to-br from-orange-600 to-red-600',
      route: '/inventory',
      status: 'processing',
      count: 7
    },
    { 
      name: 'Customer Support', 
      icon: <FaHeadset />, 
      description: 'Respond to customer inquiries and provide support', 
      color: 'bg-gradient-to-br from-amber-600 to-orange-600',
      route: '/employee/customer-support',
      status: 'normal',
      count: 3
    }
  ];

  const employeeAccountFunctions = [
    { 
      name: 'My Profile', 
      icon: <FaUser />, 
      description: 'View and update your employee profile information', 
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
      route: '/employee/profile'
    }
  ];

  const quickStats = [
    { label: 'Pending Repairs', value: '0', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: <FaExclamationTriangle /> },
    { label: 'Active Rides', value: '0', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: <FaShip /> },
    { label: 'Purchase Visits', value: '0', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: <FaCar /> },
    { label: 'Orders to Process', value: '0', color: 'text-red-600', bgColor: 'bg-red-100', icon: <FaShoppingCart /> }
  ];


  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'active': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFunctionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl text-orange-600 bg-orange-100 p-3 rounded-full">
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200">
                    <FaTasks className="mr-2" />
                    Employee Account
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaBell className="text-orange-400 text-xl" />
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
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-400 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className={`mt-1 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`text-4xl ${stat.bgColor} p-3 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Functions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaTasks className="mr-2 text-orange-500" />
            Main Functions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFunctions.map((func, index) => (
              <div
                key={index}
                onClick={() => handleFunctionClick(func.route)}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 border border-orange-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${func.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {func.icon}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(func.status)}`}>
                        {func.status}
                      </span>
                      <span className="text-2xl font-bold text-orange-600 mt-1">{func.count}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {func.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed px-6 pb-6">
                  {func.description}
                </p>
              </div>
            ))}
          </div>
        </div>


        {/* Employee Account Functions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaUser className="mr-2 text-orange-500" />
            Account Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeeAccountFunctions.map((func, index) => (
              <div
                key={index}
                onClick={() => handleFunctionClick(func.route)}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 border border-orange-100"
              >
                <div className="p-6">
                  <div className={`${func.color} text-white p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {func.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {func.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed px-6 pb-6">
                  {func.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
