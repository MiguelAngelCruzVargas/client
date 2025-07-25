# 📋 GUÍA DE INTEGRACIÓN BACKEND - MQERK CLIENT

## 🎯 **RESUMEN EJECUTIVO**

**La integración backend debe hacerse EXCLUSIVAMENTE en los archivos de contexto, NUNCA en componentes UI.**

---

# ################################ Profile_Alumno_comp.jsx ###################################

## ✅ **ESTADO ACTUAL: LISTO PARA BACKEND**

> **🎯 ÚNICO ARCHIVO A MODIFICAR: `src/context/StudentContext.jsx`**

### **FUNCIONES BACKEND REQUERIDAS EN StudentContext.jsx:**

#### 1. **Cargar Perfil del Estudiante**
```javascript
// AGREGAR ESTA FUNCIÓN AL CONTEXTO:
const loadStudentProfile = async () => {
  try {
    const response = await fetch('/api/student/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const profileData = await response.json();
    
    setStudentData({
      name: profileData.name,
      matricula: profileData.matricula,
      email: profileData.email
    });
    
    return profileData;
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    throw error;
  }
};
```

#### 2. **Actualizar Perfil del Estudiante**
```javascript
// AGREGAR ESTA FUNCIÓN AL CONTEXTO:
const updateStudentProfile = async (profileData) => {
  try {
    const response = await fetch('/api/student/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) throw new Error('Error al guardar el perfil');
    
    const updatedProfile = await response.json();
    
    setStudentData({
      name: updatedProfile.name,
      matricula: updatedProfile.matricula,
      email: updatedProfile.email
    });
    
    return updatedProfile;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};
```

#### 3. **Exponer en el Value del Contexto**
```javascript
const value = {
  // ...código existente...
  
  // AGREGAR ESTAS 5 LÍNEAS:
  loadStudentProfile,
  updateStudentProfile,
  loadEnrolledCourses,
  selectCourse,
  checkPaymentStatus,
  
  // ...resto del value...
};
```

#### 4. **Inicializar al Cargar la App**
```javascript
useEffect(() => {
  // ...código existente...
  
  // AGREGAR ESTAS 3 LÍNEAS AL FINAL DEL useEffect:
  loadStudentProfile().catch(console.error);
  loadEnrolledCourses().catch(console.error);
  checkPaymentStatus().catch(console.error);
}, []);
```

---

# ################################ FLUJO DE ACCESO AL DASHBOARD ###################################

## 🎯 **ARQUITECTURA REAL: SISTEMA DE VERIFICACIÓN Y SELECCIÓN DE CURSO**

### **FLUJO COMPLETO DEL SISTEMA:**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Login         │ -> │ Verificación     │ -> │ Selección de Curso  │ -> │ Dashboard Específico│
│ (Autenticación) │    │ Pago (si falta)  │    │ (MisCursos)         │    │ (con currentCourse) │
└─────────────────┘    └──────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### **ESTADOS DETALLADOS DEL SISTEMA:**

#### **Estado 1: Usuario Sin Verificar/Pagar**
```javascript
isVerified: false, hasPaid: false, currentCourse: null
```
- **Pantalla**: `InicioAlumnoDashboard.jsx` en **modo bloqueo**
- **UI**: Formulario de pago obligatorio
- **Sidebar**: ❌ **OCULTO** (`shouldShowSidebar = false`)
- **Header**: ✅ **Botón de logout VISIBLE** (`showLogoutButton = true`)
- **Acciones disponibles**: Solo subir comprobante de pago

#### **Estado 2: Usuario Verificado Sin Curso**
```javascript
isVerified: true, hasPaid: true, currentCourse: null
```
- **Pantalla**: `InicioAlumnoDashboard.jsx` → **redirección automática**
- **Destino**: `/alumno/cursos` (MisCursos_Alumno_comp.jsx)
- **Sidebar**: ❌ **OCULTO** (`shouldShowSidebar = false`)
- **Header**: ✅ **Botón de logout VISIBLE** (`showLogoutButton = true`)
- **Acción requerida**: Seleccionar curso matriculado

#### **Estado 3: Usuario Con Curso Seleccionado**
```javascript
isVerified: true, hasPaid: true, currentCourse: {objeto_curso}
```
- **Pantalla**: Dashboard completo habilitado
- **Sidebar**: ✅ **VISIBLE** (`shouldShowSidebar = true`)
- **Header**: ❌ **Botón de logout OCULTO** (`showLogoutButton = false`)
- **Funcionalidades**: Acceso completo al contenido del curso

### **COMPONENTES Y SUS ROLES ESPECÍFICOS:**

