import React, { useState } from 'react';
import { FaArrowLeft, FaCheck, FaClock, FaExclamationTriangle, FaEye, FaChartBar, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminSupport = () => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock data - replace with real data from API
  const supportTickets = [
    {
      id: 'TICKET-001',
      customer: 'John Doe',
      subject: 'Boat repair delayed',
      category: 'repair',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-15',
      assignedTo: 'Unassigned',
      message: 'My boat repair has been delayed for 3 days. When will it be ready?'
    },
    {
      id: 'TICKET-002',
      customer: 'Jane Smith',
      subject: 'Payment issue',
      category: 'payment',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2024-01-14',
      assignedTo: 'Sarah Johnson',
      message: 'I was charged twice for the same service. Please help resolve this.'
    },
    {
      id: 'TICKET-003',
      customer: 'Mike Johnson',
      subject: 'Spare parts availability',
      category: 'spare-parts',
      priority: 'low',
      status: 'resolved',
      createdAt: '2024-01-13',
      assignedTo: 'Tom Wilson',
      message: 'Do you have engine parts for Yamaha 250HP?'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignTicket = (ticketId) => {
    // Handle ticket assignment
    console.log('Assigning ticket:', ticketId);
    alert('Ticket assignment feature coming soon!');
  };

  const handleResolveTicket = (ticketId) => {
    // Handle ticket resolution
    console.log('Resolving ticket:', ticketId);
    alert('Ticket resolved successfully!');
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Support Management</h1>
          </div>
          <p className="text-gray-600">Oversee and manage all customer support operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaClock className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaCheck className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaUsers className="text-purple-500 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Support Staff</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Support Tickets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supportTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-teal-600 hover:text-teal-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {ticket.assignedTo === 'Unassigned' && (
                          <button
                            onClick={() => handleAssignTicket(ticket.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Assign Ticket"
                          >
                            <FaUsers />
                          </button>
                        )}
                        {ticket.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolveTicket(ticket.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Resolve Ticket"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ticket ID</p>
                    <p className="text-sm text-gray-900">{selectedTicket.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Customer</p>
                    <p className="text-sm text-gray-900">{selectedTicket.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Subject</p>
                    <p className="text-sm text-gray-900">{selectedTicket.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Assigned To</p>
                    <p className="text-sm text-gray-900">{selectedTicket.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Message</p>
                    <p className="text-sm text-gray-900">{selectedTicket.message}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                  {selectedTicket.assignedTo === 'Unassigned' && (
                    <button
                      onClick={() => {
                        handleAssignTicket(selectedTicket.id);
                        setSelectedTicket(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Assign
                    </button>
                  )}
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        handleResolveTicket(selectedTicket.id);
                        setSelectedTicket(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
