import { getSavedToken } from "../utils/authStorage";
import type { Machine, Maintenance } from "../types";

const API_URL = `${import.meta.env.VITE_API_URL}/api/machines`;

function getAuthHeaders(): HeadersInit {
  const token = getSavedToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

// Gets all machines from the backend
export async function getMachines(): Promise<Machine[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error fetching machines");
  }

  return response.json();
}

// Gets one machine by MongoDB ID
export async function getMachineById(id: string): Promise<Machine> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Error fetching machine");
  }

  return response.json();
}

// Creates a new machine in the backend
export async function createMachine(machineData: FormData): Promise<Machine> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: machineData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error creating machine. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Updates an existing machine in the backend
export async function updateMachine(
  id: string,
  machineData: FormData,
): Promise<Machine> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: machineData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error updating machine. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Deletes a machine from the backend
export async function deleteMachine(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error deleting machine. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Adds a maintenance record to a machine
export async function addMaintenanceToMachine(
  id: string,
  maintenanceData: Maintenance,
): Promise<Machine> {
  const response = await fetch(`${API_URL}/${id}/maintenance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(maintenanceData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error adding maintenance. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Updates a maintenance record by index
export async function updateMaintenanceInMachine(
  id: string,
  maintenanceIndex: number,
  maintenanceData: Maintenance,
): Promise<Machine> {
  const response = await fetch(
    `${API_URL}/${id}/maintenance/${maintenanceIndex}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(maintenanceData),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error updating maintenance. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Deletes a maintenance record by index
export async function deleteMaintenanceFromMachine(
  id: string,
  maintenanceIndex: number,
): Promise<Machine> {
  const response = await fetch(
    `${API_URL}/${id}/maintenance/${maintenanceIndex}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error deleting maintenance. Status: ${response.status}`,
    );
  }

  return response.json();
}
