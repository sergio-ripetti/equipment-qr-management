# Equipment QR Management App

Full-stack equipment management system built for tracking equipment records, maintenance history, QR codes, user roles, and activity logs.

This project was designed as a practical solution for businesses that need quick access to equipment information and maintenance records during inspections, audits, or daily operations. Instead of searching through paper records, spreadsheets, or folders, each equipment item can be accessed through a QR code and managed from a central system.

The application was built as a portfolio-ready full-stack project using React, TypeScript, Node.js, Express, MongoDB, JWT authentication, image uploads, and role-based access control.

---

## Project Overview

Equipment QR Management App allows a business to register equipment, upload images, generate QR codes, track maintenance records, and control access depending on the user role.

Each equipment item has a private detail page for logged-in users and a public QR page that can be scanned to view read-only equipment information and maintenance history.

This app was inspired by a real-world need to keep equipment maintenance records organized and easy to access when required.

---

## Main Features

- Full-stack TypeScript application
- Equipment CRUD
- QR code generation for each equipment item
- Public QR equipment detail page
- Image upload with preview and validation
- Maintenance history tracking
- Add, edit, and delete maintenance records
- JWT authentication
- Role-based access control
- Admin, technician, and viewer roles
- Activity log for important system actions
- User management for admin users
- Dashboard with equipment and maintenance overview
- Responsive UI for desktop and mobile
- MongoDB Atlas database integration

---

## User Roles and Permissions

### Admin

Admin users have full access to the system.

Admin can:

- View dashboard
- Search equipment
- View equipment list
- Create equipment
- Edit equipment
- Delete equipment
- Add maintenance records
- Edit maintenance records
- Delete maintenance records
- Download and print QR codes
- Manage users
- View activity logs

### Technician

Technician users can work with maintenance records but cannot manage equipment details or users.

Technician can:

- View dashboard
- Search equipment
- View equipment list
- View equipment details
- Add maintenance records
- Edit maintenance records
- Download and print QR codes

Technician cannot:

- Create equipment
- Edit equipment details
- Delete equipment
- Delete maintenance records
- Manage users
- View activity logs

### Viewer

Viewer users have read-only access.

Viewer can:

- View dashboard
- Search equipment
- View equipment list
- View equipment details

Viewer cannot:

- Create equipment
- Edit equipment
- Delete equipment
- Add maintenance records
- Edit maintenance records
- Delete maintenance records
- Manage users
- View activity logs

### Public QR User

Public users can scan a QR code and access a public read-only equipment page.

Public users can:

- View public equipment information
- View public maintenance history
- Login from the public QR page if they have an account

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Heroicons
- qrcode.react

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- Multer
- CORS
- dotenv

### Database

- MongoDB Atlas

---

## Project Structure

```txt
equipment-qr-management-app
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
├── .gitignore
└── README.md
```

---

## Environment Variables

Environment variables are not included in the repository for security reasons.

You need to create environment files manually before running the project locally.

---

## Frontend Environment Variables

Create this file inside the `client` folder:

```txt
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

For production, replace it with the deployed backend URL:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Backend Environment Variables

Create this file inside the `server` folder:

```txt
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/equipment-db
JWT_SECRET=your_secure_secret_key
```

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/equipment-qr-management-app.git
cd equipment-qr-management-app
```

If your repository has a different name, use that folder name instead.

---

### 2. Install frontend dependencies

```bash
cd client
npm install
```

---

### 3. Install backend dependencies

Open a second terminal from the project root:

```bash
cd server
npm install
```

---

### 4. Create environment files

Create the frontend environment file:

```txt
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

Create the backend environment file:

```txt
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

### 5. Run the backend

From the `server` folder:

```bash
npm run dev
```

The backend should run on:

```txt
http://localhost:5000
```

You can test the API by opening:

```txt
http://localhost:5000
```

Expected response:

```txt
Ripe Deli Equipment API is running
```

Note: the response text can be changed to a more generic message if needed.

---

### 6. Run the frontend

From the `client` folder:

```bash
npm run dev
```

The frontend should run on:

```txt
http://localhost:5173
```

---

## Available Scripts

## Frontend Scripts

Run these commands from the `client` folder.

### Start development server

```bash
npm run dev
```

Starts the Vite development server.

### Build frontend

```bash
npm run build
```

Builds the frontend for production.

### Run ESLint

