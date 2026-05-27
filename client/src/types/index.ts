export type MachineStatus = "Active" | "Under maintenance" | "Out of service";

export type UserRole = "admin" | "technician" | "viewer";

export interface Maintenance {
  date: string;
  company: string;
  description: string;
}

export interface Machine {
  _id: string;
  id?: string;
  name: string;
  machineCode?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate: string;
  location?: string;
  status: MachineStatus;
  description?: string;
  imageUrl?: string;
  maintenanceHistory?: Maintenance[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityLog {
  _id: string;
  user?: string | null;
  userName: string;
  userRole: UserRole | "system";
  action: string;
  entityType: "machine" | "maintenance" | "auth" | "user";
  entityId?: string;
  machineCode?: string;
  machineName?: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MaintenanceWithMachine extends Maintenance {
  machineName: string;
  machineId: string;
  machineCode?: string;
}
