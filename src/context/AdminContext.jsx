// src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AdminContext - Contexto principal para el manejo de datos administrativos
 * Centraliza la lógica de datos del backend para todos los componentes admin
 * 
 * 🎯 ESTADO ACTUAL: FUNCIONANDO CON DATOS MOCK
 * - Todas las funciones tienen datos mock temporales
 * - Los endpoints reales están comentados y listos para activar
 * - Solo necesitas descomentar y conectar el backend real
 * 
 * 📋 COMPONENTES QUE USAN AdminContext:
 * ✅ BienvenidaAdmin.jsx - adminProfile, refreshDashboard, dashboardData
 * ✅ inicio-admin.jsx - dashboardData, loadDashboardMetrics (via AdminNotificationContext)
 * ✅ ListaAlumnos_Admin_comp.jsx - loadStudentsData, deleteStudent, updateStudent
 * ✅ ValidacionPagos_Admin_comp.jsx - loadPaymentsData, approvePayment, rejectPayment, generateContract, uploadContract
 * ✅ Configuracion_Admin_comp.jsx - adminProfile, updateAdminProfile, uploadAdminAvatar
 * 
 * ❌ COMPONENTES QUE NO USAN AdminContext (usan API directa):
 * ❌ ComprobanteRecibo.jsx - API directa para validación específica de recibos
 * ❌ Calendario_Admin_comp.jsx - API directa para eventos de calendario específicos
 * 
 * 🚀 TODO BACKEND:
 * 1. Crear endpoints en el backend según la documentación
 * 2. Descomentar las llamadas fetch reales
 * 3. Comentar/eliminar los datos mock
 */
const AdminContext = createContext();

/**
 * Hook para consumir el contexto administrativo
 * @returns {Object} Estado y métodos del contexto administrativo
 */
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext debe usarse dentro de AdminProvider');
  }
  return context;
};

/**
 * Provider del contexto administrativo
 * Maneja todo el estado global de la aplicación administrativa
 */
