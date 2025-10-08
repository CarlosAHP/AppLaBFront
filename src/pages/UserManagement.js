import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserManagementComponent from '../components/UserManagement';
import UserRegistrationForm from '../components/UserRegistrationForm';
import UserEditForm from '../components/UserEditForm';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { hasRole, user: currentUser, updateProfile } = useAuth();
  const [showUserRegistration, setShowUserRegistration] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Verificar que el usuario tenga permisos de administrador
  if (!hasRole('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  // Funciones para manejar el módulo de administración
  const handleCreateUser = () => {
    setShowUserRegistration(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserEdit(true);
  };

  const handleUserRegistrationSuccess = () => {
    setShowUserRegistration(false);
    toast.success('Usuario creado exitosamente');
  };

  const handleUserEditSuccess = async (updatedUser) => {
    setShowUserEdit(false);
    setSelectedUser(null);
    
    // Si el usuario actualizado es el usuario actual, actualizar el contexto
    if (updatedUser && currentUser && updatedUser.id === currentUser.id) {
      console.log('UserManagement - Updating current user context after profile edit');
      try {
        await updateProfile(updatedUser);
        toast.success('Perfil actualizado exitosamente');
      } catch (error) {
        console.error('Error updating user context:', error);
        toast.success('Usuario actualizado exitosamente');
      }
    } else {
      toast.success('Usuario actualizado exitosamente');
    }
  };

  const handleCloseUserRegistration = () => {
    setShowUserRegistration(false);
  };

  const handleCloseUserEdit = () => {
    setShowUserEdit(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Módulo de administración */}
        <UserManagementComponent 
          onEditUser={handleEditUser}
          onCreateUser={handleCreateUser}
        />

        {/* Modales */}
        {showUserRegistration && (
          <UserRegistrationForm
            onClose={handleCloseUserRegistration}
            onSuccess={handleUserRegistrationSuccess}
          />
        )}

        {showUserEdit && selectedUser && (
          <UserEditForm
            user={selectedUser}
            onClose={handleCloseUserEdit}
            onSuccess={handleUserEditSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;

