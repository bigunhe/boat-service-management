// API service for boat repair operations
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'Token exists' : 'No token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Create new boat repair request
export const createBoatRepair = async (repairData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/boat-repairs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(repairData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create repair request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating boat repair:', error);
    throw error;
  }
};

// Get repair by booking ID
export const getRepairByBookingId = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/boat-repairs/booking/${bookingId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch repair request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repair by booking ID:', error);
    throw error;
  }
};

// Get customer's repair requests
export const getMyRepairs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/boat-repairs/my-repairs`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch repair requests');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching my repairs:', error);
    throw error;
  }
};

// Generate PDF confirmation
export const generatePDFConfirmation = async (repairId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/boat-repairs/${repairId}/pdf`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate PDF');
    }

    // Return the blob for download
    return await response.blob();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
