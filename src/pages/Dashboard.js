import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import SecretaryDashboard from '../components/SecretaryDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import UserDashboard from '../components/UserDashboard';

const Dashboard = () => {
  const { user, hasRole } = useAuth();

  // Debug: mostrar información del usuario
  console.log('Dashboard - User:', user);
  console.log('Dashboard - User role:', user?.role);
  console.log('Dashboard - hasRole admin:', hasRole('admin'));
  console.log('Dashboard - hasRole secretary:', hasRole('secretary'));
  console.log('Dashboard - hasRole doctor:', hasRole('doctor'));
  console.log('Dashboard - hasRole user:', hasRole('user'));

  // Renderizar dashboard específico según el rol
  if (hasRole('admin')) {
    return <AdminDashboard />;
  }
  
  if (hasRole('secretary')) {
    return <SecretaryDashboard />;
  }
  
  if (hasRole('doctor')) {
    return <DoctorDashboard />;
  }

  if (hasRole('user')) {
    return <UserDashboard />;
  }

  // Dashboard por defecto para otros roles (técnico, etc.)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">Bienvenido, {user?.first_name || user?.name}</p>
        <p className="text-sm text-gray-500 mt-2">Rol: {user?.role}</p>
      </div>
    </div>
  );
};

export default Dashboard;

