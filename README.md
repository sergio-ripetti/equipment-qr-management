# Equipment QR Management App

Un sistema de gestión de equipos que permite rastrear registros, historiales de mantenimiento, códigos QR y controlar acceso por roles de usuario.

La idea surgió de una necesidad real: en lugar de buscar en hojas de cálculo, carpetas o registros en papel, cada equipo se puede acceder mediante un código QR y gestionar desde una plataforma centralizada. Hice esto como proyecto full-stack usando React, TypeScript, Node.js, Express, MongoDB, autenticación JWT y control de acceso por roles.

**Repositorio:** https://github.com/sergio-ripetti/equipment-qr-management

---

## Tabla de contenidos

- [Quick Start](#quick-start)
- [Demo en vivo](#demo-en-vivo)
- [Requisitos](#requisitos)
- [Screenshots](#screenshots)
- [Características](#características-principales)
- [Roles de usuario](#roles-de-usuario)
- [Tecnología](#tecnología-usada)
- [Estructura](#estructura-del-proyecto)
- [Cómo correr localmente](#cómo-correr-localmente)
- [Scripts](#scripts-disponibles)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contribuir](#contribuir)
- [License](#license)

---

## Quick Start

Si solo quieres correr el proyecto rápido sin leer todo:

```bash
# Clonar
git clone https://github.com/sergio-ripetti/equipment-qr-management.git
cd equipment-qr-management

# Frontend
cd client
npm install
# Crear client/.env con: VITE_API_URL=http://localhost:5000
npm run dev
# Frontend corre en http://localhost:5173

# Backend (en otra terminal, desde raíz)
cd server
npm install
# Crear server/.env con:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# CLOUDINARY_CLOUD_NAME=your_name
# CLOUDINARY_API_KEY=your_key
# CLOUDINARY_API_SECRET=your_secret
npm run dev
# Backend corre en http://localhost:5000
```

Listo. Ambos deberían estar corriendo.

---

## Demo en vivo

Frontend: https://equipment-qr-management.vercel.app/

Backend API: https://equipment-qr-management.onrender.com

---

## Requisitos

Antes de empezar, necesitas tener instalado:

- Node.js 18.0.0 o mayor
- npm 9.0.0 o mayor (viene con Node.js)
- MongoDB (local o Atlas account)
- Cloudinary account (para subida de imágenes)
- Una cuenta de GitHub (para clonar)

Verifica que tienes Node.js:
```bash
node --version
npm --version
```

---

## Screenshots

**Login**
![Login page](screenshots/login.png)

**Dashboard**
![Dashboard](screenshots/dashboard.png)

**Home - Búsqueda**
![Home Search Page](screenshots/home.png)

**Lista de equipos**
![Equipment List](screenshots/equipment-list.png)

**Detalle de equipo**
![Machine Detail](screenshots/machine-detail.png)

**Página pública QR**
![Public QR Page](screenshots/public-qr-page.png)

---

## Características principales

- App full-stack con TypeScript en frontend y backend
- CRUD completo de equipos
- Generación de códigos QR para cada equipo
- Página pública de QR con detalles del equipo
- Subida de imágenes con preview y validación
- Almacenamiento de imágenes en Cloudinary
- Historial de mantenimiento completo
- Agregar, editar y eliminar registros de mantenimiento
- Autenticación con JWT
- Control de acceso por roles (Admin, Technician, Viewer)
- Log de actividades del sistema
- Gestión de usuarios para admins
- Dashboard con resumen de equipos y mantenimiento
- Interfaz responsiva para escritorio y móvil
- Integración con MongoDB Atlas

---

## Roles de usuario

### Admin

Acceso completo al sistema. Puede:

- Ver dashboard
- Buscar y ver equipos
- Crear, editar y eliminar equipos
- Agregar, editar y eliminar registros de mantenimiento
- Descargar y imprimir códigos QR
- Gestionar otros usuarios
- Ver logs de actividad

### Technician

Puede trabajar con mantenimiento pero no puede crear ni eliminar equipos.

- Ver dashboard
- Buscar y ver equipos
- Agregar y editar mantenimiento
- Descargar códigos QR

No puede:

- Crear o editar equipos
- Eliminar equipos
- Eliminar mantenimiento
- Gestionar usuarios
- Ver logs

### Viewer

Acceso de solo lectura.

- Ver dashboard
- Buscar y ver equipos
- Ver detalles de equipos

No puede hacer cambios de ningún tipo.

### Usuario público (QR)

Puede escanear un código QR y acceder a información pública del equipo con su historial de mantenimiento.

---

## Tecnología usada

**Frontend**
- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Heroicons
- qrcode.react

**Backend**
- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- Multer
- Cloudinary
- CORS

**Deployment**
- Frontend en Vercel
- Backend en Render
- Base de datos en MongoDB Atlas
- Imágenes en Cloudinary

---

## Estructura del proyecto

```
equipment-qr-management
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── constants
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── data
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   ├── index.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
│
├── screenshots
├── .gitignore
└── README.md
```

---

## Cómo correr localmente

### 1. Clonar el repo

```bash
git clone https://github.com/sergio-ripetti/equipment-qr-management.git
cd equipment-qr-management
```

### 2. Instalar dependencias del frontend

```bash
cd client
npm install
```

### 3. Instalar dependencias del backend

En otra terminal desde la raíz del proyecto:

```bash
cd server
npm install
```

### 4. Crear archivos .env

Frontend `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

Backend `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 5. Correr el backend

Desde la carpeta `server`:

```bash
npm run dev
```

Debería estar en: http://localhost:5000

Prueba abriendo http://localhost:5000 en el navegador y deberías ver:
```
Equipment QR Management API is running
```

### 6. Correr el frontend

Desde la carpeta `client`:

```bash
npm run dev
```

Debería estar en: http://localhost:5173

---

## Scripts disponibles

**Frontend** (desde carpeta `client`)

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build para producción
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking
npm run preview      # Preview del build de producción
```

**Backend** (desde carpeta `server`)

```bash
npm run dev          # Inicia servidor con Nodemon
npm run build        # Compila TypeScript a dist/
npm start            # Corre el build compilado
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run seed         # Importa datos de demo a MongoDB
npm run destroy      # Borra datos de demo
```

---

## API Endpoints

Base URL local: http://localhost:5000

**Auth**
```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/profile
```

**Equipos**
```
GET    /api/machines
GET    /api/machines/:id
POST   /api/machines
PUT    /api/machines/:id
DELETE /api/machines/:id
```

**Mantenimiento**
```
POST   /api/machines/:id/maintenance
PUT    /api/machines/:id/maintenance/:maintenanceIndex
DELETE /api/machines/:id/maintenance/:maintenanceIndex
```

**Usuarios**
```
GET    /api/users
POST   /api/users
PUT    /api/users/:id/role
DELETE /api/users/:id
```

**Activity logs**
```
GET /api/activity-logs
```

---

## Troubleshooting

### Error: "Port 5000 is already in use"

El puerto 5000 ya está ocupado. Soluciones:

Opción 1: Matar el proceso que usa el puerto
```bash
# En Mac/Linux
lsof -i :5000
kill -9 <PID>

# En Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Opción 2: Cambiar el puerto en `server/.env`
```
PORT=5001
```

### Error: "Cannot connect to MongoDB"

Verifica tu `MONGO_URI` en `server/.env`:
- Asegúrate que está correcta
- Si usas MongoDB Atlas, verifica que tu IP está en la whitelist
- Comprueba que tienes conexión a internet

### Error: "Cloudinary error"

Verifica tus credenciales de Cloudinary en `server/.env`:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Son sensibles y deben ser exactas. Cópialas de nuevo desde tu dashboard de Cloudinary.

### Error: "VITE_API_URL is not defined"

Verifica que tu `client/.env` existe y tiene:
```
VITE_API_URL=http://localhost:5000
```

Después de crear el archivo, reinicia el servidor de frontend.

### La app corre pero no carga datos

Asegúrate que:
- El backend está corriendo en http://localhost:5000
- MongoDB está conectado (verifica MONGO_URI)
- No hay errores en la consola del navegador (abre DevTools)

### Error: "npm: command not found"

Node.js no está instalado o no está en tu PATH. Descarga desde https://nodejs.org/ e instala la versión LTS.

---

## Cómo funcionan las imágenes

Uso Cloudinary para almacenar imágenes de equipos. Cuando un usuario sube una imagen, se guarda en Cloudinary en lugar de localmente, así persiste incluso si el servidor se reinicia o se redeploy.

Flujo:
1. Usuario selecciona imagen
2. Frontend envía como FormData
3. Backend recibe con Multer y sube a Cloudinary
4. MongoDB guarda la URL de Cloudinary
5. Frontend muestra la imagen desde Cloudinary

Las imágenes de demo por defecto vienen de la carpeta public del frontend.

---

## Códigos QR

Cada equipo tiene un código QR que enlaza a una página pública. Desde ahí se puede:

- Ver detalles del equipo
- Ver estado
- Ver historial de mantenimiento
- Loguearse si tienes cuenta

Útil para inspecciones rápidas o checks de mantenimiento.

---

## Logs de actividad

El sistema registra:

- Equipos creados, modificados, eliminados
- Mantenimiento agregado, editado, eliminado
- Usuarios creados, modificados, eliminados

Solo admins pueden ver los logs.

---

## Seguridad

Sigo estas prácticas en la app:

- Variables de entorno sensibles excluidas del repositorio
- CORS restringido a orígenes específicos en producción
- Tokens JWT que expiran después de 24 horas
- Contraseñas hasheadas con bcryptjs
- Errores en producción sin detalles sensibles
- Validación de todos los inputs
- TypeScript strict mode habilitado
- Tokens guardados en sessionStorage en lugar de localStorage

---

## Deployment

Recomendado: Frontend en Vercel, backend en Render, BD en MongoDB Atlas, imágenes en Cloudinary.

**Frontend en Vercel**

```
Root directory: client
Build command: npm run build
Output directory: dist
```

Variable de entorno:
```
VITE_API_URL=https://your-backend-url.com
```

**Backend en Render**

```
Root directory: server
Build command: npm install --include=dev && npm run build
Start command: npm start
```

Variables de entorno:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Contribuir

Si quieres contribuir:

1. Fork el repo
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Mejoras futuras

- Optimización de imágenes con Cloudinary
- Tests automatizados
- Reset de contraseña
- Notificaciones por email
- Fechas de vencimiento y reminders de mantenimiento
- Analytics avanzado en dashboard
- Templates para imprimir etiquetas QR
- Exportar logs en PDF o CSV
- Mejorar configuración de deployment
- Paginación para listas grandes

---

## License

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## Estado actual

Migrado completamente a TypeScript en frontend y backend. Todo funciona:

- Autenticación
- Roles y permisos
- CRUD de equipos
- Subida de imágenes a Cloudinary
- CRUD de mantenimiento
- Páginas públicas de QR
- Logs de actividad
- Gestión de usuarios
- Builds sin errores
- Responsive en desktop y móvil

---

## Autor

Desarrollado por Sergio Ripetti como proyecto full-stack para portfolio.

Contacto: https://github.com/sergio-ripetti
