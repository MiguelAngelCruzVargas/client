// src/components/student/Asistencia_Alumno_comp.jsx
// CONSULTA DE ASISTENCIA ESCOLAR - Solo visualización para estudiantes
// El estudiante solo puede VER su historial de asistencia (el admin marca la asistencia)
import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext.jsx';

// Iconos SVG para el sistema de asistencia
const IconoPresente = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconoAusente = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconoCalendario = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
  </svg>
);

// TODO: BACKEND - Obtener registros de asistencia desde la API (solo lectura para estudiante)
// Estructura esperada: { id, date, status, markedAt, markedBy, className, sessionInfo }
function generateAttendanceRecords() {
  // TODO: BACKEND - Reemplazar con llamada a API GET /api/students/attendance-history/{studentId}
  const records = [];
  const today = new Date();
  
  // Generar registros de ejemplo para los últimos 30 días
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Solo días laborables (lunes a viernes)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const isPresent = Math.random() > 0.15; // 85% presente, 15% ausente
      
      // Crear fecha de marcado (mismo día, hora aleatoria entre 8-10 AM)
      const markedTime = new Date(date);
      markedTime.setHours(8 + Math.floor(Math.random() * 2));
      markedTime.setMinutes(Math.floor(Math.random() * 60));
      markedTime.setSeconds(0);
      
      records.push({
        id: `record-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        status: isPresent ? 'presente' : 'ausente',
        markedAt: markedTime.toISOString(),
        markedBy: 'Prof. García', // Quién marcó la asistencia
        className: 'Clase General',
        sessionInfo: {
          startTime: '08:00',
          endTime: '10:00',
          subject: 'Matemáticas'
        }
      });
    }
  }
  
  return records;
}

// Componente de estadísticas de asistencia
function AttendanceStats({ records }) {
  // TODO: BACKEND - Calcular estadísticas desde datos del backend
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === 'presente').length;
  const absentDays = records.filter(r => r.status === 'ausente').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Porcentaje de Asistencia */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">%</span>
          </div>
          <span className="text-3xl font-bold text-blue-600">{attendancePercentage}%</span>
        </div>
        <h3 className="text-lg font-semibold text-blue-800 mb-1">Asistencia</h3>
        <p className="text-sm text-blue-600">Porcentaje total</p>
      </div>

      {/* Total de Días */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
            <IconoCalendario className="text-white" />
          </div>
          <span className="text-3xl font-bold text-gray-600">{totalDays}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Días</h3>
        <p className="text-sm text-gray-600">Días registrados</p>
      </div>

      {/* Días Presentes */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <IconoPresente className="text-white" />
          </div>
          <span className="text-3xl font-bold text-green-600">{presentDays}</span>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-1">Presentes</h3>
        <p className="text-sm text-green-600">Días asistidos</p>
      </div>

      {/* Ausencias */}
      <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-2xl shadow-lg border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <IconoAusente className="text-white" />
          </div>
          <span className="text-3xl font-bold text-red-600">{absentDays}</span>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-1">Ausencias</h3>
        <p className="text-sm text-red-600">Días faltados</p>
      </div>
    </div>
  );
}

// Componente para mostrar el estado de asistencia del día actual (solo lectura)
function TodayAttendanceStatus({ todayRecord }) {
  const today = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
      <div className={`p-6 ${
        todayRecord 
          ? todayRecord.status === 'presente' 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
            : 'bg-gradient-to-r from-red-600 to-rose-600'
          : 'bg-gradient-to-r from-gray-600 to-slate-600'
      }`}>
        <h3 className="text-xl font-bold text-white">
          Asistencia de Hoy - {today}
        </h3>
      </div>
      
      <div className="p-6">
        {todayRecord ? (
          <div className={`flex items-center justify-center p-6 rounded-xl ${
            todayRecord.status === 'presente' 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="text-center">
              {todayRecord.status === 'presente' ? (
                <>
                  <IconoPresente className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-green-800 mb-2">¡Presente!</h4>
                  <p className="text-green-600">Fuiste marcado como presente</p>
                </>
              ) : (
                <>
                  <IconoAusente className="h-12 w-12 text-red-600 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-red-800 mb-2">Ausente</h4>
                  <p className="text-red-600">Fuiste marcado como ausente</p>
                </>
              )}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>Marcado por: <span className="font-semibold">{todayRecord.markedBy}</span></p>
                <p>Hora: {new Date(todayRecord.markedAt).toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
                {todayRecord.sessionInfo && (
                  <p>Materia: <span className="font-semibold">{todayRecord.sessionInfo.subject}</span></p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 rounded-xl bg-gray-50 border-2 border-gray-200">
            <div className="text-center">
              <IconoCalendario className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-600 mb-2">Sin registrar</h4>
              <p className="text-gray-500">Aún no se ha tomado asistencia para hoy</p>
              <p className="text-sm text-gray-400 mt-2">El profesor marcará tu asistencia durante la clase</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente del historial de asistencias - Organizado por mes con tarjetas compactas
function AttendanceHistory({ records }) {
  // Agrupar registros por mes
  const groupRecordsByMonth = (records) => {
    const grouped = {};
    
    records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(record => {
        // Asegurar que la fecha sea válida
        const date = new Date(record.date + 'T00:00:00'); // Agregar tiempo para evitar problemas de zona horaria
        
        if (isNaN(date.getTime())) {
          console.warn('Fecha inválida encontrada:', record.date);
          return;
        }
        
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long' 
        });
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = {
            name: monthName,
            records: []
          };
        }
        
        grouped[monthKey].records.push(record);
      });
    
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const groupedRecords = groupRecordsByMonth(records);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-slate-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            Historial de Asistencias
          </h3>
          <div className="text-white/80 text-sm">
            Total: {records.length} registros
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {records.length > 0 ? (
          <div className="max-h-96 overflow-y-auto pr-2 space-y-6" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}>
            <style dangerouslySetInnerHTML={{
              __html: `
                .attendance-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .attendance-scroll::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 10px;
                }
                .attendance-scroll::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 10px;
                }
                .attendance-scroll::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `
            }} />
            
            <div className="attendance-scroll max-h-96 overflow-y-auto pr-2 space-y-6">
              {groupedRecords.map(([monthKey, monthData]) => (
                <div key={monthKey} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Header del mes */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800 capitalize">
                        {monthData.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {monthData.records.filter(r => r.status === 'presente').length} P
                        </span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          {monthData.records.filter(r => r.status === 'ausente').length} A
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tarjetas compactas del mes */}
                  <div className="p-3 space-y-2">
                    {monthData.records.map(record => (
                      <div 
                        key={record.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          record.status === 'presente' 
                            ? 'border-green-200 bg-green-50/50 hover:bg-green-50' 
                            : 'border-red-200 bg-red-50/50 hover:bg-red-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Icono de estado */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            record.status === 'presente' ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {record.status === 'presente' ? (
                              <IconoPresente className="text-white w-4 h-4" />
                            ) : (
                              <IconoAusente className="text-white w-4 h-4" />
                            )}
                          </div>
                          
                          {/* Información principal */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-gray-800 text-sm">
                                {new Date(record.date + 'T00:00:00').toLocaleDateString('es-ES', {
                                  weekday: 'short',
                                  day: 'numeric'
                                })}
                              </h5>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-600">
                                {record.sessionInfo?.subject || record.className}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500">
                                {new Date(record.markedAt).toLocaleTimeString('es-ES', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {record.markedBy}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Badge de estado */}
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'presente' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {record.status === 'presente' ? 'P' : 'A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <IconoCalendario className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay registros de asistencia</p>
            <p className="text-gray-400 text-sm">Los registros aparecerán aquí cuando marques tu asistencia</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal - Consulta de asistencia para estudiantes
export function Asistencia_Alumno_comp() {
  const { currentCourse } = useStudent();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState(null);

  // TODO: BACKEND - Cargar historial de asistencia desde API (solo lectura)
  useEffect(() => {
    const loadAttendanceHistory = async () => {
      setIsLoading(true);
      try {
        // TODO: BACKEND - Llamada real a API de consulta (sin permisos de escritura)
        // const response = await fetch(`/api/students/attendance-history/${studentId}`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // const data = await response.json();
        // setAttendanceRecords(data.records);
        
        // Simulación temporal
        await new Promise(resolve => setTimeout(resolve, 1000));
        const records = generateAttendanceRecords();
        setAttendanceRecords(records);
        
        // Verificar si hay registro para hoy
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = records.find(r => r.date === today);
        setTodayRecord(todayAttendance);
        
      } catch (error) {
        console.error('Error al cargar historial de asistencia:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendanceHistory();
  }, [currentCourse]);

  // Estado de carga inicial
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center p-4 bg-white">
  //       <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-lg font-medium text-gray-700">Cargando historial de asistencia...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Renderizado principal del sistema de asistencia
  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header del sistema */}
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            MI ASISTENCIA
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Consulta tu historial de asistencia escolar
          </p>
          {currentCourse && (
            <p className="text-sm text-gray-500 font-medium">
              Curso: {currentCourse.title}
            </p>
          )}
          <div className="mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg inline-block">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">📝 Nota:</span> La asistencia es marcada por tu profesor
            </p>
          </div>
        </div>
        
        {/* Estadísticas de asistencia */}
        <AttendanceStats records={attendanceRecords} />
        
        {/* Estado de asistencia del día */}
        <TodayAttendanceStatus todayRecord={todayRecord} />
        
        {/* Historial de asistencias */}
        <AttendanceHistory records={attendanceRecords} />
        
      </div>
    </div>
  );
}

export default Asistencia_Alumno_comp;
