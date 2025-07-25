/**
 * Student List Admin Component
 * Manages student data display, search, filtering, and CRUD operations
 * 
 * Backend Endpoints Required:
 * - GET /api/admin/students?curso={curso}&turno={turno}
 * - DELETE /api/admin/students/{folio}
 * - PUT /api/admin/students/{folio}
 * - POST /api/admin/students
 */

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../../context/AdminContext.jsx';

function LoadingScreen({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Cargando lista de estudiantes...</p>
            </div>
        </div>
    );
}

// Component for category buttons (courses)
function CategoryButton({ label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                relative overflow-hidden 
                px-1.5 py-1.5 xs:px-2 xs:py-2 sm:px-3 sm:py-3 md:px-4 md:py-3
                rounded-md xs:rounded-lg sm:rounded-xl 
                font-bold text-[10px] xs:text-xs sm:text-sm md:text-base
                transition-all duration-300 ease-out 
                w-full min-w-[80px] xs:min-w-[100px] max-w-[140px] xs:max-w-[160px]
                h-10 xs:h-12 sm:h-14 md:h-16
                flex items-center justify-center
                border-2 transform hover:scale-105 hover:shadow-lg
                ${isActive
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 shadow-md shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400 shadow-sm hover:from-purple-600 hover:to-purple-700 hover:border-purple-500'
                }
            `}
        >
            <span className="relative z-10 tracking-wide text-center leading-tight">{label}</span>
        </button>
    );
}

export function ListaAlumnos_Admin_comp() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTurno, setActiveTurno] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { 
    studentsData,
    isLoading,
    error,
    lastUpdated,
    loadStudentsData,
    deleteStudent,
    updateStudent
  } = useAdminContext();

  const categorias = ['EEAU', 'EEAP', 'DIGI-START', 'MINDBRIDGE', 'SPEAKUP', 'PCE'];
  const turnos = ['VESPERTINO 1', 'VESPERTINO 2'];

  const fetchAlumnos = async () => {
    if (!activeCategory || !activeTurno) return;
    
    try {
      const data = await loadStudentsData(activeCategory, activeTurno);
      setAlumnos(data || []);
    } catch (err) {
      console.error('Error loading students:', err);
      setAlumnos([]);
    }
  };

  // Load students when course and shift are selected
  useEffect(() => {
    if (activeCategory && activeTurno) {
      fetchAlumnos();
    }
  }, [activeCategory, activeTurno]);

  // Handle initial loading screen completion
  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  // Function to manually refresh data
  const handleRefreshData = async () => {
    if (activeCategory && activeTurno) {
      await fetchAlumnos();
    }
  };

  // Filter students based on search term, active category and shift
  const alumnosFiltrados = alumnos.filter(alumno => {
    const matchesSearch = 
      alumno.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.folio.toLowerCase().includes(searchTerm.toLowerCase());
      alumno.correoElectronico.toLowerCase().includes(filtro.toLowerCase()) ||
      alumno.folio.toLowerCase().includes(filtro.toLowerCase()) ||
      alumno.municipioComunidad.toLowerCase().includes(filtro.toLowerCase());
    
    const matchesCategory = activeCategory === null || alumno.curso === activeCategory;
    // If no shift selected, show all students from the course
    const matchesTurno = activeTurno === null || alumno.turno === activeTurno;
    
    return matchesSearch && matchesCategory && matchesTurno;
  });

  // Handle category selection
  const handleCategorySelect = (categoria) => {
    setActiveCategory(categoria === activeCategory ? null : categoria);
    // Reset shift when category changes
    setActiveTurno(null);
  };

  // Handle shift selection
  const handleTurnoSelect = (turno) => {
    setActiveTurno(turno === activeTurno ? null : turno);
  };

  // Student action handlers using AdminContext
  const handleVerPerfil = (alumno) => {
    // Navigate to student profile (to be implemented with routing)
    console.log('View profile for student:', alumno.folio);
  };

  const handleEditarAlumno = async (alumno) => {
    try {
      // Call context function to edit student
      await updateStudent(alumno.folio, alumno);
      console.log('Student updated:', alumno.folio);
      // Refresh data after edit
      await fetchAlumnos();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleEliminarAlumno = async (alumno) => {
    if (window.confirm(`Are you sure you want to delete student ${alumno.nombres} ${alumno.apellidos}?`)) {
      try {
        await deleteStudent(alumno.folio);
        console.log('Student deleted:', alumno.folio);
        // Refresh data after deletion
        await fetchAlumnos();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };



  const getStatusBadge = (estatus) => {
    if (estatus === 'Activo') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Activo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Inactivo
        </span>
      );
    }
  };

  // If initially loading, show loading screen
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Error handling
  if (error) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRefreshData}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Reintentando...' : 'Reintentar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col bg-white">
      {/* Header con filtros optimizado */}
      <div className="pt-2 xs:pt-4 sm:pt-6 pb-2 xs:pb-3 sm:pb-4 px-2 xs:px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Título principal */}
          <div className="text-center mb-4 xs:mb-6 sm:mb-8">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 xs:mb-2 px-2">
              Lista de Alumnos por Curso
            </h1>
            <div className="w-8 xs:w-12 sm:w-16 lg:w-20 h-0.5 xs:h-1 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 mx-auto mb-2 rounded-full"></div>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 px-4">
              Gestiona y supervisa a todos los estudiantes registrados por curso
            </p>
            
            {/* Información de actualización y refresh */}
            {lastUpdated && (
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Actualizado: {new Date(lastUpdated).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <button
                  onClick={handleRefreshData}
                  disabled={isLoading}
                  className="ml-2 text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                  title="Actualizar datos"
                >
                  <svg className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Botones de categoría (filtros por curso) */}
          <div className="mb-4 xs:mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 shadow-lg border border-gray-200">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 text-center px-2">
                Filtrar por Curso
              </h2>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 place-items-center">
                {categorias.map((cat) => (
                  <CategoryButton
                    key={cat}
                    label={cat}
                    isActive={activeCategory === cat}
                    onClick={() => handleCategorySelect(cat)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botones de turno (aparecen solo cuando se selecciona una categoría) */}
          {activeCategory && (
            <div className="mb-4 xs:mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 shadow-lg border border-blue-200">
                <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 text-center px-2">
                  Turnos Disponibles para {activeCategory}
                </h2>
                <div className="flex flex-row gap-3 xs:gap-4 sm:gap-6 justify-center items-center max-w-md mx-auto">
                  {turnos.map((turno) => (
                    <button
                      key={turno}
                      onClick={() => handleTurnoSelect(turno)}
                      className={`
                        relative overflow-hidden 
                        px-3 py-2 xs:px-4 xs:py-2 sm:px-6 sm:py-4
                        rounded-md xs:rounded-lg sm:rounded-xl 
                        font-bold text-xs xs:text-sm sm:text-base
                        transition-all duration-300 ease-out 
                        w-full min-w-[100px] max-w-[140px]
                        h-10 xs:h-12 sm:h-14 md:h-16
                        flex items-center justify-center
                        border-2 transform hover:scale-105 hover:shadow-lg
                        ${activeTurno === turno
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 shadow-md shadow-blue-500/30' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-300 shadow-sm hover:from-blue-600 hover:to-blue-700 hover:border-blue-500'
                        }
                      `}
                    >
                      <span className="relative z-10 tracking-wide text-center leading-tight">{turno}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Contenido principal de la tabla */}
      <div className="flex-1 px-2 xs:px-4 sm:px-6 pb-4 xs:pb-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Tabla de alumnos completa - Solo se muestra cuando hay curso Y turno seleccionados */}
          {activeCategory && activeTurno ? (
            <>
              {/* Barra de búsqueda - Solo se muestra cuando hay curso seleccionado */}
              <div className="mb-4 xs:mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-lg border border-gray-200">
                  <div className="max-w-sm xs:max-w-md mx-auto">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar por nombre, apellido, correo o folio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 pl-8 xs:pl-10 pr-3 xs:pr-4 text-xs xs:text-sm border border-gray-300 rounded-md xs:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 left-0 pl-2 xs:pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 xs:h-5 w-4 xs:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de alumnos */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg xs:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-100 to-gray-50">
              <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800">
                Lista Completa de Alumnos ({alumnosFiltrados.length})
              </h3>
              <p className="text-xs xs:text-sm text-gray-600 mt-1">
                Información completa de todos los estudiantes registrados
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <tr>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <span>Folio</span>
                        <span className="text-gray-500 font-normal">ID</span>
                      </div>
                    </th>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <span>Estudiante</span>
                        <span className="text-gray-500 font-normal">Datos Personales</span>
                      </div>
                    </th>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <span>Contacto</span>
                        <span className="text-gray-500 font-normal">Teléfonos</span>
                      </div>
                    </th>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <span>Académico</span>
                        <span className="text-gray-500 font-normal">Nivel/Grado</span>
                      </div>
                    </th>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <span>Salud</span>
                        <span className="text-gray-500 font-normal">Condiciones</span>
                      </div>
                    </th>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <span>Proyección</span>
                        <span className="text-gray-500 font-normal">Universidades</span>
                      </div>
                    </th>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <span>Expectativas</span>
                        <span className="text-gray-500 font-normal">Objetivos</span>
                      </div>
                    </th>
                    <th className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex flex-col space-y-1">
                        <span>Estado</span>
                        <span className="text-gray-500 font-normal">Acciones</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alumnosFiltrados.map((alumno, index) => (
                    <tr key={alumno.folio} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      {/* Columna Folio */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 border-r border-gray-200">
                        <div className="text-center">
                          <div className="text-[10px] xs:text-xs sm:text-sm font-bold text-purple-600 bg-purple-100 px-1 xs:px-2 py-0.5 xs:py-1 rounded-md xs:rounded-lg">
                            {alumno.folio}
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500 mt-0.5 xs:mt-1">
                            {alumno.fechaRegistro}
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Estudiante */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 border-r border-gray-200">
                        <div className="flex items-start space-x-1 xs:space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-6 xs:h-8 sm:h-10 w-6 xs:w-8 sm:w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                              <span className="text-[8px] xs:text-[10px] sm:text-sm font-bold text-white">
                                {alumno.nombres.charAt(0)}{alumno.apellidos.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 truncate">
                              {alumno.nombres} {alumno.apellidos}
                            </div>
                            <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 truncate">
                              {alumno.correoElectronico}
                            </div>
                            <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500 truncate">
                              📍 {alumno.municipioComunidad}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Contacto */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 border-r border-gray-200">
                        <div className="space-y-0.5 xs:space-y-1">
                          <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-900">
                            <span className="font-medium">Alumno:</span>
                            <div className="text-blue-600 font-mono">{alumno.telefonoAlumno}</div>
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-900">
                            <span className="font-medium">Tutor:</span>
                            <div className="text-green-600">{alumno.nombreTutor}</div>
                            <div className="text-green-600 font-mono">{alumno.telefonoTutor}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Académico */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 border-r border-gray-200">
                        <div className="space-y-1 xs:space-y-2">
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="inline-flex items-center px-1 xs:px-2 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                              {alumno.nivelAcademico}
                            </span>
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-700 font-medium">
                            {alumno.gradoSemestre}
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="inline-flex items-center px-1 xs:px-2 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-800">
                              {alumno.curso}
                            </span>
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="inline-flex items-center px-1 xs:px-2 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                              {alumno.turno}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Salud */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 border-r border-gray-200">
                        <div className="space-y-0.5 xs:space-y-1">
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="font-medium text-gray-700">Alergia:</span>
                            <div className={`text-[8px] xs:text-[10px] sm:text-xs ${alumno.tipoAlergia === 'Ninguna' ? 'text-green-600' : 'text-orange-600'}`}>
                              {alumno.tipoAlergia}
                            </div>
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="font-medium text-gray-700">Discapacidad:</span>
                            <div className={`text-[8px] xs:text-[10px] sm:text-xs ${alumno.discapacidadTranstorno === 'Ninguna' ? 'text-green-600' : 'text-orange-600'}`}>
                              {alumno.discapacidadTranstorno}
                            </div>
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="font-medium text-gray-700">Orientación:</span>
                            <div className={`text-[8px] xs:text-[10px] sm:text-xs ${alumno.orientacionVocacional === 'Sí' ? 'text-green-600' : 'text-gray-600'}`}>
                              {alumno.orientacionVocacional}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Proyección */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 border-r border-gray-200">
                        <div className="space-y-0.5 xs:space-y-1">
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="font-medium text-gray-700">Universidades:</span>
                            <div className="text-[8px] xs:text-[10px] sm:text-xs text-indigo-600 font-medium">
                              {alumno.universidadesPostula}
                            </div>
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="font-medium text-gray-700">Licenciatura:</span>
                            <div className="text-[8px] xs:text-[10px] sm:text-xs text-purple-600">
                              {alumno.licenciaturaPostula}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Expectativas */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3 border-r border-gray-200">
                        <div className="space-y-1 xs:space-y-2">
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="font-medium text-gray-700">Cambio que quiere lograr:</span>
                            <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 italic max-w-32 xs:max-w-40 sm:max-w-48 line-clamp-2">
                              "{alumno.cambioQuiereLograr}"
                            </div>
                          </div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs">
                            <span className="font-medium text-gray-700">Expectativa:</span>
                            <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 italic max-w-32 xs:max-w-40 sm:max-w-48 line-clamp-2">
                              "{alumno.comentarioEspera}"
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Estado y Acciones */}
                      <td className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                        <div className="space-y-1 xs:space-y-2">
                          <div className="flex justify-center">
                            {getStatusBadge(alumno.estatus)}
                          </div>
                          <div className="flex flex-col space-y-0.5 xs:space-y-1">
                            <button 
                              onClick={() => handleVerPerfil(alumno)}
                              className="text-[8px] xs:text-[10px] sm:text-xs px-1 xs:px-2 py-0.5 xs:py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200"
                            >
                              Ver Perfil
                            </button>
                            <button 
                              onClick={() => handleEditarAlumno(alumno)}
                              className="text-[8px] xs:text-[10px] sm:text-xs px-1 xs:px-2 py-0.5 xs:py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors duration-200"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleEliminarAlumno(alumno)}
                              className="text-[8px] xs:text-[10px] sm:text-xs px-1 xs:px-2 py-0.5 xs:py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Estado vacío */}
            {alumnosFiltrados.length === 0 && (
              <div className="text-center py-8 xs:py-12 bg-gray-50">
                <svg className="mx-auto h-8 xs:h-12 w-8 xs:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-4 0H9m11 0a2 2 0 01-2 2M7 13a2 2 0 01-2-2V9a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 012 2v2a2 2 0 01-2 2H7z" />
                </svg>
                <h3 className="mt-2 xs:mt-4 text-base xs:text-lg font-medium text-gray-900">No se encontraron alumnos</h3>
                <p className="mt-1 xs:mt-2 text-xs xs:text-sm text-gray-500 px-4">
                  {filtro || activeCategory !== null || activeTurno !== null ? 
                    'No se encontraron alumnos con los filtros seleccionados.' : 
                    'Selecciona un curso y turno para ver los estudiantes.'
                  }
                </p>
               
              </div>
            )}
          </div>
          </>
          ) : (
            // Message when no course and shift are selected
            <div className="text-center py-8 xs:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg xs:rounded-xl shadow-lg border border-gray-200">
              <div className="max-w-xs xs:max-w-md mx-auto px-4">
                <svg className="mx-auto h-12 xs:h-16 w-12 xs:w-16 text-purple-400 mb-3 xs:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg xs:text-xl font-bold text-gray-800 mb-1 xs:mb-2">
                  {!activeCategory 
                    ? "Selecciona un Curso de Inglés"
                    : "Selecciona un Turno"
                  }
                </h3>
                <p className="text-xs xs:text-base text-gray-600 mb-3 xs:mb-4">
                  {!activeCategory 
                    ? "Para gestionar los alumnos, primero debes seleccionar el curso que deseas revisar desde las opciones de arriba."
                    : `Ahora selecciona el turno específico para ver los estudiantes de ${activeCategory}.`
                  }
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 xs:p-4 mt-3 xs:mt-4">
                  <p className="text-xs xs:text-sm text-purple-700">
                    💡 <strong>Tip:</strong> {!activeCategory 
                      ? "Una vez seleccionado el curso, podrás filtrar por turno y buscar estudiantes específicos."
                      : "Selecciona VESPERTINO 1 o VESPERTINO 2 para ver la lista completa de alumnos."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
