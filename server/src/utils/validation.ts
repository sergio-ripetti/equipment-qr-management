import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
});

// Machine validation schemas
export const createMachineSchema = z.object({
  name: z
    .string()
    .min(2, 'Machine name is required')
    .max(100, 'Machine name must be less than 100 characters'),
  machineCode: z
    .string()
    .min(2, 'Machine code is required')
    .max(50, 'Machine code must be less than 50 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  imageUrl: z
    .string()
    .url('Invalid image URL')
    .optional()
});

export const updateMachineSchema = createMachineSchema.partial();

// User validation schemas
export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'technician', 'viewer'], {
    errorMap: () => ({ message: 'Invalid role' })
  })
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateMachineInput = z.infer<typeof createMachineSchema>;
export type UpdateMachineInput = z.infer<typeof updateMachineSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
