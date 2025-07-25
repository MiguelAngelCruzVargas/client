# 📋 INTEGRACIÓN BACKEND - ACTIVIDADES_ALUMNO_COMP.JSX

## 🎯 **RESUMEN EJECUTIVO**

**El componente `Actividades_Alumno_comp.jsx` ya está preparado para integración backend. Contiene 14 puntos de integración claramente marcados con comentarios `TODO: BACKEND`.**

**PRINCIPIO FUNDAMENTAL: La integración backend debe hacerse EXCLUSIVAMENTE en el contexto, NUNCA directamente en el componente UI.**

---

## 📁 **ESTRUCTURA DE INTEGRACIÓN**

### **🎪 CONTEXTO RESPONSABLE: `src/context/StudentContext.jsx`**

El componente ya consume el contexto `useStudent()` correctamente. Solo necesitas agregar las funciones backend al contexto.

---

## 🔧 **PUNTOS DE INTEGRACIÓN BACKEND IDENTIFICADOS**

### **1. CARGA DE MÓDULOS Y ÁREAS**

#### 📍 **Línea 88**: Carga de módulos específicos
```javascript
// EN StudentContext.jsx - AGREGAR:
const loadActivityModules = async () => {
  try {
    const response = await fetch('/api/activity-modules', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const modules = await response.json();
    setActivityModules(modules);
    return modules;
  } catch (error) {
    console.error('Error loading activity modules:', error);
    throw error;
  }
};
```

#### 📍 **Línea 200**: Carga de áreas generales
```javascript
// EN StudentContext.jsx - AGREGAR:
const loadSubjectAreas = async () => {
  try {
    const response = await fetch('/api/subject-areas', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const areas = await response.json();
    setSubjectAreas(areas);
    return areas;
  } catch (error) {
    console.error('Error loading subject areas:', error);
    throw error;
  }
};
```

### **2. CARGA DE ACTIVIDADES Y QUIZZES**

