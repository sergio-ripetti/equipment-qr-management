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
  } else if (maintenance.company.trim().length < 2) {
    errors.company = "Company name must contain at least 2 characters.";
  } else if (maintenance.company.trim().length > 100) {
    errors.company = "Company name cannot exceed 100 characters.";
  }

  if (!maintenance.description.trim()) {
    errors.description = "Maintenance description is required.";
  } else if (maintenance.description.trim().length < 5) {
    errors.description = "Description must contain at least 5 characters.";
  } else if (maintenance.description.trim().length > 1000) {
    errors.description = "Description cannot exceed 1000 characters.";
  }

  return errors;
}

export function validateMachineForm(
  machine: MachineFormData,
): MachineValidationErrors {
  const errors: MachineValidationErrors = {};

  if (!machine.name.trim()) {
    errors.name = "Equipment name is required.";
  } else if (machine.name.trim().length < 2) {
    errors.name = "Equipment name must contain at least 2 characters.";
  } else if (machine.name.trim().length > 100) {
    errors.name = "Equipment name cannot exceed 100 characters.";
  }

  if (machine.brand && machine.brand.trim()) {
    if (machine.brand.trim().length > 60) {
      errors.brand = "Brand cannot exceed 60 characters.";
    }
  }

  if (machine.model && machine.model.trim()) {
    if (machine.model.trim().length > 60) {
      errors.model = "Model cannot exceed 60 characters.";
    }
  }

  if (machine.serialNumber && machine.serialNumber.trim()) {
    if (machine.serialNumber.trim().length > 80) {
      errors.serialNumber = "Serial number cannot exceed 80 characters.";
    }
  }

  if (!machine.purchaseDate.trim()) {
    errors.purchaseDate = "Purchase date is required.";
  }

  if (machine.location && machine.location.trim()) {
    if (machine.location.trim().length < 2) {
      errors.location = "Location must contain at least 2 characters.";
    } else if (machine.location.trim().length > 100) {
      errors.location = "Location cannot exceed 100 characters.";
    }
  }

  if (machine.description && machine.description.trim()) {
    if (machine.description.trim().length > 500) {
      errors.description = "Description cannot exceed 500 characters.";
    }
  }

  return errors;
}

export function hasValidationErrors(
  errors: MaintenanceValidationErrors | MachineValidationErrors,
): boolean {
  return Object.keys(errors).length > 0;
}
