import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import ChangePassword from '../../components/ChangePassword';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EmployeeProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nic: '',
    address: {
      street: '',
      city: '',
      district: '',
      postalCode: ''
    },
    employeeId: '',
    position: '',
    hireDate: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nic: user.nic || '',
        address: user.address || {
          street: '',
          city: '',
          district: '',
          postalCode: ''
        },
        employeeId: user.employeeData?.employeeId || '',
        position: user.employeeData?.position || '',
        hireDate: user.employeeData?.hireDate || '',
        dateOfBirth: user.employeeData?.dateOfBirth || '',
        emergencyContact: user.employeeData?.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        status: user.isActive ? 'Active' : 'Inactive'
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      if (!user || !user._id) {
        toast.error('User information not available. Please refresh the page.');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Update the user context with new data
        const updatedUser = { ...user, ...formData };
        updateUser(updatedUser);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      nic: user?.nic || '',
      address: user?.address || {
        street: '',
        city: '',
        district: '',
        postalCode: ''
      },
      employeeId: user?.employeeData?.employeeId || '',
      position: user?.employeeData?.position || '',
      hireDate: user?.employeeData?.hireDate || '',
      dateOfBirth: user?.employeeData?.dateOfBirth || '',
      emergencyContact: user?.employeeData?.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      status: user?.isActive ? 'Active' : 'Inactive'
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="text-4xl text-teal-600">
                <FaUser />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
                <p className="text-gray-600">View and update your employee information</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
                  <input
                    type="text"
                    value={formData.nic}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                        isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input
                      type="text"
                      value={formData.address.district}
                      onChange={(e) => handleInputChange('address.district', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                        isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={formData.address.postalCode}
                      onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                        isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Employment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <input
                    type="text"
                    value={formData.status}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Change Password Section */}
        <div className="mt-8">
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