#### **🏠 InicioAlumnoDashboard.jsx**
- **Función**: Pantalla de bienvenida y verificación de pago
- **Cuándo se muestra**: 
  - Estado 1: Usuario sin verificar/pagar (modo bloqueo)
  - Estado 3: Usuario con curso seleccionado (modo bienvenida)
- **Lógica de redirección**: 
  ```javascript
  // REDIRECCIÓN AUTOMÁTICA (líneas 218-241)
  const shouldRedirect = finalVerificado && 
                        finalHaPagado && 
                        !isFirstAccess && 
                        !currentCourse &&  // ← SIN CURSO = REDIRIGIR
                        !window.location.search.includes('direct=true');
  
  if (shouldRedirect) {
    navigate('/alumno/cursos'); // Redirige a selección de curso
  }
  ```
- **Principio clave**: **SI ya tiene curso seleccionado, NO redirige**

#### **📚 MisCursos_Alumno_comp.jsx - INTEGRACIÓN BACKEND CRÍTICA**
- **Función**: Selector de curso activo (NO catálogo general)
- **Datos fuente**: `StudentContext.enrolledCourses` ← **SOLO cursos matriculados del estudiante**
- **Acción principal**: `selectCourse(courseId)` → actualizar `currentCourse` → habilitar dashboard
- **Backend endpoint**: `GET /api/student/enrolled-courses`
- **Estructura de datos esperada**:
  ```json
  {
    "enrolledCourses": [
      {
        "id": "course-1",
        "title": "Mi Curso de Inglés",
        "instructor": "Prof. María González", 
        "progress": 65,
        "status": "active",
        "level": "A1",
        "startDate": "2024-01-15",
        "endDate": "2024-06-15",
        "enrollmentDate": "2024-01-10"
      }
    ],
    "currentCourseId": "course-1" // Curso previamente seleccionado
  }
  ```

#### **🚨 DIFERENCIA CRÍTICA: MisCursos vs CourseContext**

| Aspecto | **MisCursos_Alumno_comp.jsx** | **CourseContext.jsx** |
|---------|-------------------------------|----------------------|
| **Propósito** | Cursos del estudiante matriculado | Catálogo general (marketing) |
| **Datos fuente** | `StudentContext.enrolledCourses` | `CourseContext.courses` |
| **Endpoint** | `/api/student/enrolled-courses` | `/api/courses` |
| **Acción** | `selectCourse()` → Activar curso | Ver detalles → Comprar |
| **Estado** | `currentCourse` | N/A |
| **Acceso** | Solo estudiantes verificados | Público |

#### **🎛️ CourseContext.jsx**
- **Función**: Catálogo general de cursos (marketing/ventas)
- **Uso**: Página pública, landing page, lista de cursos disponibles para comprar
- **❌ NO usar para**: Cursos matriculados del estudiante

---

## 🔧 **INTEGRACIÓN BACKEND - PUNTOS ESPECÍFICOS**

### **1. StudentContext.jsx - Funciones Requeridas**

#### **Cargar Cursos Matriculados**
```javascript
const loadEnrolledCourses = async () => {
  try {
    const response = await fetch('/api/student/enrolled-courses', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    
    setEnrolledCourses(data.enrolledCourses);
    
    // Si tiene curso activo guardado en backend
    if (data.currentCourseId) {
      const current = data.enrolledCourses.find(c => c.id === data.currentCourseId);
      setCurrentCourse(current);
    }
  } catch (error) {
    console.error('Error cargando cursos matriculados:', error);
  }
};
```

#### **Seleccionar Curso Activo**
```javascript
const selectCourse = async (courseId) => {
  try {
    // Actualizar en backend cuál es el curso activo
    await fetch('/api/student/current-course', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ courseId })
    });
    
    // Actualizar estado local
    const course = enrolledCourses.find(c => c.id === courseId);
    setCurrentCourse(course);
    setIsFirstAccess(false);
  } catch (error) {
    console.error('Error seleccionando curso:', error);
  }
};
```

#### **Verificar Estado de Pago**
```javascript
const checkPaymentStatus = async () => {
  try {
    const response = await fetch('/api/student/payment-status', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    
    setIsVerified(data.isVerified);
    setHasPaid(data.hasPaid);
  } catch (error) {
    console.error('Error verificando estado de pago:', error);
  }
};
```

### **2. MisCursos_Alumno_comp.jsx - INTEGRACIÓN ESPECÍFICA**

#### **❌ ESTADO ACTUAL (Mock Data):**
```javascript
// ESTO ESTÁ MAL - Solo datos de ejemplo
const cursosMatriculados = [
  { id: 1, titulo: "Inglés", profesor: "Prof. García" },
  { id: 2, titulo: "Matemáticas", profesor: "Dr. López" }
];
```

