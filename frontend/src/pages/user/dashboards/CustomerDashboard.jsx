import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShip, FaChartBar, FaTools, FaCalendarAlt, FaHistory, FaCreditCard, FaHeadset, FaShoppingCart, FaCar, FaHeart, FaStar } from 'react-icons/fa';

const CustomerDashboard = ({ firstName }) => {
  const navigate = useNavigate();

  const mainFeatures = [
    { 
      name: 'Book Boat Ride', 
      icon: <FaShip />, 
      description: 'Schedule a boat ride for your next adventure',
      color: 'bg-gradient-to-br from-blue-500 to-teal-500',
      route: '/boat-rides'
    },
    { 
      name: 'Book Repair Service', 
      icon: <FaTools />, 
      description: 'Schedule maintenance or repair for your boat',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      route: '/repair-service'
    },
    { 
      name: 'Boat Sales', 
      icon: <FaCar />, 
      description: 'Visit our showroom to explore and purchase new boats',
      color: 'bg-gradient-to-br from-teal-500 to-green-500',
      route: '/boat-purchase'
    },
    { 
      name: 'Spare Parts Store', 
      icon: <FaShoppingCart />, 
      description: 'Browse and purchase boat spare parts and accessories',
      color: 'bg-gradient-to-br from-blue-600 to-indigo-500',
      route: '/spare-parts'
    }
  ];

  const myAccountFeatures = [
    { 
      name: 'My Profile', 
      icon: <FaUser />, 
      description: 'View and update your personal information',
      color: 'bg-gradient-to-br from-teal-500 to-cyan-500',
      route: '/profile'
    },
    { 
      name: 'My Rides', 
      icon: <FaCalendarAlt />, 
      description: 'View and manage your boat ride bookings',
      color: 'bg-gradient-to-br from-blue-500 to-teal-500',
      route: '/my-rides'
    },
    { 
      name: 'My Repairs', 
      icon: <FaTools />, 
      description: 'View and manage your repair requests',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      route: '/my-repairs'
    },
    { 
      name: 'Payment History', 
      icon: <FaCreditCard />, 
      description: 'View your payment history and invoices',
      color: 'bg-gradient-to-br from-teal-600 to-blue-600',
      route: '/payment-history'
    }
  ];

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl text-blue-600 bg-white p-3 rounded-full shadow-lg">
              <FaUser />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Manage your boat services, bookings, and purchases</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 border border-blue-200">
                  <FaStar className="mr-2" />
                  Customer Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="text-2xl text-blue-600 mr-3 bg-blue-100 p-3 rounded-full">
                <FaCalendarAlt />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-gray-600 text-sm">Upcoming Bookings</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="text-2xl text-teal-600 mr-3 bg-teal-100 p-3 rounded-full">
                <FaShoppingCart />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-gray-600 text-sm">Items in Cart</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-cyan-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="text-2xl text-cyan-600 mr-3 bg-cyan-100 p-3 rounded-full">
                <FaTools />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-gray-600 text-sm">Pending Services</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="text-2xl text-indigo-600 mr-3 bg-indigo-100 p-3 rounded-full">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FaHeart className="mr-2 text-blue-500" />
            Main Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`text-2xl text-white p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My Account - Single Row */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FaUser className="mr-2 text-teal-500" />
            My Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {myAccountFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`text-xl text-white p-3 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">
                <FaHeadset />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Need Help?</h3>
                <p className="text-blue-100">Our customer support team is here to assist you</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
