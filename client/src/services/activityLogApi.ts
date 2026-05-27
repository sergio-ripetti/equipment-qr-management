import { getSavedToken } from "../utils/authStorage";
import type { ActivityLog } from "../types";

const API_URL = `${import.meta.env.VITE_API_URL}/api/activity-logs`;

// Gets activity logs from the backend
export async function getActivityLogs(): Promise<ActivityLog[]> {
  const token = getSavedToken();

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error fetching activity logs. Status: ${response.status}`,
    );
  }

  return response.json();
}
