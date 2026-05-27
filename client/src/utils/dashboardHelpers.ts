import { MACHINE_STATUS } from "../constants/machineStatus";
import type { Machine, MaintenanceWithMachine } from "../types";

// Counts how many machines exist in each status
export function getDashboardStats(machines: Machine[]) {
  const totalEquipment = machines.length;

  const activeEquipment = machines.filter(
    (machine) => machine.status === MACHINE_STATUS.ACTIVE,
  ).length;

  const underMaintenance = machines.filter(
    (machine) => machine.status === MACHINE_STATUS.UNDER_MAINTENANCE,
  ).length;

  const outOfService = machines.filter(
    (machine) => machine.status === MACHINE_STATUS.OUT_OF_SERVICE,
  ).length;

  const totalMaintenanceRecords = machines.reduce((total, machine) => {
    return total + (machine.maintenanceHistory?.length || 0);
  }, 0);

  const allMaintenanceDates = machines.flatMap((machine) =>
    (machine.maintenanceHistory || []).map((maintenance) => maintenance.date),
  );

  const lastMaintenanceDate =
    allMaintenanceDates.length > 0
      ? allMaintenanceDates.sort(
          (a, b) => Number(new Date(b)) - Number(new Date(a)),
        )[0]
      : null;

  return {
    totalEquipment,
    activeEquipment,
    underMaintenance,
    outOfService,
    totalMaintenanceRecords,
    lastMaintenanceDate,
  };
}

// Gets all maintenance records from all machines and sorts them by newest date
export function getRecentMaintenance(
  machines: Machine[],
  limit = 5,
): MaintenanceWithMachine[] {
  const allMaintenanceRecords = machines.flatMap((machine) =>
    (machine.maintenanceHistory || []).map((maintenance) => ({
      ...maintenance,
      machineName: machine.name,
      machineId: machine._id || machine.id || "",
      machineCode: machine.machineCode || machine.id,
    })),
  );

  return allMaintenanceRecords
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .slice(0, limit);
}

// Gets machines that need attention
export function getMachinesNeedingAttention(
  machines: Machine[],
  limit = 5,
): Machine[] {
  return machines
    .filter(
      (machine) =>
        machine.status === MACHINE_STATUS.UNDER_MAINTENANCE ||
        machine.status === MACHINE_STATUS.OUT_OF_SERVICE ||
        !machine.maintenanceHistory ||
        machine.maintenanceHistory.length === 0,
    )
    .slice(0, limit);
}
