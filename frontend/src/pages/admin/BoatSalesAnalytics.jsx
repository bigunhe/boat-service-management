import React from 'react';
import { FaArrowLeft, FaShip, FaChartBar, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BoatSalesAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Boat Sales Analytics</h1>
          </div>
          <p className="text-gray-600">Boat sales insights and revenue performance</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl text-green-500 mb-6">
              <FaShip />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Boat sales analytics will provide insights into sales performance, 
              popular boat models, customer demographics, and revenue trends.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <FaChartBar className="mr-2" />
                <span>Sales performance and trends</span>
              </div>
              <div className="flex items-center justify-center">
                <FaDollarSign className="mr-2" />
                <span>Revenue analysis and forecasting</span>
              </div>
              <div className="flex items-center justify-center">
                <FaShoppingCart className="mr-2" />
                <span>Popular boat models and features</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatSalesAnalytics;
