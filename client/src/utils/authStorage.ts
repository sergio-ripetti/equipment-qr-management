import type { AuthUser } from "../types";

const AUTH_STORAGE_KEY = "kitchenEquipmentUser";

// Saves logged user data in localStorage
export function saveUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

// Gets logged user data from localStorage
export function getSavedUser(): AuthUser | null {
  const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    removeSavedUser();
    return null;
  }
}

// Removes logged user data from localStorage
export function removeSavedUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// Gets token from saved user
export function getSavedToken(): string | null {
  const user = getSavedUser();

  return user?.token || null;
}
