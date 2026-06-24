# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Summary

Equipment QR Management App — a full-stack TypeScript application for tracking equipment records, maintenance history, QR codes, and user roles. Frontend deployed on Vercel, backend on Render, MongoDB for storage, Cloudinary for images.

---

## Development Commands

### Frontend (client folder)

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### Backend (server folder)

```bash
npm run dev          # Start with Nodemon + ts-node
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run seed         # Import demo equipment data
npm run destroy      # Delete equipment data
```

---

## Stack & Key Technologies

**Frontend:** React 19, TypeScript, Vite, React Router DOM v7, Tailwind CSS 4, Heroicons, qrcode.react

**Backend:** Node.js, Express 5, TypeScript, MongoDB + Mongoose, JWT auth, bcryptjs, Multer, Cloudinary

**Database:** MongoDB Atlas (connection via `MONGO_URI` in `server/.env`)

**Image Storage:** Cloudinary (requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

---

## Project Structure

```
client/src/
├── components/       # Reusable UI components (Navbar, DashboardCard, etc.)
├── pages/           # Route pages (Dashboard, MachineList, Login, etc.)
├── services/        # API calls (authApi, machineApi, userApi, activityLogApi)
├── utils/           # Helpers (formatDate, permissionHelpers, dashboardHelpers, etc.)
├── constants/       # Role definitions, machine status, form initial state
├── types/           # TypeScript interfaces
├── hooks/           # Custom hooks (useMachineForm)
├── App.tsx          # Main router setup
└── main.tsx         # Entry point

server/src/
├── controllers/     # Route logic for auth, machines, maintenance, users, activity logs
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
├── middleware/      # Auth middleware, error handling
├── utils/           # Helpers
├── config/          # Database, Cloudinary config
├── index.ts         # Express app setup
└── seed.ts          # Demo data seeder
```

---

## Authentication & Roles

**JWT flow:** Login stores token in localStorage via `getSavedUser()` / `removeSavedUser()` (see `utils/authStorage.ts`).

**Permission helpers** in `utils/permissionHelpers.ts`:
- `canAccessPrivateApp()` — checks if user is Admin, Technician, or Viewer
- `canCreateEquipment()` — Admin only
- `canAccessAdminTools()` — Admin only

**Roles:**
- **Admin**: Full access (CRUD equipment, manage users, view activity logs)
- **Technician**: View & maintain equipment, cannot edit equipment details or manage users
- **Viewer**: Read-only access
- **Public**: No auth needed for QR detail pages

Routes are protected by `<RoleRoute>` wrapper in `App.tsx`.

---

## Navbar / Navigation Component

**Location:** `client/src/components/Navbar.tsx`

**Current behavior:**
- Desktop (lg breakpoint): Horizontal navbar with links across the top
- Mobile/Tablet (<lg): Hamburger menu (Bars3Icon) that expands vertically below the navbar, still appearing as a dropdown menu
- Uses Tailwind breakpoints: `hidden lg:flex` for desktop, `lg:hidden` for mobile collapse
- Styling: Gradient background (slate-950 → blue-950 → indigo-900), white text, semi-transparent hover states

**Key classes:**
- `sticky top-0 z-40` — stays at top
- `lg:flex` and `hidden` — responsiveness
- `navLinkClass` function handles active/inactive link styling

**User info display:**
- Desktop: User name + role in rounded pill, separate logout button
- Mobile: Compact row with user name, role, and logout button

---

## API Routes Overview

**Auth:** `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/profile`

**Equipment (machines):** `GET /api/machines`, `GET /api/machines/:id`, `POST /api/machines`, `PUT /api/machines/:id`, `DELETE /api/machines/:id`

**Maintenance:** `POST /api/machines/:id/maintenance`, `PUT /api/machines/:id/maintenance/:maintenanceIndex`, `DELETE /api/machines/:id/maintenance/:maintenanceIndex`

**Users:** `GET /api/users`, `POST /api/users`, `PUT /api/users/:id/role`, `DELETE /api/users/:id`

**Activity Logs:** `GET /api/activity-logs`

---

## Image Upload Flow

1. User selects image in component (e.g., MachineForm)
2. Frontend sends FormData to backend
3. Backend receives with Multer (memory storage)
4. Backend uploads to Cloudinary
5. MongoDB stores Cloudinary secure URL
6. Frontend displays from Cloudinary

Default demo images served from `client/public/` (fallback if no custom image).

---

## Environment Setup

**Frontend** (`client/.env`):
```
VITE_API_URL=http://localhost:5000  (local dev)
```

**Backend** (`server/.env`):
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secure_secret_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Common Workflows

**Add a new route:**
1. Create page in `client/src/pages/`
2. Add `<Route>` in `App.tsx`
3. Wrap with `<RoleRoute>` if protected
4. Add NavLink in `Navbar.tsx` (both desktop & mobile sections)

**Add a new permission check:**
1. Create helper in `utils/permissionHelpers.ts`
2. Import in components that need it
3. Use in conditional rendering (e.g., `{canAccessAdminTools(user) && <Link>}`)

**Create a new API endpoint:**
1. Define Mongoose model in `server/src/models/`
2. Create controller in `server/src/controllers/`
3. Add routes in `server/src/routes/`
4. Add service/API call in `client/src/services/`

---

## Notes

- The frontend uses **Tailwind CSS 4** with the `@tailwindcss/vite` plugin (no separate config file needed)
- TypeScript strict mode enabled on both frontend and backend
- Public QR pages use `PublicNavbar.tsx` (simpler navbar without full menu)
- Activity logging happens on important backend actions (equipment CRUD, maintenance changes, user management)
- Main branch is production-ready; features should be developed on branches and tested before merge
