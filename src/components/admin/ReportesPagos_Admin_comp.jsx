// src\components\ReportesPagos_Admin_comp.jsx

/**
 * Componente de Reportes de Pagos Admin
 * 
 * Estructura de Datos del Backend para Reportes de Pagos:
 * {
 *   resumenGeneral: {
 *     totalIngresos: number,      // Ingresos totales para el período
 *     totalPagos: number,         // Número total de pagos
 *     pagosPendientes: number,    // Pagos pendientes de aprobación
 *     pagosAprobados: number,     // Pagos aprobados
 *     pagosRechazados: number,    // Pagos rechazados
 *     promedioMensual: number     // Promedio mensual de ingresos
 *   },
 *   ingresosPorMes: [
 *     {
 *       mes: string,              // Nombre del mes
 *       ingresos: number,         // Ingresos mensuales totales
 *       pagos: number            // Número de pagos para el mes
 *     }
 *   ],
 *   pagosPorCurso: [
 *     {
 *       curso: string,           // Nombre del curso
 *       pagos: number,           // Número de pagos
 *       ingresos: number         // Ingresos totales del curso
 *     }
 *   ],
 *   metodosDepago: [
 *     {
 *       metodo: string,          // Método de pago
 *       cantidad: number,        // Número de pagos con este método
 *       porcentaje: number       // Porcentaje del total
 *     }
 *   ]
 * }
 * 
 * APIs del Backend a implementar:
 * - GET /api/admin/reports/payments?startDate={date}&endDate={date} - Obtener reportes de pagos
 * - GET /api/admin/reports/export/excel?startDate={date}&endDate={date} - Exportar a Excel
 * - GET /api/admin/reports/export/pdf?startDate={date}&endDate={date} - Exportar a PDF
 */

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../../context/AdminContext.jsx';

// Componente de pantalla de carga simple (estilo consistente con otros componentes)
function LoadingScreen({ onComplete }) {
    useEffect(() => {
        // Simular carga por 2 segundos
        const timer = setTimeout(() => {
            onComplete();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Cargando reportes de pagos...</p>
            </div>
        </div>
    );
}

export function ReportesPagos_Admin_comp() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [reportes, setReportes] = useState({
    resumenGeneral: {
      totalIngresos: 0,
      totalPagos: 0,
      pagosPendientes: 0,
      pagosAprobados: 0,
      pagosRechazados: 0,
      promedioMensual: 0
    },
    ingresosPorMes: [],
    pagosPorCurso: [],
    metodosDepago: []
  });
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-12-31');

  const { 
    paymentReports,
    isLoading,
    error,
    lastUpdated,
    loadFinancialReports,
    exportToExcel,
    exportToPDF
  } = useAdminContext();

  // Función para obtener reportes del backend
  const fetchReportes = async () => {
    try {
      const data = await loadFinancialReports(fechaInicio, fechaFin);
      setReportes(data || {});
    } catch (err) {
      console.error('Error cargando reportes financieros:', err);
      setReportes({});
    }
  };

  // Cargar reportes cuando las fechas cambien
  useEffect(() => {
    fetchReportes();
  }, [fechaInicio, fechaFin]);

  // Manejar finalización de pantalla de carga inicial
  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  // Función para actualizar datos manualmente
  const handleRefreshData = async () => {
    await fetchReportes();
  };

  // Funciones de exportación (preparadas para backend)
  const handleExportExcel = async () => {
    try {
      await exportToExcel(fechaInicio, fechaFin);
      console.log('Exportar a Excel:', { fechaInicio, fechaFin });
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      alert('❌ Error exportando a Excel');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(fechaInicio, fechaFin);
      console.log('Exportar a PDF:', { fechaInicio, fechaFin });
    } catch (error) {
      console.error('Error exportando a PDF:', error);
      alert('❌ Error exportando a PDF');
    }
  };

  // Si está cargando inicialmente, mostrar pantalla de carga
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  };

  // Manejo de errores
  if (error) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error cargando reportes</h2>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reportes de Pagos</h1>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mt-2 mb-2 rounded-full"></div>
              <p className="text-sm text-gray-500">
                Análisis detallado de ingresos y estadísticas de pagos
              </p>
              
              {/* Información de actualización */}
              {lastUpdated && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Actualizado: {new Date(lastUpdated).toLocaleTimeString('es-MX', { 
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
            <div className="mt-4 sm:mt-0 flex gap-2">
              <button 
                onClick={handleExportExcel}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Excel
              </button>
              <button 
                onClick={handleExportPDF}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Filtros de fecha */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de fin
              </label>
              <input
                type="date"
                id="fechaFin"
                className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Aplicar Filtros
            </button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Ingresos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${(reportes.resumenGeneral?.totalIngresos || 0).toLocaleString()} MXN
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pagos Procesados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reportes.resumenGeneral?.totalPagos || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pagos Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reportes.resumenGeneral?.pagosPendientes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio Mensual</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${(reportes.resumenGeneral?.promedioMensual || 0).toLocaleString()} MXN
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de ingresos por mes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ingresos por Mes</h3>
            <div className="space-y-4">
              {(reportes.ingresosPorMes || []).slice(0, 6).map((mes, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">{mes.mes || ''}</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${((mes.ingresos || 0) / 5100) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${(mes.ingresos || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pagos por Curso</h3>
            <div className="space-y-4">
              {(reportes.pagosPorCurso || []).map((curso, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-gray-600 truncate">{curso.curso || ''}</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${((curso.ingresos || 0) / 19200) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {curso.pagos || 0} pagos
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métodos de pago y tabla detallada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Estado</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">Pagos Aprobados</span>
                <span className="text-lg font-bold text-green-900">
                  {reportes.resumenGeneral?.pagosAprobados || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-800">Pagos Pendientes</span>
                <span className="text-lg font-bold text-yellow-900">
                  {reportes.resumenGeneral?.pagosPendientes || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-800">Pagos Rechazados</span>
                <span className="text-lg font-bold text-red-900">
                  {reportes.resumenGeneral?.pagosRechazados || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
