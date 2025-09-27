import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaUserTie,
  FaBriefcase,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get the tab parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const returnTab = urlParams.get('tab') || 'customers';

  // Check if we're in edit mode based on URL
  const isEditMode = window.location.pathname.includes('/edit');

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        
        const formDataToSet = {
          name: data.data.user.name || '',
          email: data.data.user.email || '',
          phone: data.data.user.phone || '',
          nic: data.data.user.nic || '',
          address: data.data.user.address || {
            street: '',
            city: '',
            district: '',
            postalCode: ''
          },
          isActive: data.data.user.isActive !== undefined ? data.data.user.isActive : true,
          // Employee specific fields
          position: data.data.user.employeeData?.position || '',
          dateOfBirth: data.data.user.employeeData?.dateOfBirth ? 
            new Date(data.data.user.employeeData.dateOfBirth).toISOString().split('T')[0] : '',
          emergencyContact: data.data.user.employeeData?.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          }
        };
        
        setFormData(formDataToSet);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
      navigate(`/admin/users?tab=${returnTab}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // Set editing mode if URL contains /edit
    if (isEditMode) {
      setEditing(true);
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    const fieldPath = `${parent}.${field}`;
    if (errors[fieldPath]) {
      setErrors(prev => ({
        ...prev,
        [fieldPath]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Always validate editable fields
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
    
    // Address validation (always editable)
    if (!formData.address?.street?.trim()) newErrors['address.street'] = 'Street address is required';
    if (!formData.address?.city?.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address?.district?.trim()) newErrors['address.district'] = 'District is required';
    if (!formData.address?.postalCode?.trim()) newErrors['address.postalCode'] = 'Postal code is required';
    
    // Only validate non-customer fields if user is not a customer
    if (user?.role !== 'customer') {
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      if (!formData.nic?.trim()) newErrors.nic = 'NIC is required';
      
      // Employee specific validation
      if (user?.role === 'employee') {
        if (!formData.position?.trim()) newErrors.position = 'Position is required';
        if (!formData.dateOfBirth?.trim()) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.emergencyContact?.name?.trim()) newErrors['emergencyContact.name'] = 'Emergency contact name is required';
        if (!formData.emergencyContact?.phone?.trim()) newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
        if (!formData.emergencyContact?.relationship?.trim()) newErrors['emergencyContact.relationship'] = 'Relationship is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nic: formData.nic,
        address: formData.address,
        isActive: formData.isActive
      };

      // Add employee specific fields if user is employee
      if (user?.role === 'employee') {
        updateData.employeeData = {
          position: formData.position,
          dateOfBirth: formData.dateOfBirth,
          emergencyContact: formData.emergencyContact
        };
      }

      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast.success('User updated successfully');
        setEditing(false);
        fetchUserDetails(); // Refresh data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        navigate(`/admin/users?tab=${returnTab}`);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <FaTimesCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(`/admin/users?tab=${returnTab}`)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/admin/users?tab=${returnTab}`)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  {getStatusBadge(user.isActive)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'employee' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {user.role === 'employee' ? (
                      <>
                        <FaUserTie className="w-3 h-3 mr-1 inline" />
                        Employee
                      </>
                    ) : (
                      <>
                        <FaUser className="w-3 h-3 mr-1 inline" />
                        Customer
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setErrors({});
                      fetchUserDetails(); // Reset form data
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaTimes className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <FaSave className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FaUser className="mr-2 text-teal-600" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {editing && user.role !== 'customer' ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <FaEnvelope className="w-4 h-4 mr-2 text-gray-400" />
                    {user.email}
                  </p>
                )}
                {user.role === 'customer' && editing && (
                  <p className="text-gray-500 text-sm mt-1">Email cannot be edited for customer accounts</p>
                )}
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="flex items-center">
                  <p className="text-gray-900 flex items-center">
                    <FaLock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {user.password ? user.password.substring(0, 20) + '...' : 'No password set'}
                    </span>
                  </p>
                  <span className="ml-2 text-xs text-gray-500">(Hashed - Admin View Only)</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Password cannot be edited. Contact user to reset if needed.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <FaPhone className="w-4 h-4 mr-2 text-gray-400" />
                    {user.phone}
                  </p>
                )}
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIC</label>
                {editing && user.role !== 'customer' ? (
                  <input
                    type="text"
                    value={formData.nic}
                    onChange={(e) => handleInputChange('nic', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.nic ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <FaIdCard className="w-4 h-4 mr-2 text-gray-400" />
                    {user.nic}
                  </p>
                )}
                {user.role === 'customer' && editing && (
                  <p className="text-gray-500 text-sm mt-1">NIC cannot be edited for customer accounts</p>
                )}
                {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                {editing ? (
                  <select
                    value={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                ) : (
                  getStatusBadge(user.isActive)
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-teal-600" />
              Address Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.address?.street || ''}
                    onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{user.address?.street || 'N/A'}</p>
                )}
                {errors['address.street'] && <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.address?.city || ''}
                      onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <p className="text-gray-900">{user.address?.city || 'N/A'}</p>
                  )}
                  {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.address?.district || ''}
                      onChange={(e) => handleNestedInputChange('address', 'district', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors['address.district'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <p className="text-gray-900">{user.address?.district || 'N/A'}</p>
                  )}
                  {errors['address.district'] && <p className="text-red-500 text-sm mt-1">{errors['address.district']}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.address?.postalCode || ''}
                    onChange={(e) => handleNestedInputChange('address', 'postalCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors['address.postalCode'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{user.address?.postalCode || 'N/A'}</p>
                )}
                {errors['address.postalCode'] && <p className="text-red-500 text-sm mt-1">{errors['address.postalCode']}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Employee Information (if employee) */}
        {user.role === 'employee' && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FaBriefcase className="mr-2 text-teal-600" />
              Employee Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <p className="text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded">
                  {user.employeeData?.employeeId || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                {editing && user.role !== 'customer' ? (
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.position ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select position</option>
                    <option value="General Employee">General Employee</option>
                    <option value="Technician">Technician</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Repair Specialist">Repair Specialist</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{user.employeeData?.position || 'N/A'}</p>
                )}
                {user.role === 'customer' && editing && (
                  <p className="text-gray-500 text-sm mt-1">Position is not applicable for customer accounts</p>
                )}
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {editing && user.role !== 'customer' ? (
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                    {user.employeeData?.dateOfBirth ? formatDate(user.employeeData.dateOfBirth) : 'N/A'}
                  </p>
                )}
                {user.role === 'customer' && editing && (
                  <p className="text-gray-500 text-sm mt-1">Date of birth cannot be edited for customer accounts</p>
                )}
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
                <p className="text-gray-900 flex items-center">
                  <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                  {user.employeeData?.hireDate ? formatDate(user.employeeData.hireDate) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors['emergencyContact.name'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <p className="text-gray-900">{user.employeeData?.emergencyContact?.name || 'N/A'}</p>
                  )}
                  {errors['emergencyContact.name'] && <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.name']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.emergencyContact?.phone || ''}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors['emergencyContact.phone'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <p className="text-gray-900">{user.employeeData?.emergencyContact?.phone || 'N/A'}</p>
                  )}
                  {errors['emergencyContact.phone'] && <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.phone']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  {editing ? (
                    <select
                      value={formData.emergencyContact?.relationship || ''}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors['emergencyContact.relationship'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
                      <option value="Relative">Relative</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{user.employeeData?.emergencyContact?.relationship || 'N/A'}</p>
                  )}
                  {errors['emergencyContact.relationship'] && <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.relationship']}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FaCalendarAlt className="mr-2 text-teal-600" />
            Account Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
              <p className="text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
              <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <FaTrash className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{user.name}</strong>? 
                This will permanently remove their account and all associated data.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
