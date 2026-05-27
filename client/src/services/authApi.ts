import type { AuthUser } from "../types";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: AuthUser["role"];
};

// Logs in a user and returns user data with token
export async function loginUser(loginData: LoginData): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Error logging in");
  }

  return response.json();
}

// Registers a new user and returns user data with token
export async function registerUser(userData: RegisterData): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Error registering user");
  }

  return response.json();
}

// Gets the current user profile using the saved token
export async function getUserProfile(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error getting user profile");
  }

  return response.json();
}
