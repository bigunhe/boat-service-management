import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaUsers, FaChartBar, FaTools, FaShip, FaUserPlus, FaEye, FaEdit, FaTrash, FaDownload, FaUser, FaServer, FaArrowUp, FaList } from 'react-icons/fa';

const AdminDashboard = ({ firstName }) => {
  const navigate = useNavigate();

  const userManagementFeatures = [
    {
      name: 'Create Employee',
      icon: <FaUserPlus />,
      description: 'Add new employee accounts with detailed information',
      color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      route: '/admin/create-employee?from=/dashboard',
      metric: '23 Active'
    },
    {
      name: 'View All Users',
      icon: <FaUsers />,
      description: 'Browse and manage all customer and employee accounts',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      route: '/admin/users',
      metric: '1,247 Total'
    },
    {
      name: 'User Analytics',
      icon: <FaChartBar />,
      description: 'View user statistics and system analytics',
      color: 'bg-gradient-to-br from-violet-500 to-purple-500',
      route: '/admin/analytics',
      metric: '98% Active'
    }
  ];

  const accountManagementFeatures = [
    {
      name: 'My Profile',
      icon: <FaUser />,
      description: 'View and edit your administrator profile',
      color: 'bg-gradient-to-br from-purple-600 to-indigo-600',
      route: '/admin/profile'
    }
  ];

  const systemFeatures = [
    {
      name: 'System Settings',
      icon: <FaCog />,
      description: 'Configure system-wide settings and preferences',
      color: 'bg-gradient-to-br from-gray-600 to-purple-600',
      route: '/admin/settings',
      status: 'healthy'
    },
    {
      name: 'Service Management',
      icon: <FaTools />,
      description: 'Manage all boat services and maintenance operations',
      color: 'bg-gradient-to-br from-purple-500 to-violet-500',
      route: '/admin/services',
      status: 'active'
    },
    {
      name: 'Fleet Management',
      icon: <FaShip />,
      description: 'Oversee boat fleet and ride management operations',
      color: 'bg-gradient-to-br from-indigo-600 to-purple-600',
      route: '/admin/fleet',
      status: 'monitoring'
    }
  ];

  const quickStats = [
    { label: 'Total Customers', value: '0', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: <FaUsers /> },
    { label: 'Total Employees', value: '0', color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: <FaUserPlus /> },
    { label: 'Total Repairs', value: '0', color: 'text-violet-600', bgColor: 'bg-violet-100', icon: <FaTools /> },
    { label: 'Total Rides', value: '0', color: 'text-green-600', bgColor: 'bg-green-100', icon: <FaShip /> }
  ];



  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'monitoring': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl text-purple-600 bg-white p-3 rounded-full shadow-lg border-2 border-purple-200">
              <FaUser />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Manage the entire boat service system</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200">
                  <FaUser className="mr-2" />
                  Admin Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-400 hover:shadow-xl transition-shadow duration-300">
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


        {/* User Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaUsers className="mr-2 text-indigo-500" />
            User Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userManagementFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 border border-purple-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${feature.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {feature.metric}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaCog className="mr-2 text-violet-500" />
            System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systemFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 border border-purple-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${feature.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Account Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaUser className="mr-2 text-purple-500" />
            Account Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accountManagementFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 border border-purple-100"
              >
                <div className="p-6">
                  <div className={`${feature.color} text-white p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
