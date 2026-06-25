import type { AuthUser } from "../types";

const AUTH_STORAGE_KEY = "kitchenEquipmentUser";

// Saves logged user data in sessionStorage
export function saveUser(user: AuthUser): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

// Gets logged user data from sessionStorage
export function getSavedUser(): AuthUser | null {
  const savedUser = sessionStorage.getItem(AUTH_STORAGE_KEY);

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

// Removes logged user data from sessionStorage
export function removeSavedUser(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

// Gets token from saved user
export function getSavedToken(): string | null {
  const user = getSavedUser();

  return user?.token || null;
}
