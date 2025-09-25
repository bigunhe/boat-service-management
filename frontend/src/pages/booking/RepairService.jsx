import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaArrowRight, FaUpload, FaTimes, FaCheck, FaCalendarAlt, FaCreditCard, FaSpinner, FaImage, FaVideo } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { createBoatRepair } from '../../services/repairService';

const RepairService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Boat Details
    serviceType: '',
    boatType: '',
    boatMake: '',
    boatModel: '',
    boatYear: '',
    engineType: '',
    engineModel: '',
    hullMaterial: '',
    problemDescription: '',
    serviceDescription: '',
    
    // Step 2: File Upload
    photos: [],
    
    // Step 3: Scheduling
    preferredDate: '',
    preferredTimeSlot: '',
    calendlyEventId: '',
    calendlyEventUri: '',
    scheduledDateTime: null,
    
    // Step 4: Payment
    serviceLocation: {
      type: 'service_center',
      address: {
        street: '',
        city: '',
        district: '',
        postalCode: ''
      }
    },
    customerNotes: ''
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cancelUpload, setCancelUpload] = useState(null);
  
  // Step titles
  const stepTitles = [
    'Boat Details',
    'Upload Photos/Videos', 
    'Schedule Appointment',
    'Submit Request'
  ];
  
  // Navigation functions
  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        toast.error('Please fix the errors before proceeding');
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Real-time validation - only for text inputs with minimum requirements
    let error = '';
    const textFields = ['boatMake', 'boatModel', 'engineModel', 'problemDescription', 'serviceDescription'];
    
    if (field === 'boatYear') {
      error = validateYear(value);
    } else if (textFields.includes(field)) {
      const minLength = getFieldMinLength(field);
      error = validateTextInput(value, field.replace(/([A-Z])/g, ' $1').toLowerCase(), minLength);
    }
    // For dropdowns (serviceType, boatType, engineType, hullMaterial), don't show real-time validation
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };
  
  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };
  
  const handleDeepNestedInputChange = (parent, child, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: {
          ...prev[parent][child],
          [field]: value
        }
      }
    }));
  };

  // File upload functions
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const abortController = new AbortController();
    setCancelUpload(() => () => abortController.abort());
    
    try {
      const fileArray = Array.from(files);
      
      // Validate file sizes
      const maxImageSize = 10 * 1024 * 1024; // 10MB
      const maxVideoSize = 50 * 1024 * 1024; // 50MB
      
      for (const file of fileArray) {
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? maxVideoSize : maxImageSize;
        
        if (file.size > maxSize) {
          throw new Error(`${file.name} is too large. ${isVideo ? 'Videos' : 'Images'} must be under ${isVideo ? '50MB' : '10MB'}`);
        }
      }
      
      // Upload files one by one with progress tracking
      const uploadPromises = fileArray.map(async (file, index) => {
        const result = await uploadToCloudinary(file, {
          folder: 'boat-repairs',
          tags: 'boat-repair',
          onProgress: (progress) => {
            const totalProgress = ((index + progress / 100) / fileArray.length) * 100;
            setUploadProgress(totalProgress);
          },
          signal: abortController.signal
        });
        
        return {
          ...result,
          preview: URL.createObjectURL(file),
          file: file
        };
      });
      
      const results = await Promise.all(uploadPromises);
      
      setUploadedFiles(prev => [...prev, ...results]);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...results.map(r => ({
          filename: r.publicId,
          originalName: r.originalFilename,
          path: r.secureUrl,
          uploadedAt: new Date()
        }))]
      }));
      
      toast.success(`${results.length} file(s) uploaded successfully!`);
      
    } catch (error) {
      if (error.message === 'Upload cancelled' || error.name === 'AbortError' || error.message.includes('aborted')) {
        toast('Upload cancelled', { icon: 'ℹ️' });
      } else {
        toast.error(error.message || 'Upload failed');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCancelUpload(null);
    }
  };
  
  const handleFileRemove = (index) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    
    // Revoke object URL to free memory
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    toast.success('File removed');
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Validation functions
  const validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    
    if (!year) return 'Year is required';
    if (isNaN(yearNum)) return 'Please enter a valid year';
    if (year.length !== 4) return 'Year must be exactly 4 digits';
    if (yearNum < 1900) return 'Year cannot be before 1900';
    if (yearNum > currentYear) return 'Year cannot be in the future';
    return '';
  };

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  };

  const validateTextInput = (value, fieldName, minLength) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    if (value.trim().length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return '';
  };

  const getFieldMinLength = (field) => {
    const minLengths = {
      boatMake: 2,
      boatModel: 2,
      engineModel: 2,
      problemDescription: 10,
      serviceDescription: 5
    };
    return minLengths[field] || 1;
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Dropdown validations (only on submit)
    newErrors.serviceType = validateRequired(formData.serviceType, 'Service type');
    newErrors.boatType = validateRequired(formData.boatType, 'Boat type');
    
    // Text input validations with minimum lengths
    newErrors.boatMake = validateTextInput(formData.boatMake, 'Boat make', 2);
    newErrors.boatModel = validateTextInput(formData.boatModel, 'Boat model', 2);
    newErrors.boatYear = validateYear(formData.boatYear);
    newErrors.problemDescription = validateTextInput(formData.problemDescription, 'Problem description', 10);
    
    // Optional fields - only validate if they have content
    if (formData.engineModel && formData.engineModel.trim().length > 0) {
      newErrors.engineModel = validateTextInput(formData.engineModel, 'Engine model', 2);
    }
    if (formData.serviceDescription && formData.serviceDescription.trim().length > 0) {
      newErrors.serviceDescription = validateTextInput(formData.serviceDescription, 'Service description', 5);
    }
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  // Calendly integration
  // Function to fetch Calendly event details
  const fetchCalendlyEventDetails = async (eventUri) => {
    try {
      // Extract event UUID from URI
      const eventUuid = eventUri.split('/').pop();
      console.log('Event URI:', eventUri);
      console.log('Event UUID:', eventUuid);
      console.log('API Token exists:', !!process.env.REACT_APP_CALENDLY_TOKEN);
      console.log('API Token value:', process.env.REACT_APP_CALENDLY_TOKEN ? 'Token is set' : 'Token is NOT set');
      console.log('API Token length:', process.env.REACT_APP_CALENDLY_TOKEN?.length || 0);
      
      const apiUrl = `https://api.calendly.com/scheduled_events/${eventUuid}`;
      console.log('API URL:', apiUrl);
      
      // Call Calendly API to get event details
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_CALENDLY_TOKEN || 'YOUR_CALENDLY_TOKEN_HERE'}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const eventData = await response.json();
        console.log('Calendly event details:', eventData);
        console.log('Event resource:', eventData.resource);
        console.log('Start time:', eventData.resource?.start_time);
        console.log('End time:', eventData.resource?.end_time);
        
        // Extract the actual scheduled time
        if (eventData.resource?.start_time) {
          const scheduledTime = new Date(eventData.resource.start_time);
          console.log('Parsed scheduled time:', scheduledTime);
          
          setFormData(prev => ({
            ...prev,
            scheduledDateTime: scheduledTime
          }));
          
          toast.success(`Appointment confirmed for ${scheduledTime.toLocaleDateString()} at ${scheduledTime.toLocaleTimeString()}`);
        } else {
          console.error('No start_time found in Calendly response');
          toast.error('Could not find appointment time. Please enter manually.');
        }
      } else {
        console.error('Failed to fetch Calendly event details. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error('Could not fetch appointment details. Please enter manually.');
      }
    } catch (error) {
      console.error('Error fetching Calendly event:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      toast.error('Could not fetch appointment details. Please enter manually.');
    }
  };

  useEffect(() => {
    const handleCalendlyEvent = (e) => {
      // Only process actual Calendly events, ignore React DevTools messages
      if (e.data && e.data.event === 'calendly.event_scheduled') {
        console.log('Calendly event received:', e.data);
        const eventData = e.data.payload;
        console.log('Calendly event data:', eventData);
        
        // Extract data from the correct structure
        const eventUri = eventData.event.uri;
        const inviteeUri = eventData.invitee.uri;
        
        setFormData(prev => ({
          ...prev,
          calendlyEventId: eventUri.split('/').pop(), // Extract ID from URI
          calendlyEventUri: eventUri,
        }));
        
        // Fetch real event details from Calendly API
        fetchCalendlyEventDetails(eventUri);
      }
    };

    window.addEventListener('message', handleCalendlyEvent);
    return () => window.removeEventListener('message', handleCalendlyEvent);
  }, []);

  // Initialize Calendly widget when Step 3 is active
  useEffect(() => {
    if (currentStep === 3) {
      // Load Calendly script dynamically if not already loaded
      if (!window.Calendly) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = () => {
          // Initialize widget after script loads
          setTimeout(() => {
            if (window.Calendly) {
              const widgetElement = document.getElementById('calendly-widget');
              if (widgetElement && !widgetElement.hasChildNodes()) {
                try {
                  window.Calendly.initInlineWidget({
                    url: 'https://calendly.com/abigunhettiarachchi/30min?primary_color=0d9488',
                    parentElement: widgetElement,
                    prefill: {},
                    utm: {}
                  });
                } catch (error) {
                  console.error('Error initializing Calendly widget:', error);
                }
              }
            }
          }, 100);
        };
        document.head.appendChild(script);
      } else {
        // Script already loaded, initialize widget
        setTimeout(() => {
          if (window.Calendly) {
            const widgetElement = document.getElementById('calendly-widget');
            if (widgetElement && !widgetElement.hasChildNodes()) {
              try {
                window.Calendly.initInlineWidget({
                  url: 'https://calendly.com/abigunhettiarachchi/30min?primary_color=0d9488',
                  parentElement: widgetElement,
                  prefill: {},
                  utm: {}
                });
              } catch (error) {
                console.error('Error initializing Calendly widget:', error);
              }
            }
          }
        }, 100);
      }
    }
  }, [currentStep]);

  // Submit repair request
  const submitRepairRequest = async () => {
    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const submissionData = {
        serviceType: formData.serviceType,
        problemDescription: formData.problemDescription,
        serviceDescription: formData.serviceDescription,
        boatDetails: {
          boatType: formData.boatType,
          boatMake: formData.boatMake,
          boatModel: formData.boatModel,
          boatYear: parseInt(formData.boatYear),
          engineType: formData.engineType,
          engineModel: formData.engineModel,
          hullMaterial: formData.hullMaterial
        },
        photos: formData.photos.map(photo => ({
          filename: photo.filename,
          originalName: photo.originalName,
          cloudinaryUrl: photo.cloudinaryUrl,
          cloudinaryId: photo.cloudinaryId
        })),
        scheduledDateTime: formData.scheduledDateTime,
        calendlyEventId: formData.calendlyEventId,
        calendlyEventUri: formData.calendlyEventUri,
        serviceLocation: formData.serviceLocation,
        customerNotes: formData.customerNotes
      };

      console.log('Submitting repair request:', submissionData);

      // Submit to backend
      const response = await createBoatRepair(submissionData);
      
      if (response.success) {
        toast.success('Repair service request submitted successfully! Visit on your scheduled date or contact support for emergencies.');
        
        // Navigate to confirmation page with booking ID
        navigate(`/booking-confirmation/${response.bookingId}`);
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }

    } catch (error) {
      console.error('Error submitting repair request:', error);
      toast.error(error.message || 'Failed to submit repair request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Boat Repair Service</h1>
              <p className="text-gray-600 mt-2">Book a professional repair service for your boat</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > index + 1 
                    ? 'bg-teal-600 border-teal-600 text-white' 
                    : currentStep === index + 1 
                    ? 'border-teal-600 text-teal-600' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > index + 1 ? (
                    <FaCheck className="text-sm" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {title}
                  </p>
                </div>
                {index < stepTitles.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > index + 1 ? 'bg-teal-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className={`bg-white rounded-lg shadow-md ${currentStep === 3 ? 'p-0' : 'p-8'}`}>
          {/* Step 1: Boat Details */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Boat Details</h2>
              
              <div className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    className={`w-full max-w-md px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      errors.serviceType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select service type</option>
                    <option value="engine_repair">Engine Repair</option>
                    <option value="hull_repair">Hull Repair</option>
                    <option value="electrical_repair">Electrical Repair</option>
                    <option value="propeller_repair">Propeller Repair</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.serviceType && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
                  )}
                </div>

                {/* Boat Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boat Type *
                  </label>
                  <select
                    value={formData.boatType}
                    onChange={(e) => handleInputChange('boatType', e.target.value)}
                    className={`w-full max-w-md px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      errors.boatType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select boat type</option>
                    <option value="speedboat">Speedboat</option>
                    <option value="yacht">Yacht</option>
                    <option value="fishing_boat">Fishing Boat</option>
                    <option value="sailboat">Sailboat</option>
                    <option value="jet_ski">Jet Ski</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.boatType && (
                    <p className="mt-1 text-sm text-red-600">{errors.boatType}</p>
                  )}
                </div>

                {/* Boat Make, Model, and Year */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boat Make *
                    </label>
                    <input
                      type="text"
                      value={formData.boatMake}
                      onChange={(e) => handleInputChange('boatMake', e.target.value)}
                      placeholder="e.g., Sea Ray, Bayliner"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                        errors.boatMake ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.boatMake && (
                      <p className="mt-1 text-sm text-red-600">{errors.boatMake}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boat Model *
                    </label>
                    <input
                      type="text"
                      value={formData.boatModel}
                      onChange={(e) => handleInputChange('boatModel', e.target.value)}
                      placeholder="e.g., 240 Sundancer"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                        errors.boatModel ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.boatModel && (
                      <p className="mt-1 text-sm text-red-600">{errors.boatModel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boat Year *
                    </label>
                    <input
                      type="text"
                      value={formData.boatYear}
                      onChange={(e) => {
                        // Only allow 4 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange('boatYear', value);
                      }}
                      placeholder="2020"
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                        errors.boatYear ? 'border-red-500' : formData.boatYear && !errors.boatYear ? 'border-green-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.boatYear ? (
                      <p className="mt-1 text-sm text-red-600">{errors.boatYear}</p>
                    ) : formData.boatYear && formData.boatYear.length === 4 && !errors.boatYear && (
                      <p className="mt-1 text-sm text-green-600">✓ Valid year</p>
                    )}
                  </div>
                </div>


                {/* Engine Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engine Type
                    </label>
                    <select
                      value={formData.engineType}
                      onChange={(e) => handleInputChange('engineType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Select engine type</option>
                      <option value="inboard">Inboard</option>
                      <option value="outboard">Outboard</option>
                      <option value="jet_drive">Jet Drive</option>
                      <option value="electric">Electric</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engine Model
                    </label>
                    <input
                      type="text"
                      value={formData.engineModel}
                      onChange={(e) => handleInputChange('engineModel', e.target.value)}
                      placeholder="e.g., Mercury 250HP"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Hull Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hull Material
                  </label>
                  <select
                    value={formData.hullMaterial}
                    onChange={(e) => handleInputChange('hullMaterial', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select hull material</option>
                    <option value="fiberglass">Fiberglass</option>
                    <option value="aluminum">Aluminum</option>
                    <option value="wood">Wood</option>
                    <option value="steel">Steel</option>
                    <option value="composite">Composite</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problem Description *
                  </label>
                  <textarea
                    value={formData.problemDescription}
                    onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                    placeholder="Describe the specific problem or issue you're experiencing..."
                    rows={4}
                    maxLength={1000}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      errors.problemDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {formData.problemDescription.length}/1000 characters
                  </div>
                  {errors.problemDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.problemDescription}</p>
                  )}
                </div>

                {/* Service Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Requirements (Optional)
                  </label>
                  <textarea
                    value={formData.serviceDescription}
                    onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                    placeholder="Describe any specific service requirements or preferences..."
                    rows={3}
                    maxLength={500}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                      errors.serviceDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {formData.serviceDescription.length}/500 characters
                  </div>
                  {errors.serviceDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceDescription}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: File Upload */}
          {currentStep === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Photos/Videos</h2>
              
              {/* Upload Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3 mt-1">
                    <FaVideo className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">📱 Video Upload Recommendation</h3>
                    <p className="text-blue-700 text-sm">
                      <strong>We highly recommend uploading a video if possible!</strong> Mobile videos under 50MB work best. 
                      Videos help our technicians better understand the problem and provide more accurate estimates.
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                      <strong>Tips:</strong> Record the issue from multiple angles, show any error messages, and include engine sounds if relevant.
                    </div>
                  </div>
                </div>
              </div>
              
              {/* File Size Limits */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">File Size Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <FaImage className="text-teal-600 mr-2" />
                    <span className="text-gray-700"><span className="text-teal-600 font-medium">Images:</span> Up to 10MB each</span>
                  </div>
                  <div className="flex items-center">
                    <FaVideo className="text-teal-600 mr-2" />
                    <span className="text-gray-700"><span className="text-teal-600 font-medium">Videos:</span> Up to 50MB each</span>
                  </div>
                </div>
              </div>
              
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isUploading 
                    ? 'border-teal-400 bg-teal-50' 
                    : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {isUploading ? (
                  <div>
                    <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading Files...</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 mb-4">{Math.round(uploadProgress)}% complete</p>
                    {cancelUpload && (
                      <button
                        onClick={cancelUpload}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Upload
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Photos or Videos</h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop files here, or click to select files
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 cursor-pointer transition-colors"
                    >
                      <FaUpload className="mr-2" />
                      Choose Files
                    </label>
                  </div>
                )}
              </div>
              
              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative bg-white border border-gray-200 rounded-lg p-4">
                        <button
                          onClick={() => handleFileRemove(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                        
                        <div className="text-center">
                          {file.format === 'mp4' || file.format === 'mov' || file.format === 'avi' ? (
                            <div className="mb-2">
                              <video 
                                src={file.cloudinaryUrl || file.preview} 
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                controls
                                preload="metadata"
                              />
                              <p className="text-sm text-gray-600 mt-1">Video</p>
                            </div>
                          ) : (
                            <div className="mb-2">
                              <img 
                                src={file.cloudinaryUrl || file.preview} 
                                alt={file.originalFilename}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <p className="text-sm text-gray-600 mt-1">Image</p>
                            </div>
                          )}
                          
                          <p className="text-sm font-medium text-gray-900 truncate" title={file.originalFilename}>
                            {file.originalFilename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Scheduling */}
          {currentStep === 3 && (
            <div>
              <div className="p-8 pb-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Appointment</h2>
                
                {/* Scheduling Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <FaCalendarAlt className="text-blue-600 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">
                        {formData.scheduledDateTime ? 'Appointment Booked!' : 'Book Your Appointment'}
                      </h3>
                      <p className="text-blue-700 text-sm">
                        {formData.scheduledDateTime ? (
                          <>
                            Your appointment is scheduled for: <strong>
                              {formData.scheduledDateTime.toLocaleDateString()} at {formData.scheduledDateTime.toLocaleTimeString()}
                            </strong>
                            <br /><br />
                            Our technicians will review your boat details and photos before confirming the appointment.
                          </>
                        ) : (
                          <>
                            Please book an appointment below to proceed with your repair service request. 
                            Our technicians will review your boat details and photos before confirming the appointment.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Calendly Widget - No padding constraints */}
              <div className="px-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
                <div 
                  id="calendly-widget"
                  className="calendly-inline-widget" 
                  data-url="https://calendly.com/abigunhettiarachchi/30min?primary_color=0d9488" 
                  style={{ minWidth: '320px', height: '700px' }}>
                </div>
                
                {/* Manual Date/Time Input */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Confirm Your Scheduled Time</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    After booking with Calendly above, please enter your confirmed appointment time below:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scheduled Date
                      </label>
                      <input
                        type="date"
                        value={formData.scheduledDateTime ? formData.scheduledDateTime.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value;
                          const time = formData.scheduledDateTime ? formData.scheduledDateTime.toTimeString().split(' ')[0] : '10:00';
                          setFormData(prev => ({
                            ...prev,
                            scheduledDateTime: new Date(`${date}T${time}`)
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scheduled Time
                      </label>
                      <input
                        type="time"
                        value={formData.scheduledDateTime ? formData.scheduledDateTime.toTimeString().split(' ')[0] : ''}
                        onChange={(e) => {
                          const time = e.target.value;
                          const date = formData.scheduledDateTime ? formData.scheduledDateTime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                          setFormData(prev => ({
                            ...prev,
                            scheduledDateTime: new Date(`${date}T${time}`)
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.scheduledDateTime && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        ✅ Confirmed: {formData.scheduledDateTime.toLocaleDateString()} at {formData.scheduledDateTime.toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="p-8 pt-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Our technician will review your boat details and photos</li>
                    <li>• We'll contact you within 24 hours to confirm the appointment</li>
                    <li>• You'll receive a detailed estimate before work begins</li>
                    <li>• A 30% deposit will be required to secure your appointment slot</li>
                    <li>• Remaining balance will be due after service completion</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Submit Request */}
          {currentStep === 4 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Request</h2>
              
              {/* Service Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Service Summary</h3>
                
                {/* Service Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Service Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Type:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.serviceType?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Boat Type:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.boatType?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engine Type:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.engineType?.replace('_', ' ') || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hull Material:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.hullMaterial?.replace('_', ' ') || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Boat Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Make:</span>
                        <span className="font-medium text-gray-900">{formData.boatMake}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium text-gray-900">{formData.boatModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium text-gray-900">{formData.boatYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engine Model:</span>
                        <span className="font-medium text-gray-900">{formData.engineModel || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Appointment Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled Date:</span>
                        <span className="font-medium text-gray-900">
                          {formData.scheduledDateTime ? formData.scheduledDateTime.toLocaleDateString() : 'Not scheduled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled Time:</span>
                        <span className="font-medium text-gray-900">
                          {formData.scheduledDateTime ? formData.scheduledDateTime.toLocaleTimeString() : 'Not scheduled'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Files Uploaded:</span>
                        <span className="font-medium text-gray-900">{formData.photos.length} files</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calendly Event:</span>
                        <span className="font-medium text-gray-900">
                          {formData.calendlyEventId ? 'Booked' : 'Not booked'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Problem Description</h4>
                  <p className="text-gray-700 bg-white p-4 rounded-lg border">
                    {formData.problemDescription}
                  </p>
                  
                  {formData.serviceDescription && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Service Requirements</h4>
                      <p className="text-gray-700 bg-white p-4 rounded-lg border">
                        {formData.serviceDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">What Happens Next?</h3>
                <div className="space-y-3 text-blue-700">
                  <div className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                    <p><strong>Scheduled Visit:</strong> Visit our service center on your scheduled date: <strong>{formData.scheduledDateTime ? formData.scheduledDateTime.toLocaleDateString() : 'Not scheduled'}</strong></p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                    <p><strong>Estimate Review:</strong> Our technician will analyze your photos/videos and send you a detailed estimate</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                    <p><strong>Service Completion:</strong> Repairs will be completed during your scheduled visit</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                    <p><strong>Payment:</strong> Pay after service completion</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>🚨 Emergency:</strong> For urgent repairs, contact our support line directly for immediate assistance.
                  </p>
                </div>
              </div>
              
              {/* Customer Notes */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.customerNotes}
                  onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                  placeholder="Any additional information or special requests..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              
              {/* Terms and Conditions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Terms & Conditions</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Scheduled Service:</strong> Visit on your scheduled date for repairs</li>
                  <li>• <strong>Estimate Process:</strong> Technician will analyze photos/videos and send estimate</li>
                  <li>• <strong>Emergency Service:</strong> Contact support line for urgent repairs</li>
                  <li>• No payment required upfront - pay after service completion</li>
                  <li>• We provide 90-day warranty on all repairs</li>
                  <li>• Cancellation policy: 24 hours notice required</li>
                  <li>• Photos and videos help us provide accurate estimates</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </button>
          
          <div className="flex space-x-3">
            {/* Development Test Button */}
            <button
              onClick={() => {
                // Fill form with test data
                setFormData({
                  serviceType: 'engine_repair',
                  boatType: 'speedboat',
                  boatMake: 'Sea Ray',
                  boatModel: '240 Sundancer',
                  boatYear: '2020',
                  engineType: 'inboard',
                  engineModel: 'Mercury 250HP',
                  hullMaterial: 'fiberglass',
                  problemDescription: 'Engine is making strange noises and not starting properly. This is a test description for development purposes.',
                  serviceDescription: 'Please check engine mounts and fuel system. Test service requirements.',
                  photos: [],
                  preferredDate: '',
                  preferredTimeSlot: '',
                  serviceLocation: {
                    type: 'service_center',
                    address: {
                      street: '',
                      city: '',
                      district: '',
                      postalCode: ''
                    }
                  },
                  customerNotes: ''
                });
                setErrors({});
                setCurrentStep(2);
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              🧪 Test Data (Dev)
            </button>
            
            {currentStep === totalSteps ? (
              <button
                onClick={submitRepairRequest}
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 rounded-lg font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairService;