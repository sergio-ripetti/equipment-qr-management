import type { MachineStatus } from "../types";

export const MACHINE_STATUS = {
  ACTIVE: "Active",
  UNDER_MAINTENANCE: "Under maintenance",
  OUT_OF_SERVICE: "Out of service",
} as const satisfies Record<string, MachineStatus>;

export const MACHINE_STATUS_OPTIONS: MachineStatus[] = [
  MACHINE_STATUS.ACTIVE,
  MACHINE_STATUS.UNDER_MAINTENANCE,
  MACHINE_STATUS.OUT_OF_SERVICE,
];
