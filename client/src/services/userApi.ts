import { getSavedToken } from "../utils/authStorage";
import type { AppUser, UserRole } from "../types";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

function getAuthHeaders(): HeadersInit {
  const token = getSavedToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Gets all users
export async function getUsers(): Promise<AppUser[]> {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || `Error fetching users. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Creates a new user
export async function createUser(userData: CreateUserData): Promise<AppUser> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || `Error creating user. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Updates a user role
export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<AppUser> {
  const response = await fetch(`${API_URL}/${userId}/role`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        `Error updating user role. Status: ${response.status}`,
    );
  }

  return response.json();
}

// Deletes a user
export async function deleteUser(userId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getSavedToken()}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || `Error deleting user. Status: ${response.status}`,
    );
  }

  return response.json();
}
