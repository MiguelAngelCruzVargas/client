import React, { useState, useEffect } from 'react';

function LoadingScreen({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000); // Simula un tiempo de carga de 2 segundos
        return () => clearTimeout(timer);
    }, [onComplete]);
// Esta función se ejecuta una vez que la carga se completa 
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Cargando validación de recibos... </p>
            </div>
        </div>
    );
}

// Botón de categoría de curso
function CategoryButton({ label, isActive, onClick }) {
    // Función para obtener texto responsive
    // falta  ver si realmente funciona bien en pantallas pequeñas y grandes
    
    const getResponsiveText = (label) => {
        const abbreviations = {
            'DIGI-START': { short: 'DIGI', medium: 'DIGI-START' },
            'MINDBRIDGE': { short: 'MIND', medium: 'MINDBRIDGE' },
            'SPEAKUP': { short: 'SPEAK', medium: 'SPEAKUP' },
            'EEAU': { short: 'EEAU', medium: 'EEAU' },
            'EEAP': { short: 'EEAP', medium: 'EEAP' },
            'PCE': { short: 'PCE', medium: 'PCE' }
        };
         
        return abbreviations[label] || { short: label, medium: label };
    };

    const textVariants = getResponsiveText(label);

    return (
        <button
            onClick={onClick}
            className={`
                relative overflow-hidden 
                px-1 py-1.5 xs:px-2 xs:py-2 sm:px-3 sm:py-3 md:px-4 md:py-3
                rounded-md xs:rounded-lg sm:rounded-xl 
                font-bold text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base
                transition-all duration-300 ease-out 
                w-full min-w-[70px] xs:min-w-[85px] sm:min-w-[100px] max-w-[120px] xs:max-w-[140px] sm:max-w-[160px]
                h-10 xs:h-12 sm:h-14 md:h-16
                flex items-center justify-center
                border-2 transform hover:scale-105 hover:shadow-lg
                ${isActive
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 shadow-md shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400 shadow-sm hover:from-purple-600 hover:to-purple-700 hover:border-purple-500'
                }
            `}
        >
            {/* Texto para pantallas muy pequeñas */}
            <span className="block xs:hidden relative z-10 tracking-tight text-center leading-tight break-words hyphens-auto px-1">
                {textVariants.short}
            </span>
            {/* Texto para pantallas medianas y grandes */}
            <span className="hidden xs:block relative z-10 tracking-tight text-center leading-tight break-words hyphens-auto px-1">
                {textVariants.medium}
            </span>
        </button>
    );
}

// Botón de turno vespertino con profesor asignado
function VespertinoButton({ label, isActive, onClick, profesorAsignado, grupo }) {
    // Función para obtener estilos sobrios basados en el tipo de turno
    const getGrupoStyles = (tipo, isActive) => {
        const baseStyles = "relative overflow-hidden px-3 py-2 xs:px-4 xs:py-2 sm:px-5 sm:py-3 rounded-md xs:rounded-lg font-medium text-xs xs:text-sm transition-all duration-200 ease-out w-full min-w-[100px] max-w-[140px] h-10 xs:h-12 sm:h-14 flex flex-col items-center justify-center gap-0.5 border hover:shadow-md";
        
        switch (tipo) {
            case 'vespertino':
                return isActive 
                    ? `${baseStyles} bg-purple-500 text-white border-purple-500`
                    : `${baseStyles} bg-white text-purple-600 border-purple-300 hover:bg-purple-50`;
            
            case 'matutino':
                return isActive 
                    ? `${baseStyles} bg-blue-500 text-white border-blue-500`
                    : `${baseStyles} bg-white text-blue-600 border-blue-300 hover:bg-blue-50`;
            
            case 'sabatino':
                return isActive 
                    ? `${baseStyles} bg-green-500 text-white border-green-500`
                    : `${baseStyles} bg-white text-green-600 border-green-300 hover:bg-green-50`;
            
            default:
                return isActive 
                    ? `${baseStyles} bg-gray-500 text-white border-gray-500`
                    : `${baseStyles} bg-white text-gray-600 border-gray-300 hover:bg-gray-50`;
        }
    };

    return (
        <button
            onClick={onClick}
            className={getGrupoStyles(grupo?.tipo, isActive)}
        >
            <span className="relative z-10 tracking-wide text-center leading-tight">{label}</span>
            {isActive && profesorAsignado && (
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium opacity-90 relative z-10 text-center">
                    Prof. {profesorAsignado}
                </span>
            )}
        </button>
    );
}

// Tooltip de ayuda para zoom en PDFs
// este se puede quedar 
function PdfZoomTip({ onDismiss }) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleDismiss = () => {
        onDismiss(dontShowAgain);
    };

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-indigo-600/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl z-10 border border-indigo-400/50">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 21v-1m0-16a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-sm">Consejo</h4>
                    <p className="text-xs text-indigo-100">Usa <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">Rueda del ratón</kbd> para hacer zoom.</p>
                    <div className="mt-2">
                        <label className="flex items-center text-xs text-indigo-200 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                            />
                            <span className="ml-2">No volver a mostrar</span>
                        </label>
                    </div>
                </div>
                <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-indigo-500/50 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
    );
}

