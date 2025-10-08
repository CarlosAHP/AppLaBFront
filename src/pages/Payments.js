import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { paymentsService } from '../services/paymentsService';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CreditCard, 
  Calendar,
  User,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const Payments = () => {
  const { user, hasRole } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    loadPayments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPayments = async () => {
    try {
      setLoading(true);
      let response;
      
      // Si es usuario regular, solo cargar sus propios pagos
      if (hasRole('user')) {
        response = await paymentsService.getUserPayments(user.id);
      } else {
        // Para admin, secretaria y doctor, cargar todos los pagos
        response = await paymentsService.getPayments();
      }
      
      setPayments(response.data || []);
    } catch (error) {
      toast.error('Error al cargar pagos');
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingPayment) {
        // Solo admin y secretaria pueden editar pagos
        if (!hasRole('admin') && !hasRole('secretary')) {
          toast.error('No tienes permisos para editar pagos');
          return;
        }
        await paymentsService.updatePayment(editingPayment.id, data);
        toast.success('Pago actualizado exitosamente');
      } else {
        // Agregar información del usuario si es usuario regular
        if (hasRole('user')) {
          data.user_id = user.id;
          data.patient_name = user.name || user.first_name + ' ' + user.last_name;
        }
        await paymentsService.createPayment(data);
        toast.success('Pago registrado exitosamente');
      }
      
      setShowModal(false);
      setEditingPayment(null);
      reset();
      loadPayments();
    } catch (error) {
      toast.error(error.message || 'Error al guardar pago');
    }
  };

  const handleEdit = (payment) => {
    // Solo admin y secretaria pueden editar pagos
    if (!hasRole('admin') && !hasRole('secretary')) {
      toast.error('No tienes permisos para editar pagos');
      return;
    }
    
    setEditingPayment(payment);
    reset({
      patient_name: payment.patient_name,
      amount: payment.amount,
      payment_method: payment.payment_method,
      payment_date: payment.payment_date?.split('T')[0],
      notes: payment.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Solo admin y secretaria pueden eliminar pagos
    if (!hasRole('admin') && !hasRole('secretary')) {
      toast.error('No tienes permisos para eliminar pagos');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      try {
        await paymentsService.deletePayment(id);
        toast.success('Pago eliminado exitosamente');
        loadPayments();
      } catch (error) {
        toast.error('Error al eliminar pago');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPayment(null);
    reset();
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.payment_method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const getMethodBadge = (method) => {
    const methodConfig = {
      efectivo: { color: 'bg-green-100 text-green-800', label: 'Efectivo' },
      tarjeta: { color: 'bg-blue-100 text-blue-800', label: 'Tarjeta' },
      transferencia: { color: 'bg-purple-100 text-purple-800', label: 'Transferencia' },
      cheque: { color: 'bg-yellow-100 text-yellow-800', label: 'Cheque' }
    };
    
    const config = methodConfig[method] || methodConfig.efectivo;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {hasRole('user') ? 'Mis Pagos' : 'Gestión de Pagos'}
          </h1>
          <p className="text-gray-600 mt-1">
            {hasRole('user') 
              ? 'Consulta y realiza tus pagos' 
              : 'Administra los pagos de los pacientes'
            }
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          {hasRole('user') ? 'Realizar Pago' : 'Nuevo Pago'}
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Total de Pagos</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por paciente o método de pago..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">Todos los métodos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notas
                </th>
                {(hasRole('admin') || hasRole('secretary')) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {payment.patient_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getMethodBadge(payment.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {payment.notes || '-'}
                    </div>
                  </td>
                  {(hasRole('admin') || hasRole('secretary')) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || methodFilter !== 'all' 
                ? 'No se encontraron pagos con los filtros aplicados.'
                : 'Comienza registrando un nuevo pago.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPayment ? 'Editar Pago' : 'Nuevo Pago'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!hasRole('user') && (
                  <div>
                    <label className="form-label">Nombre del Paciente</label>
                    <input
                      type="text"
                      className={`input-field ${errors.patient_name ? 'border-red-500' : ''}`}
                      placeholder="Juan Pérez"
                      {...register('patient_name', {
                        required: !hasRole('user') ? 'El nombre del paciente es requerido' : false
                      })}
                    />
                    {errors.patient_name && (
                      <p className="error-message">{errors.patient_name.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="form-label">Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
                    placeholder="150.00"
                    {...register('amount', {
                      required: 'El monto es requerido',
                      min: {
                        value: 0.01,
                        message: 'El monto debe ser mayor a 0'
                      }
                    })}
                  />
                  {errors.amount && (
                    <p className="error-message">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Método de Pago</label>
                  <select
                    className={`input-field ${errors.payment_method ? 'border-red-500' : ''}`}
                    {...register('payment_method', {
                      required: 'El método de pago es requerido'
                    })}
                  >
                    <option value="">Seleccionar método</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="cheque">Cheque</option>
                  </select>
                  {errors.payment_method && (
                    <p className="error-message">{errors.payment_method.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Fecha de Pago</label>
                  <input
                    type="date"
                    className={`input-field ${errors.payment_date ? 'border-red-500' : ''}`}
                    {...register('payment_date', {
                      required: 'La fecha de pago es requerida'
                    })}
                  />
                  {errors.payment_date && (
                    <p className="error-message">{errors.payment_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Notas (Opcional)</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Notas adicionales sobre el pago..."
                    {...register('notes')}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;

