import { MACHINE_STATUS } from "./machineStatus";
import type { Machine } from "../types";

export type MachineFormData = {
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  location: string;
  status: Machine["status"];
  description: string;
  imageUrl: string;
};

export const MACHINE_FORM_INITIAL_STATE: MachineFormData = {
  name: "",
  brand: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  location: "",
  status: MACHINE_STATUS.ACTIVE,
  description: "",
  imageUrl: "",
};