#### 📍 **Línea 249**: Carga de quizzes por área
```javascript
// EN StudentContext.jsx - AGREGAR:
const loadQuizzesByArea = async (areaId) => {
  try {
    const response = await fetch(`/api/students/quizzes/${areaId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const quizzes = await response.json();
    return quizzes;
  } catch (error) {
    console.error('Error loading quizzes:', error);
    throw error;
  }
};
```

#### 📍 **Línea 361**: Carga de actividades por área
```javascript
// EN StudentContext.jsx - AGREGAR:
const loadActivitiesByArea = async (areaId) => {
  try {
    const response = await fetch(`/api/students/activities/${areaId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const activities = await response.json();
    return activities;
  } catch (error) {
    console.error('Error loading activities:', error);
    throw error;
  }
};
```

#### 📍 **Línea 556**: Carga dinámica según tipo (actividades/quiz)
```javascript
// EN StudentContext.jsx - AGREGAR:
const loadContentByAreaAndType = async (areaId, type) => {
  try {
    const endpoint = type === 'quiz' ? 'quizzes' : 'activities';
    const response = await fetch(`/api/students/${endpoint}/${areaId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const content = await response.json();
    return content;
  } catch (error) {
    console.error(`Error loading ${type}:`, error);
    throw error;
  }
};
```

### **3. GESTIÓN DE ARCHIVOS**

#### 📍 **Línea 603**: Subida de archivos de actividades
```javascript
// EN StudentContext.jsx - AGREGAR:
const uploadActivityFile = async (activityId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('activityId', activityId);
    
    const response = await fetch('/api/students/upload-activity', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
```

#### 📍 **Línea 707**: Descarga de archivos
```javascript
// EN StudentContext.jsx - AGREGAR:
const downloadActivityFile = async (activityId) => {
  try {
    const response = await fetch(`/api/students/download-activity/${activityId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Download failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
```

### **4. GESTIÓN DE SIMULACIONES**

#### 📍 **Línea 754**: Iniciar simulación
```javascript
// EN StudentContext.jsx - AGREGAR:
const startSimulation = async (quizId) => {
  try {
    const response = await fetch(`/api/simulations/validate-access/${quizId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Access denied');
    
    const validation = await response.json();
    if (validation.canAccess) {
      window.location.href = `/simulacion/${quizId}`;
    }
    return validation;
  } catch (error) {
    console.error('Error starting simulation:', error);
    throw error;
  }
};
```

#### 📍 **Línea 775**: Ver resultados de quiz
```javascript
// EN StudentContext.jsx - AGREGAR:
const getQuizResults = async (quizId) => {
  try {
    const response = await fetch(`/api/students/quiz-results/${quizId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Results not found');
    
    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Error loading quiz results:', error);
    throw error;
  }
};
```

### **5. GESTIÓN DE ACCESOS Y PERMISOS**

#### 📍 **Línea 515**: Solicitar acceso a módulo
```javascript
// EN StudentContext.jsx - AGREGAR:
const requestModuleAccess = async (moduleId, reason) => {
  try {
    const response = await fetch('/api/students/request-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        moduleId,
        reason,
        requestDate: new Date().toISOString()
      })
    });
    
    if (!response.ok) throw new Error('Request failed');
    
    const result = await response.json();
    
    // Actualizar estado local
    setActivityRequests(prev => [...prev, result.request]);
    
    return result;
  } catch (error) {
    console.error('Error requesting module access:', error);
    throw error;
  }
};
```

#### 📍 **Línea 812**: Manejar reintentos
```javascript
// EN StudentContext.jsx - AGREGAR:
const retryActivity = async (activityId, type) => {
  try {
    const response = await fetch(`/api/students/retry-${type}/${activityId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Retry failed');
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error retrying activity:', error);
    throw error;
  }
};
```

---

## 🎭 **MODIFICACIÓN REQUERIDA EN StudentContext.jsx**

### **PASO 1: Agregar Estados**
```javascript
const [activityModules, setActivityModules] = useState([]);
const [subjectAreas, setSubjectAreas] = useState([]);
const [studentActivities, setStudentActivities] = useState([]);
const [studentQuizzes, setStudentQuizzes] = useState([]);
const [activityRequests, setActivityRequests] = useState([]);
```

### **PASO 2: Agregar Funciones** 
Agregar todas las funciones listadas arriba al contexto.

### **PASO 3: Exponer en Value**
```javascript
const value = {
  // ...código existente...
  
  // AGREGAR ESTAS FUNCIONES:
  loadActivityModules,
  loadSubjectAreas,
  loadQuizzesByArea,
  loadActivitiesByArea,
  loadContentByAreaAndType,
  uploadActivityFile,
  downloadActivityFile,
  startSimulation,
  getQuizResults,
  requestModuleAccess,
  retryActivity,
  
  // AGREGAR ESTOS ESTADOS:
  activityModules,
  subjectAreas,
  studentActivities,
  studentQuizzes,
  activityRequests,
  
  // ...resto del value...
};
```

### **PASO 4: Inicialización**
```javascript
useEffect(() => {
  // ...código existente...
  
  // AGREGAR AL FINAL:
  loadActivityModules().catch(console.error);
  loadSubjectAreas().catch(console.error);
}, []);
```

---

## ✅ **COMPONENTE YA PREPARADO**

El componente `Actividades_Alumno_comp.jsx` ya:

1. ✅ **Consume el contexto correctamente** con `useStudent()`
2. ✅ **Tiene todos los puntos de integración marcados** con `TODO: BACKEND`
3. ✅ **Maneja errores apropiadamente** con `showNotification()`
4. ✅ **Usa datos mock temporales** hasta la integración
5. ✅ **Separará responsabilidades** correctamente (UI vs lógica de negocio)

---

## 🚨 **IMPORTANTE: NO MODIFICAR EL COMPONENTE**

**El componente `Actividades_Alumno_comp.jsx` NO necesita modificaciones. Solo agregar las funciones al contexto y reemplazar los comentarios `TODO: BACKEND` con llamadas reales a las funciones del contexto.**

**Ejemplo de cambio en el componente (línea 556):**
```javascript
// ANTES (línea 556):
// TODO: BACKEND - Cargar actividades/quiz desde API según área y tipo

// DESPUÉS:
const data = await loadContentByAreaAndType(areaId, type);
setActividades(data.items);
```

---

## 📊 **ENDPOINTS BACKEND REQUERIDOS**

| Método | Endpoint | Propósito |
|--------|----------|-----------|
| GET | `/api/activity-modules` | Cargar módulos específicos |
| GET | `/api/subject-areas` | Cargar áreas generales |
| GET | `/api/students/quizzes/{areaId}` | Cargar quizzes por área |
| GET | `/api/students/activities/{areaId}` | Cargar actividades por área |
| POST | `/api/students/upload-activity` | Subir archivo de actividad |
| GET | `/api/students/download-activity/{activityId}` | Descargar archivo |
| GET | `/api/simulations/validate-access/{quizId}` | Validar acceso a simulación |
| GET | `/api/students/quiz-results/{quizId}` | Obtener resultados |
| POST | `/api/students/request-access` | Solicitar acceso a módulo |
| POST | `/api/students/retry-{type}/{activityId}` | Reintentar actividad/quiz |

---

## 🎯 **RESUMEN FINAL**

1. **ÚNICAMENTE** modificar `src/context/StudentContext.jsx`
2. **NO** tocar `src/components/student/Actividades_Alumno_comp.jsx`
3. Agregar las **14 funciones backend** al contexto
4. Exponer las funciones en el **value** del contexto
5. Inicializar datos en el **useEffect** del contexto
6. Los **10 endpoints** del backend deben estar listos

**El componente ya está 100% preparado para recibir datos reales del backend a través del contexto. 🚀**