export const AdminProvider = ({ children }) => {
  // Estados principales
  const [dashboardData, setDashboardData] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Estados específicos para diferentes secciones
  const [studentsData, setStudentsData] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [systemStatus, setSystemStatus] = useState('online');

  /**
   * 📊 FUNCIÓN: loadDashboardMetrics
   * 
   * 🎯 USADO POR:
   * - BienvenidaAdmin.jsx: Carga métricas en el dashboard principal
   * - inicio-admin.jsx: Via AdminNotificationContext para métricas en tiempo real
   * 
   * 📡 ENDPOINT: GET /api/admin/dashboard/metrics
   * 
   * 💡 EJEMPLO DE USO:
   * const { dashboardData, loadDashboardMetrics } = useAdminContext();
   * useEffect(() => { loadDashboardMetrics(); }, []);
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   ingresos: 125000,
   *   pagosPendientes: 23,
   *   nuevosAlumnos: 15,
   *   cursosActivos: 8,
   *   accesosActivados: 42
   * }
   */
  const loadDashboardMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch('/api/admin/dashboard/metrics', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      
      // const data = await response.json();
      
      // MOCK DATA - Simular datos temporales hasta que el backend esté listo
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular latencia
      
      const mockData = {
        ingresos: 125000 + Math.floor(Math.random() * 50000),
        pagosPendientes: 23 + Math.floor(Math.random() * 10),
        nuevosAlumnos: 15 + Math.floor(Math.random() * 5),
        cursosActivos: 8 + Math.floor(Math.random() * 3),
        accesosActivados: 42 + Math.floor(Math.random() * 20)
      };
      
      setDashboardData(mockData);
      setLastUpdated(new Date().toISOString());
      
    } catch (err) {
      setError(err.message);
      console.error('Dashboard metrics error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 👤 FUNCIÓN: loadAdminProfile
   * 
   * 🎯 USADO POR:
   * - BienvenidaAdmin.jsx: Muestra datos del admin y avatar
   * - Configuracion_Admin_comp.jsx: Carga datos para edición de perfil
   * 
   * 📡 ENDPOINT: GET /api/admin/profile
   * 
   * 💡 EJEMPLO DE USO:
   * const { adminProfile } = useAdminContext();
   * <img src={adminProfile?.avatar} alt="Avatar" />
   * <h2>{adminProfile?.name}</h2>
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   id: 'admin_001',
   *   name: 'Administrador Principal',
   *   email: 'admin@mqerk.academy',
   *   role: 'Super Admin',
   *   avatar: 'https://...',
   *   lastLogin: '2024-12-15T10:30:00Z',
   *   permissions: ['read', 'write', 'delete']
   * }
   */
  const loadAdminProfile = async () => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch('/api/admin/profile', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error loading admin profile');
      // }
      
      // const profile = await response.json();
      
      // MOCK DATA - Perfil temporal del administrador
      const mockProfile = {
        id: 'admin_001',
        name: 'Administrador Principal',
        email: 'admin@mqerk.academy',
        role: 'Super Admin',
        avatar: null,
        lastLogin: new Date().toISOString(),
        permissions: ['read', 'write', 'delete', 'manage_users', 'manage_payments']
      };
      
      setAdminProfile(mockProfile);
      
    } catch (err) {
      console.error('Admin profile error:', err);
      // No lanzar error para el perfil, solo log
    }
  };

  /**
   * Función para refrescar todos los datos del dashboard
   */
  const refreshDashboard = async () => {
    await loadDashboardMetrics();
  };

  /**
   * 🎓 FUNCIÓN: loadStudentsData
   * 
   * 🎯 USADO POR:
   * - ListaAlumnos_Admin_comp.jsx: Carga lista completa de estudiantes filtrada por curso/turno
   * 
   * 📡 ENDPOINT: GET /api/admin/students?curso={curso}&turno={turno}
   * 
   * 💡 EJEMPLO DE USO:
   * const { loadStudentsData } = useAdminContext();
   * const fetchStudents = async () => {
   *   const students = await loadStudentsData('EEAU', 'Matutino');
   *   setStudentsList(students);
   * };
   * 
   * 📤 RESPONSE ESPERADO: Array de objetos estudiante
   * [
   *   {
   *     folio: 'ALU001',
   *     nombres: 'Juan Carlos',
   *     apellidos: 'Pérez García',
   *     correoElectronico: 'juan@email.com',
   *     curso: 'EEAU',
   *     turno: 'Matutino',
   *     estatus: 'Activo'
   *     // ... más campos
   *   }
   * ]
   */
  const loadStudentsData = async (curso, turno) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/students?curso=${curso}&turno=${turno}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error loading students data');
      // }
      
      // const students = await response.json();
      
      // MOCK DATA - Estudiantes temporales con datos completos
      await new Promise(resolve => setTimeout(resolve, 600)); // Simular latencia
      
      const mockStudents = [
        {
          folio: 'ALU001',
          nombres: 'Juan Carlos',
          apellidos: 'Pérez García',
          correoElectronico: 'juan.perez@email.com',
          telefonoAlumno: '555-0123',
          municipioComunidad: 'Ciudad de México',
          nombreTutor: 'María García Pérez',
          telefonoTutor: '555-0124',
          nivelAcademico: 'Preparatoria',
          gradoSemestre: '3er Semestre',
          bachillerato: 'Preparatoria Nacional',
          licenciaturaPostula: 'Ingeniería en Sistemas',
          universidadesPostula: 'UNAM, IPN',
          curso: curso,
          turno: turno,
          asesor: 'Prof. Ana López',
          grupo: 'A1',
          modalidad: 'Presencial',
          tipoAlergia: 'Ninguna',
          discapacidadTranstorno: 'Ninguna',
          orientacionVocacional: 'Sí',
          cambioQuiereLograr: 'Mejorar mis habilidades matemáticas para ingresar a la universidad',
          comentarioEspera: 'Espero aprender de forma didáctica y práctica',
          estatus: 'Activo',
          fechaRegistro: '2024-12-15'
        },
        {
          folio: 'ALU002',
          nombres: 'María Elena',
          apellidos: 'López Martínez',
          correoElectronico: 'maria.lopez@email.com',
          telefonoAlumno: '555-0125',
          municipioComunidad: 'Guadalajara',
          nombreTutor: 'Carlos López Hernández',
          telefonoTutor: '555-0126',
          nivelAcademico: 'Preparatoria',
          gradoSemestre: '2do Semestre',
          bachillerato: 'CECYTEM',
          licenciaturaPostula: 'Medicina',
          universidadesPostula: 'UNAM, UAM',
          curso: curso,
          turno: turno,
          asesor: 'Prof. Roberto Díaz',
          grupo: 'B2',
          modalidad: 'Virtual',
          tipoAlergia: 'Polen',
          discapacidadTranstorno: 'Ninguna',
          orientacionVocacional: 'No',
          cambioQuiereLograr: 'Prepararme mejor para el examen de admisión',
          comentarioEspera: 'Busco una preparación integral y personalizada',
          estatus: 'Activo',
          fechaRegistro: '2024-12-16'
        },
        {
          folio: 'ALU003',
          nombres: 'Carlos Alberto',
          apellidos: 'Ramírez Sánchez',
          correoElectronico: 'carlos.ramirez@email.com',
          telefonoAlumno: '555-0127',
          municipioComunidad: 'Monterrey',
          nombreTutor: 'Rosa Sánchez Vázquez',
          telefonoTutor: '555-0128',
          nivelAcademico: 'Universidad',
          gradoSemestre: '1er Semestre',
          bachillerato: 'Preparatoria UANL',
          licenciaturaPostula: 'Administración',
          universidadesPostula: 'UANL, TEC',
          curso: curso,
          turno: turno,
          asesor: 'Prof. Laura Mendoza',
          grupo: 'C1',
          modalidad: 'Híbrida',
          tipoAlergia: 'Mariscos',
          discapacidadTranstorno: 'Dislexia leve',
          orientacionVocacional: 'Sí',
          cambioQuiereLograr: 'Desarrollar habilidades de liderazgo y comunicación',
          comentarioEspera: 'Quiero complementar mi formación universitaria',
          estatus: 'Activo',
          fechaRegistro: '2024-12-17'
        }
      ];
      
      setStudentsData(mockStudents);
      return mockStudents;
      
    } catch (err) {
      console.error('Students data error:', err);
      throw err;
    }
  };

  /**
   * 💳 FUNCIÓN: loadPaymentsData
   * 
   * 🎯 USADO POR:
   * - ValidacionPagos_Admin_comp.jsx: Carga pagos pendientes de validación
   * 
   * 📡 ENDPOINT: GET /api/admin/payments/validation?curso={curso}&turno={turno}
   * 
   * 💡 EJEMPLO DE USO:
   * const { loadPaymentsData } = useAdminContext();
   * const fetchPagos = async () => {
   *   const pagos = await loadPaymentsData('EEAU', 'Matutino');
   *   setPagosList(pagos);
   * };
   * 
   * 📤 RESPONSE ESPERADO: Array de objetos pago
   * [
   *   {
   *     id: 'PAY001',
   *     folio: 'PAY-2024-001',
   *     alumno: 'Juan Carlos Pérez García',
   *     pagoCurso: '$2,500.00',
   *     metodoPago: 'Transferencia',
   *     estatus: 'Pendiente',
   *     contratoGenerado: false,
   *     contratoSubido: false
   *   }
   * ]
   */
  const loadPaymentsData = async (curso, turno) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/payments/validation?curso=${curso}&turno=${turno}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error loading payments data');
      // }
      
      // const payments = await response.json();
      
      // MOCK DATA - Pagos temporales
      await new Promise(resolve => setTimeout(resolve, 700)); // Simular latencia
      
      const mockPayments = [
        {
          id: 'PAY001',
          folio: 'PAY-2024-001',
          alumno: 'Juan Carlos Pérez García',
          correoElectronico: 'juan@email.com',
          fechaEntrada: '2024-12-15',
          planCurso: `Plan ${curso}`,
          pagoCurso: '$2,500.00',
          metodoPago: 'Transferencia',
          categoria: curso,
          turno: turno,
          contratoGenerado: false,
          contratoSubido: false,
          estatus: 'Pendiente'
        },
        {
          id: 'PAY002',
          folio: 'PAY-2024-002',
          alumno: 'María Elena López Martínez',
          correoElectronico: 'maria@email.com',
          fechaEntrada: '2024-12-16',
          planCurso: `Plan ${curso}`,
          pagoCurso: '$2,500.00',
          metodoPago: 'Efectivo',
          categoria: curso,
          turno: turno,
          contratoGenerado: true,
          contratoSubido: false,
          estatus: 'En Proceso'
        }
      ];
      
      setPaymentsData(mockPayments);
      return mockPayments;
      
    } catch (err) {
      console.error('Payments data error:', err);
      throw err;
    }
  };

  /**
   * ✅ FUNCIÓN: approvePayment
   * 
   * 🎯 USADO POR:
   * - ValidacionPagos_Admin_comp.jsx: Botón "Aprobar" en tabla de pagos
   * 
   * 📡 ENDPOINT: PUT /api/admin/payments/{paymentId}/approve
   * 
   * 💡 EJEMPLO DE USO:
   * const { approvePayment } = useAdminContext();
   * const handleAprobar = async (paymentId) => {
   *   const result = await approvePayment(paymentId);
   *   if (result.success) {
   *     setMessage('Pago aprobado exitosamente');
   *     refreshPaymentsList();
   *   }
   * };
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   message: 'Pago aprobado exitosamente',
   *   paymentId: 'PAY001',
   *   status: 'Aprobado',
   *   timestamp: '2024-12-15T10:30:00Z'
   * }
   */
  const approvePayment = async (paymentId) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/payments/${paymentId}/approve`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error approving payment');
      // }
      
      // return await response.json();
      
      // MOCK - Simular aprobación de pago
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Pago ${paymentId} aprobado exitosamente (MOCK)`);
      
      return {
        success: true,
        message: 'Pago aprobado exitosamente',
        paymentId: paymentId,
        status: 'Aprobado',
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error approving payment:', err);
      throw err;
    }
  };

  /**
   * ❌ FUNCIÓN: rejectPayment
   * 
   * 🎯 USADO POR:
   * - ValidacionPagos_Admin_comp.jsx: Botón "Rechazar" con modal de razón
   * 
   * 📡 ENDPOINT: PUT /api/admin/payments/{paymentId}/reject
   * 
   * 💡 EJEMPLO DE USO:
   * const { rejectPayment } = useAdminContext();
   * const handleRechazar = async (paymentId, razon) => {
   *   const result = await rejectPayment(paymentId, razon);
   *   if (result.success) {
   *     setMessage('Pago rechazado exitosamente');
   *     refreshPaymentsList();
   *   }
   * };
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   message: 'Pago rechazado exitosamente',
   *   paymentId: 'PAY001',
   *   status: 'Rechazado',
   *   reason: 'Comprobante ilegible',
   *   timestamp: '2024-12-15T10:30:00Z'
   * }
   */
  const rejectPayment = async (paymentId, reason) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/payments/${paymentId}/reject`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ reason })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error rejecting payment');
      // }
      
      // return await response.json();
      
      // MOCK - Simular rechazo de pago
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`❌ Pago ${paymentId} rechazado. Razón: ${reason} (MOCK)`);
      
      return {
        success: true,
        message: 'Pago rechazado exitosamente',
        paymentId: paymentId,
        status: 'Rechazado',
        reason: reason,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error rejecting payment:', err);
      throw err;
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardMetrics();
    loadAdminProfile();
    
    // Auto-refresh cada 5 minutos solo para métricas del dashboard
    const interval = setInterval(loadDashboardMetrics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * 📄 FUNCIÓN: generateContract
   * 
   * 🎯 USADO POR:
   * - ValidacionPagos_Admin_comp.jsx: Botón "Generar Contrato" con modal de datos adicionales
   * 
   * 📡 ENDPOINT: PUT /api/admin/payments/{paymentId}/generate-contract
   * 
   * 💡 EJEMPLO DE USO:
   * const { generateContract } = useAdminContext();
   * const handleGenerarContrato = async (paymentId, contractData) => {
   *   const result = await generateContract(paymentId, contractData);
   *   if (result.success) {
   *     setMessage('Contrato generado exitosamente');
   *     // Descargar PDF: window.open(result.contractUrl);
   *   }
   * };
   * 
   * 📥 BODY ENVIADO:
   * {
   *   direccion: 'Calle Principal #123',
   *   fechaNacimiento: '1990-01-15',
   *   telefonoContacto: '555-0123',
   *   nombreTutor: 'María García',
   *   // ... otros datos del contrato
   * }
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   message: 'Contrato generado exitosamente',
   *   paymentId: 'PAY001',
   *   contractUrl: '/contracts/PAY001-contract.pdf',
   *   timestamp: '2024-12-15T10:30:00Z'
   * }
   */
  const generateContract = async (paymentId, contractData) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/payments/${paymentId}/generate-contract`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(contractData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error generating contract');
      // }
      
      // return await response.json();
      
      // MOCK - Simular generación de contrato
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log(`📄 Contrato generado para pago ${paymentId} (MOCK)`);
      
      return {
        success: true,
        message: 'Contrato generado exitosamente',
        paymentId: paymentId,
        contractUrl: `/contracts/${paymentId}-contract.pdf`,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error generating contract:', err);
      throw err;
    }
  };

  /**
   * 📤 FUNCIÓN: uploadContract
   * 
   * 🎯 USADO POR:
   * - ValidacionPagos_Admin_comp.jsx: Input file "Subir Contrato Firmado"
   * 
   * 📡 ENDPOINT: POST /api/admin/payments/{paymentId}/upload-contract
   * 
   * 💡 EJEMPLO DE USO:
   * const { uploadContract } = useAdminContext();
   * const handleSubirContrato = async (paymentId, file) => {
   *   const result = await uploadContract(paymentId, file);
   *   if (result.success) {
   *     setMessage('Contrato subido exitosamente');
   *     // Marcar como "Contrato Subido: Sí"
   *   }
   * };
   * 
   * 📥 FORMDATA ENVIADO:
   * FormData:
   *   - contract: File (PDF del contrato firmado)
   *   - paymentId: 'PAY001'
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   message: 'Contrato subido exitosamente',
   *   paymentId: 'PAY001',
   *   uploadedUrl: '/contracts/PAY001-signed.pdf',
   *   timestamp: '2024-12-15T10:30:00Z'
   * }
   */
  const uploadContract = async (paymentId, contractFile) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const formData = new FormData();
      // formData.append('contract', contractFile);
      // formData.append('paymentId', paymentId);
      
      // const response = await fetch(`/api/admin/payments/${paymentId}/upload-contract`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error uploading contract');
      // }
      
      // return await response.json();
      
      // MOCK - Simular subida de contrato
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`📤 Contrato subido para pago ${paymentId} (MOCK)`);
      
      return {
        success: true,
        message: 'Contrato subido exitosamente',
        paymentId: paymentId,
        uploadedUrl: `/contracts/${paymentId}-signed.pdf`,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error uploading contract:', err);
      throw err;
    }
  };

  /**
   * 🗑️ FUNCIÓN: deleteStudent
   * 
   * 🎯 USADO POR:
   * - ListaAlumnos_Admin_comp.jsx: Botón "Eliminar" con confirmación
   * 
   * 📡 ENDPOINT: DELETE /api/admin/students/{studentId}
   * 
   * 💡 EJEMPLO DE USO:
   * const { deleteStudent } = useAdminContext();
   * const handleEliminar = async (studentId) => {
   *   if (confirm('¿Estás seguro?')) {
   *     const result = await deleteStudent(studentId);
   *     if (result.success) {
   *       setMessage('Estudiante eliminado');
   *       refreshStudentsList();
   *     }
   *   }
   * };
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   message: 'Estudiante eliminado exitosamente',
   *   studentId: 'ALU001',
   *   timestamp: '2024-12-15T10:30:00Z'
   * }
   */
  const deleteStudent = async (studentId) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/students/${studentId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error deleting student');
      // }
      
      // return await response.json();
      
      // MOCK - Simular eliminación de estudiante
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`🗑️ Estudiante ${studentId} eliminado (MOCK)`);
      
      return {
        success: true,
        message: 'Estudiante eliminado exitosamente',
        studentId: studentId,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error deleting student:', err);
      throw err;
    }
  };

  /**
   * ✏️ FUNCIÓN: updateStudent
   * 
   * 🎯 USADO POR:
   * - ListaAlumnos_Admin_comp.jsx: Modal "Editar Estudiante" 
   * 
   * 📡 ENDPOINT: PUT /api/admin/students/{studentId}
   * 
   * 💡 EJEMPLO DE USO:
   * const { updateStudent } = useAdminContext();
   * const handleActualizar = async (studentId, formData) => {
   *   const result = await updateStudent(studentId, formData);
   *   if (result.success) {
   *     setMessage('Estudiante actualizado');
   *     setShowEditModal(false);
   *     refreshStudentsList();
   *   }
   * };
   * 
   * 📥 BODY ENVIADO:
   * {
   *   nombres: 'Juan Carlos',
   *   apellidos: 'Pérez García',
   *   correoElectronico: 'juan@email.com',
   *   telefonoAlumno: '555-0123',
   *   curso: 'EEAU',
   *   turno: 'Matutino',
   *   // ... todos los campos editables
   * }
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   message: 'Estudiante actualizado exitosamente',
   *   studentId: 'ALU001',
   *   updatedData: { ... },
   *   timestamp: '2024-12-15T10:30:00Z'
   * }
   */
  const updateStudent = async (studentId, studentData) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/students/${studentId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(studentData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error updating student');
      // }
      
      // return await response.json();
      
      // MOCK - Simular actualización de estudiante
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✏️ Estudiante ${studentId} actualizado (MOCK)`);
      
      return {
        success: true,
        message: 'Estudiante actualizado exitosamente',
        studentId: studentId,
        updatedData: studentData,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error updating student:', err);
      throw err;
    }
  };

  /**
   * Update student status
   */
  const updateStudentStatus = async (studentId, status) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/students/${studentId}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ status })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error updating student status');
      // }
      
      // return await response.json();
      
      // MOCK - Simular actualización de estado de estudiante
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✏️ Estado del estudiante ${studentId} actualizado a ${status} (MOCK)`);
      
      return {
        success: true,
        message: 'Estado de estudiante actualizado exitosamente',
        studentId: studentId,
        newStatus: status,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error updating student status:', err);
      throw err;
    }
  };

  /**
   * Load financial reports data
   */
  const loadFinancialReports = async (dateRange) => {
    try {
      // TODO: BACKEND - Reemplazar con endpoint real cuando esté disponible
      // const response = await fetch(`/api/admin/reports/financial?from=${dateRange.from}&to=${dateRange.to}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error loading financial reports');
      // }
      
      // return await response.json();
      
      // MOCK - Datos de reportes financieros
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockReports = {
        totalIngresos: 385000,
        pagosCompletados: 156,
        pagosPendientes: 23,
        pagosRechazados: 8,
        ingresosPorMes: [
          { mes: 'Enero', ingresos: 45000 },
          { mes: 'Febrero', ingresos: 52000 },
          { mes: 'Marzo', ingresos: 48000 },
          { mes: 'Abril', ingresos: 58000 },
          { mes: 'Mayo', ingresos: 62000 },
          { mes: 'Junio', ingresos: 55000 },
          { mes: 'Julio', ingresos: 65000 }
        ],
        pagosPorCurso: [
          { curso: 'EEAU', pagos: 45, ingresos: 112500 },
          { curso: 'EEAP', pagos: 38, ingresos: 95000 },
          { curso: 'DIGI-START', pagos: 32, ingresos: 80000 },
          { curso: 'MINDBRIDGE', pagos: 25, ingresos: 62500 },
          { curso: 'SPEAKUP', pagos: 16, ingresos: 40000 }
        ]
      };
      
      return mockReports;
    } catch (err) {
      console.error('Error loading financial reports:', err);
      throw err;
    }
  };

  /**
   * 📷 FUNCIÓN: uploadAdminAvatar
   * 
   * 🎯 USADO POR:
   * - Configuracion_Admin_comp.jsx: Input file para cambiar foto de perfil
   * 
   * 📡 ENDPOINT: POST /api/admin/profile/avatar
   * 
   * 💡 EJEMPLO DE USO:
   * const { uploadAdminAvatar } = useAdminContext();
   * const handleImageChange = async (file) => {
   *   const result = await uploadAdminAvatar(file);
   *   if (result.success) {
   *     setPersonalData(prev => ({
   *       ...prev,
   *       fotoPreview: result.avatarUrl
   *     }));
   *   }
   * };
   * 
   * 📥 FORMDATA ENVIADO:
   * FormData:
   *   - avatar: File (imagen JPG/PNG del avatar)
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   avatarUrl: 'https://cdn.mqerk.com/avatars/admin_001.jpg'
   * }
   */
  const uploadAdminAvatar = async (file) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: BACKEND - Replace with real endpoint when available
      // const formData = new FormData();
      // formData.append('avatar', file);
      // 
      // const response = await fetch('/api/admin/profile/avatar', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: formData
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error uploading avatar');
      // }
      // 
      // const result = await response.json();
      
      // MOCK DATA - Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
      
      const mockAvatarUrl = URL.createObjectURL(file); // Create temporary URL for preview
      
      // Update admin profile with new avatar
      setAdminProfile(prev => ({
        ...prev,
        avatar: mockAvatarUrl
      }));
      
      return { success: true, avatarUrl: mockAvatarUrl };
      
    } catch (err) {
      setError(err.message);
      console.error('Upload avatar error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 👤 FUNCIÓN: updateAdminProfile
   * 
   * 🎯 USADO POR:
   * - Configuracion_Admin_comp.jsx: Formulario "Mi Perfil" - actualizar datos personales
   * 
   * 📡 ENDPOINT: PUT /api/admin/profile
   * 
   * 💡 EJEMPLO DE USO:
   * const { updateAdminProfile } = useAdminContext();
   * const handleUpdatePersonalData = async () => {
   *   const profileData = {
   *     name: `${personalData.nombre} ${personalData.apellidos}`,
   *     email: personalData.email,
   *     phone: personalData.telefono,
   *     avatar: avatarUrl
   *   };
   *   const result = await updateAdminProfile(profileData);
   *   if (result.success) {
   *     setMessage('Perfil actualizado exitosamente');
   *   }
   * };
   * 
   * 📥 BODY ENVIADO:
   * {
   *   name: 'Administrador Principal',
   *   email: 'admin@mqerk.academy',
   *   phone: '+52 999 123 4567',
   *   avatar: 'https://cdn.mqerk.com/avatars/admin_001.jpg'
   * }
   * 
   * 📤 RESPONSE ESPERADO:
   * {
   *   success: true,
   *   profile: {
   *     id: 'admin_001',
   *     name: 'Administrador Principal',
   *     email: 'admin@mqerk.academy',
   *     phone: '+52 999 123 4567',
   *     avatar: 'https://...',
   *     lastUpdated: '2024-12-15T10:30:00Z'
   *   }
   * }
   */
  const updateAdminProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: BACKEND - Replace with real endpoint when available
      // const response = await fetch('/api/admin/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(profileData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error updating profile');
      // }
      // 
      // const updatedProfile = await response.json();
      
      // MOCK DATA - Simulate profile update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedProfile = {
        ...adminProfile,
        ...profileData,
        lastUpdated: new Date().toISOString()
      };
      
      setAdminProfile(updatedProfile);
      
      return { success: true, profile: updatedProfile };
      
    } catch (err) {
      setError(err.message);
      console.error('Update profile error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to remove admin avatar
   * TODO: BACKEND - Replace with real endpoint when available
   */
  const removeAdminAvatar = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: BACKEND - Replace with real endpoint when available
      // const response = await fetch('/api/admin/profile/avatar', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error removing avatar');
      // }
      
      // MOCK DATA - Simulate avatar removal
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAdminProfile(prev => ({
        ...prev,
        avatar: null
      }));
      
      return { success: true };
      
    } catch (err) {
      setError(err.message);
      console.error('Remove avatar error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize admin profile on component mount
  useEffect(() => {
    loadAdminProfile();
  }, []);

  // Context value with all admin functions and state
  // 🎯 TODAS LAS FUNCIONES Y ESTADOS DISPONIBLES PARA LOS COMPONENTES
  const value = {
    // 📊 ESTADOS PRINCIPALES - Usados por múltiples componentes
    dashboardData,        // ✅ BienvenidaAdmin, inicio-admin
    adminProfile,         // ✅ BienvenidaAdmin, Configuracion_Admin_comp
    isLoading,           // ✅ Todos los componentes (estados de carga)
    error,               // ✅ Todos los componentes (manejo de errores)
    lastUpdated,         // ✅ Componentes que necesitan timestamps
    systemStatus,        // ✅ Estado general del sistema
    
    // 📋 ESTADOS ESPECÍFICOS - Datos cacheados por sección
    studentsData,        // ✅ ListaAlumnos_Admin_comp
    paymentsData,        // ✅ ValidacionPagos_Admin_comp
    
    // 🔄 FUNCIONES DEL DASHBOARD - Métricas y refrescos
    refreshDashboard,    // ✅ BienvenidaAdmin (botón refresh)
    loadDashboardMetrics,// ✅ BienvenidaAdmin, inicio-admin
    
    // 🎓 FUNCIONES DE ESTUDIANTES - CRUD completo
    loadStudentsData,    // ✅ ListaAlumnos_Admin_comp (cargar lista)
    deleteStudent,       // ✅ ListaAlumnos_Admin_comp (botón eliminar)
    updateStudent,       // ✅ ListaAlumnos_Admin_comp (modal editar)
    updateStudentStatus, // ✅ ListaAlumnos_Admin_comp (cambiar estatus)
    
    // 💳 FUNCIONES DE PAGOS - Validación y contratos
    loadPaymentsData,    // ✅ ValidacionPagos_Admin_comp (cargar pagos)
    approvePayment,      // ✅ ValidacionPagos_Admin_comp (aprobar)
    rejectPayment,       // ✅ ValidacionPagos_Admin_comp (rechazar)
    generateContract,    // ✅ ValidacionPagos_Admin_comp (generar contrato)
    uploadContract,      // ✅ ValidacionPagos_Admin_comp (subir firmado)
    
    // 📊 FUNCIONES DE REPORTES - Análisis financiero
    loadFinancialReports,// ✅ Para futuros componentes de reportes
    
    // 👤 FUNCIONES DE PERFIL ADMIN - Gestión personal
    loadAdminProfile,    // ✅ Auto-carga inicial
    uploadAdminAvatar,   // ✅ Configuracion_Admin_comp (subir foto)
    updateAdminProfile,  // ✅ Configuracion_Admin_comp (actualizar datos)
    removeAdminAvatar    // ✅ Configuracion_Admin_comp (quitar foto)
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
