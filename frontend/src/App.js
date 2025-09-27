import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Common Pages
import Home from './common/Home';
import NotFound from './common/NotFound';

// User Pages
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Profile from './pages/user/Profile';
import Dashboard from './pages/user/dashboards/Dashboard';
import MyBookings from './pages/user/MyBookings';
import MyRepairs from './pages/user/MyRepairs';
import RepairDetails from './pages/user/RepairDetails';
import ServiceHistory from './pages/user/ServiceHistory';

// Function Pages
import BoatRideBooking from './pages/rideBooking/BoatRideBooking';
import RepairService from './pages/repairService/RepairService';
import BoatPurchase from './pages/purchaseVisit/BoatPurchase';
import BookingConfirmation from './pages/repairService/BookingConfirmation';
import SparePartsStore from './pages/spareParts/SparePartsStore';
import PaymentHistory from './pages/payment/PaymentHistory';

// Employee Pages
import RepairManagementList from './pages/employee/RepairManagementList';
import RepairManagementDetail from './pages/employee/RepairManagementDetail';
import RideManagement from './pages/rideBooking/RideManagement';
import PurchaseManagement from './pages/purchaseVisit/PurchaseManagement';
import SparePartsManagement from './pages/spareParts/SparePartsManagement';
import EmployeeProfile from './pages/user/EmployeeProfile';
import CustomerSupport from './common/CustomerSupport';

// Admin Pages
import CreateEmployee from './pages/admin/CreateEmployee';
import UserManagementList from './pages/admin/UserManagementList';
import UserDetails from './pages/admin/UserDetails';

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
              <Route path="/repair-service/edit/:id" element={<ProtectedRoute><RepairService /></ProtectedRoute>} />
              <Route path="/boat-purchase" element={<ProtectedRoute><BoatPurchase /></ProtectedRoute>} />
              <Route path="/spare-parts" element={<ProtectedRoute><SparePartsStore /></ProtectedRoute>} />
              <Route path="/booking-confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/my-repairs" element={<ProtectedRoute><MyRepairs /></ProtectedRoute>} />
              <Route path="/repair-details/:id" element={<ProtectedRoute><RepairDetails /></ProtectedRoute>} />
              <Route path="/service-history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>} />
              <Route path="/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Employee Routes */}
              <Route path="/employee/repair-management" element={<ProtectedRoute requiredRole="employee"><RepairManagementList /></ProtectedRoute>} />
              <Route path="/employee/repair-management/:id" element={<ProtectedRoute requiredRole="employee"><RepairManagementDetail /></ProtectedRoute>} />
              <Route path="/employee/ride-management" element={<ProtectedRoute requiredRole="employee"><RideManagement /></ProtectedRoute>} />
              <Route path="/employee/purchase-management" element={<ProtectedRoute requiredRole="employee"><PurchaseManagement /></ProtectedRoute>} />
              <Route path="/employee/spare-parts-management" element={<ProtectedRoute requiredRole="employee"><SparePartsManagement /></ProtectedRoute>} />
              <Route path="/employee/profile" element={<ProtectedRoute requiredRole="employee"><EmployeeProfile /></ProtectedRoute>} />
              <Route path="/employee/customer-support" element={<ProtectedRoute requiredRole="employee"><CustomerSupport /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/create-employee" element={<ProtectedRoute requiredRole="admin"><CreateEmployee /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagementList /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute requiredRole="admin"><UserDetails /></ProtectedRoute>} />
              <Route path="/admin/users/:id/edit" element={<ProtectedRoute requiredRole="admin"><UserDetails /></ProtectedRoute>} />
              
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
