import type { Machine, Maintenance } from "../types";

// Filters machines by search text and selected status.
// Used in Equipment List.
export function filterMachines(
  machines: Machine[],
  search: string,
  statusFilter: string,
): Machine[] {
  const searchValue = search.trim().toLowerCase();

  return machines.filter((machine) => {
    const matchesSearch =
      !searchValue ||
      machine.name?.toLowerCase().includes(searchValue) ||
      machine.machineCode?.toLowerCase().includes(searchValue) ||
      machine.brand?.toLowerCase().includes(searchValue) ||
      machine.model?.toLowerCase().includes(searchValue) ||
      machine.serialNumber?.toLowerCase().includes(searchValue) ||
      machine.location?.toLowerCase().includes(searchValue) ||
      machine.status?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || machine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}

// Filters machines only by search text.
// Used in Home search.
export function filterMachinesBySearch(
  machines: Machine[],
  search: string,
): Machine[] {
  const searchValue = search.trim().toLowerCase();

  if (!searchValue) {
    return [];
  }

  return machines.filter((machine) => {
    return (
      machine.name?.toLowerCase().includes(searchValue) ||
      machine.machineCode?.toLowerCase().includes(searchValue) ||
      machine.brand?.toLowerCase().includes(searchValue) ||
      machine.model?.toLowerCase().includes(searchValue) ||
      machine.serialNumber?.toLowerCase().includes(searchValue) ||
      machine.location?.toLowerCase().includes(searchValue) ||
      machine.status?.toLowerCase().includes(searchValue)
    );
  });
}

// Gets the latest maintenance record from one machine.
// Used in SearchResultCard.
export function getLastMaintenance(machine: Machine): Maintenance | null {
  const maintenanceHistory = machine.maintenanceHistory || [];

  if (maintenanceHistory.length === 0) {
    return null;
  }

  return [...maintenanceHistory].sort(
    (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
  )[0];
}
