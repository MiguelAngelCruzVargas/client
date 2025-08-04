/**
 * Página de Perfil Completo de Estudiante
 * Reemplaza el modal por una página completa con más espacio y mejor organización
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/AdminContext.jsx';

// Componente de ventana de confirmación
function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "warning"
}) {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "bg-red-100 text-red-600",
          confirmBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200", 
          icon: "bg-green-100 text-green-600",
          confirmBtn: "bg-green-600 hover:bg-green-700 focus:ring-green-500"
        };
      default: // warning
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: "bg-yellow-100 text-yellow-600", 
          confirmBtn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
        };
    }
  };

  const colors = getColors();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >
      <div className={`${colors.bg} ${colors.border} border rounded-xl shadow-2xl max-w-md w-full p-6`}>
        <div className="flex items-start space-x-4">
          <div className={`${colors.icon} rounded-full p-2 flex-shrink-0`}>
            {type === "danger" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            ) : type === "success" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${colors.confirmBtn} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de notificación de éxito
function SuccessNotification({ isOpen, onClose, message }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-green-800">✅ {message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 inline-flex text-green-400 hover:text-green-600 focus:outline-none"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentProfile() {
  const { folio } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  
  // Estados para confirmaciones y notificaciones
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInactivateConfirm, setShowInactivateConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { 
    studentsData = [],
    updateStudent,
    deleteStudent,
    loadStudentsData
  } = useAdminContext() || {};

  // Cargar datos del estudiante
  useEffect(() => {
    if (folio && studentsData && studentsData.length > 0) {
      // Buscar estudiante en la lista de studentsData
      const foundStudent = studentsData.find(s => s.folio === folio);
      if (foundStudent) {
        setStudent(foundStudent);
        initializeFormData(foundStudent);
      } else {
        // Si no se encuentra, intentar cargar desde API
        loadStudentData();
      }
    } else if (folio) {
      // Si studentsData no está disponible o está vacío, cargar desde API
      loadStudentData();
    }
  }, [folio, studentsData]);

  const loadStudentData = async () => {
    // Por ahora, como no tenemos getStudentDetails, vamos a intentar cargar usando loadStudentsData
    // Esta función debería cargar todos los estudiantes y luego buscar el específico
    setIsLoading(true);
    try {
      if (loadStudentsData) {
        // Necesitamos saber el curso y turno para cargar los datos
        // Por ahora vamos a crear datos mock del estudiante
        console.log('⚠️ Función getStudentDetails no disponible, usando datos por defecto');
        
        // Crear un estudiante mock básico para evitar errores
        const mockStudent = {
          folio: folio,
          nombres: 'Estudiante',
          apellidos: 'No encontrado',
          correoElectronico: 'no-disponible@email.com',
          fechaRegistro: new Date().toISOString().split('T')[0],
          estatus: 'Activo'
        };
        
        setStudent(mockStudent);
        initializeFormData(mockStudent);
      }
    } catch (error) {
      console.error('❌ Error al cargar estudiante:', error);
      showSuccess('❌ Error al cargar los datos del estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFormData = (studentData) => {
    const initialData = {
      // Datos básicos del estudiante
      nombres: studentData.nombres || '',
      apellidos: studentData.apellidos || '',
      folio: studentData.folio || '',
      fechaRegistro: studentData.fechaRegistro || '',
      
      // Datos personales
      personal: {
        email: studentData.correoElectronico || '',
        municipio: studentData.municipioComunidad || '',
        tutorName: studentData.nombreTutor || '',
        phoneNumber: studentData.telefonoAlumno || '',
        tutorPhoneNumber: studentData.telefonoTutor || '',
      },
      
      // Datos académicos
      academic: {
        nivelAcademico: studentData.nivelAcademico || '',
        gradoSemestre: studentData.gradoSemestre || '',
        bachillerato: studentData.bachillerato || '',
        licenciaturaOption: studentData.licenciaturaPostula || '',
        universityOption: studentData.universidadesPostula || '',
      },
      
      // Datos del curso
      course: {
        curso: studentData.curso || '',
        turno: studentData.turno || '',
        advisor: studentData.asesor || '',
        group: studentData.grupo || '',
        modality: studentData.modalidad || '',
      },
      
      // Datos de salud
      health: {
        tipoAlergia: studentData.tipoAlergia || '',
        discapacidadTranstorno: studentData.discapacidadTranstorno || '',
        orientacionVocacional: studentData.orientacionVocacional || '',
      },
      
      // Expectativas y objetivos
      expectations: {
        cambioQuiereLograr: studentData.cambioQuiereLograr || '',
        comentarioEspera: studentData.comentarioEspera || '',
      },
      
      // Estado del estudiante
      status: {
        estatus: studentData.estatus || 'Activo'
      }
    };
    
    setFormData(initialData);
    setOriginalData(initialData);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    const fieldParts = field.split('.');
    
    if (fieldParts.length === 1) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      const [section, subField] = fieldParts;
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subField]: value
        }
      }));
    }
  };

  // Función para mostrar notificación de éxito
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessNotification(true);
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!student?.folio || !updateStudent) {
      console.error('❌ Datos del estudiante o función updateStudent no disponibles');
      return;
    }
    
    setIsLoading(true);
    try {
      const updateData = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correoElectronico: formData.personal.email,
        telefonoAlumno: formData.personal.phoneNumber,
        municipioComunidad: formData.personal.municipio,
        nombreTutor: formData.personal.tutorName,
        telefonoTutor: formData.personal.tutorPhoneNumber,
        nivelAcademico: formData.academic.nivelAcademico,
        gradoSemestre: formData.academic.gradoSemestre,
        bachillerato: formData.academic.bachillerato,
        licenciaturaPostula: formData.academic.licenciaturaOption,
        universidadesPostula: formData.academic.universityOption,
        curso: formData.course.curso,
        turno: formData.course.turno,
        asesor: formData.course.advisor,
        grupo: formData.course.group,
        modalidad: formData.course.modality,
        tipoAlergia: formData.health.tipoAlergia,
        discapacidadTranstorno: formData.health.discapacidadTranstorno,
        orientacionVocacional: formData.health.orientacionVocacional,
        cambioQuiereLograr: formData.expectations.cambioQuiereLograr,
        comentarioEspera: formData.expectations.comentarioEspera,
        estatus: formData.status.estatus
      };
      
      await updateStudent(student.folio, updateData);
      console.log('✅ Estudiante actualizado exitosamente');
      
      setIsEditing(false);
      setOriginalData(formData);
      
      showSuccess('Información del estudiante actualizada exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar estudiante:', error);
      showSuccess('❌ Error al actualizar la información del estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  // Cambiar estatus del estudiante
  const handleStatusChange = async (newStatus) => {
    if (!student?.folio || !updateStudent) {
      console.error('❌ Datos del estudiante o función updateStudent no disponibles');
      return;
    }
    
    setIsLoading(true);
    try {
      // Usar updateStudent para cambiar solo el estatus
      const updateData = {
        ...student,
        estatus: newStatus
      };
      
      await updateStudent(student.folio, updateData);
      console.log(`✅ Estatus del estudiante cambiado a: ${newStatus}`);
      
      const updatedData = { ...formData };
      updatedData.status.estatus = newStatus;
      setFormData(updatedData);
      setOriginalData(updatedData);
      
      showSuccess(`Estudiante marcado como ${newStatus.toLowerCase()} exitosamente`);
    } catch (error) {
      console.error('❌ Error al cambiar estatus:', error);
      showSuccess('❌ Error al cambiar el estatus del estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar estudiante permanentemente
  const handleDelete = async () => {
    if (!student?.folio || !deleteStudent) {
      console.error('❌ Datos del estudiante o función deleteStudent no disponibles');
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteStudent(student.folio);
      console.log('✅ Estudiante eliminado exitosamente');
      
      showSuccess('Estudiante eliminado exitosamente');
      setTimeout(() => {
        navigate('/admin1/lista-alumnos');
      }, 2000);
    } catch (error) {
      console.error('❌ Error al eliminar estudiante:', error);
      showSuccess('❌ Error al eliminar el estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente de campo de entrada
  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    options = null, 
    disabled = false, 
    helpText = null,
    maxLength = null,
    isRequired = false 
  }) => {
    const getValue = () => {
      const fieldParts = field.split('.');
      if (fieldParts.length === 1) {
        return formData[field] || '';
      } else {
        const [section, subField] = fieldParts;
        return formData[section]?.[subField] || '';
      }
    };

    const value = getValue();

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        {options ? (
          <select
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing || disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm transition-all duration-200 hover:border-gray-400"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing || disabled}
            maxLength={maxLength}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm resize-none transition-all duration-200 hover:border-gray-400"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing || disabled}
            maxLength={maxLength}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm transition-all duration-200 hover:border-gray-400"
          />
        )}
        <div className="flex justify-between">
          {helpText && (
            <p className="text-xs text-gray-500">{helpText}</p>
          )}
          {maxLength && value && (
            <p className="text-xs text-gray-400">
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'general', name: '📋 Información General', icon: '📋' },
    { id: 'academic', name: '🎓 Datos Académicos', icon: '🎓' },
    { id: 'course', name: '📚 Información del Curso', icon: '📚' },
    { id: 'health', name: '🏥 Salud y Expectativas', icon: '🏥' },
    { id: 'status', name: '⚙️ Estado y Configuración', icon: '⚙️' }
  ];

  if (isLoading && !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium text-gray-700">Cargando perfil del estudiante...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Estudiante no encontrado</h2>
          <p className="text-gray-600 mb-6">No se pudo cargar la información del estudiante con folio: {folio}</p>
          <button
            onClick={() => navigate('/admin1/lista-alumnos')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header de la página */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin1/lista-alumnos')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {student?.nombres?.charAt(0) || ''}{student?.apellidos?.charAt(0) || ''}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formData.nombres} {formData.apellidos}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Folio: {formData.folio}</span>
                    <span>•</span>
                    <span>Registro: {formData.fechaRegistro}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      formData.status?.estatus === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : formData.status?.estatus === 'Inactivo'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {formData.status?.estatus || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Perfil
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Datos Personales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Datos Personales
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InputField label="Nombres" field="nombres" isRequired={true} maxLength={50} />
                <InputField label="Apellidos" field="apellidos" isRequired={true} maxLength={50} />
                <InputField label="Correo Electrónico" field="personal.email" type="email" isRequired={true} />
                <InputField label="Teléfono del Alumno" field="personal.phoneNumber" type="tel" maxLength={15} />
                <InputField label="Municipio/Comunidad" field="personal.municipio" maxLength={50} />
              </div>
            </div>

            {/* Datos del Tutor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  Información del Tutor
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InputField label="Nombre del Tutor" field="personal.tutorName" maxLength={50} />
                <InputField label="Teléfono del Tutor" field="personal.tutorPhoneNumber" type="tel" maxLength={15} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Académica */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  Información Académica
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InputField 
                  label="Nivel Académico" 
                  field="academic.nivelAcademico"
                  options={[
                    { value: '', label: 'Seleccionar...' },
                    { value: 'Preparatoria', label: 'Preparatoria' },
                    { value: 'Universidad', label: 'Universidad' },
                    { value: 'Posgrado', label: 'Posgrado' }
                  ]}
                />
                <InputField label="Grado/Semestre" field="academic.gradoSemestre" type="number" />
                <InputField label="Bachillerato de Procedencia" field="academic.bachillerato" maxLength={100} />
                <InputField label="Licenciatura a la que Postula" field="academic.licenciaturaOption" maxLength={100} />
                <InputField label="Universidades a las que Postula" field="academic.universityOption" maxLength={100} />
              </div>
            </div>

            {/* Información de Registro */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  Fechas y Registro
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InputField label="Folio" field="folio" disabled={true} />
                <InputField label="Fecha de Registro" field="fechaRegistro" type="date" disabled={true} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'course' && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  Información del Curso
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField 
                  label="Curso" 
                  field="course.curso"
                  options={[
                    { value: '', label: 'Seleccionar...' },
                    { value: 'EEAU', label: 'EEAU' },
                    { value: 'EEAP', label: 'EEAP' },
                    { value: 'DIGI-START', label: 'DIGI-START' },
                    { value: 'MINDBRIDGE', label: 'MINDBRIDGE' },
                    { value: 'SPEAKUP', label: 'SPEAKUP' },
                    { value: 'PCE', label: 'PCE' }
                  ]}
                />
                <InputField 
                  label="Turno" 
                  field="course.turno"
                  options={[
                    { value: '', label: 'Seleccionar...' },
                    { value: 'VESPERTINO 1', label: 'VESPERTINO 1' },
                    { value: 'VESPERTINO 2', label: 'VESPERTINO 2' },
                    { value: 'MATUTINO', label: 'MATUTINO' },
                    { value: 'NOCTURNO', label: 'NOCTURNO' }
                  ]}
                />
                <InputField label="Asesor Asignado" field="course.advisor" maxLength={50} />
                <InputField label="Grupo" field="course.group" maxLength={20} />
                <InputField 
                  label="Modalidad" 
                  field="course.modality"
                  options={[
                    { value: '', label: 'Seleccionar...' },
                    { value: 'Presencial', label: 'Presencial' },
                    { value: 'Virtual', label: 'Virtual' },
                    { value: 'Híbrida', label: 'Híbrida' }
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Datos de Salud */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  Información de Salud
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InputField label="Tipo de Alergia" field="health.tipoAlergia" maxLength={100} />
                <InputField label="Discapacidad/Trastorno" field="health.discapacidadTranstorno" maxLength={200} />
                <InputField 
                  label="Orientación Vocacional" 
                  field="health.orientacionVocacional"
                  options={[
                    { value: '', label: 'Seleccionar...' },
                    { value: 'Sí', label: 'Sí' },
                    { value: 'No', label: 'No' }
                  ]}
                />
              </div>
            </div>

            {/* Expectativas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Expectativas y Objetivos
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InputField 
                  label="Cambio que Quiere Lograr" 
                  field="expectations.cambioQuiereLograr" 
                  type="textarea"
                  maxLength={500}
                  helpText="Describe qué cambio espera lograr con el curso"
                />
                <InputField 
                  label="Comentario/Expectativa" 
                  field="expectations.comentarioEspera" 
                  type="textarea"
                  maxLength={500}
                  helpText="Expectativas adicionales del curso"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Estado del Estudiante */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Estado del Estudiante
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InputField 
                  label="Estatus Actual" 
                  field="status.estatus"
                  options={[
                    { value: 'Activo', label: '✅ Activo' },
                    { value: 'Inactivo', label: '⏸️ Inactivo' },
                    { value: 'Suspendido', label: '❌ Suspendido' }
                  ]}
                />
                
                {/* Botones de cambio rápido de estado */}
                {!isEditing && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Acciones Rápidas:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {formData.status?.estatus !== 'Activo' && (
                        <button
                          onClick={() => setShowActivateConfirm(true)}
                          disabled={isLoading}
                          className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-all duration-200 disabled:opacity-50"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Activar Estudiante
                        </button>
                      )}
                      {formData.status?.estatus !== 'Inactivo' && (
                        <button
                          onClick={() => setShowInactivateConfirm(true)}
                          disabled={isLoading}
                          className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-all duration-200 disabled:opacity-50"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Inactivar Estudiante
                        </button>
                      )}
                      {formData.status?.estatus !== 'Suspendido' && (
                        <button
                          onClick={() => setShowSuspendConfirm(true)}
                          disabled={isLoading}
                          className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-all duration-200 disabled:opacity-50"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                          Suspender Estudiante
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Información del Sistema
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm text-gray-600">
                  <p><strong>Última modificación:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Estado actual:</strong> {isEditing ? 'Editando' : 'Solo lectura'}</p>
                  <p><strong>Folio del estudiante:</strong> {formData.folio}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales de Confirmación */}
      {showDeleteConfirm && (
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDelete();
          }}
          title="Eliminar Estudiante"
          message={`¿Está seguro de que desea eliminar permanentemente al estudiante ${formData.nombres} ${formData.apellidos}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      )}

      {showActivateConfirm && (
        <ConfirmationModal
          isOpen={showActivateConfirm}
          onClose={() => setShowActivateConfirm(false)}
          onConfirm={() => {
            setShowActivateConfirm(false);
            handleStatusChange('Activo');
          }}
          title="Activar Estudiante"
          message={`¿Desea activar al estudiante ${formData.nombres} ${formData.apellidos}?`}
          confirmText="Activar"
          cancelText="Cancelar"
          type="success"
        />
      )}

      {showInactivateConfirm && (
        <ConfirmationModal
          isOpen={showInactivateConfirm}
          onClose={() => setShowInactivateConfirm(false)}
          onConfirm={() => {
            setShowInactivateConfirm(false);
            handleStatusChange('Inactivo');
          }}
          title="Inactivar Estudiante"
          message={`¿Desea inactivar al estudiante ${formData.nombres} ${formData.apellidos}?`}
          confirmText="Inactivar"
          cancelText="Cancelar"
          type="warning"
        />
      )}

      {showSuspendConfirm && (
        <ConfirmationModal
          isOpen={showSuspendConfirm}
          onClose={() => setShowSuspendConfirm(false)}
          onConfirm={() => {
            setShowSuspendConfirm(false);
            handleStatusChange('Suspendido');
          }}
          title="Suspender Estudiante"
          message={`¿Desea suspender al estudiante ${formData.nombres} ${formData.apellidos}?`}
          confirmText="Suspender"
          cancelText="Cancelar"
          type="danger"
        />
      )}

      {/* Notificación de Éxito */}
      {showSuccessNotification && (
        <SuccessNotification
          isOpen={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          message={successMessage}
        />
      )}
    </div>
  );
}

export default StudentProfile;
