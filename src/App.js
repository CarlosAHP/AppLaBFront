import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LabResults from './pages/LabResults';
import PatientManagement from './pages/PatientManagement';
import Payments from './pages/Payments';
import Sync from './pages/Sync';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import WordToHtmlConverter from './components/WordToHtmlConverter';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/lab-results" element={
              <ProtectedRoute>
                <Layout>
                  <LabResults />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/patients" element={
              <ProtectedRoute requiredRoles={['admin', 'secretary', 'doctor']}>
                <Layout>
                  <PatientManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/word-converter" element={
              <ProtectedRoute requiredRoles={['admin', 'secretary', 'doctor']}>
                <Layout>
                  <WordToHtmlConverter />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/payments" element={
              <ProtectedRoute requiredRoles={['admin', 'secretary', 'doctor', 'user']}>
                <Layout>
                  <Payments />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/sync" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Layout>
                  <Sync />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/user-management" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
