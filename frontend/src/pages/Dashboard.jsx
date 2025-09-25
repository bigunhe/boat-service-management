import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './dashboards/CustomerDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const firstName = user?.name?.split(' ')[0] || 'User';

  switch (user.role) {
    case 'customer':
      return <CustomerDashboard firstName={firstName} />;
    case 'employee':
      return <EmployeeDashboard firstName={firstName} />;
    case 'admin':
      return <AdminDashboard firstName={firstName} />;
    default:
      return <CustomerDashboard firstName={firstName} />;
  }
};

export default Dashboard;
