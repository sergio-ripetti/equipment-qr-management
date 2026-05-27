import type { Maintenance } from "../types";
import type { MachineFormData } from "../constants/machineFormInitialState";

export type MaintenanceValidationErrors = Partial<
  Record<keyof Maintenance, string>
>;

export type MachineValidationErrors = Partial<
  Record<keyof MachineFormData, string>
>;

export function validateMaintenanceForm(
  maintenance: Maintenance,
): MaintenanceValidationErrors {
  const errors: MaintenanceValidationErrors = {};

  if (!maintenance.date.trim()) {
    errors.date = "Maintenance date is required.";
  }

  if (!maintenance.company.trim()) {
    errors.company = "Company name is required.";
  }

  if (!maintenance.description.trim()) {
    errors.description = "Maintenance description is required.";
  }

  return errors;
}

export function validateMachineForm(
  machine: MachineFormData,
): MachineValidationErrors {
  const errors: MachineValidationErrors = {};

  if (!machine.name.trim()) {
    errors.name = "Machine name is required.";
  }

  if (!machine.purchaseDate.trim()) {
    errors.purchaseDate = "Purchase date is required.";
  }

  return errors;
}

export function hasValidationErrors(
  errors: MaintenanceValidationErrors | MachineValidationErrors,
): boolean {
  return Object.keys(errors).length > 0;
}