```bash
npm run lint
```

Runs ESLint.

### Run TypeScript type checking

```bash
npm run typecheck
```

Runs TypeScript type checking without generating files.

### Preview production build

```bash
npm run preview
```

Previews the production build locally.

---

## Backend Scripts

Run these commands from the `server` folder.

### Start development server

```bash
npm run dev
```

Starts the backend with Nodemon and ts-node.

### Build backend

```bash
npm run build
```

Compiles TypeScript into the `dist` folder.

### Start production build

```bash
npm start
```

Runs the compiled backend from:

```txt
dist/index.js
```

### Run TypeScript type checking

```bash
npm run typecheck
```

Runs TypeScript type checking without generating files.

### Run ESLint

```bash
npm run lint
```

Runs ESLint.

### Import demo data

```bash
npm run seed
```

Imports demo equipment data into MongoDB.

### Delete demo data

```bash
npm run destroy
```

Deletes equipment data from MongoDB.

---

## API Overview

Base URL for local development:

```txt
http://localhost:5000
```

---

## Auth Routes

```txt
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/profile
```

---

## Equipment Routes

```txt
GET    /api/machines
GET    /api/machines/:id
POST   /api/machines
PUT    /api/machines/:id
DELETE /api/machines/:id
```

---

## Maintenance Routes

```txt
POST   /api/machines/:id/maintenance
PUT    /api/machines/:id/maintenance/:maintenanceIndex
DELETE /api/machines/:id/maintenance/:maintenanceIndex
```

---

## User Routes

```txt
GET    /api/users
POST   /api/users
PUT    /api/users/:id/role
DELETE /api/users/:id
```

---

## Activity Log Routes

```txt
GET /api/activity-logs
```

---

## Image Uploads

This project currently uses local server storage for uploaded equipment images.

Uploaded images are saved in:

```txt
server/uploads
```

The app validates images before saving and currently limits image size from the frontend.

For a portfolio demo, local uploads are enough to demonstrate the feature.

For production, cloud image storage is recommended because many hosting platforms use temporary file systems. A future improvement would be replacing local uploads with Cloudinary, Amazon S3, or another persistent storage provider.

---

## QR Code Functionality

Each equipment item has a QR code that links to a public equipment detail page.

The public page allows users to view:

- Equipment details
- Status
- Maintenance history

Logged-in users can also open the private app from the public QR page.

This makes the system useful for quick access during inspections, maintenance checks, or daily operations.

---

## Activity Logs

The system records important actions, including:

- Equipment created
- Equipment updated
- Equipment deleted
- Maintenance added
- Maintenance updated
- Maintenance deleted
- User created
- User role updated
- User deleted

Activity logs are only available to admin users.

---

## Deployment Notes

Recommended deployment approach:

```txt
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
```

---

## Frontend Deployment

The frontend can be deployed using Vercel.

Recommended settings:

```txt
Root directory: client
Build command: npm run build
Output directory: dist
```

Required environment variable:

```env
VITE_API_URL=https://your-backend-url.com
```

---

## Backend Deployment

The backend can be deployed using Render.

Recommended settings:

```txt
Root directory: server
Build command: npm install && npm run build
Start command: npm start
```

Required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

---

## Notes About Image Storage in Production

The current version stores uploaded images locally in the backend server.

This is suitable for development and portfolio demonstration, but not ideal for production because uploaded files may not persist on some hosting platforms.

Recommended future production solution:

```txt
Cloudinary or Amazon S3
```

---

## Future Improvements

- Move image storage from local server uploads to Cloudinary or another cloud storage provider
- Add automated tests
- Add password reset functionality
- Add email notifications for maintenance reminders
- Add maintenance due dates and reminders
- Add advanced dashboard analytics
- Add QR label print templates
- Add export options for maintenance and activity logs
- Improve production deployment configuration
- Add pagination for large equipment and activity log lists

---

## Project Status

The application has been migrated from JavaScript to TypeScript on both frontend and backend.

Current status:

- Frontend TypeScript migration complete
- Backend TypeScript migration complete
- Authentication working
- Role-based access working
- Equipment CRUD working
- Image upload working
- Maintenance CRUD working
- Public QR pages working
- Activity logs working
- User management working
- Frontend and backend build successfully
- Responsive design working on desktop and mobile

---

## Author

Developed by Sergio Ripetti as a full-stack portfolio project.