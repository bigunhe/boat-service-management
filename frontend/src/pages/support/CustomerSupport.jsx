import React, { useState } from 'react';
import { FaArrowLeft, FaPaperPlane, FaHeadset } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle support ticket submission
    console.log('Support ticket submitted:', formData);
    alert('Support ticket submitted successfully! We will get back to you soon.');
    setFormData({ subject: '', category: '', message: '', priority: 'medium' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
          </div>
          <p className="text-gray-600">Get help with your boat service needs</p>
        </div>

        {/* WhatsApp Chat Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl text-green-500 mb-6">
              💬
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WhatsApp Chat Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're working on a WhatsApp chat feature for instant support. 
              For now, please use our contact form or call us directly.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <span>📞 Phone: +94 11 234 5678</span>
              </div>
              <div className="flex items-center justify-center">
                <span>📧 Email: support@boatservice.lk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-gray-600">+94 11 234 5678</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-gray-600">support@boatservice.lk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
