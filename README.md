
# 🔐 Face Recognition Login - Sistema de Autenticación Segura con Control de Roles

Sistema de autenticación basado en reconocimiento facial utilizando tecnologías modernas de inteligencia artificial y seguridad de software siguiendo estándares NIST SSDF y principios SOLID.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Base de Datos](#-base-de-datos)
- [Requisitos Previos](#-requisitos-previos)
- [Guía Completa de Despliegue](#-guía-completa-de-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionamiento del Sistema](#-funcionamiento-del-sistema)
- [Seguridad NIST SSDF](#-seguridad-nist-ssdf)
- [Principios SOLID](#-principios-solid)
- [API Endpoints](#-api-endpoints)
- [Solución de Problemas](#-solución-de-problemas)

---

## ✨ Características Principales

- ✅ **Autenticación Biométrica Facial** - Sistema de login basado en reconocimiento facial FaceNet 128D
- ✅ **Control de Acceso Basado en Roles (RBAC)** - Perfiles de Administrador y Usuario
- ✅ **Detección en Tiempo Real** - Retroalimentación visual continua durante el escaneo facial
- ✅ **Seguridad Robusta** - Hash de contraseñas (bcrypt), tokens JWT, validación de entrada
- ✅ **Clean Architecture** - Separación de capas (Core, Infrastructure, Interfaces)
- ✅ **TypeScript Full Stack** - Tipado estático en frontend y backend
- ✅ **Contenedores Docker** - PostgreSQL containerizado para fácil despliegue
- ✅ **UI/UX Moderna** - Interfaz responsive con React, Tailwind CSS y glassmorphism
- ✅ **Validación en Tiempo Real** - Mensajes de estado para guiar al usuario
- ✅ **Cumplimiento NIST SSDF** - Implementación de prácticas de desarrollo seguro
- ✅ **Principios SOLID** - Código mantenible y escalable

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura General

```mermaid
graph TB
    subgraph "Cliente - Navegador Web"
        A[Usuario Final]
        B[React SPA]
        C[face-api.js]
        D[AuthContext]
    end
    
    subgraph "Backend - Node.js + Express + TypeScript"
        E[Express Server]
        F[Middlewares]
        G[Controllers]
        H[Use Cases]
        I[Repositories]
        J[Entities]
    end
    
    subgraph "Persistencia"
        K[(PostgreSQL<br/>Docker Container)]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    I --> K
    
    style A fill:#e1f5ff
    style K fill:#d4edda
    style E fill:#fff3cd
```

### Arquitectura de Capas - Clean Architecture

```mermaid
graph LR
    subgraph "Core Domain"
        A[Entities<br/>User]
        B[Use Cases<br/>RegisterUser, LoginUser<br/>GetUserProfile]
        C[Repository Interfaces<br/>IUserRepository]
    end
    
    subgraph "Infrastructure"
        D[PostgresUserRepository]
        E[PostgresConfig]
        F[authMiddleware]
        G[roleMiddleware]
    end
    
    subgraph "Presentation"
        H[AuthController<br/>UserController]
        I[authRoutes<br/>userRoutes]
        J[Express Server]
    end
    
    B --> A
    B --> C
    D --> C
    D --> E
    H --> B
    I --> H
    J --> I
    J --> F
    J --> G
    
    style A fill:#ffcccc
    style D fill:#ccffcc
    style H fill:#ccccff
```

### Flujo de Control de Acceso por Roles

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant AM as authMiddleware
    participant RM as requireAdmin
    participant C as Controller
    participant UC as Use Case
    
    U->>F: Solicita recurso protegido
    F->>AM: Request + JWT Token
    AM->>AM: Verificar y decodificar JWT
    AM->>AM: Extraer userId, role
    
    alt Recurso público
        AM->>C: Request autorizado
    else Recurso admin
        AM->>RM: Verificar role
        alt role === 'admin'
            RM->>C: Request autorizado
        else role !== 'admin'
            RM->>F: 403 Forbidden
        end
    end
    
    C->>UC: Ejecutar lógica de negocio
    UC->>F: Respuesta exitosa
```

### Patrón de Arquitectura: Clean Architecture

El proyecto implementa **Clean Architecture** con separación estricta de responsabilidades:

#### **1. Core (Dominio) - La Capa Interna**
📁 `backend/src/core/`

**Características:**
- **Independiente de frameworks**: No depende de Express, PostgreSQL ni librerías externas
- **Contiene la lógica de negocio pura**: Reglas que definen qué es un usuario, cómo se registra, etc.
- **Altamente testeable**: Se puede probar sin bases de datos ni servidores HTTP

**Componentes:**
- **Entities** (`entities/User.ts`): 
  - Define la estructura de un `User` con sus propiedades fundamentales
  - Incluye campos: `id`, `username`, `passwordHash`, `faceDescriptor`, `role`, `createdAt`
  
- **Use Cases** (`use-cases/`):
  - `RegisterUser`: Valida datos, hashea contraseñas, crea usuarios con rol asignado
  - `LoginUser`: Verifica credenciales, genera JWT con información de role
  - `GetUserProfile`: Obtiene información del usuario sin exponer datos sensibles
  
- **Repository Interfaces** (`repositories/IUserRepository.ts`):
  - Contratos abstractos que definen operaciones de persistencia
  - Métodos: `create()`, `findByUsername()`, `findById()`, `getAllUsers()`, `exists()`

#### **2. Infrastructure (Infraestructura) - La Capa Externa**
📁 `backend/src/infrastructure/`

**Responsabilidad:** Implementaciones concretas de tecnologías y herramientas externas

**Componentes:**
- **Database** (`database/PostgresConfig.ts`):
  - Configuración del pool de conexiones a PostgreSQL
  - Manejo de variables de entorno
  
- **Repositories** (`repositories/PostgresUserRepository.ts`):
  - Implementación concreta de `IUserRepository`
  - Traduce operaciones de dominio a queries SQL
  - Maneja conversión de tipos entre DB y entidades
  
- **Security Middlewares** (`security/`):
  - `authMiddleware.ts`: Verifica tokens JWT, extrae información del usuario
  - `roleMiddleware.ts`: Autoriza acceso según roles (requireAdmin)

#### **3. Interfaces (Presentación) - La Capa de Entrada**
📁 `backend/src/interfaces/`

**Responsabilidad:** Adaptadores para comunicación externa (HTTP, CLI, etc.)

**Componentes:**
- **Controllers** (`controllers/`):
  - `AuthController`: Maneja registro y login de usuarios
  - `UserController`: Gestiona operaciones de perfil y administración
  - Validan entrada HTTP y formatean respuestas
  
- **Routes** (`routes/`):
  - `authRoutes`: `/api/auth/register`, `/api/auth/login`
  - `userRoutes`: `/api/users/profile`, `/api/users/all`, `/api/users/register`
  - Aplican middlewares de autenticación y autorización

### Flujo de Datos Completo

```
Usuario en Navegador
    ↓
React Component (Login/Register/AdminDashboard)
    ↓
face-api.js genera descriptor facial (128D)
    ↓
Axios HTTP POST con datos + JWT token (si aplica)
    ↓
Express Server: authRoutes/userRoutes
    ↓
authMiddleware → Valida JWT → Extrae userId, role
    ↓
requireAdmin (opcional) → Verifica role === 'admin'
    ↓
Controller (AuthController/UserController)
    ↓
Use Case (RegisterUser/LoginUser/GetUserProfile)
    ↓
Repository Interface (IUserRepository)
    ↓
Repository Implementation (PostgresUserRepository)
    ↓
PostgreSQL Database (Docker)
    ↓
Response: JSON con datos o errores
    ↓
Frontend actualiza UI según respuesta
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Framework UI con hooks |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Build tool y dev server ultra rápido |
| face-api.js | 0.22.x | Reconocimiento facial (FaceNet 128D) |
| Axios | 1.x | Cliente HTTP |
| Tailwind CSS | 3.x | Estilos utility-first |
| React Router | 6.x | Enrutamiento SPA |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 22.x | Runtime JavaScript |
| Express | 5.x | Framework web minimalista |
| TypeScript | 5.x | Tipado estático |
| PostgreSQL | 15 | Base de datos relacional |
| bcrypt | 6.x | Hash de contraseñas (12 rounds) |
| jsonwebtoken | 9.x | Tokens de autenticación JWT |
| pg | 8.x | Cliente PostgreSQL |
| dotenv | 17.x | Variables de entorno |

### DevOps
| Tecnología | Propósito |
|------------|-----------|
| Docker | Containerización de PostgreSQL |
| Docker Compose | Orquestación de contenedores |

---

## 💾 Base de Datos

### Esquema de Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    face_descriptor JSONB NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_role CHECK (role IN ('admin', 'user')),
    CONSTRAINT check_username_length CHECK (LENGTH(username) >= 3)
);

-- Índices para optimización
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_created_at ON users(created_at);
```

### Estructura de Datos

#### Tabla `users`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único autoincremental |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | Nombre de usuario único |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash bcrypt de la contraseña (12 rounds) |
| `face_descriptor` | JSONB | NOT NULL | Descriptor facial de 128 dimensiones (FaceNet) |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'user' | Rol del usuario ('admin' o 'user') |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha y hora de creación |

#### Índices

- **`idx_username`**: Optimiza búsquedas por nombre de usuario (login, validación)
- **`idx_role`**: Optimiza filtros y consultas por rol (listado de admins, etc.)
- **`idx_created_at`**: Permite ordenamiento eficiente por fecha de registro

### Ejemplo de Registro

```json
{
  "id": 1,
  "username": "jose_admin",
  "password_hash": "$2b$12$KIXj3Vz8l2Y.../hashed_password",
  "face_descriptor": [
    0.123456, -0.234567, 0.345678, ...  // 128 valores flotantes
  ],
  "role": "admin",
  "created_at": "2026-01-20T23:45:00.000Z"
}
```

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **admin** | • Acceso al Dashboard de administración<br/>• Registrar nuevos usuarios (admin o user)<br/>• Ver lista completa de usuarios<br/>• Ver estadísticas del sistema<br/>• Acceso a todas las rutas `/api/users/*` |
| **user** | • Acceso a su perfil personal<br/>• Ver su propia información<br/>• Actualizar su rostro (futuro)<br/>• Solo acceso a `/api/users/profile` |

---

## 📦 Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 (viene con Node.js)
- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop))
- **Git** ([Descargar](https://git-scm.com/))
- **Navegador web moderno** con soporte para WebRTC (Chrome, Edge, Firefox)
- **Cámara web** funcional (para el reconocimiento facial)
- **10 GB de espacio libre** en disco

### Verificar Instalación

```bash
node --version    # Debe mostrar v18.x o superior
npm --version     # Debe mostrar v9.x o superior
docker --version  # Debe mostrar Docker version 20.x o superior
git --version     # Debe mostrar git version 2.x o superior
```

### Sistema Operativo

Compatible con:
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+, Debian 11+)

---

## 🚀 Guía Completa de Despliegue

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd FaceReconigtionLogin_SWSeguro
```

### Paso 2: Configurar Base de Datos

#### 2.1. Iniciar PostgreSQL con Docker

Desde la raíz del proyecto:

```bash
# Iniciar contenedor de PostgreSQL
docker-compose up -d

# Verificar que está corriendo
docker ps

# Deberías ver:
# CONTAINER ID   IMAGE         COMMAND      STATUS        NAMES
# xxxxx          postgres:15   ...          Up 2 seconds  face_recon_db
```

#### 2.2. Ejecutar Script de Inicialización

```bash
cd backend

# Windows PowerShell:
Get-Content setup_database.sql | docker exec -i face_recon_db psql -U admin -d face_auth_db

# Linux/macOS:
cat setup_database.sql | docker exec -i face_recon_db psql -U admin -d face_auth_db
```

**Salida esperada:**
```
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

#### 2.3. Aplicar Migración de Roles (Si BD ya existía)

```bash
# Windows PowerShell:
Get-Content migration_add_role.sql | docker exec -i face_recon_db psql -U admin -d face_auth_db

# Linux/macOS:
cat migration_add_role.sql | docker exec -i face_recon_db psql -U admin -d face_auth_db
```

### Paso 3: Configurar Backend

#### 3.1. Instalar Dependencias

```bash
cd backend
npm install
```

#### 3.2. Verificar Variables de Entorno

El archivo `backend/.env` debe contener:

```env
# Database Configuration (Docker)
DB_USER=admin
DB_HOST=localhost
DB_NAME=face_auth_db
DB_PASSWORD=admin
DB_PORT=5432

# JWT Secret (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=tu_secret_jwt_super_seguro_cambiar_en_produccion

# Server Port
PORT=3000
```

> ⚠️ **IMPORTANTE**: En producción, genera un JWT_SECRET seguro:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

#### 3.3. Compilar TypeScript

```bash
npm run build
```

**Salida esperada:**
```
Successfully compiled 15 files
```

#### 3.4. Crear Usuario Administrador Inicial

```bash
npm run create-admin
```

**Interacción:**
```
🔐 Creación de Usuario Administrador

Este script creará el primer usuario con rol de administrador.
NOTA: El descriptor facial debe ser agregado posteriormente desde el frontend.

Ingrese nombre de usuario para el admin: admin
Ingrese contraseña para el admin: admin123

⏳ Procesando...

✅ Usuario administrador creado exitosamente:
   ID: 1
   Username: admin
   Role: admin

⚠️  IMPORTANTE: Debe registrar su rostro desde la interfaz web para habilitar el reconocimiento facial.
```

### Paso 4: Configurar Frontend

#### 4.1. Instalar Dependencias

```bash
cd frontend
npm install
```

#### 4.2. Descargar Modelos de face-api.js

Los modelos ya deberían estar en `frontend/public/models/`. Si no:

1. Descarga de [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
2. Coloca los siguientes archivos en `frontend/public/models/`:
   - `ssd_mobilenetv1_model-weights_manifest.json`
   - `ssd_mobilenetv1_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`

Verifica la estructura:
```bash
ls frontend/public/models/

# Deberías ver:
# face_landmark_68_model-shard1
# face_landmark_68_model-weights_manifest.json
# face_recognition_model-shard1
# face_recognition_model-shard2
# face_recognition_model-weights_manifest.json
# ssd_mobilenetv1_model-shard1
# ssd_mobilenetv1_model-weights_manifest.json
```

### Paso 5: Ejecutar la Aplicación

Necesitas **3 terminales abiertas**:

#### Terminal 1: Base de Datos

```bash
# Ya debería estar corriendo desde el Paso 2
docker ps

# Si no está activo:
docker-compose up
```

#### Terminal 2: Backend

```bash
cd backend
npm start
```

**Salida esperada:**
```
🔌 Configuración de base de datos: {
  user: 'admin',
  host: 'localhost',
  database: 'face_auth_db',
  port: 5432
}
🚀 Servidor seguro corriendo en http://localhost:3000
```

#### Terminal 3: Frontend

```bash
cd frontend
npm run dev
```

**Salida esperada:**
```
VITE v5.x.x  ready in 456 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Paso 6: Configuración Inicial en la Web

#### 6.1. Registrar Rostro del Administrador

1. Abre el navegador en **http://localhost:5173**
2. Intenta iniciar sesión con:
   - Username: `admin`
   - Password: `admin123` (la que usaste en create-admin)
3. **Funcionará la contraseña pero fallará el reconocimiento facial** (normal, aún no has registrado tu rostro)
4. Abre la consola del navegador (F12) y ejecuta:
   ```javascript
   // Esto te permite acceder directamente sin facial
   localStorage.setItem('token', 'bypass');
   ```
5. MEJOR OPCIÓN: Modifica temporalmente el código o usa Postman para hacer el registro facial del admin:
   - Ve a `/register` logged in como admin (usa AdminRoute)
   - O crea otro usuario admin desde el script `create-admin`

#### 6.2. Flujo Normal de Uso

Una vez configurado el sistema:

1. **Usuario Normal Registrándose** (BLOQUEADO - Solo admins):
   - Los usuarios NO pueden auto-registrarse
   - El botón "Registrarse" no aparece en el navbar
   
2. **Administrador Registrando Usuarios**:
   - Login como admin en http://localhost:5173
   - Ir a Dashboard → Formulario de registro
   - Completar username, password, seleccionar role
   - Activar cámara y escanear rostro del nuevo usuario
   - Click "Registrar Usuario"
   
3. **Usuario Viendo su Perfil**:
   - Login normal
   - Automáticamente redirigido a `/profile`
   - Ver información personal

### Paso 7: Verificación del Despliegue

#### Verificar Backend

```bash
# Test de salud del servidor
curl http://localhost:3000/api/auth/register

# Deberías recibir error 400 (esperado, sin datos)
```

#### Verificar Base de Datos

```bash
# Ver usuarios registrados
docker exec -it face_recon_db psql -U admin -d face_auth_db -c "SELECT id, username, role, created_at FROM users;"

# Salida esperada:
#  id | username | role  |         created_at
# ----+----------+-------+----------------------------
#   1 | admin    | admin | 2026-01-20 23:45:00.123456
```

#### Verificar Frontend

1. Abre http://localhost:5173
2. Deberías ver la página de login con diseño moderno
3. Verifica que la cámara funciona (permite permisos)
4. Los modelos de IA deben cargar automáticamente (revisa consola del navegador)

---

## 📁 Estructura del Proyecto

```
FaceReconigtionLogin_SWSeguro/
├── backend/
│   ├── src/
│   │   ├── core/                          # 🔴 CAPA DE DOMINIO
│   │   │   ├── entities/
│   │   │   │   └── User.ts                # Entidad de usuario con role
│   │   │   ├── repositories/
│   │   │   │   └── IUserRepository.ts     # Interfaz de repositorio
│   │   │   └── use-cases/
│   │   │       ├── RegisterUser.ts        # UC: Registro con role
│   │   │       ├── LoginUser.ts           # UC: Login con JWT
│   │   │       └── GetUserProfile.ts      # UC: Obtener perfil
│   │   ├── infrastructure/                # 🟢 CAPA DE INFRAESTRUCTURA
│   │   │   ├── database/
│   │   │   │   └── PostgresConfig.ts      # Pool de conexión PostgreSQL
│   │   │   ├── repositories/
│   │   │   │   └── PostgresUserRepository.ts # Implementación concreta
│   │   │   └── security/
│   │   │       ├── authMiddleware.ts      # Middleware de autenticación JWT
│   │   │       └── roleMiddleware.ts      # Middleware de autorización
│   │   ├── interfaces/                    # 🔵 CAPA DE PRESENTACIÓN
│   │   │   ├── controllers/
│   │   │   │   ├── AuthController.ts      # Controlador de autenticación
│   │   │   │   └── UserController.ts      # Controlador de usuarios
│   │   │   └── routes/
│   │   │       ├── authRoutes.ts          # Rutas públicas
│   │   │       └── userRoutes.ts          # Rutas protegidas
│   │   └── server.ts                      # Configuración de Express
│   ├── scripts/
│   │   └── createAdmin.ts                 # Script CLI para crear admin
│   ├── dist/                              # Código compilado (generado)
│   ├── .env                               # Variables de entorno
│   ├── package.json
│   ├── tsconfig.json
│   ├── setup_database.sql                 # Script de inicialización DB
│   └── migration_add_role.sql             # Migración para agregar roles
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FaceScanner.tsx            # Componente de detección facial
│   │   │   ├── ProtectedRoute.tsx         # HOC para rutas autenticadas
│   │   │   └── AdminRoute.tsx             # HOC para rutas admin
│   │   ├── context/
│   │   │   └── AuthContext.tsx            # Context API global de auth
│   │   ├── pages/
│   │   │   ├── Login.tsx                  # Página de login
│   │   │   ├── Register.tsx               # Página de registro (admin only)
│   │   │   ├── UserProfile.tsx            # Dashboard de usuario
│   │   │   └── AdminDashboard.tsx         # Dashboard de administrador
│   │   ├── App.tsx                        # Router y rutas protegidas
│   │   ├── main.tsx                       # Punto de entrada
│   │   └── index.css                      # Estilos globales (Tailwind)
│   ├── public/
│   │   └── models/                        # Modelos de face-api.js
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js                 # Configuración Tailwind CSS
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── docker-compose.yml                     # Configuración de PostgreSQL
└── README.md                              # Este archivo
```

### Explicación de Capas (Clean Architecture)

- **🔴 Core (Dominio)**: Lógica de negocio pura, independiente de frameworks
- **🟢 Infrastructure**: Implementaciones técnicas, bases de datos, seguridad
- **🔵 Interfaces**: Adaptadores HTTP, controladores, rutas

**Dependencias**: Interfaces → Infrastructure → Core (sin dependencias)

---

## 🔄 Funcionamiento del Sistema

### 1. Registro de Usuario (Por Administrador)

```mermaid
sequenceDiagram
    participant A as Administrador
    participant F as Frontend
    participant FA as face-api.js
    participant B as Backend
    participant DB as PostgreSQL
    
    A->>F: Login como admin
    F->>B: POST /api/auth/login
    B-->>F: JWT token con role=admin
    F->>F: Guardar token en localStorage
    
    A->>F: Ir a /admin Dashboard
    F->>F: AdminRoute verifica token y role
    F->>A: Mostrar dashboard
    
    A->>F: Completar formulario registro
    A->>F: Seleccionar role (admin/user)
    FA->>FA: Detectar rostro del nuevo usuario
    FA-->>F: Descriptor 128D generado
    
    A->>F: Click "Registrar Usuario"
    F->>B: POST /api/users/register + JWT
    Note over B: authMiddleware verifica JWT
    Note over B: requireAdmin verifica role=admin
    B->>B: Hash password (bcrypt 12 rounds)
    B->>DB: INSERT INTO users (con role)
    DB-->>B: Usuario creado (ID: X)
    B-->>F: {message: "Éxito"}
    F->>A: Confirmación + actualizar lista
```

### 2. Login de Usuario

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant FA as face-api.js
    participant B as Backend
    participant DB as PostgreSQL
    
    U->>F: Ingresa username/password
    U->>F: Activa cámara
    FA->>FA: Detectar rostro actual
    FA-->>F: Descriptor actual (128D)
    
    U->>F: Click "Iniciar Sesión"
    F->>B: POST /api/auth/login
    B->>DB: SELECT FROM users WHERE username
    DB-->>B: {password_hash, face_descriptor, role}
    
    B->>B: bcrypt.compare(password, password_hash)
    B->>B: jwt.sign({userId, username, role})
    
    B-->>F: {token, faceDescriptor, role}
    F->>FA: euclideanDistance(actual, stored)
    
    alt Distancia < 0.6
        FA-->>F: Match exitoso
        F->>F: Guardar token + role en localStorage
        alt role === 'admin'
            F->>U: Redirigir a /admin
        else role === 'user'
            F->>U: Redirigir a /profile
        end
    else Distancia >= 0.6
        FA-->>F: No match
        F->>U: Error: Rostro no coincide
    end
```

### 3. Acceso a Rutas Protegidas

```mermaid
flowchart TD
    A[Usuario solicita /profile o /admin] --> B{¿Token en localStorage?}
    B -->|No| C[Redirigir a /login]
    B -->|Sí| D[Enviar request con Authorization header]
    
    D --> E[authMiddleware: Verificar JWT]
    E --> F{¿Token válido?}
    F -->|No| G[401 Unauthorized]
    F -->|Sí| H[Extraer userId, username, role]
    
    H --> I{¿Ruta requiere admin?}
    I -->|No| J[Permitir acceso]
    I -->|Sí| K[requireAdmin: Verificar role]
    
    K --> L{¿role === 'admin'?}
    L -->|No| M[403 Forbidden]
    L -->|Sí| J
    
    J --> N[Controller ejecuta lógica]
    N --> O[Respuesta exitosa]
```

---

## 🔒 Seguridad NIST SSDF

El proyecto implementa prácticas del **NIST Secure Software Development Framework (SSDF)**:

### PO.3: Configuración Segura del Entorno

**Implementación:**
- ✅ Variables de entorno separadas del código (`dotenv`)
- ✅ `.env` en `.gitignore` para evitar commits accidentales
- ✅ Contenedores Docker para aislamiento
- ✅ Valores por defecto seguros en configuración

```typescript
// backend/src/infrastructure/database/PostgresConfig.ts
const dbConfig = {
    user: process.env.DB_USER || 'admin',  // Fallback seguro
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'face_auth_db',
    password: process.env.DB_PASSWORD,  // Sin fallback inseguro
    port: 5432,
};
```

### PS.1: Protección de Credenciales

**Implementación:**
- ✅ Hash de contraseñas con bcrypt (12 rounds, inmune a rainbow tables)
- ✅ JWT firmado con secret seguro
- ✅ No se exponen passwords en logs ni respuestas
- ✅ Descriptores faciales almacenados como JSONB (no reversible a imagen)

```typescript
// backend/src/core/use-cases/RegisterUser.ts
const saltRounds = 12;  // Alto costo de cómputo contra fuerza bruta
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Backend nunca devuelve password_hash en responses
```

### PS.2: Gestión de Secretos

**Implementación:**
- ✅ JWT_SECRET en variable de entorno
- ✅ Rotación de secretos soportada (cambiar .env)
- ✅ Tokens con expiración (24h)

```typescript
// backend/src/core/use-cases/LoginUser.ts
const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }  // Ventana de validez limitada
);
```

### PW.1: Validación de Entrada

**Implementación:**
- ✅ Validación de longitud y formato de username
- ✅ Validación de descriptor facial (debe ser array de 128 números)
- ✅ Validación de rol (solo 'admin' o 'user')
- ✅ Sanitización de entrada SQL (queries parametrizadas)

```typescript
// backend/src/interfaces/controllers/AuthController.ts
if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
    return res.status(400).json({ 
        error: "El descriptor facial debe ser un array de 128 números." 
    });
}

// Queries parametrizadas (previene SQL injection)
const result = await pool.query(
    'INSERT INTO users (username, password_hash, face_descriptor, role) VALUES ($1, $2, $3, $4)',
    [username, passwordHash, JSON.stringify(faceDescriptor), role]
);
```

### PW.2: Autenticación y Autorización

**Implementación:**
- ✅ Autenticación basada en JWT (stateless)
- ✅ Autorización basada en roles (RBAC)
- ✅ Principio de mínimo privilegio (usuarios no acceden a recursos admin)
- ✅ Middleware de autenticación en todas las rutas protegidas

```typescript
// backend/src/infrastructure/security/authMiddleware.ts
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No se proporcionó token de autenticación.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;  // Inyecta información del usuario
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};
```

### PW.4: Revisión de Código y Arquitectura

**Implementación:**
- ✅ Clean Architecture facilita revisión por capas
- ✅ TypeScript reduce errores de tipo en tiempo de compilación
- ✅ Separación de responsabilidades (SRP)
- ✅ Código autodocumentado con nombres descriptivos

### PW.7: Gestión de Errores Segura

**Implementación:**
- ✅ No se exponen stack traces en producción
- ✅ Mensajes de error genéricos para seguridad (no revelan info interna)
- ✅ Logging de errores sin información sensible

```typescript
// No revelar si usuario existe o no (previene enumeración)
if (!user || !(await bcrypt.compare(password, user.props.passwordHash))) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
}
```

### PW.8: Seguridad de Datos en Tránsito

**Recomendaciones para Producción:**
- ⚠️ Usar HTTPS/TLS para cifrar comunicación (nginx + Let's Encrypt)
- ⚠️ Configurar headers de seguridad (Helmet.js)
- ⚠️ CORS restringido a dominios autorizados

### RV.1: Pruebas de Seguridad

**Implementación:**
- ✅ Validación manual de flujos de autenticación
- ✅ Pruebas de rol (usuarios no acceden a rutas admin)
- ⚠️ Futuro: Tests automatizados con Jest/Supertest

---

## 🧩 Principios SOLID

### S - Single Responsibility Principle (Principio de Responsabilidad Única)

**Cada clase/módulo tiene una sola razón para cambiar.**

**Ejemplo 1: Use Cases**
```typescript
// backend/src/core/use-cases/RegisterUser.ts
// RESPONSABILIDAD ÚNICA: Registrar un usuario
export class RegisterUser {
    // Solo se cambia si la lógica de registro cambia
    async execute(username, password, faceDescriptor, role) {
        // Validar, hashear, crear usuario
    }
}

// backend/src/core/use-cases/LoginUser.ts
// RESPONSABILIDAD ÚNICA: Autenticar un usuario
export class LoginUser {
    // Solo se cambia si la lógica de login cambia
    async execute(username, password) {
        // Verificar credenciales, generar JWT
    }
}
```

**Ejemplo 2: Middlewares**
```typescript
// backend/src/infrastructure/security/authMiddleware.ts
// RESPONSABILIDAD ÚNICA: Verificar autenticación
export const authMiddleware = (req, res, next) => {
    // Solo verifica si el token es válido
};

// backend/src/infrastructure/security/roleMiddleware.ts
// RESPONSABILIDAD ÚNICA: Verificar autorización por rol
export const requireAdmin = (req, res, next) => {
    // Solo verifica si el usuario es admin
};
```

### O - Open/Closed Principle (Principio Abierto/Cerrado)

**Abierto para extensión, cerrado para modificación.**

**Ejemplo: Repository Pattern**
```typescript
// backend/src/core/repositories/IUserRepository.ts
// INTERFAZ: Define el contrato (cerrado para modificación)
export interface IUserRepository {
    create(user: User): Promise<void>;
    findByUsername(username: string): Promise<User | null>;
    // ...
}

// backend/src/infrastructure/repositories/PostgresUserRepository.ts
// IMPLEMENTACIÓN 1: PostgreSQL (extensión sin modificar interfaz)
export class PostgresUserRepository implements IUserRepository {
    async create(user: User) { /* PostgreSQL specific */ }
}

// FUTURO: Podemos agregar MongoDBUserRepository sin cambiar código existente
// export class MongoDBUserRepository implements IUserRepository {
//     async create(user: User) { /* MongoDB specific */ }
// }
```

### L - Liskov Substitution Principle (Principio de Sustitución de Liskov)

**Los objetos derivados deben poder sustituir a su clase base.**

**Ejemplo: Implementaciones de Repository**
```typescript
// Use Case depends on interface, not implementation
export class GetUserProfile {
    constructor(private userRepository: IUserRepository) {}
    // ^^^ Puede recibir PostgresUserRepository o cualquier otra impl
    
    async execute(userId: string) {
        return await this.userRepository.findById(userId);
        // Funciona con cualquier implementación de IUserRepository
    }
}

// Sustitución en servidor
const postgresRepo = new PostgresUserRepository(pool);
const getUserProfile = new GetUserProfile(postgresRepo);

// En el futuro, podemos sustituir:
// const mongoRepo = new MongoDBUserRepository(client);
// const getUserProfile = new GetUserProfile(mongoRepo);  // ✅ Funciona igual
```

### I - Interface Segregation Principle (Principio de Segregación de Interfaces)

**Los clientes no deben depender de interfaces que no usan.**

**Ejemplo:**
```typescript
// ❌ MALO: Interfaz "gorda" con métodos que algunos clientes no necesitarían
// interface IUserRepository {
//     create(): void;
//     findById(): void;
//     updateProfile(): void;
//     deleteAccount(): void;
//     sendEmail(): void;  // ¿Por qué está aquí?
//     generateReport(): void;  // No tiene sentido en repository
// }

// ✅ BUENO: Interfaz enfocada solo en persistencia
export interface IUserRepository {
    create(user: User): Promise<void>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    exists(username: string): Promise<boolean>;
}
// Otros servicios (email, reportes) tendrían sus propias interfaces
```

### D - Dependency Inversion Principle (Principio de Inversión de Dependencias)

**Depender de abstracciones, no de implementaciones concretas.**

**Ejemplo: Inyección de Dependencias**
```typescript
// backend/src/core/use-cases/RegisterUser.ts
export class RegisterUser {
    constructor(
        private userRepository: IUserRepository  // ✅ Depende de abstracción
        // NO: private userRepository: PostgresUserRepository  // ❌ Depende de concreta
    ) {}
    
    async execute(...) {
        await this.userRepository.create(user);
        // No le importa si es PostgreSQL, MongoDB, etc.
    }
}

// backend/src/interfaces/controllers/AuthController.ts
const userRepository = new PostgresUserRepository(pool);  // Implementación concreta
const registerUser = new RegisterUser(userRepository);  // Inyección de dependencia

// Ventaja: Fácil de testear con mocks
// const mockRepo = new MockUserRepository();
// const registerUser = new RegisterUser(mockRepo);
```

### Beneficios de SOLID en este Proyecto

1. **Testabilidad**: Mocks/stubs fáciles para unit tests
2. **Mantenibilidad**: Cambios aislados en módulos específicos
3. **Escalabilidad**: Agregar features sin romper código existente
4. **Legibilidad**: Código autodocumentado y predecible

---

## 📡 API Endpoints

### Base URL: `http://localhost:3000`

### Rutas Públicas

#### 1. Registro de Usuario (DEPRECADO - Usar endpoint admin)

```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "nuevo_usuario",
    "password": "SecurePass123!",
    "faceDescriptor": [0.123, -0.456, ...]  // Array de 128 números
}
```

**Respuesta exitosa (201)**:
```json
{
    "message": "Usuario registrado con éxito."
}
```

#### 2. Login de Usuario

```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "jose_user",
    "password": "SecurePass123!"
}
```

**Respuesta exitosa (200)**:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "faceDescriptor": [0.123, -0.456, ...],
    "userId": "1",
    "username": "jose_user",
    "role": "user",
    "message": "Login exitoso"
}
```

### Rutas Protegidas (Requieren Autenticación)

**Header requerido:**
```http
Authorization: Bearer <JWT_TOKEN>
```

#### 3. Obtener Perfil del Usuario

```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200)**:
```json
{
    "id": "1",
    "username": "jose_user",
    "role": "user",
    "createdAt": "2026-01-20T23:45:00.000Z"
}
```

### Rutas Admin (Requieren rol 'admin')

#### 4. Listar Todos los Usuarios

```http
GET /api/users/all
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Respuesta exitosa (200)**:
```json
{
    "users": [
        {
            "id": "1",
            "username": "admin",
            "role": "admin",
            "createdAt": "2026-01-20T23:00:00.000Z"
        },
        {
            "id": "2",
            "username": "user1",
            "role": "user",
            "createdAt": "2026-01-20T23:30:00.000Z"
        }
    ]
}
```

#### 5. Registrar Usuario (Por Administrador)

```http
POST /api/users/register
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
    "username": "nuevo_usuario",
    "password": "SecurePass123!",
    "faceDescriptor": [0.123, -0.456, ...],  // 128 números
    "role": "user"  // o "admin"
}
```

**Respuesta exitosa (201)**:
```json
{
    "message": "Usuario registrado exitosamente",
    "userId": "3"
}
```

### Códigos de Error

| Código | Significado |
|--------|-------------|
| `400` | Bad Request - Datos faltantes o inválidos |
| `401` | Unauthorized - Token inválido, expirado o faltante |
| `403` | Forbidden - Rol insuficiente para la operación |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 🐛 Solución de Problemas

### Backend: "Cannot find module PostgresConfig"

**Error:**
```
Error: Cannot find module 'C:\...\PostgresConfig.js'
```

**Solución:**
```bash
# Recompilar TypeScript
cd backend
npm run build

# Verificar que dist/ tiene la estructura correcta
ls dist/infrastructure/database/
```

### Frontend: "Modelos de IA no se cargan"

**Error en consola:**
```
Error al cargar modelos: Failed to fetch
```

**Solución:**
1. Verifica que los modelos estén en `frontend/public/models/`
2. Descarga modelos faltantes de [face-api.js weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
3. Estructura correcta:
   ```
   frontend/public/models/
   ├── ssd_mobilenetv1_model-weights_manifest.json
   ├── ssd_mobilenetv1_model-shard1
   ├── face_landmark_68_model-weights_manifest.json
   ├── face_landmark_68_model-shard1
   ├── face_recognition_model-weights_manifest.json
   ├── face_recognition_model-shard1
   └── face_recognition_model-shard2
   ```

### Base de Datos: "password authentication failed"

**Solución:**
```bash
# Verificar que Docker está corriendo
docker ps

# Recrear contenedor si es necesario
docker-compose down
docker-compose up -d

# Verificar credenciales en backend/.env
cat backend/.env | grep DB_
```

### Usuario: "No se detecta mi rostro"

**Soluciones:**
- ✅ Mejora la iluminación frontal
- ✅ Mira directamente a la cámara
- ✅ Mantén la cara completa dentro del cuadro
- ✅ Solo una persona debe estar frente a la cámara
- ✅ Espera al mensaje "✅ Rostro detectado (>60%)"

### Permisos: "403 Forbidden al intentar registrar usuario"

**Causa:** Intentando acceder a endpoint admin sin ser administrador.

**Solución:**
1. Verifica tu rol:
   ```javascript
   // En consola del navegador
   const token = localStorage.getItem('token');
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log(payload.role);  // Debe ser 'admin'
   ```
2. Si no eres admin, pide a un administrador que te registre

---

## 📊 Comandos Útiles

### Backend
```bash
# Compilar TypeScript
npm run build

# Iniciar servidor (producción)
npm start

# Desarrollo con auto-reload
npm run dev

# Crear usuario administrador
npm run create-admin
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Docker
```bash
# Iniciar PostgreSQL
docker-compose up -d

# Detener PostgreSQL
docker-compose down

# Ver logs
docker logs face_recon_db

# Conectarse a la base de datos
docker exec -it face_recon_db psql -U admin -d face_auth_db

# Ver usuarios registrados
docker exec -it face_recon_db psql -U admin -d face_auth_db -c "SELECT id, username, role, created_at FROM users;"

# Ejecutar script SQL
Get-Content setup_database.sql | docker exec -i face_recon_db psql -U admin -d face_auth_db
```

---

## 👥 Autores

- **Jose Sanmartin** - Desarrollo Full Stack

## 📄 Licencia

Este proyecto es de código educativo para el curso de Software Seguro - ESPE.

---

## 🙏 Agradecimientos

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Librería de reconocimiento facial
- [NIST SSDF](https://csrc.nist.gov/Projects/ssdf) - Marco de desarrollo seguro
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin

---

**¿Preguntas o problemas?** Abre un issue en el repositorio o contacta al desarrollador.
