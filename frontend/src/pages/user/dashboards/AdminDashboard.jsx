import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaUsers, FaChartBar, FaTools, FaShip, FaUserPlus, FaEye, FaEdit, FaTrash, FaDownload, FaUser } from 'react-icons/fa';

const AdminDashboard = ({ firstName }) => {
  const navigate = useNavigate();

  const userManagementFeatures = [
    {
      name: 'Create Employee',
      icon: <FaUserPlus />,
      description: 'Add new employee accounts with detailed information',
      color: 'bg-green-500',
      route: '/admin/create-employee?from=/dashboard'
    },
    {
      name: 'View All Users',
      icon: <FaUsers />,
      description: 'Browse and manage all customer and employee accounts',
      color: 'bg-blue-500',
      route: '/admin/users'
    },
    {
      name: 'User Analytics',
      icon: <FaChartBar />,
      description: 'View user statistics and system analytics',
      color: 'bg-purple-500',
      route: '/admin/analytics'
    }
  ];

  const systemFeatures = [
    {
      name: 'System Settings',
      icon: <FaCog />,
      description: 'Configure system-wide settings and preferences',
      color: 'bg-gray-500',
      route: '/admin/settings'
    },
    {
      name: 'Service Management',
      icon: <FaTools />,
      description: 'Manage all boat services and maintenance operations',
      color: 'bg-orange-500',
      route: '/admin/services'
    },
    {
      name: 'Fleet Management',
      icon: <FaShip />,
      description: 'Oversee boat fleet and ride management operations',
      color: 'bg-teal-500',
      route: '/admin/fleet'
    }
  ];

  const quickStats = [
    { label: 'Total Users', value: '1,247', color: 'text-blue-600' },
    { label: 'Active Employees', value: '23', color: 'text-green-600' },
    { label: 'Pending Requests', value: '15', color: 'text-orange-600' },
    { label: 'System Health', value: '98%', color: 'text-teal-600' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Customer', status: 'Active', joinDate: '2 days ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Employee', status: 'Active', joinDate: '1 week ago' },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'Customer', status: 'Pending', joinDate: '3 days ago' }
  ];

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl text-teal-600">
              <FaUser />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Manage the entire boat service system</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Admin Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="text-2xl text-gray-400 mr-3">
                  <FaChartBar />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userManagementFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`text-2xl text-white p-3 rounded-lg ${feature.color} group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systemFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`text-2xl text-white p-3 rounded-lg ${feature.color} group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'Employee' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-teal-600 hover:text-teal-900">
                          <FaEye />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
