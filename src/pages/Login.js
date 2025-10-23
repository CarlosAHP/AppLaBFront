import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, LogIn, FlaskConical, Shield, Heart, MapPin, Clock, Users, Award, Target, Phone, Mail, Settings, User } from 'lucide-react';
import toast from 'react-hot-toast';
import ConnectionDiagnostic from '../components/ConnectionDiagnostic';
import RateLimitNotification from '../components/RateLimitNotification';
import AuthDiagnostic from '../components/AuthDiagnostic';
import SentryDiagnostic from '../components/SentryDiagnostic';
import { useRateLimit } from '../hooks/useRateLimit';
import { formatAuthError } from '../utils/authDiagnostic';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSection, setCurrentSection] = useState('login');
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [showAuthDiagnostic, setShowAuthDiagnostic] = useState(false);
  const [showSentryDiagnostic, setShowSentryDiagnostic] = useState(false);
  const { login, isAuthenticated, error, clearError } = useAuth();
  const { retryAfter, isRateLimited, handleRateLimitError, clearRateLimitError } = useRateLimit();
  const navigate = useNavigate();
  const location = useLocation();
  const loginSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Efecto para detectar scroll y hacer transiciones automáticas
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout;

    const handleScroll = () => {
      if (isScrolling) return;
      
      isScrolling = true;
      clearTimeout(scrollTimeout);
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Detectar si estamos en la sección de login o about
      if (aboutSectionRef.current && loginSectionRef.current) {
        
        // Si estamos cerca del final de la sección de login, hacer scroll automático a about
        if (scrollY > windowHeight * 0.3 && scrollY < windowHeight * 0.7 && currentSection === 'login') {
          setCurrentSection('about');
          aboutSectionRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
        // Si estamos cerca del inicio de la sección about, hacer scroll automático a login
        else if (scrollY < windowHeight * 0.3 && currentSection === 'about') {
          setCurrentSection('login');
          loginSectionRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
        
        // La sección about está visible cuando está en el viewport
      }
      
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentSection]);

  const getRedirectPath = (userRole) => {
    const rolePaths = {
      admin: '/dashboard',
      secretary: '/dashboard',
      doctor: '/dashboard',
      technician: '/dashboard'
    };
    return rolePaths[userRole] || '/dashboard';
  };

  const onSubmit = async (data) => {
    try {
      // Limpiar errores previos
      clearRateLimitError();
      
      const result = await login(data.username, data.password);
      if (result.success) {
        toast.success('¡Bienvenido!');
        // Redireccionar según el rol del usuario
        const redirectPath = getRedirectPath(result.user?.role);
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Manejar error 429 específicamente
      if (handleRateLimitError(error)) {
        // El hook ya maneja el error 429, no mostrar toast adicional
        return;
      }
      
      if (error.message.includes('CORS') || error.message.includes('ERR_NETWORK')) {
        toast.error('Error de conexión. Verifica que el servidor esté ejecutándose en http://localhost:5002');
      } else {
        const formattedError = formatAuthError(error);
        toast.error(formattedError);
        
        // Si es un error 401, mostrar diagnóstico de autenticación
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          setTimeout(() => {
            setShowAuthDiagnostic(true);
          }, 2000);
        }
      }
    }
  };


  return (
    <div ref={loginSectionRef} className="min-h-screen relative overflow-hidden bg-gradient-to-br from-lab-950 via-lab-900 to-primary-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/10 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-lab-400/10 rounded-full blur-xl animate-pulse-slow delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse-slow delay-500"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center animate-slide-up">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-2xl shadow-primary-500/25">
              <FlaskConical className="h-10 w-10 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              Laboratorio Esperanza
            </h1>
            <p className="mt-2 text-lg text-white/80">
              Sistema de Gestión de Resultados
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-primary-200">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Acceso Seguro</span>
              <Heart className="h-5 w-5" />
            </div>
          </div>
          
          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 animate-slide-up">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-white mb-2">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.username ? 'border-red-400 ring-2 ring-red-400' : ''
                      }`}
                      placeholder="Ingresa tu usuario"
                      {...register('username', {
                        required: 'El nombre de usuario es requerido'
                      })}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                      {errors.username.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.password ? 'border-red-400 ring-2 ring-red-400' : ''
                      }`}
                      placeholder="Ingresa tu contraseña"
                      {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 6,
                          message: 'La contraseña debe tener al menos 6 caracteres'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-white/10 rounded-r-xl transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>

              {/* Demo Credentials */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-center text-sm text-white/80 mb-3">
                  <span className="font-semibold text-primary-200">Credenciales de Prueba</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 mb-1">Administrador</p>
                    <p className="text-white font-mono text-xs">admin</p>
                    <p className="text-white/60 text-xs">Admin123!</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 mb-1">Doctor</p>
                    <p className="text-white font-mono text-xs">doctor1</p>
                    <p className="text-white/60 text-xs">Doctor123!</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 mb-1">Secretaria</p>
                    <p className="text-white font-mono text-xs">secretaria1</p>
                    <p className="text-white/60 text-xs">Secret123!</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 mb-1">Técnico</p>
                    <p className="text-white font-mono text-xs">tecnico1</p>
                    <p className="text-white/60 text-xs">Tecnic123!</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center animate-fade-in">
            <p className="text-white/60 text-sm mb-4">
              © 2024 Laboratorio Esperanza. Todos los derechos reservados.
            </p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowDiagnostic(true)}
                className="flex items-center justify-center mx-auto px-3 py-2 text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Diagnóstico de Conexión
              </button>
              <button
                onClick={() => setShowAuthDiagnostic(true)}
                className="flex items-center justify-center mx-auto px-3 py-2 text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                Diagnóstico de Autenticación
              </button>
              <button
                onClick={() => setShowSentryDiagnostic(true)}
                className="flex items-center justify-center mx-auto px-3 py-2 text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                Diagnóstico de Sentry
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Transición entre secciones */}
      <div className="relative h-32 bg-gradient-to-b from-primary-800 via-primary-600 to-white overflow-hidden">
        {/* Elementos decorativos en la transición */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-12 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-6 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-1500"></div>
        </div>
        
        {/* Ondas decorativas */}
        <div className="absolute bottom-0 left-0 w-full h-16">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                  fill="white" 
                  opacity="0.25"/>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                  fill="white" 
                  opacity="0.5"/>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                  fill="white"/>
          </svg>
        </div>
      </div>

      {/* Sección Quiénes Somos */}
      <div 
        ref={aboutSectionRef}
        className={`relative bg-white py-20 overflow-hidden transition-all duration-1000 ${
          currentSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Imagen de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/img2.svg')`,
              backgroundAttachment: 'fixed'
            }}
          ></div>
        </div>
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-white"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-lab-900 mb-4">
              Quiénes Somos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Laboratorio Esperanza: Comprometidos con la excelencia en diagnóstico clínico y el cuidado de la salud de nuestra comunidad.
            </p>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Misión */}
            <div className={`bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
              currentSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-500 rounded-xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-lab-900 ml-4">Nuestra Misión</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Proporcionar servicios de diagnóstico clínico de alta calidad, utilizando tecnología de vanguardia y un equipo de profesionales altamente capacitados para contribuir al bienestar y la salud de nuestros pacientes.
              </p>
            </div>

            {/* Visión */}
            <div className={`bg-gradient-to-br from-lab-50 to-lab-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
              currentSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-lab-600 rounded-xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-lab-900 ml-4">Nuestra Visión</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ser el laboratorio de referencia en nuestra región, reconocido por la excelencia en nuestros servicios, la innovación tecnológica y el compromiso inquebrantable con la salud de la comunidad.
              </p>
            </div>

            {/* Valores */}
            <div className={`bg-gradient-to-br from-primary-50 to-lab-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1 ${
              currentSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-primary-500 to-lab-500 rounded-xl">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-lab-900 ml-4">Nuestros Valores</h3>
              </div>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  Excelencia en el servicio
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  Confiabilidad y precisión
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  Compromiso con la salud
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  Innovación constante
                </li>
              </ul>
            </div>
          </div>

          {/* Información de contacto y ubicación */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Ubicación */}
            <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg transition-all duration-500 ${
              currentSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary-500 rounded-xl">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-lab-900 ml-4">Ubicación</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-500 mt-1 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Dirección Principal</p>
                    <p className="text-gray-600">3ra, calle 3-03 zona 3 </p>
                    <p className="text-gray-600">Departamento de Sacatepequez</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary-500 mt-1 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Horarios de Atención</p>
                    <p className="text-gray-600">Lunes a Viernes: 7:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sábados: 8:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className={`bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-lg transition-all duration-500 ${
              currentSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`} style={{ transitionDelay: '1000ms' }}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-lab-600 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-lab-900 ml-4">Contacto</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Teléfono</p>
                    <p className="text-gray-600">(502) 5596-8317</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">info@laboratorioesperanza.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Emergencias</p>
                    <p className="text-gray-600">24/7 - Línea directa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className={`text-center mt-16 transition-all duration-500 ${
            currentSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1200ms' }}>
            <div className="bg-gradient-to-r from-primary-600 to-lab-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">
                ¿Listo para comenzar?
              </h3>
              <p className="text-xl mb-6 opacity-90">
                Accede a nuestro sistema de gestión de resultados de laboratorio
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary-200">
                <Shield className="h-6 w-6" />
                <span className="text-lg">Acceso seguro y confiable</span>
                <Heart className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de diagnóstico */}
      {showDiagnostic && (
        <ConnectionDiagnostic onClose={() => setShowDiagnostic(false)} />
      )}

      {/* Notificación de rate limit */}
      {isRateLimited && (
        <RateLimitNotification 
          onClose={clearRateLimitError}
          retryAfter={retryAfter}
        />
      )}

      {/* Diagnóstico de autenticación */}
      {showAuthDiagnostic && (
        <AuthDiagnostic 
          onClose={() => setShowAuthDiagnostic(false)}
          onTestLogin={async (username, password) => {
            try {
              const result = await login(username, password);
              if (result.success) {
                toast.success('¡Login exitoso!');
                const redirectPath = getRedirectPath(result.user?.role);
                navigate(redirectPath, { replace: true });
              }
            } catch (error) {
              console.error('Test login error:', error);
            }
          }}
        />
      )}

      {showSentryDiagnostic && (
        <SentryDiagnostic 
          onClose={() => setShowSentryDiagnostic(false)}
        />
      )}
    </div>
  );
};

export default Login;