// COMPONENTE PRINCIPAL: Gestión de Comprobantes de Pago
export function ComprobanteRecibo() {
    // ==================== ESTADOS DE LA APLICACIÓN ====================
    
    // Estados de navegación y UI
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [activeCategory, setActiveCategory] = useState('');
    const [activeVespertino, setActiveVespertino] = useState('');
    const [vistaActual, setVistaActual] = useState('pendientes'); // 'pendientes', 'aprobados', 'rechazados'
   
    // ==================== ESTADOS PARA MODALES DE CONFIRMACIÓN ====================
    
    // MODAL DE ÉXITO (aprobación)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // ========== MODAL DE RECHAZO - VARIABLES PRINCIPALES ==========
    // showRejectModal: boolean - Controla visibilidad del modal de rechazo
    // USADA EN: Botón "RECHAZAR" → handleRechazar() → confirmarRechazo()
    const [showRejectModal, setShowRejectModal] = useState(false);
    
    // currentComprobante: object - Almacena temporalmente el comprobante a procesar
    // CONTENIDO: Todos los datos del comprobante (id, nombreAlumno, importe, etc.)
    // USADA EN: Modal de rechazo para mostrar nombre del estudiante
    // USADA EN: Modal de éxito para mostrar nombre del estudiante aprobado
    // FLUJO: handleRechazar() → setCurrentComprobante() → Modal muestra datos
    const [currentComprobante, setCurrentComprobante] = useState(null);
    
    // motivoRechazo: string - Texto del motivo ingresado por admin
    // PROPÓSITO: Campo obligatorio para documentar por qué se rechaza
    // VALIDACIÓN: confirmarRechazo() verifica que no esté vacío con trim()
    // BACKEND: Se envía al servidor y se almacena en la base de datos
    // LIMPIEZA: Se resetea a '' cuando se cancela o completa el rechazo
    const [motivoRechazo, setMotivoRechazo] = useState('');
    
    // Otros modales
    const [showPdfTip, setShowPdfTip] = useState(false);
    
    // ==================== ESTADOS PARA EDICIÓN TEMPORAL ====================
    // PROPÓSITO: Los comprobantes llegan como PDF/imagen SIN datos extraídos automáticamente
    // PROBLEMA: Extraer datos de PDF/imagen requiere OCR o procesamiento complejo
    // SOLUCIÓN: Admin ve la imagen y MANUALMENTE ingresa importe/método de pago
    
    // FLUJO REAL:
    // 1. Backend recibe PDF/imagen del estudiante (sin datos estructurados)
    // 2. Comprobante llega con campos importe="" y metodoPago="" VACÍOS  
    // 3. Admin abre imagen, lee visualmente los datos y los ingresa aquí
    // 4. Al aprobar/rechazar, se envían los valores ingresados manualmente al backend
    // 5. Backend guarda los datos que el admin extrajo manualmente
    
    // Estados para campos editables (importe y método)
    const [editableFields, setEditableFields] = useState({}); // Para almacenar valores ingresados manualmente por admin
    
    // Estado del visor de comprobantes
    const [modalComprobante, setModalComprobante] = useState({
        isOpen: false,
        comprobante: null,
        zoomLevel: 1
    });
    // ==================== DATOS Y CONFIGURACIÓN ====================
    
    // TODO: REEMPLAZAR CON API - Comprobantes pendientes de validación
    //  ELIMINAR DATOS MOCK ANTES DE PRODUCCIÓN 
    const [comprobantes, setComprobantes] = useState([
        {
            id: 1,
            folio: "MQEEAU-2025-0001", 
            nombreAlumno: "María González López",
            cursoComprado: "EEAU - Grupo V1",
            fechaHora: "2024-07-29 14:30",
            importe: "", // ← VACÍO: Admin debe leer del PDF e ingresar manualmente
            metodoPago: "", // ← VACÍO: Admin debe leer del PDF e ingresar manualmente
            estado: "pendiente",
            comprobanteUrl: "/src/assets/comprobante-pago-MQ-20250729-0001.pdf"
        },
        {
            id: 2,
            folio: "MQEEAP-2025-0002", 
            nombreAlumno: "Carlos Hernández Ruiz",
            cursoComprado: "EEAP - Grupo V1",
            fechaHora: "2024-07-29 16:45",
            importe: "", // ← VACÍO: Admin debe leer de la imagen e ingresar manualmente
            metodoPago: "", // ← VACÍO: Admin debe leer de la imagen e ingresar manualmente
            estado: "pendiente",
            comprobanteUrl: "/src/assets/comprobante-pago-MQ-20250729-0001.png"
        },
        {
            id: 3,
            folio: "MQDIGI-2025-0003", 
            nombreAlumno: "Ana Patricia Morales",
            cursoComprado: "DIGI-START - Grupo V1",
            fechaHora: "2024-07-29 10:15",
            importe: "", // ← VACÍO: Admin debe leer del PDF e ingresar manualmente
            metodoPago: "", // ← VACÍO: Admin debe leer del PDF e ingresar manualmente
            estado: "pendiente",
            comprobanteUrl: "/src/assets/comprobante-pago-MQ-20250729-0001.pdf"
        }
    ]);
    
    /* 
    ========== DATOS MOCK - ELIMINAR EN PRODUCCIÓN ==========
    
    Ejemplo de estructura de datos que debe venir del backend:
    
    const [comprobantes, setComprobantes] = useState([
        {
            id: 1,
            nombreAlumno: "María González López",
            cursoComprado: "Matemáticas Nivel 1",
            fechaHora: "2024-06-27 14:30",
            importe: "150.00",
            metodoPago: "Transferencia bancaria",
            estado: "pendiente",
            comprobanteUrl: "/src/assets/comprobante-pago-MQ-20250729-0001.pdf"
        }
    ]);
    
    ========== FIN DATOS MOCK ==========
    */

    // TODO: REEMPLAZAR CON API - Historial de comprobantes procesados
    const [comprobantesAprobados, setComprobantesAprobados] = useState([]);
    const [comprobantesRechazados, setComprobantesRechazados] = useState([]);

    // ==================== CONFIGURACIÓN DE CURSOS Y GRUPOS ====================
    
    // ❌ CURSOS FIJOS - HARDCODEADOS en el frontend
    // Estos NO cambian desde el backend, están definidos aquí:
    const cursosDisponibles = ['EEAU', 'EEAP', 'DIGI-START', 'MINDBRIDGE', 'SPEAKUP', 'PCE'];
    
    //  GRUPOS DINÁMICOS - TODO viene del backend
    // Incluye: nombre, tipo, capacidad máxima, alumnos actuales
    // TODO: CONECTAR CON BACKEND - Endpoint: GET /api/cursos/{curso}/grupos
    // ¡¡¡ ESTOS DATOS SÍ VIENEN DEL BACKEND !!!
    const [gruposPorCurso, setGruposPorCurso] = useState({
        // DATOS MOCK TEMPORALES PARA PRUEBAS - ELIMINAR EN PRODUCCIÓN
        'EEAU': [
            { id: 1, nombre: 'V1', tipo: 'vespertino', capacidad: 10, alumnosActuales: 8 },
            { id: 2, nombre: 'V2', tipo: 'vespertino', capacidad: 10, alumnosActuales: 5 },
            { id: 3, nombre: 'M1', tipo: 'matutino', capacidad: 15, alumnosActuales: 12 }
        ],
        'EEAP': [
            { id: 4, nombre: 'V1', tipo: 'vespertino', capacidad: 12, alumnosActuales: 9 },
            { id: 5, nombre: 'S1', tipo: 'sabatino', capacidad: 20, alumnosActuales: 15 }
        ],
        'DIGI-START': [
            { id: 6, nombre: 'V1', tipo: 'vespertino', capacidad: 8, alumnosActuales: 6 },
            { id: 7, nombre: 'M1', tipo: 'matutino', capacidad: 10, alumnosActuales: 7 }
        ],
        'MINDBRIDGE': [
            { id: 8, nombre: 'V1', tipo: 'vespertino', capacidad: 6, alumnosActuales: 4 }
        ],
        'SPEAKUP': [
            { id: 9, nombre: 'V1', tipo: 'vespertino', capacidad: 8, alumnosActuales: 6 },
            { id: 10, nombre: 'V2', tipo: 'vespertino', capacidad: 8, alumnosActuales: 3 }
        ],
        'PCE': [
            { id: 11, nombre: 'M1', tipo: 'matutino', capacidad: 12, alumnosActuales: 10 },
            { id: 12, nombre: 'S1', tipo: 'sabatino', capacidad: 15, alumnosActuales: 8 }
        ]
    });
    
    //  PROFESORES DINÁMICOS - TODO viene del backend  
    // Asignaciones pueden cambiar: reasignar profesores a diferentes grupos
    // TODO: CONECTAR CON BACKEND - Endpoint: GET /api/profesores/asignaciones
    // ¡¡¡ ESTOS DATOS SÍ VIENEN DEL BACKEND !!!
    const [profesoresAsignados, setProfesoresAsignados] = useState({
        // DATOS MOCK TEMPORALES PARA PRUEBAS - ELIMINAR EN PRODUCCIÓN
        'EEAU': {
            'V1': { nombre: 'García López', id: 123 },
            'V2': { nombre: 'Martínez Silva', id: 124 },
            'M1': { nombre: 'Pérez García', id: 125 }
        },
        'EEAP': {
            'V1': { nombre: 'Fernández Ruiz', id: 126 },
            'S1': { nombre: 'López Herrera', id: 127 }
        },
        'DIGI-START': {
            'V1': { nombre: 'Rodríguez Tech', id: 128 },
            'M1': { nombre: 'González Code', id: 129 }
        },
        'MINDBRIDGE': {
            'V1': { nombre: 'Morales Mind', id: 130 }
        },
        'SPEAKUP': {
            'V1': { nombre: 'Jiménez Speak', id: 131 },
            'V2': { nombre: 'Castro Talk', id: 132 }
        },
        'PCE': {
            'M1': { nombre: 'Vargas Prep', id: 133 },
            'S1': { nombre: 'Medina Exam', id: 134 }
        }
    });

    /*
    ========== ESTRUCTURA DE DATOS BACKEND - ACLARACIÓN IMPORTANTE ==========
    
    ❌ CURSOS: FIJOS en el frontend ['EEAU', 'EEAP', 'DIGI-START', 'MINDBRIDGE', 'SPEAKUP', 'PCE']
       → NO requieren endpoint del backend
       → Están hardcodeados en el componente
       → Solo se cambian editando el código frontend
    
     DINÁMICO desde el backend (TODO viene de APIs):
    
    1. GRUPOS/TURNOS POR CURSO:
       Endpoint: GET /api/cursos/{curso}/grupos
       Response: [
         { 
           id: 1, 
           nombre: "V1", 
           tipo: "vespertino", 
           capacidad: 10,        ← DINÁMICO: Admin puede cambiar
           alumnosActuales: 8    ← DINÁMICO: Se actualiza automáticamente
         }
       ]
       
    2. ASIGNACIÓN DE PROFESORES:
       Endpoint: GET /api/profesores/asignaciones
       Response: {
         "EEAU": {
           "V1": { 
             nombre: "García López",  ← DINÁMICO: Admin puede reasignar
             id: 123 
           }
         }
       }
    

    ========== FIN ACLARACIÓN ==========
    */

    // ==================== UTILIDADES ====================
    
    const isPdf = modalComprobante.comprobante?.comprobanteUrl?.toLowerCase().endsWith('.pdf');

    // Genera folio dinámico basado en el curso y año actual (los renombro por la cuestion del espacio)
    const generateFolio = (cursoComprado) => {
        const year = new Date().getFullYear();
        const courseCode = cursoComprado.includes('EEAU') ? 'EEAU' : 
                          cursoComprado.includes('EEAP') ? 'EEAP' :
                          cursoComprado.includes('DIGI-START') ? 'DIGI' :
                          cursoComprado.includes('MINDBRIDGE') ? 'MIND' :
                          cursoComprado.includes('SPEAKUP') ? 'SPEAK' :
                          cursoComprado.includes('PCE') ? 'PCE' : 'GEN';
        
        // Obtener el siguiente número secuencial
        const allFolios = [
            ...comprobantes,
            ...comprobantesAprobados,
            ...comprobantesRechazados
        ].map(c => c.folio || '').filter(Boolean);
        
        const foliosOfYear = allFolios.filter(folio => 
            folio.includes(`-${year}-`) && folio.includes(courseCode)
        );
        
        const nextNumber = foliosOfYear.length + 1;
        const paddedNumber = nextNumber.toString().padStart(4, '0');
        
        return `MQ${courseCode}-${year}-${paddedNumber}`;
    };

    // ==================== GESTIÓN DE CAMPOS EDITABLES ====================
    // IMPORTANTE: El admin puede editar IMPORTE y MÉTODO DE PAGO antes de aprobar/rechazar
    // Los valores editados se almacenan temporalmente hasta que se procese el comprobante
    
    // Manejador para actualizar campos editables (importe y método de pago)
    // FUNCIÓN: Permite al admin corregir datos incorrectos antes de procesar
    // ALMACENA: valores temporales en editableFields sin modificar el comprobante original
    const handleFieldChange = (comprobanteId, field, value) => {
        setEditableFields(prev => ({
            ...prev,
            [comprobanteId]: {
                ...prev[comprobanteId],
                [field]: value
            }
        }));
    };

    // Obtener valor de campo editable o valor original
    // LÓGICA: Si el admin editó el campo, devuelve el valor editado
    //         Si no, devuelve el valor original del comprobante
    const getFieldValue = (comprobante, field) => {
        return editableFields[comprobante.id]?.[field] ?? comprobante[field];
    };

    // Obtiene los comprobantes según la vista activa Y filtrados por curso/grupo seleccionado
    const getComprobantesActuales = () => {
        let comprobantesBase;
        switch (vistaActual) {
            case 'aprobados':
                comprobantesBase = comprobantesAprobados;
                break;
            case 'rechazados':
                comprobantesBase = comprobantesRechazados;
                break;
            default:
                comprobantesBase = comprobantes;
        }

        // FILTRAR por curso y grupo seleccionado
        if (activeCategory && activeVespertino) {
            const filtroGrupo = `${activeCategory} - Grupo ${activeVespertino}`;
            return comprobantesBase.filter(comprobante => 
                comprobante.cursoComprado === filtroGrupo
            );
        }
        
        return comprobantesBase;
    };

    // Título dinámico según la vista Y grupo seleccionado
    const getTituloVista = () => {
        const grupoInfo = activeCategory && activeVespertino ? ` - ${activeCategory} ${activeVespertino}` : '';
        
        switch (vistaActual) {
            case 'aprobados':
                return `Comprobantes Aprobados${grupoInfo}`;
            case 'rechazados':
                return `Comprobantes Rechazados${grupoInfo}`;
            default:
                return `Comprobantes Pendientes${grupoInfo}`;
        }
    };

    // Obtiene el profesor asignado al grupo seleccionado
    const getProfesorAsignado = () => {
        if (activeCategory && activeVespertino) {
            const profesor = profesoresAsignados[activeCategory]?.[activeVespertino];
            return profesor?.nombre || 'Sin asignar';
        }
        return null;
    };

    // Obtiene los grupos disponibles para el curso seleccionado
    const getGruposDisponibles = () => {
        return gruposPorCurso[activeCategory] || [];
    };

    // 🔧 CONTADORES DINÁMICOS - Solo para el grupo seleccionado
    const getContadoresParaGrupo = () => {
        if (!activeCategory || !activeVespertino) {
            return { pendientes: 0, aprobados: 0, rechazados: 0 };
        }
        
        const filtroGrupo = `${activeCategory} - Grupo ${activeVespertino}`;
        
        const pendientes = comprobantes.filter(c => c.cursoComprado === filtroGrupo).length;
        const aprobados = comprobantesAprobados.filter(c => c.cursoComprado === filtroGrupo).length;
        const rechazados = comprobantesRechazados.filter(c => c.cursoComprado === filtroGrupo).length;
        
        return { pendientes, aprobados, rechazados };
    };

    // ==================== EFECTOS ====================
    
    // TODO: IMPLEMENTAR - Cargar datos dinámicos desde el backend
    useEffect(() => {
        // IMPLEMENTAR ESTAS LLAMADAS AL BACKEND

        const loadInitialData = async () => {
            try {
                // 1. Cargar grupos para todos los cursos (los cursos son fijos)
                // const gruposData = {};
                // for (const curso of cursosDisponibles) {
                //     const gruposResponse = await api.get(`/api/cursos/${curso}/grupos`);
                //     gruposData[curso] = gruposResponse.data;
                // }
                // setGruposPorCurso(gruposData);
                
                // 2. Cargar profesores asignados
                // const profesoresResponse = await api.get('/api/profesores/asignaciones');
                // setProfesoresAsignados(profesoresResponse.data);
                
                // 3. Cargar comprobantes pendientes
                // const comprobantesResponse = await api.get('/api/comprobantes/pendientes');
                // setComprobantes(comprobantesResponse.data);
                
                // 4. Cargar historial de comprobantes
                // const [aprobados, rechazados] = await Promise.all([
                //     api.get('/api/comprobantes/aprobados'),
                //     api.get('/api/comprobantes/rechazados')
                // ]);
                // setComprobantesAprobados(aprobados.data);
                // setComprobantesRechazados(rechazados.data);
                
            } catch (error) {
                console.error('Error cargando datos iniciales:', error);
                // TODO: Mostrar mensaje de error al usuario
            }
        };
        
        // loadInitialData();
    }, []);

    // TODO: IMPLEMENTAR - Cargar grupos cuando se selecciona un curso
    useEffect(() => {
        if (activeCategory) {
            // IMPLEMENTAR ESTA LLAMADA AL BACKEND

            // const loadGruposForCurso = async () => {
            //     try {
            //         const response = await api.get(`/api/cursos/${activeCategory}/grupos`);
            //         setGruposPorCurso(prev => ({
            //             ...prev,
            //             [activeCategory]: response.data
            //         }));
            //     } catch (error) {
            //         console.error(`Error cargando grupos para ${activeCategory}:`, error);
            //     }
            // };
            
            // loadGruposForCurso();
        }
    }, [activeCategory]);

    // Manejo del tooltip de PDF
    useEffect(() => {
        if (modalComprobante.isOpen && isPdf) {
            const hideTip = localStorage.getItem('hidePdfZoomTip');
            if (hideTip !== 'true') {
                setShowPdfTip(true);
            }
        } else {
            setShowPdfTip(false);
        }
    }, [modalComprobante.isOpen, isPdf]);

    // ========================================
            // MANEJADORES DE EVENTOS 
    // ========================================
    
    // Navegación entre cursos
    const handleCategorySelect = (categoria) => {
        if (activeCategory === categoria) {
            setActiveCategory('');
            setActiveVespertino('');
            setShowContent(false);
        } else {
            setActiveCategory(categoria);
            setActiveVespertino('');
            setShowContent(false); 
        }
    };

    const handleVespertinoSelect = (vespertino) => {
        if (activeVespertino === vespertino) {
            setActiveVespertino('');
            setShowContent(false);
        } else {
            setActiveVespertino(vespertino);
            setShowContent(true);
        }
    };

    const handleLoadingComplete = () => {
        setShowLoadingScreen(false);
        setIsLoading(false);
    };

    // ==================== ACCIONES DE COMPROBANTES ====================
    
    /*
    ========== ENDPOINTS NECESARIOS PARA EL BACKEND ==========
    
     IMPORTANTE: Los cursos ['EEAU', 'EEAP', 'DIGI-START', 'MINDBRIDGE', 'SPEAKUP', 'PCE'] 
        están FIJOS en el frontend y NO requieren endpoint.
    
    === CONFIGURACIÓN DINÁMICA ===
    1. GET /api/cursos/{curso}/grupos
       - Parámetro: curso (uno de los 6 cursos fijos)
       - Response: Array con grupos del curso:
         [{ 
           id: 1, 
           nombre: "V1", 
           tipo: "vespertino", 
           capacidad: 10,        ← Admin puede modificar
           alumnosActuales: 8    ← Se actualiza automáticamente
         }]
         
    2. GET /api/profesores/asignaciones
       - Response: Objeto con asignaciones dinámicas:
         { "EEAU": { "V1": { nombre: "García López", id: 123 } } }
    
    === GESTIÓN DE COMPROBANTES ===
    3. POST /api/comprobantes/{id}/rechazar
    4. POST /api/comprobantes/{id}/aprobar  
    5. GET /api/comprobantes/pendientes
    6. GET /api/comprobantes/aprobados
    7. GET /api/comprobantes/rechazados
    
  
    
    ========== FIN LISTA DE ENDPOINTS ==========
    */
    
    // ==================== ACCIÓN: RECHAZAR COMPROBANTE ====================
    // Función que inicia el proceso de rechazo de un comprobante
    // PROPÓSITO: Preparar el modal de confirmación con los datos del comprobante
    // VARIABLES QUE MODIFICA:
    //   - setCurrentComprobante(comprobante): Almacena el comprobante a rechazar
    //   - setShowRejectModal(true): Muestra el modal de confirmación
    // FLUJO: Botón "RECHAZAR" → handleRechazar() → Modal aparece → confirmarRechazo()
    
    // IMPORTANTE: Esta función solo abre el modal de confirmación
    // La lógica real de rechazo está en confirmarRechazo()
    // TODO: Conectar con API - Endpoint: POST /api/comprobantes/{id}/rechazar
    const handleRechazar = (comprobante) => {
        // Guardar el comprobante que se va a rechazar para usarlo en el modal
        setCurrentComprobante(comprobante);
        // Mostrar el modal de confirmación de rechazo
        setShowRejectModal(true);
    };

    // ==================== CONFIRMAR RECHAZO CON MOTIVO ====================
    // Esta función ejecuta el rechazo definitivo del comprobante
    // VARIABLES QUE USA:
    //   - motivoRechazo: string - Motivo ingresado por admin (OBLIGATORIO)
    //   - currentComprobante: object - Comprobante a rechazar
    //   - editableFields: object - Campos editados por admin (importe/metodoPago)
    // VARIABLES QUE MODIFICA:
    //   - setComprobantes(): Remueve de pendientes
    //   - setComprobantesRechazados(): Añade a rechazados
    //   - setEditableFields(): Limpia campos editados
    //   - setShowRejectModal(false): Cierra modal
    //   - setCurrentComprobante(null): Limpia comprobante actual
    //   - setMotivoRechazo(''): Limpia motivo
    // FLUJO: Modal → confirmarRechazo() → Validación → Procesamiento → Cierre
    
    // REQUIERE: motivo de rechazo obligatorio
    // PROCESA: campos editables (importe y método de pago) antes del rechazo
    // BACKEND: debe enviar los datos actualizados al servidor
    
    // TODO: Conectar con API - Enviar motivo de rechazo al backend
    const confirmarRechazo = async () => {
        // VALIDACIÓN OBLIGATORIA: El motivo no puede estar vacío
        if (!motivoRechazo.trim()) {
            alert('Por favor, ingresa el motivo del rechazo');
            return;
        }
        
        try {
            // OBTENER VALORES DE CAMPOS EDITABLES
            // Si el admin editó el importe o método de pago, usar esos valores
            // Si no, usar los valores originales del comprobante
            const importeActualizado = getFieldValue(currentComprobante, 'importe');
            const metodoPagoActualizado = getFieldValue(currentComprobante, 'metodoPago');
            
            // TODO: LLAMADA AL BACKEND - ENDPOINT: POST /api/comprobantes/{id}/rechazar
            // DEBE ENVIAR:
            // - motivo: texto del motivo de rechazo
            // - fechaRechazo: timestamp actual
            // - adminId: ID del administrador que rechaza
            // - importe: valor actualizado (editado o original)
            // - metodoPago: valor actualizado (editado o original)
            // - folio: folio generado o existente
            
            // await api.post(`/comprobantes/${currentComprobante.id}/rechazar`, {
            //     motivo: motivoRechazo,
            //     fechaRechazo: new Date().toISOString(),
            //     adminId: sessionStorage.getItem('adminId'),
            //     importe: importeActualizado,
            //     metodoPago: metodoPagoActualizado,
            //     folio: currentComprobante.folio || generateFolio(currentComprobante.cursoComprado)
            // });
            
            // SIMULACIÓN LOCAL - ELIMINAR CUANDO SE CONECTE EL BACKEND
            const comprobanteRechazado = {
                ...currentComprobante,
                folio: currentComprobante.folio || generateFolio(currentComprobante.cursoComprado),
                importe: importeActualizado,      // ← Valor editado por admin
                metodoPago: metodoPagoActualizado, // ← Valor editado por admin
                estado: 'rechazado',
                motivoRechazo: motivoRechazo,     // ← Motivo ingresado por admin
                fechaRechazo: new Date().toLocaleString()
            };
            
            // ACTUALIZAR ESTADOS: Mover comprobante de pendientes a rechazados
            setComprobantes(prev => prev.filter(c => c.id !== currentComprobante.id));
            setComprobantesRechazados(prev => [...prev, comprobanteRechazado]);
            
            // LIMPIAR CAMPOS EDITABLES para este comprobante
            setEditableFields(prev => {
                const newFields = { ...prev };
                delete newFields[currentComprobante.id];
                return newFields;
            });
            
            // CERRAR MODAL Y LIMPIAR VARIABLES
            setShowRejectModal(false);
            setCurrentComprobante(null);
            setMotivoRechazo('');
        } catch (error) {
            console.error('Error al rechazar comprobante:', error);
            alert('Error al procesar el rechazo. Intenta nuevamente.');
        }
    };

    // ==================== ACCIÓN: APROBAR/VALIDAR COMPROBANTE ====================
    // Función que ejecuta la aprobación definitiva del comprobante
    // PROCESA: campos editables (importe y método de pago) antes de aprobar
    // BACKEND: debe enviar los datos actualizados al servidor
    // RESULTADO: comprobante se mueve de pendientes a aprobados
    
    // TODO: Conectar con API - Endpoint: POST /api/comprobantes/{id}/aprobar
    const handleValidar = async (comprobante) => {
        try {
            // OBTENER VALORES DE CAMPOS EDITABLES
            // Si el admin editó el importe o método de pago, usar esos valores
            // Si no, usar los valores originales del comprobante
            const importeActualizado = getFieldValue(comprobante, 'importe');
            const metodoPagoActualizado = getFieldValue(comprobante, 'metodoPago');
            
            // TODO: LLAMADA AL BACKEND - ENDPOINT: POST /api/comprobantes/{id}/aprobar
            // DEBE ENVIAR:
            // - fechaAprobacion: timestamp actual
            // - adminId: ID del administrador que aprueba
            // - importe: valor actualizado (editado o original)
            // - metodoPago: valor actualizado (editado o original)
            // - folio: folio generado o existente
            
            // await api.post(`/comprobantes/${comprobante.id}/aprobar`, {
            //     fechaAprobacion: new Date().toISOString(),
            //     adminId: sessionStorage.getItem('adminId'),
            //     importe: importeActualizado,
            //     metodoPago: metodoPagoActualizado,
            //     folio: comprobante.folio || generateFolio(comprobante.cursoComprado)
            // });
            
            // SIMULACIÓN LOCAL - ELIMINAR CUANDO SE CONECTE EL BACKEND
            const comprobanteAprobado = {
                ...comprobante,
                folio: comprobante.folio || generateFolio(comprobante.cursoComprado),
                importe: importeActualizado,      // ← Valor editado por admin
                metodoPago: metodoPagoActualizado, // ← Valor editado por admin
                estado: 'aprobado',
                fechaAprobacion: new Date().toLocaleString()
            };
            
            // Mover comprobante de pendientes a aprobados
            setComprobantes(prev => prev.filter(c => c.id !== comprobante.id));
            setComprobantesAprobados(prev => [...prev, comprobanteAprobado]);
            
            // Limpiar campos editables para este comprobante
            setEditableFields(prev => {
                const newFields = { ...prev };
                delete newFields[comprobante.id];
                return newFields;
            });
            
            // ========== PREPARAR DATOS PARA MODAL DE ÉXITO ==========
            // IMPORTANTE: Establecer currentComprobante con datos actualizados
            // PROPÓSITO: El modal de éxito necesita mostrar el nombre del estudiante aprobado
            // CONTIENE: Todos los datos del comprobante incluyendo valores editados por admin
            setCurrentComprobante(comprobanteAprobado);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error al aprobar comprobante:', error);
            alert('Error al procesar la aprobación. Intenta nuevamente.');
        }
    };

    // ==================== VISOR DE COMPROBANTES ====================
    
    const handleVerComprobante = (comprobante) => {
        setModalComprobante({
            isOpen: true,
            comprobante: comprobante,
            zoomLevel: 1
        });
    };
    
    const closeModal = () => {
        setModalComprobante({ isOpen: false, comprobante: null, zoomLevel: 1 });
    }

    // Controles de zoom para imágenes
    const handleZoomIn = () => setModalComprobante(prev => ({ ...prev, zoomLevel: Math.min(prev.zoomLevel + 0.2, 3) }));
    const handleZoomOut = () => setModalComprobante(prev => ({ ...prev, zoomLevel: Math.max(prev.zoomLevel - 0.2, 0.2) }));
    const handleResetZoom = () => setModalComprobante(prev => ({ ...prev, zoomLevel: 1 }));

    const handleDismissPdfTip = (permanently) => {
        if (permanently) {
            localStorage.setItem('hidePdfZoomTip', 'true');
        }
        setShowPdfTip(false);
    };

    // ==================== RENDER ====================

    // Si está cargando inicialmente, mostrar pantalla de carga
    if (showLoadingScreen) {
        return <LoadingScreen onComplete={handleLoadingComplete} />;
    }

    return (
        <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col bg-white">
            {/* ==================== HEADER Y FILTROS ==================== */}
            <div className="pt-2 xs:pt-4 sm:pt-6 pb-2 xs:pb-3 sm:pb-4 px-2 xs:px-4 sm:px-6">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Título principal */}
                    <div className="text-center mb-4 xs:mb-6 sm:mb-8">
                        <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 xs:mb-2 px-2">
                            Seleccionar Curso de Inglés
                        </h1>
                        <p className="text-xs xs:text-sm sm:text-base text-gray-600 px-4">
                            Selecciona el curso para gestionar los comprobantes de pago
                        </p>
                    </div>

                    {/* Selector de cursos */}
                    <div className="mb-4 xs:mb-6 sm:mb-8">
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 shadow-lg border border-gray-200">
                            <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 text-center px-2">
                                Cursos Disponibles
                            </h2>
                            <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-6 md:grid-cols-6 gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 place-items-center">
                                {cursosDisponibles.map((cat) => (
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

                    {/* Selector de grupos/turnos dinámico */}
                    {activeCategory && getGruposDisponibles().length > 0 && (
                        <div className="mb-3 xs:mb-4 sm:mb-6">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 shadow-lg border border-gray-200">
                                <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 text-center px-2">
                                    Grupos Disponibles para {activeCategory}
                                </h2>
                                <div className="flex flex-wrap gap-1.5 xs:gap-2 sm:gap-3 justify-center items-center max-w-4xl mx-auto">
                                    {getGruposDisponibles().map((grupo) => (
                                        <VespertinoButton
                                            key={grupo.id || grupo.nombre}
                                            label={`${grupo.nombre} (${grupo.alumnosActuales}/${grupo.capacidad})`}
                                            isActive={activeVespertino === grupo.nombre}
                                            onClick={() => handleVespertinoSelect(grupo.nombre)}
                                            profesorAsignado={activeVespertino === grupo.nombre ? profesoresAsignados[activeCategory]?.[grupo.nombre]?.nombre : null}
                                            grupo={grupo}
                                        />
                                    ))}
                                </div>
                                
                                {/* Leyenda de colores por tipo de turno */}
                                <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                        <span>Matutino</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                                        <span>Vespertino</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                                        <span>Sabatino</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información del grupo seleccionado */}
                    {activeCategory && activeVespertino && (
                        <div className="mb-4 xs:mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 xs:px-6 sm:px-8 py-4 xs:py-5 sm:py-6 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg">
                                <div className="text-center">
                                    <p className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold mb-1 xs:mb-2">
                                        Grupo Activo: {activeCategory} - {activeVespertino}
                                    </p>
                                    <p className="text-xs xs:text-sm sm:text-base text-blue-100">
                                        Profesor Asignado: <span className="font-bold text-white">{getProfesorAsignado()}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navegación entre vistas */}
                    {activeCategory && activeVespertino && (
                        <div className="mb-4 xs:mb-6">
                            <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 shadow-lg border border-gray-200">
                                <div className="flex flex-wrap gap-2 xs:gap-3 justify-center">
                                    <button
                                        onClick={() => setVistaActual('pendientes')}
                                        className={`px-4 xs:px-6 py-2 xs:py-3 rounded-lg font-semibold text-sm xs:text-base transition-all duration-300 flex items-center space-x-2 ${
                                            vistaActual === 'pendientes'
                                                ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Pendientes ({getContadoresParaGrupo().pendientes})</span>
                                    </button>
                                    <button
                                        onClick={() => setVistaActual('aprobados')}
                                        className={`px-4 xs:px-6 py-2 xs:py-3 rounded-lg font-semibold text-sm xs:text-base transition-all duration-300 flex items-center space-x-2 ${
                                            vistaActual === 'aprobados'
                                                ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Aprobados ({getContadoresParaGrupo().aprobados})</span>
                                    </button>
                                    <button
                                        onClick={() => setVistaActual('rechazados')}
                                        className={`px-4 xs:px-6 py-2 xs:py-3 rounded-lg font-semibold text-sm xs:text-base transition-all duration-300 flex items-center space-x-2 ${
                                            vistaActual === 'rechazados'
                                                ? 'bg-red-500 text-white shadow-lg transform scale-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Rechazados ({getContadoresParaGrupo().rechazados})</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ======================================================================== */}
            {/*                        TABLA DE COMPROBANTES                          */}
            {/*                     CENTRO DE PROCESAMIENTO                           */}
            {/* ======================================================================== */}
      
        
            {/* VARIABLES PRINCIPALES:
                - vistaActual: string - Estado actual de la vista ('pendientes'|'aprobados'|'rechazados')
                - comprobantes: array - Lista de comprobantes pendientes
                - comprobantesAprobados: array - Lista de comprobantes aprobados
                - comprobantesRechazados: array - Lista de comprobantes rechazados
                - editableFields: object - Campos editados temporalmente por admin
            */}
          
            {/* BACKEND ENDPOINTS:
                - GET /api/comprobantes/pendientes → Carga tabla pendientes
                - GET /api/comprobantes/aprobados → Carga tabla aprobados  
                - GET /api/comprobantes/rechazados → Carga tabla rechazados
                - POST /api/comprobantes/{id}/aprobar → Procesa aprobación
                - POST /api/comprobantes/{id}/rechazar → Procesa rechazo
            */}
            {showContent && (
                <div className="flex-1 px-2 xs:px-4 sm:px-6 pb-4 xs:pb-6">
                    <div className="w-full max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            {/* ========== HEADER DINÁMICO DE LA TABLA ========== */}
                            {/* FUNCIÓN: getTituloVista() - Genera título según vista activa */}
                            <div className="px-4 xs:px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">{getTituloVista()}</h3>
                            </div>
                            
                            <div className="overflow-x-auto">
                                {/* ========== TABLA RESPONSIVA CON COLUMNAS DINÁMICAS ========== */}
                                {/* DISEÑO: Responsive con min-width para evitar colapso en móviles */}
                                <table className="w-full min-w-[1000px] xs:min-w-[1100px] sm:min-w-[1200px]">
                                    {/* ========== ENCABEZADOS DINÁMICOS SEGÚN VISTA ========== */}
                                    {/* COLORES: Verde para aprobados, Rojo para rechazados, Gris para pendientes */}
                                    <thead>
                                        <tr className={`${vistaActual === 'aprobados' ? 'bg-gradient-to-r from-green-700 to-green-800' : 
                                                        vistaActual === 'rechazados' ? 'bg-gradient-to-r from-red-700 to-red-800' : 
                                                        'bg-gradient-to-r from-gray-800 to-gray-900'} text-white`}>
                                            {/* COLUMNAS BÁSICAS (siempre visibles) */}
                                            <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Folio</th>
                                            <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Nombre del Alumno</th>
                                            <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Fecha y Hora</th>
                                            <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Importe</th>
                                            <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Método</th>
                                            
                                            {/* COLUMNAS CONDICIONALES según vista activa */}
                                            {vistaActual === 'rechazados' && (
                                                <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Motivo Rechazo</th>
                                            )}
                                            {vistaActual === 'aprobados' && (
                                                <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Fecha Aprobación</th>
                                            )}
                                            {vistaActual === 'rechazados' && (
                                                <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider border-r border-gray-300">Fecha Rechazo</th>
                                            )}
                                            <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider">Comprobante</th>
                                            {vistaActual === 'pendientes' && (
                                                <th className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-center text-xs xs:text-sm font-semibold uppercase tracking-wider">Acciones</th>
                                            )}
                                        </tr>
                                    </thead>

                                    {/* ========== CUERPO DE LA TABLA - PROCESAMIENTO DINÁMICO ========== */}
                                    {/* FUNCIÓN: getComprobantesActuales() - Filtra comprobantes según vista */}
                                    {/* DATOS MOSTRADOS: Según vistaActual (pendientes/aprobados/rechazados) */}
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {/* ========== ESTADO VACÍO - SIN COMPROBANTES ========== */}
                                        {getComprobantesActuales().length === 0 ? (
                                            <tr>
                                                <td colSpan={vistaActual === 'rechazados' ? '8' : vistaActual === 'aprobados' ? '7' : '7'} className="px-4 xs:px-6 py-12 xs:py-16 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-12 xs:w-16 h-12 xs:h-16 rounded-full flex items-center justify-center mb-3 xs:mb-4 ${
                                                            vistaActual === 'aprobados' ? 'bg-green-100' : 
                                                            vistaActual === 'rechazados' ? 'bg-red-100' : 'bg-gray-100'
                                                        }`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 xs:h-8 w-6 xs:w-8 ${
                                                                vistaActual === 'aprobados' ? 'text-green-400' : 
                                                                vistaActual === 'rechazados' ? 'text-red-400' : 'text-gray-400'
                                                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-base xs:text-lg font-medium text-gray-700 mb-1 xs:mb-2">
                                                            {vistaActual === 'aprobados' && 'No hay comprobantes aprobados'}
                                                            {vistaActual === 'rechazados' && 'No hay comprobantes rechazados'}
                                                            {vistaActual === 'pendientes' && 'No hay comprobantes pendientes'}
                                                        </p>
                                                        <p className="text-xs xs:text-sm text-gray-500 px-4">
                                                            {vistaActual === 'aprobados' && 'Los comprobantes aprobados aparecerán aquí'}
                                                            {vistaActual === 'rechazados' && 'Los comprobantes rechazados aparecerán aquí'}
                                                            {vistaActual === 'pendientes' && 'Los comprobantes aparecerán aquí cuando estén disponibles para validación'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            /* ========== FILAS DE COMPROBANTES - RENDERIZADO DINÁMICO ========== */
                                            /* MAPEO: Itera sobre comprobantes filtrados por vista activa */
                                            /* ESTADOS VISUALES: Fondo verde para aprobados, rojo para rechazados */
                                            getComprobantesActuales().map((comprobante) => (
                                                <tr key={comprobante.id} className={`hover:bg-gray-50 transition-colors duration-150 ${
                                                    vistaActual === 'rechazados' ? 'bg-red-50/30' : 
                                                    vistaActual === 'aprobados' ? 'bg-green-50/30' : ''
                                                }`}>
                                    
                                    {/* ========== COLUMNAS DE DATOS BÁSICOS (SOLO LECTURA) ========== */}
                                    
                                    {/* COLUMNA FOLIO - Generado automáticamente */}
                                    <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm text-gray-900 text-center border-r border-gray-200">
                                        <div className="font-mono text-blue-600 font-medium text-xs xs:text-sm">{comprobante.folio || generateFolio(comprobante.cursoComprado)}</div>
                                    </td>
                                    
                                    {/* COLUMNA NOMBRE - Del estudiante que envió el comprobante */}
                                    <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm text-gray-900 text-center border-r border-gray-200">
                                        <div className="font-medium">{comprobante.nombreAlumno}</div>
                                    </td>
                                    
                                    {/* COLUMNA FECHA - Cuándo se subió el comprobante */}
                                    <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-900 text-center border-r border-gray-200">
                                        <div className="font-medium">{comprobante.fechaHora}</div>
                                    </td>
                                    
                                    {/* ========== COLUMNAS EDITABLES (SOLO EN PENDIENTES) ========== */}
                                    
                                    {/* ========== COLUMNA IMPORTE - CAMPO EDITABLE ========== */}
                             
                                    {/* VARIABLES:
                                        - getFieldValue(): Obtiene valor editado o original
                                        - handleFieldChange(): Actualiza editableFields temporalmente
                                        - editableFields[id]: Almacena cambios antes de procesar
                                    */}
                                    {/* PROCESO:
                                        1. Admin ve valor original del comprobante
                                        2. Admin edita en input → handleFieldChange() → editableFields
                                        3. Admin RECHAZA/VALIDA → getFieldValue() → Valor actualizado al backend
                                    */}
                              
                                    <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm text-center border-r border-gray-200">
                                        {vistaActual === 'pendientes' ? (
                                            <input
                                                type="text"
                                                value={getFieldValue(comprobante, 'importe')}
                                                onChange={(e) => handleFieldChange(comprobante.id, 'importe', e.target.value)}
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                            />
                                        ) : (
                                            <div className="font-medium text-green-600">${comprobante.importe}</div>
                                        )}
                                    </td>
                                    
                                    {/* ========== COLUMNA MÉTODO DE PAGO - CAMPO EDITABLE ========== */}
                              
                                    <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm text-center border-r border-gray-200">
                                        {vistaActual === 'pendientes' ? (
                                            <input
                                                type="text"
                                                value={getFieldValue(comprobante, 'metodoPago')}
                                                onChange={(e) => handleFieldChange(comprobante.id, 'metodoPago', e.target.value)}
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Método de pago"
                                            />
                                        ) : (
                                            <div className="font-medium">{comprobante.metodoPago}</div>
                                        )}
                                    </td>
                                    
                                    {/* ========== COLUMNAS CONDICIONALES SEGÚN ESTADO ========== */}
                                    
                                    {/* COLUMNA MOTIVO RECHAZO - Solo visible en vista 'rechazados' */}
                                    {vistaActual === 'rechazados' && (
                                        <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm text-red-700 text-center border-r border-gray-200">
                                            <div className="bg-red-100 px-2 py-1 rounded-md max-w-xs mx-auto">
                                                <span className="font-medium">{comprobante.motivoRechazo}</span>
                                            </div>
                                        </td>
                                    )}
                                    
                                    {/* COLUMNA FECHA APROBACIÓN - Solo visible en vista 'aprobados' */}
                                    {vistaActual === 'aprobados' && (
                                        <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-green-700 font-medium text-center border-r border-gray-200">
                                            {comprobante.fechaAprobacion}
                                        </td>
                                    )}
                                    
                                    {/* COLUMNA VER COMPROBANTE - Siempre visible */}
                                    <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-center">
                                        <button onClick={() => handleVerComprobante(comprobante)} className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150 px-2 xs:px-3 py-1 rounded-lg hover:bg-blue-50">
                                            Ver comprobante
                                        </button>
                                    </td>
                                    
                                    {/* ========== COLUMNA MOTIVO RECHAZO - Solo visible en vista 'rechazados' ========== */}
                                    {vistaActual === 'rechazados' && (
                                        <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm text-red-700 text-center border-r border-gray-200">
                                            <div className="bg-red-100 px-2 py-1 rounded-md max-w-xs mx-auto">
                                                <span className="font-medium">{comprobante.motivoRechazo}</span>
                                            </div>
                                        </td>
                                    )}
                                    
                                    {/* ========== COLUMNA FECHA APROBACIÓN - Solo visible en vista 'aprobados' ========== */}
                                    {vistaActual === 'aprobados' && (
                                        <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-green-700 font-medium text-center border-r border-gray-200">
                                            {comprobante.fechaAprobacion}
                                        </td>
                                    )}
                                    
                                    {/* ========== COLUMNA FECHA RECHAZO - Solo visible en vista 'rechazados' ========== */}
                                    {vistaActual === 'rechazados' && (
                                        <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-red-700 font-medium text-center border-r border-gray-200">
                                            {comprobante.fechaRechazo}
                                        </td>
                                    )}
                                    
                                    {/* ========== BOTONES DE ACCIÓN - CENTRO DE PROCESAMIENTO ========== */}
                                    {/* SOLO VISIBLE EN VISTA 'PENDIENTES' - Aquí es donde se procesa todo */}
                                    {/* FUNCIONES PRINCIPALES:
                                        - handleRechazar(): Abre modal de motivo → confirmarRechazo() → RECHAZADOS
                                        - handleValidar(): Procesa inmediatamente → Modal éxito → APROBADOS
                                    */}
                                    {/* VARIABLES QUE USAN:
                                        - getFieldValue(): Obtiene valores editados de importe/método
                                        - editableFields: Almacena cambios temporales del admin
                                    */}
                                 
                                    {vistaActual === 'pendientes' && (
                                        <td className="px-2 xs:px-4 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-center">
                                            <div className="flex gap-1 xs:gap-2 sm:gap-3 justify-center">
                                                {/* ========== BOTÓN RECHAZAR ========== */}
                                                {/* ACCIÓN: handleRechazar(comprobante) */}
                                                {/* RESULTADO: Abre modal → Motivo obligatorio → confirmarRechazo() */}
                                                {/* DESTINO: Array comprobantesRechazados */}
                                                <button onClick={() => handleRechazar(comprobante)} className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] xs:text-xs font-semibold rounded-md xs:rounded-lg transition-colors duration-150">
                                                    RECHAZAR
                                                </button>
                                                
                                                {/* ========== BOTÓN VALIDAR ========== */}
                                                {/* ACCIÓN: handleValidar(comprobante) */}
                                         
                                                {/* DESTINO: Array comprobantesAprobados */}
                                                <button onClick={() => handleValidar(comprobante)} className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] xs:text-xs font-semibold rounded-md xs:rounded-lg transition-colors duration-150">
                                                    VALIDAR
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

    

            {/***************************************************************/}
                {/* INICIO: Modal de visualización de comprobante  */}
            {/***************************************************************/}
            {modalComprobante.isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-28 bg-black/60 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div 
                        className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl h-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-200/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                     
                        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Visualizador de Comprobante</h2>
                                    <p className="text-sm text-gray-500">Revisando pago de {modalComprobante.comprobante?.nombreAlumno}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Controles de Zoom (solo para imágenes) */}
                                {!isPdf && (
                                    <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                        <button onClick={handleZoomOut} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Alejar"><svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path></svg></button>
                                        <span className="text-sm font-medium text-gray-700 w-12 text-center">{Math.round(modalComprobante.zoomLevel * 100)}%</span>
                                        <button onClick={handleZoomIn} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Acercar"><svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path></svg></button>
                                        <button onClick={handleResetZoom} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Restaurar"><svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9a9 9 0 0114.65-4.65l-4.15 4.15M20 15a9 9 0 01-14.65 4.65l4.15-4.15"></path></svg></button>
                                    </div>
                                )}
                                {/* Botón Abrir en nueva pestaña */}
                                <button onClick={() => window.open(modalComprobante.comprobante?.comprobanteUrl, '_blank')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Abrir en nueva pestaña">
                                     <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                </button>
                                {/* Botón de Descarga */}
                                <a href={modalComprobante.comprobante?.comprobanteUrl} download={`Comprobante_${modalComprobante.comprobante?.nombreAlumno?.replace(/\s+/g, '_')}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Descargar">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </a>
                                {/* Botón de Cerrar */}
                                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Cerrar">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </header>
                        
                        {/* Área del Visor del Documento */}
                        <main className="relative flex-1 bg-gray-800/90 p-2 sm:p-4 overflow-auto">
                            <div className={`w-full h-full flex ${isPdf ? 'items-center justify-center' : 'justify-center'}`}>
                                {isPdf ? (
                                    <embed
                                        src={`${modalComprobante.comprobante?.comprobanteUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                                        type="application/pdf"
                                        className="w-full max-w-4xl h-full"
                                        title={`Comprobante PDF - ${modalComprobante.comprobante?.nombreAlumno}`}
                                    />
                                ) : (
                                    <img
                                        src={modalComprobante.comprobante?.comprobanteUrl}
                                        alt={`Comprobante de ${modalComprobante.comprobante?.nombreAlumno}`}
                                        className="transition-transform duration-200 ease-in-out rounded-md shadow-lg"
                                        style={{ 
                                            maxWidth: '100%',
                                            transform: `scale(${modalComprobante.zoomLevel})`, 
                                            transformOrigin: 'top center' 
                                        }}
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/ef4444/ffffff?text=Error+al+cargar+imagen"; }}
                                    />
                                )}
                            </div>
                            {showPdfTip && <PdfZoomTip onDismiss={handleDismissPdfTip} />}
                        </main>
                    </div>
                </div>
            )}
            {/***************************************************************/}
                    {/* FIN: Modal de visualización de comprobante      */}
            {/***************************************************************/}

            {/* ======================================================================== */}
            {/*                       MODALES DE CONFIRMACIÓN                         */}
            {/* ======================================================================== */}
            
            {/* ==================== MODAL DE CONFIRMACIÓN DE RECHAZO ==================== */}
       
            {/* VARIABLES NECESARIAS:
                - showRejectModal: boolean - Controla visibilidad del modal
                - currentComprobante: object - Datos del comprobante a rechazar
                - motivoRechazo: string - Motivo ingresado por admin (OBLIGATORIO)
                - setShowRejectModal: function - Ocultar/mostrar modal
                - setMotivoRechazo: function - Actualizar motivo de rechazo
                - confirmarRechazo: function - Procesar rechazo definitivo
            */}
            {/* FLUJO:
                1. handleRechazar() → Abre este modal y establece currentComprobante
                2. Admin ingresa motivo obligatorio en textarea
                3. confirmarRechazo() → Valida motivo y procesa rechazo
                4. Modal se cierra y limpia variables
            */}
            {/* BACKEND ENDPOINT: POST /api/comprobantes/{id}/rechazar */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-2 xs:p-4">
                    <div className="bg-red-50/95 backdrop-blur-lg rounded-lg xs:rounded-xl sm:rounded-2xl max-w-sm xs:max-w-md w-full shadow-2xl border border-red-200/50 overflow-hidden">
                        {/* ICONO DE ADVERTENCIA */}
                        <div className="flex justify-center pt-6 xs:pt-8 pb-3 xs:pb-4">
                            <div className="w-16 xs:w-20 h-16 xs:h-20 bg-red-200/80 rounded-full flex items-center justify-center">
                                <svg className="w-10 xs:w-12 h-10 xs:h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                        </div>
                        
                        {/* TÍTULO DEL MODAL */}
                        <div className="text-center px-4 xs:px-6 pb-1 xs:pb-2">
                            <h3 className="text-lg xs:text-xl font-bold text-red-800">Confirmar Rechazo</h3>
                        </div>
                        
                        {/* CONTENIDO DEL MODAL */}
                        <div className="px-4 xs:px-6 pb-6 xs:pb-8">
                            {/* ========== MENSAJE DE CONFIRMACIÓN ========== */}
                            {/* MUESTRA: Nombre del estudiante desde currentComprobante.nombreAlumno */}
                            <p className="text-sm xs:text-base text-gray-700 mb-4 xs:mb-6 text-center">
                                ¿Estás seguro que deseas rechazar el comprobante de <br />
                                <span className="font-semibold text-gray-900">{currentComprobante?.nombreAlumno}</span>?
                            </p>
                            
                            {/* ========== CAMPO MOTIVO DE RECHAZO - OBLIGATORIO ========== */}
                            {/* VARIABLE: motivoRechazo (string) - Controlada por setMotivoRechazo */}
                            {/* VALIDACIÓN: confirmarRechazo() verifica que no esté vacío */}
                            {/* BACKEND: Este motivo se envía al servidor y se almacena en BD */}
               
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motivo del rechazo *
                                </label>
                                <textarea
                                    value={motivoRechazo}
                                    onChange={(e) => setMotivoRechazo(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                    rows="3"
                                    placeholder="Especifica el motivo del rechazo..."
                                    required
                                />
                            </div>
                            
                            {/* ========== BOTONES DE ACCIÓN ========== */}
                            <div className="flex gap-2 xs:gap-3 justify-center">
                                {/* BOTÓN CANCELAR: Cierra modal y limpia motivo */}
                                <button 
                                    onClick={() => { 
                                        setShowRejectModal(false); 
                                        setMotivoRechazo(''); 
                                    }} 
                                    className="px-4 xs:px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md xs:rounded-lg text-sm xs:text-base transition-colors duration-150"
                                >
                                    Cancelar
                                </button>
                                
                                {/* BOTÓN RECHAZAR: Ejecuta confirmarRechazo() */}
                          
                                <button 
                                    onClick={confirmarRechazo} 
                                    className="px-4 xs:px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md xs:rounded-lg text-sm xs:text-base transition-colors duration-150"
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL DE CONFIRMACIÓN DE ÉXITO ==================== */}
        
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-2 xs:p-4">
                    <div className="bg-green-50/95 backdrop-blur-lg rounded-lg xs:rounded-xl sm:rounded-2xl max-w-sm xs:max-w-md w-full shadow-2xl border border-green-200/50 overflow-hidden">
                        <div className="flex justify-center pt-6 xs:pt-8 pb-3 xs:pb-4">
                            <div className="w-16 xs:w-20 h-16 xs:h-20 bg-green-200/80 rounded-full flex items-center justify-center">
                                <svg className="w-10 xs:w-12 h-10 xs:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>
                        <div className="text-center px-4 xs:px-6 pb-1 xs:pb-2">
                            <h3 className="text-lg xs:text-xl font-bold text-green-800">¡Comprobante Validado!</h3>
                        </div>
                        <div className="px-4 xs:px-6 pb-6 xs:pb-8">
                            <p className="text-sm xs:text-base text-gray-700 mb-4 xs:mb-6 text-center">
                                El comprobante de <br />
                                {/* ========== NOMBRE DEL ESTUDIANTE APROBADO ========== */}
                                {/* FUENTE: currentComprobante.nombreAlumno */}
                                <span className="font-semibold text-gray-900">{currentComprobante?.nombreAlumno}</span> <br />
                                ha sido validado exitosamente.
                            </p>
                            <div className="flex justify-center">
                                <button onClick={() => setShowSuccessModal(false)} className="px-4 xs:px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md xs:rounded-lg text-sm xs:text-base transition-colors duration-150">Entendido</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


