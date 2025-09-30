import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Common Pages
import Home from './common/Home';
import NotFound from './common/NotFound';

// Public Pages
import AboutUs from './pages/public/AboutUs';
import Services from './pages/public/Services';
import ContactUs from './pages/public/ContactUs';
import ServiceInfo from './pages/public/ServiceInfo';

// User Pages
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Profile from './pages/user/Profile';
import CustomerProfile from './pages/user/CustomerProfile';
import Dashboard from './pages/user/dashboards/Dashboard';
import MyBookings from './pages/user/MyBookings';
import MyRepairs from './pages/user/MyRepairs';
import RepairDetails from './pages/user/RepairDetails';
import ServiceHistory from './pages/user/ServiceHistory';

// Auth Pages
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Function Pages
import BoatRideBooking from './pages/rideBooking/BoatRideBooking';
import RideConfirmation from './pages/rideBooking/RideConfirmation';
import MyRides from './pages/rideBooking/MyRides';
import RepairService from './pages/repairService/RepairService';
import BoatPurchase from './pages/purchaseVisit/BoatPurchase';
import BookingConfirmation from './pages/repairService/BookingConfirmation';
import SparePartsStore from './pages/spareParts/SparePartsStore';
import ShopCategory from './pages/spareParts/ShopCategory';
import ProductDetailsPage from './pages/spareParts/ProductDetailsPage';
import InventoryManagement from './pages/spareParts/InventoryManagement';
import CreateProduct from './pages/spareParts/CreateProduct';
import EditProduct from './pages/spareParts/EditProduct';
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
import AdminProfile from './pages/admin/AdminProfile';
import UserAnalytics from './pages/admin/UserAnalytics';
import RepairAnalytics from './pages/admin/RepairAnalytics';
import FinancialAnalytics from './pages/admin/FinancialAnalytics';


// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/service-info/:serviceType" element={<ServiceInfo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Customer Routes */}
              <Route path="/boat-rides" element={<ProtectedRoute><BoatRideBooking /></ProtectedRoute>} />
              <Route path="/ride-confirmation/:id" element={<ProtectedRoute><RideConfirmation /></ProtectedRoute>} />
              <Route path="/my-rides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
              <Route path="/repair-service" element={<ProtectedRoute><RepairService /></ProtectedRoute>} />
              <Route path="/repair-service/edit/:id" element={<ProtectedRoute><RepairService /></ProtectedRoute>} />
              <Route path="/boat-purchase" element={<ProtectedRoute><BoatPurchase /></ProtectedRoute>} />
              <Route path="/spare-parts" element={<ProtectedRoute><ShopCategory /></ProtectedRoute>} />
              <Route path="/spare-parts/:id" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
              <Route path="/booking-confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/my-repairs" element={<ProtectedRoute><MyRepairs /></ProtectedRoute>} />
              <Route path="/repair-details/:id" element={<ProtectedRoute><RepairDetails /></ProtectedRoute>} />
              <Route path="/service-history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>} />
              <Route path="/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
              
              {/* Employee Routes */}
              <Route path="/employee/repair-management" element={<ProtectedRoute requiredRole="employee"><RepairManagementList /></ProtectedRoute>} />
              <Route path="/employee/repair-management/:id" element={<ProtectedRoute requiredRole="employee"><RepairManagementDetail /></ProtectedRoute>} />
              <Route path="/employee/ride-management" element={<ProtectedRoute requiredRole="employee"><RideManagement /></ProtectedRoute>} />
              <Route path="/employee/purchase-management" element={<ProtectedRoute requiredRole="employee"><PurchaseManagement /></ProtectedRoute>} />
              <Route path="/employee/spare-parts-management" element={<ProtectedRoute requiredRole="employee"><SparePartsManagement /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute requiredRole="employee"><InventoryManagement /></ProtectedRoute>} />
              <Route path="/inventory/create" element={<ProtectedRoute requiredRole="employee"><CreateProduct /></ProtectedRoute>} />
              <Route path="/inventory/edit/:id" element={<ProtectedRoute requiredRole="employee"><EditProduct /></ProtectedRoute>} />
              <Route path="/employee/profile" element={<ProtectedRoute requiredRole="employee"><EmployeeProfile /></ProtectedRoute>} />
              <Route path="/employee/customer-support" element={<ProtectedRoute requiredRole="employee"><CustomerSupport /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/create-employee" element={<ProtectedRoute requiredRole="admin"><CreateEmployee /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagementList /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute requiredRole="admin"><UserDetails /></ProtectedRoute>} />
              <Route path="/admin/users/:id/edit" element={<ProtectedRoute requiredRole="admin"><UserDetails /></ProtectedRoute>} />
              <Route path="/admin/profile" element={<ProtectedRoute requiredRole="admin"><AdminProfile /></ProtectedRoute>} />
              <Route path="/admin/user-analytics" element={<ProtectedRoute requiredRole="admin"><UserAnalytics /></ProtectedRoute>} />
              <Route path="/admin/repair-analytics" element={<ProtectedRoute requiredRole="admin"><RepairAnalytics /></ProtectedRoute>} />
              <Route path="/admin/financial-analytics" element={<ProtectedRoute requiredRole="admin"><FinancialAnalytics /></ProtectedRoute>} />
              
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
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
