import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaDollarSign, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FinancialAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    revenueTrends: []
  });

  useEffect(() => {
    fetchFinancialAnalytics();
  }, []);

  const fetchFinancialAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const revenueTrendsRes = await fetch('http://localhost:5001/api/users/analytics/revenue-trends', { headers });
      const revenueTrends = await revenueTrendsRes.json();

      setData({
        revenueTrends: revenueTrends.data || []
      });
    } catch (error) {
      console.error('Error fetching financial analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart configuration
  const revenueTrendsConfig = {
    labels: data.revenueTrends.map(item => `${item._id.year}/${String(item._id.month).padStart(2, '0')}`),
    datasets: [
      {
        label: 'Revenue (LKR)',
        data: data.revenueTrends.map(item => item.totalRevenue),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Calculate summary statistics
  const totalRevenue = data.revenueTrends.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalServices = data.revenueTrends.reduce((sum, item) => sum + item.count, 0);
  const averageRevenue = totalServices > 0 ? totalRevenue / totalServices : 0;
  const monthlyGrowth = data.revenueTrends.length > 1 
    ? ((data.revenueTrends[data.revenueTrends.length - 1].totalRevenue - data.revenueTrends[0].totalRevenue) / data.revenueTrends[0].totalRevenue * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          </div>
          <p className="text-gray-600">Revenue trends and financial insights</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaDollarSign className="text-green-600 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  LKR {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaDollarSign className="text-blue-600 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaDollarSign className="text-purple-600 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Average Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  LKR {averageRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaDollarSign className={`text-2xl mr-3 ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className={`text-2xl font-bold ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {monthlyGrowth.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <FaDollarSign className="text-green-600 mr-2" />
            <h3 className="text-lg font-semibold">Revenue Trends</h3>
          </div>
          <div className="h-64">
            <Line data={revenueTrendsConfig} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return 'LKR ' + value.toLocaleString();
                    }
                  }
                }
              }
            }} />
          </div>
        </div>

        {/* Revenue Details Table */}
        {data.revenueTrends.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Monthly Revenue Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue (LKR)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average per Service
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.revenueTrends.map((item, index) => {
                    const avgPerService = item.count > 0 ? item.totalRevenue / item.count : 0;
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item._id.year}/{String(item._id.month).padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          LKR {item.totalRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          LKR {avgPerService.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Method Info */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <FaDollarSign className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Payment Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Payment Gateway</h4>
              <p className="text-blue-700">Stripe</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Transaction Status</h4>
              <p className="text-green-700">All payments processed through Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
