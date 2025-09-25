import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShip, FaChartBar, FaTools, FaCalendarAlt, FaHistory, FaCreditCard, FaHeadset, FaShoppingCart, FaCar } from 'react-icons/fa';

const CustomerDashboard = ({ firstName }) => {
  const navigate = useNavigate();

  const mainFeatures = [
    { 
      name: 'Book Boat Ride', 
      icon: <FaShip />, 
      description: 'Schedule a boat ride for your next adventure',
      color: 'bg-blue-500',
      route: '/boat-rides'
    },
    { 
      name: 'Book Repair Service', 
      icon: <FaTools />, 
      description: 'Schedule maintenance or repair for your boat',
      color: 'bg-orange-500',
      route: '/repair-service'
    },
    { 
      name: 'Boat Purchase Visit', 
      icon: <FaCar />, 
      description: 'Schedule a visit to explore and purchase new boats',
      color: 'bg-green-500',
      route: '/boat-purchase'
    },
    { 
      name: 'Spare Parts Store', 
      icon: <FaShoppingCart />, 
      description: 'Browse and purchase boat spare parts and accessories',
      color: 'bg-purple-500',
      route: '/spare-parts'
    }
  ];

  const myAccountFeatures = [
    { 
      name: 'My Profile', 
      icon: <FaUser />, 
      description: 'View and update your personal information',
      color: 'bg-teal-500',
      route: '/profile'
    },
    { 
      name: 'My Bookings', 
      icon: <FaCalendarAlt />, 
      description: 'View and manage your upcoming bookings',
      color: 'bg-indigo-500',
      route: '/my-bookings'
    },
    { 
      name: 'Service History', 
      icon: <FaHistory />, 
      description: 'View your past services and maintenance records',
      color: 'bg-pink-500',
      route: '/service-history'
    },
    { 
      name: 'Payment History', 
      icon: <FaCreditCard />, 
      description: 'View your payment history and invoices',
      color: 'bg-red-500',
      route: '/payment-history'
    }
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
                Welcome, {firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Manage your boat services, bookings, and purchases</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  Customer Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl text-blue-600 mr-3">
                <FaCalendarAlt />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-gray-600 text-sm">Upcoming Bookings</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl text-green-600 mr-3">
                <FaShoppingCart />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-gray-600 text-sm">Items in Cart</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl text-orange-600 mr-3">
                <FaTools />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-gray-600 text-sm">Pending Services</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl text-purple-600 mr-3">
                <FaCreditCard />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Rs. 45,000</div>
                <div className="text-gray-600 text-sm">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Services - 2x2 Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Main Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainFeatures.map((feature, index) => (
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

        {/* My Account - Single Row */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myAccountFeatures.map((feature, index) => (
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

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <FaTools className="text-orange-500" />
                <p className="text-gray-700">New repair request submitted</p>
              </div>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <FaShip className="text-blue-500" />
                <p className="text-gray-700">Boat ride booking confirmed</p>
              </div>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <FaCreditCard className="text-red-500" />
                <p className="text-gray-700">Payment for spare parts processed</p>
              </div>
              <p className="text-sm text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
