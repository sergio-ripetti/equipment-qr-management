import { MACHINE_STATUS } from "../constants/machineStatus";
import { getMachineImageUrl } from "./imageHelpers";
import type { Machine } from "../types";
import type { MachineFormData } from "../constants/machineFormInitialState";

export function getMachineFormData(machine: Machine): MachineFormData {
  return {
    name: machine.name || "",
    brand: machine.brand || "",
    model: machine.model || "",
    serialNumber: machine.serialNumber || "",
    purchaseDate: machine.purchaseDate || "",
    location: machine.location || "",
    status: machine.status || MACHINE_STATUS.ACTIVE,
    description: machine.description || "",
    imageUrl: machine.imageUrl || "",
  };
}

export function getMachineImagePreview(machine: Machine): string | null {
  return machine.imageUrl ? getMachineImageUrl(machine.imageUrl) : null;
}