#### **✅ INTEGRACIÓN CORRECTA:**
```javascript
// En MisCursos_Alumno_comp.jsx
import { useStudent } from '../../context/StudentContext.jsx';

const MisCursos_Alumno_comp = () => {
  const { 
    enrolledCourses,     // ← Cursos reales del backend
    currentCourse,       // ← Curso actualmente seleccionado
    selectCourse,        // ← Función para seleccionar curso
    isVerified,          // ← Estado de verificación
    hasPaid              // ← Estado de pago
  } = useStudent();

  // Función para manejar selección de curso
  const handleSelectCourse = async (courseId) => {
    try {
      await selectCourse(courseId); // ← Conecta con backend
      
      // Feedback visual
      console.log('✅ Curso seleccionado exitosamente');
      
      // Opcional: Navegar al dashboard
      // navigate('/alumno/dashboard');
    } catch (error) {
      console.error('❌ Error al seleccionar curso:', error);
      // Mostrar mensaje de error al usuario
    }
  };

  // Renderizar solo si está verificado y ha pagado
  if (!isVerified || !hasPaid) {
    return <div>Acceso restringido. Verifica tu cuenta primero.</div>;
  }

  return (
    <div className="mis-cursos-container">
      <h2>Mis Cursos Matriculados</h2>
      
      {enrolledCourses.length === 0 ? (
        <div>No tienes cursos matriculados.</div>
      ) : (
        <div className="cursos-grid">
          {enrolledCourses.map(curso => (
            <div 
              key={curso.id} 
              className={`curso-card ${currentCourse?.id === curso.id ? 'active' : ''}`}
            >
              <h3>{curso.title}</h3>
              <p>Instructor: {curso.instructor}</p>
              <p>Progreso: {curso.progress}%</p>
              <p>Estado: {curso.status}</p>
              
              <button 
                onClick={() => handleSelectCourse(curso.id)}
                className="btn-seleccionar-curso"
                disabled={currentCourse?.id === curso.id}
              >
                {currentCourse?.id === curso.id ? 'Curso Activo' : 'Ir al Dashboard'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### **3. Backend Requirements para MisCursos**

#### **Endpoint Principal:**
```http
GET /api/student/enrolled-courses
Authorization: Bearer {token}
```

#### **Respuesta Esperada:**
```json
{
  "success": true,
  "data": {
    "enrolledCourses": [
      {
        "id": "course-eng-001",
        "title": "Inglés Básico A1",
        "instructor": "Prof. María González",
        "progress": 65,
        "status": "active",
        "level": "A1",
        "startDate": "2024-01-15",
        "endDate": "2024-06-15",
        "enrollmentDate": "2024-01-10",
        "image": "https://example.com/course-image.jpg",
        "category": "idiomas",
        "metadata": [
          { "icon": "clock", "text": "6 meses de duración" },
          { "icon": "book", "text": "48 lecciones interactivas" },
          { "icon": "user", "text": "Progreso: 65%" }
        ]
      }
    ],
    "currentCourseId": "course-eng-001",
    "totalEnrolled": 1
  }
}
```

#### **Endpoint para Seleccionar Curso:**
```http
PUT /api/student/current-course
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "course-eng-001"
}
```

#### **Respuesta:**
```json
{
  "success": true,
  "message": "Curso seleccionado exitosamente",
  "data": {
    "currentCourseId": "course-eng-001",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

### **4. Validaciones Backend Requeridas**

#### **Seguridad:**
- ✅ Verificar que el token JWT es válido
- ✅ Confirmar que el estudiante está matriculado en el curso
- ✅ Validar que el curso existe y está activo
- ✅ Verificar que el estudiante ha pagado

#### **Lógica de Negocio:**
- ✅ Solo mostrar cursos donde `student.enrollments.includes(courseId)`
- ✅ No permitir seleccionar cursos inactivos o expirados
- ✅ Mantener historial de cursos seleccionados
- ✅ Sincronizar `currentCourseId` en la base de datos

### **2. InicioAlumnoDashboard.jsx - Subida de Comprobantes**

#### **Función de Subida (líneas 268-332)**
```javascript
const handleSubirComprobante = async (e) => {
  const file = e.target.files[0];
  if (file) {
    setShowUploadProgress(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('comprobante', file);
      formData.append('studentId', studentData.id || studentData.matricula);
      
      const response = await fetch('/api/student/upload-payment-proof', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        setComprobante(file);
        setMensajeVerificacion(result.message || "¡Comprobante recibido! Tu verificación está en proceso.");
        
        // Actualizar estado de pago después de subir
        setTimeout(() => {
          checkPaymentStatus();
        }, 1000);
      } else {
        throw new Error('Error al subir el comprobante');
      }
    } catch (error) {
      console.error('Error subiendo comprobante:', error);
      setMensajeVerificacion("Error al subir el comprobante. Inténtalo de nuevo.");
    } finally {
      setShowUploadProgress(false);
    }
  }
};
```

---

## 📡 **ENDPOINTS BACKEND REQUERIDOS**

### **Estudiante**
```http
GET  /api/student/profile              # Perfil completo del estudiante
PUT  /api/student/profile              # Actualizar perfil
POST /api/student/profile/check-email  # Verificar si email existe
GET  /api/student/enrolled-courses     # Cursos matriculados del estudiante
PUT  /api/student/current-course       # Actualizar curso activo
GET  /api/student/payment-status       # Estado de verificación y pago
POST /api/student/upload-payment-proof # Subir comprobante de pago
```

### **Estructura de Respuestas**

#### **GET /api/student/enrolled-courses**
```json
{
  "enrolledCourses": [
    {
      "id": "course-1",
      "title": "Curso de Inglés Básico",
      "instructor": "Prof. Ana González",
      "progress": 65,
      "status": "active",
      "level": "A1",
      "startDate": "2024-01-15",
      "endDate": "2024-06-15"
    }
  ],
  "currentCourseId": "course-1"
}
```

#### **GET /api/student/payment-status**
```json
{
  "isVerified": true,
  "hasPaid": true,
  "paymentDate": "2024-01-10",
  "verificationDate": "2024-01-11"
}
```

---

## 🔄 **FLUJO DE ESTADOS IMPLEMENTADO**

### **Estado 1: Sin Verificar/Pagar**
```javascript
isVerified: false, hasPaid: false, currentCourse: null
// → InicioAlumnoDashboard muestra formulario de pago
// → Usuario no puede acceder a contenido
```

### **Estado 2: Verificado pero Sin Curso Seleccionado**
```javascript
isVerified: true, hasPaid: true, currentCourse: null
// → InicioAlumnoDashboard redirige automáticamente a /alumno/cursos
// → MisCursos muestra lista de cursos matriculados para seleccionar
```

### **Estado 3: Con Curso Seleccionado**
```javascript
isVerified: true, hasPaid: true, currentCourse: {course_object}
// → Dashboard funcional con contenido específico del curso
// → Sidebar y navegación habilitados completamente
```

---

## ❌ **ERRORES COMUNES A EVITAR**

### **NO HAGAS ESTO:**
- ❌ Modificar componentes UI (`Profile_Alumno_comp.jsx`, `MisCursos_Alumno_comp.jsx`, etc.)
- ❌ Agregar fetch() directamente en componentes
- ❌ Usar `CourseContext` para cursos matriculados del estudiante
- ❌ Mezclar datos de cursos públicos con cursos matriculados

### **SÍ HAZ ESTO:**
- ✅ Solo modificar archivos de contexto (`StudentContext.jsx`)
- ✅ Usar `StudentContext` para datos específicos del estudiante
- ✅ Usar `CourseContext` solo para catálogo general de cursos
- ✅ Respetar el flujo de verificación → selección → dashboard

---

## 📋 **CHECKLIST DE INTEGRACIÓN**

### **✅ StudentContext.jsx**
- [ ] Función `loadStudentProfile()`
- [ ] Función `updateStudentProfile()`
- [ ] Función `loadEnrolledCourses()`
- [ ] Función `selectCourse()`
- [ ] Función `checkPaymentStatus()`
- [ ] Inicialización en useEffect

### **✅ InicioAlumnoDashboard.jsx**
- [ ] Función `handleSubirComprobante()` conectada al backend
- [ ] Validación de estados de pago y verificación
- [ ] Redirección automática funcionando

### **✅ Backend Endpoints**
- [ ] Todos los endpoints listados implementados
- [ ] Autenticación JWT en headers
- [ ] Validación de datos en servidor
- [ ] Manejo de errores apropiado

### **✅ Testing**
- [ ] Flujo completo: login → pago → selección → dashboard
- [ ] Validación de acceso sin curso seleccionado
- [ ] Persistencia de curso seleccionado entre sesiones

---

# 🎯 **GUÍA EXACTA: QUÉ ARCHIVOS Y LÍNEAS MODIFICAR**

## **📂 ARCHIVO 1: `src/context/StudentContext.jsx`**

### **🔧 MODIFICACIONES REQUERIDAS:**

#### **1. AGREGAR NUEVAS FUNCIONES (Después de línea 200)**
```javascript
// AGREGAR ESTAS 5 FUNCIONES NUEVAS:

// 1. Cargar perfil del estudiante
const loadStudentProfile = async () => {
  try {
    const response = await fetch('/api/student/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const profileData = await response.json();
    
    setStudentData({
      name: profileData.name,
      matricula: profileData.matricula,
      email: profileData.email
    });
    
    return profileData;
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    throw error;
  }
};

// 2. Actualizar perfil del estudiante
const updateStudentProfile = async (profileData) => {
  try {
    const response = await fetch('/api/student/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) throw new Error('Error al guardar el perfil');
    
    const updatedProfile = await response.json();
    
    setStudentData({
      name: updatedProfile.name,
      matricula: updatedProfile.matricula,
      email: updatedProfile.email
    });
    
    return updatedProfile;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};

// 3. Cargar cursos matriculados
const loadEnrolledCourses = async () => {
  try {
    const response = await fetch('/api/student/enrolled-courses', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    
    setEnrolledCourses(data.enrolledCourses);
    
    if (data.currentCourseId) {
      const current = data.enrolledCourses.find(c => c.id === data.currentCourseId);
      setCurrentCourse(current);
    }
  } catch (error) {
    console.error('Error cargando cursos matriculados:', error);
  }
};

// 4. Seleccionar curso activo
const selectCourse = async (courseId) => {
  try {
    await fetch('/api/student/current-course', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ courseId })
    });
    
    const course = enrolledCourses.find(c => c.id === courseId);
    setCurrentCourse(course);
    setIsFirstAccess(false);
  } catch (error) {
    console.error('Error seleccionando curso:', error);
  }
};

// 5. Verificar estado de pago
const checkPaymentStatus = async () => {
  try {
    const response = await fetch('/api/student/payment-status', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    
    setIsVerified(data.isVerified);
    setHasPaid(data.hasPaid);
  } catch (error) {
    console.error('Error verificando estado de pago:', error);
  }
};
```

#### **2. MODIFICAR EL OBJETO VALUE (Líneas 540-580)**
```javascript
const value = {
  // ...código existente que ya está...
  
  // AGREGAR ESTAS 5 LÍNEAS AL OBJETO VALUE:
  loadStudentProfile,
  updateStudentProfile,
  loadEnrolledCourses,
  selectCourse,
  checkPaymentStatus,
  
  // ...resto del código existente...
};
```

#### **3. MODIFICAR EL useEffect PRINCIPAL (Línea ~380)**
```javascript
useEffect(() => {
  // ...código existente que ya está...
  
  // AGREGAR ESTAS 3 LÍNEAS AL FINAL DEL useEffect:
  loadStudentProfile().catch(console.error);
  loadEnrolledCourses().catch(console.error);
  checkPaymentStatus().catch(console.error);
}, []);
```

---

## **📂 ARCHIVO 2: `src/components/student/InicioAlumnoDashboard.jsx`**

### **🔧 MODIFICACIÓN REQUERIDA:**

#### **ACTUALIZAR FUNCIÓN handleSubirComprobante (Líneas 268-332)**
```javascript
// REEMPLAZAR LA SIMULACIÓN ACTUAL CON ESTE CÓDIGO REAL:
const handleSubirComprobante = async (e) => {
  const file = e.target.files[0];
  if (file) {
    setShowUploadProgress(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('comprobante', file);
      formData.append('studentId', studentData.id || studentData.matricula);
      
      const response = await fetch('/api/student/upload-payment-proof', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        setComprobante(file);
        setMensajeVerificacion(result.message || "¡Comprobante recibido! Tu verificación está en proceso.");
        
        // Actualizar estado de pago después de subir
        setTimeout(() => {
          checkPaymentStatus();
        }, 1000);
      } else {
        throw new Error('Error al subir el comprobante');
      }
    } catch (error) {
      console.error('Error subiendo comprobante:', error);
      setMensajeVerificacion("Error al subir el comprobante. Inténtalo de nuevo.");
    } finally {
      setShowUploadProgress(false);
    }
  }
};
```

---

## **🏗️ RESUMEN DE CAMBIOS POR ARCHIVO:**

### **📋 StudentContext.jsx (EL MÁS IMPORTANTE)**
```
✅ Línea ~200:  + 5 funciones backend nuevas (loadStudentProfile, etc.)
✅ Línea ~540:  + 5 líneas en el objeto value 
✅ Línea ~380:  + 3 líneas en useEffect principal
```

### **📋 InicioAlumnoDashboard.jsx**
```
✅ Líneas 268-332: Reemplazar handleSubirComprobante con código real
```

---

## **🎯 VALIDACIÓN DE INTEGRACIÓN:**

### **Cómo saber si está funcionando:**

#### **1. Profile_Alumno_comp.jsx** 
- ✅ Al abrir el perfil, debe mostrar datos reales (no "XXXX")
- ✅ Al editar y guardar, debe persistir en backend
- ✅ NO requiere modificaciones en este archivo

#### **2. MisCursos_Alumno_comp.jsx**
- ✅ Debe mostrar cursos reales matriculados del estudiante
- ✅ Al seleccionar un curso, debe guardarse en backend
- ✅ NO requiere modificaciones en este archivo

#### **3. InicioAlumnoDashboard.jsx**
- ✅ Subida de comprobantes debe ir al servidor real
- ✅ Estados de pago/verificación deben reflejarse automáticamente

#### **4. Flujo completo:**
- ✅ Login → carga datos del backend automáticamente
- ✅ Sin pago → muestra formulario de pago
- ✅ Con pago pero sin curso → redirige a /alumno/cursos
- ✅ Con curso seleccionado → dashboard funcional

---

## **⚠️ IMPORTANTE: SOLO ESTOS 2 ARCHIVOS**

**Archivos a modificar:**
1. `src/context/StudentContext.jsx` ← **MÁS CRÍTICO**
2. `src/components/student/InicioAlumnoDashboard.jsx` ← Solo 1 función

**Archivos que NO tocar:**
- ❌ `src/components/student/Profile_Alumno_comp.jsx`
- ❌ `src/components/student/MisCursos_Alumno_comp.jsx`
- ❌ `src/components/layouts/SideBar_Alumno_Comp.jsx`
- ❌ Cualquier otro componente UI

**Principio:** Los componentes UI solo **consumen** datos del contexto, nunca hacen llamadas directas al backend.

---

# ################################ BACKEND INTEGRATION FOR MISCURSOS ###################################

## 🎯 **GUÍA ESPECÍFICA: MisCursos_Alumno_comp.jsx ↔ BACKEND**

### **ENDPOINTS REQUERIDOS PARA MISCURSOS:**

#### **1. Obtener Cursos Matriculados del Estudiante**
```http
GET /api/student/enrolled-courses
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Response esperado:**
```json
{
  "success": true,
  "data": {
    "enrolledCourses": [
      {
        "id": "course-123",
        "title": "Inglés Básico A1",
        "instructor": "Prof. María González",
        "description": "Curso completo de inglés nivel básico",
        "level": "A1",
        "duration": "6 meses",
        "progress": 65,
        "status": "active", // "active", "completed", "paused"
        "startDate": "2024-01-15",
        "endDate": "2024-07-15",
        "enrollmentDate": "2024-01-10",
        "lastAccessed": "2024-12-15T10:30:00Z",
        "imageUrl": "/assets/curso-ingles-a1.jpg",
        "totalModules": 12,
        "completedModules": 8,
        "totalLessons": 48,
        "completedLessons": 31
      },
      {
        "id": "course-456", 
        "title": "Inglés Intermedio A2",
        "instructor": "Prof. Carlos Méndez",
        "description": "Curso intermedio para continuar tu aprendizaje",
        "level": "A2",
        "duration": "8 meses",
        "progress": 25,
        "status": "active",
        "startDate": "2024-03-01",
        "endDate": "2024-11-01",
        "enrollmentDate": "2024-02-20",
        "lastAccessed": "2024-12-10T15:45:00Z",
        "imageUrl": "/assets/curso-ingles-a2.jpg",
        "totalModules": 16,
        "completedModules": 4,
        "totalLessons": 64,
        "completedLessons": 16
      }
    ],
    "currentCourseId": "course-123", // ID del curso actualmente seleccionado
    "totalEnrolledCourses": 2,
    "activeCoursesCount": 2,
    "completedCoursesCount": 0
  }
}
```

**Error responses:**
```json
// Token inválido
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Token de acceso inválido o expirado"
}

// Estudiante sin cursos
{
  "success": true,
  "data": {
    "enrolledCourses": [],
    "currentCourseId": null,
    "totalEnrolledCourses": 0,
    "activeCoursesCount": 0,
    "completedCoursesCount": 0
  }
}

// Error del servidor
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "Error interno del servidor al obtener cursos matriculados"
}
```

#### **2. Seleccionar Curso Activo**
```http
POST /api/student/select-course
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "courseId": "course-123"
}
```

**Response esperado:**
```json
{
  "success": true,
  "data": {
    "selectedCourse": {
      "id": "course-123",
      "title": "Inglés Básico A1",
      "instructor": "Prof. María González",
      "level": "A1",
      "progress": 65,
      "status": "active",
      "lastAccessed": "2024-12-15T10:30:00Z",
      "currentModule": {
        "id": "module-8",
        "title": "Módulo 8: Conversaciones Cotidianas",
        "progress": 80
      },
      "nextLesson": {
        "id": "lesson-32",
        "title": "Lección 32: En el Restaurante",
        "type": "interactive"
      }
    },
    "message": "Curso seleccionado exitosamente"
  }
}
```

### **IMPLEMENTACIÓN EN StudentContext.jsx:**

#### **Función loadEnrolledCourses() - CRÍTICA**
```javascript
const loadEnrolledCourses = async () => {
  try {
    setLoading(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await fetch('/api/student/enrolled-courses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Error al cargar cursos matriculados');
    }

    // Actualizar estado con datos del backend
    setEnrolledCourses(result.data.enrolledCourses);
    
    // Si hay un curso previamente seleccionado, establecerlo
    if (result.data.currentCourseId) {
      const currentCourse = result.data.enrolledCourses.find(
        course => course.id === result.data.currentCourseId
      );
      if (currentCourse) {
        setCurrentCourse(currentCourse);
      }
    }

    console.log('✅ Cursos matriculados cargados:', result.data.enrolledCourses.length);
    
  } catch (error) {
    console.error('❌ Error loading enrolled courses:', error);
    setError(`Error al cargar cursos: ${error.message}`);
    // En caso de error, limpiar datos
    setEnrolledCourses([]);
    setCurrentCourse(null);
  } finally {
    setLoading(false);
  }
};
```

#### **Función selectCourse() - CRÍTICA**
```javascript
const selectCourse = async (courseId) => {
  try {
    setLoading(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Validar que el curso existe en enrolledCourses
    const selectedCourse = enrolledCourses.find(course => course.id === courseId);
    if (!selectedCourse) {
      throw new Error('Curso no encontrado en tus cursos matriculados');
    }

    const response = await fetch('/api/student/select-course', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Error al seleccionar curso');
    }

    // Actualizar currentCourse con datos actualizados del backend
    setCurrentCourse(result.data.selectedCourse);
    
    console.log('✅ Curso seleccionado:', result.data.selectedCourse.title);
    
    // Retornar éxito para que el componente pueda navegar
    return { success: true, course: result.data.selectedCourse };
    
  } catch (error) {
    console.error('❌ Error selecting course:', error);
    setError(`Error al seleccionar curso: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};
```

### **VALIDACIONES ESPECÍFICAS PARA MISCURSOS:**

#### **En MisCursos_Alumno_comp.jsx - NO MODIFICAR ESTE ARCHIVO**
```javascript
// El componente solo debe usar el contexto, sin llamadas directas
const { enrolledCourses, selectCourse, loading, error } = useStudent();

// Validación automática - ya está implementada
useEffect(() => {
  if (enrolledCourses.length === 0) {
    // Mostrar mensaje "No tienes cursos matriculados"
  }
}, [enrolledCourses]);

// Manejo de selección de curso - ya está implementado
const handleSelectCourse = async (courseId) => {
  const result = await selectCourse(courseId);
  if (result.success) {
    // Navegar al dashboard o mostrar mensaje de éxito
    navigate('/alumno'); // Dashboard principal
  } else {
    // Mostrar error
    alert(result.error);
  }
};
```

### **FLUJO COMPLETO DE DATOS:**

```
1. Usuario hace login → token guardado en localStorage
2. StudentContext.loadEnrolledCourses() → GET /api/student/enrolled-courses
3. Backend responde con lista de cursos matriculados
4. MisCursos_Alumno_comp.jsx recibe cursos del contexto
5. Usuario selecciona curso → selectCourse(courseId)
6. POST /api/student/select-course → actualiza currentCourse
7. Sidebar y header se vuelven visibles automáticamente
8. Usuario puede navegar por el dashboard del curso
```

### **ERRORES COMUNES A EVITAR:**

❌ **NO hacer fetch directamente en MisCursos_Alumno_comp.jsx**
❌ **NO mezclar cursos de CourseContext con enrolledCourses**
❌ **NO permitir seleccionar cursos no matriculados**
❌ **NO olvidar validar que el token sea válido**
❌ **NO omitir el manejo de errores de red**

✅ **SÍ usar solo datos de StudentContext**
✅ **SÍ validar permisos antes de mostrar cursos**
✅ **SÍ manejar estados de loading y error**
✅ **SÍ guardar el curso seleccionado en el backend**
✅ **SÍ sincronizar currentCourse con el servidor**

### **TESTING DEL FLUJO:**

Para probar que la integración funciona correctamente:

1. **Login exitoso** → debe cargar enrolledCourses automáticamente
2. **Sin cursos matriculados** → debe mostrar mensaje apropiado
3. **Con cursos pero sin seleccionar** → debe redirigir a /alumno/cursos
4. **Selección de curso** → debe actualizar currentCourse y habilitar navegación
5. **Refresh de página** → debe mantener el curso seleccionado
6. **Logout y login** → debe recordar el último curso seleccionado

---

## 🔗 **RESUMEN DE ENDPOINTS REQUERIDOS:**

| Endpoint | Método | Propósito | Usado en |
|----------|--------|-----------|----------|
| `/api/student/enrolled-courses` | GET | Obtener cursos matriculados | `loadEnrolledCourses()` |
| `/api/student/select-course` | POST | Seleccionar curso activo | `selectCourse()` |
| `/api/student/profile` | GET | Obtener perfil del estudiante | `loadStudentProfile()` |
| `/api/student/profile` | PUT | Actualizar perfil | `updateStudentProfile()` |
| `/api/student/payment-status` | GET | Verificar estado de pago | `checkPaymentStatus()` |

**Total: 5 endpoints para funcionalidad completa del dashboard de estudiante.**

### **CONFIGURACIÓN DE RUTAS DEL DASHBOARD:**

#### **Rutas Principales:**
- **`/alumno/`**: Página de inicio/bienvenida (`InicioAlumnoDashboard`)
- **`/alumno/dashboard`**: Misma página de inicio/bienvenida (`InicioAlumnoDashboard`)
- **`/alumno/course-details`**: Detalles específicos del curso (`CourseDetailDashboard`)
- **`/alumno/cursos`**: Selección de cursos (`MisCursos_Alumno_comp`)

> **⚠️ NOTA IMPORTANTE**: Las rutas `/alumno/` y `/alumno/dashboard` muestran el MISMO componente. La diferenciación se hace por el estado del contexto, no por la ruta.

#### **Flujo de Navegación Esperado:**
1. **Login exitoso** → `/alumno/` o `/alumno/dashboard`
2. **Sin pago** → Bloqueo en pantalla de pago
3. **Pago verificado pero sin curso** → Redirección automática a `/alumno/cursos`
4. **Curso seleccionado** → Regreso a `/alumno/dashboard` con sidebar habilitado
5. **Navegación específica** → `/alumno/course-details` para detalles avanzados

---

# ✅ **CAMBIOS RECIENTES REALIZADOS** (DICIEMBRE 2024)

## **🛠️ CORRECCIÓN DE RUTAS DEL DASHBOARD**

### **PROBLEMA IDENTIFICADO:**
- La ruta `/alumno/dashboard` estaba mostrando `CourseDetailDashboard` en lugar de `InicioAlumnoDashboard`
- Esto causaba confusión en el flujo de navegación del usuario

### **SOLUCIÓN IMPLEMENTADA:**
```javascript
// ANTES (INCORRECTO):
<Route path="/dashboard" element={<CourseDetailDashboard />} />

// DESPUÉS (CORRECTO):
<Route path="/dashboard" element={<InicioAlumnoDashboard />} />
<Route path="/course-details" element={<CourseDetailDashboard />} />
```

### **RESULTADO:**
- ✅ `/alumno/` y `/alumno/dashboard` ahora muestran el MISMO componente
- ✅ `CourseDetailDashboard` movido a `/alumno/course-details` para uso específico
- ✅ Flujo de navegación simplificado y consistente
- ✅ El estado del sidebar y header se controla por contexto, no por ruta

### **COMPORTAMIENTO ACTUAL:**
1. **Usuario sin curso**: Ve `InicioAlumnoDashboard` sin sidebar
2. **Usuario con curso**: Ve `InicioAlumnoDashboard` CON sidebar habilitado
3. **Detalles específicos**: Disponibles en `/alumno/course-details` cuando sea necesario

---

# 🎯 **ESTADO ACTUAL DEL PROYECTO - RESUMEN EJECUTIVO**

## ✅ **COMPLETADO:**
1. **Arquitectura de contextos refactorizada**: Un solo `StudentProvider` en App.jsx
2. **Flujo de rutas corregido**: `/alumno/` y `/alumno/dashboard` muestran el mismo contenido
3. **Control de sidebar basado en estado**: Se muestra solo cuando hay curso seleccionado
4. **Documentación detallada**: Especificaciones claras para integración backend
5. **Lógica de redirección mejorada**: Previene loops infinitos y navegación incorrecta

## 🔄 **PENDIENTE PARA PRODUCCIÓN:**
1. **Implementar funciones backend en StudentContext.jsx**:
   - `loadStudentProfile()` - Cargar datos del estudiante
   - `updateStudentProfile()` - Actualizar perfil
   - `loadEnrolledCourses()` - Cargar cursos matriculados
   - `selectCourse()` - Seleccionar curso activo
   - `checkPaymentStatus()` - Verificar estado de pago
   
2. **Remover código de testing**:
   - Eliminar datos mock de StudentContext.jsx
   - Remover botones de testing en InicioAlumnoDashboard.jsx
   - Quitar hacks de localStorage y datos simulados
   
3. **Integración MisCursos**:
   - Conectar componente con endpoint `/api/student/courses`
   - Implementar selección de curso real
   - Manejar respuestas y errores del backend

## 🚨 **PRIORIDADES INMEDIATAS:**
1. **Desarrollar endpoints del backend** (fuera del alcance del frontend)
2. **Reemplazar datos mock con llamadas API reales**
3. **Testing completo del flujo**: Login → Pago → Selección curso → Dashboard

---
