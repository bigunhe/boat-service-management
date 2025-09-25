import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Booking Pages
import BoatRideBooking from './pages/booking/BoatRideBooking';
import RepairService from './pages/booking/RepairService';
import BoatPurchase from './pages/booking/BoatPurchase';
import BookingConfirmation from './pages/booking/BookingConfirmation';
import SparePartsStore from './pages/ecommerce/SparePartsStore';
import MyBookings from './pages/booking/MyBookings';
import ServiceHistory from './pages/history/ServiceHistory';
import PaymentHistory from './pages/payment/PaymentHistory';

// Employee Pages
import RepairManagement from './pages/employee/RepairManagement';
import RideManagement from './pages/employee/RideManagement';
import PurchaseManagement from './pages/employee/PurchaseManagement';
import SparePartsManagement from './pages/employee/SparePartsManagement';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import CustomerSupport from './pages/employee/CustomerSupport';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Customer Routes */}
              <Route path="/boat-rides" element={<ProtectedRoute><BoatRideBooking /></ProtectedRoute>} />
              <Route path="/repair-service" element={<ProtectedRoute><RepairService /></ProtectedRoute>} />
              <Route path="/boat-purchase" element={<ProtectedRoute><BoatPurchase /></ProtectedRoute>} />
              <Route path="/spare-parts" element={<ProtectedRoute><SparePartsStore /></ProtectedRoute>} />
              <Route path="/booking-confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/service-history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>} />
              <Route path="/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Employee Routes */}
              <Route path="/employee/repair-management" element={<ProtectedRoute requiredRole="employee"><RepairManagement /></ProtectedRoute>} />
              <Route path="/employee/ride-management" element={<ProtectedRoute requiredRole="employee"><RideManagement /></ProtectedRoute>} />
              <Route path="/employee/purchase-management" element={<ProtectedRoute requiredRole="employee"><PurchaseManagement /></ProtectedRoute>} />
              <Route path="/employee/spare-parts-management" element={<ProtectedRoute requiredRole="employee"><SparePartsManagement /></ProtectedRoute>} />
              <Route path="/employee/profile" element={<ProtectedRoute requiredRole="employee"><EmployeeProfile /></ProtectedRoute>} />
              <Route path="/employee/customer-support" element={<ProtectedRoute requiredRole="employee"><CustomerSupport /></ProtectedRoute>} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
