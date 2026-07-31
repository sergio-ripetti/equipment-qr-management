export interface DemoAccount {
  key: string;
  role: string;
  description: string;
  email: string;
  password: string;
  colorClass: string;
  accentColor: string;
}

export const demoCredentials: DemoAccount[] = [
  {
    key: "administrator",
    role: "Administrator",
    description: "Full access to all features, user management and activity logs.",
    email: "demo.admin@ripeqr.app",
    password: "RipeAdmin26!",
    colorClass: "text-blue-600",
    accentColor: "bg-blue-50",
  },
  {
    key: "technician",
    role: "Technician",
    description: "Can manage maintenance records but cannot create or delete equipment.",
    email: "demo.tech@ripeqr.app",
    password: "RipeTech26!!",
    colorClass: "text-blue-700",
    accentColor: "bg-blue-100",
  },
  {
    key: "viewer",
    role: "Viewer",
    description: "Read-only access to equipment and maintenance history.",
    email: "demo.viewer@ripeqr.app",
    password: "RipeView26!!",
    colorClass: "text-cyan-600",
    accentColor: "bg-cyan-50",
  },
];
