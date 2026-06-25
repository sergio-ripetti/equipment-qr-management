import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";

import { loginUser } from "../services/authApi";
import { saveUser } from "../utils/authStorage";

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Stores login form data
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Stores login error messages
  const [error, setError] = useState("");

  // Stores loading state while logging in
  const [isLoading, setIsLoading] = useState(false);

  // Updates login form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Handles login submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);

      const user = await loginUser(formData);

      saveUser(user);

      navigate(redirectPath);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      if (error instanceof Error) {
        setError(error.message || "Could not login. Please try again.");
      } else {
        setError("Could not login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[92%] max-w-md mx-auto mt-10 py-6">
      <PageHeader
        title="Login"
        description="Access the Ripe Deli Equipment management system."
      />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-gray-100 shadow-md rounded-xl p-5 sm:p-6 space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-medium text-gray-700 mb-1">
            Email
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@test.com"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <ActionButton
          type="submit"
          variant="primary"
          disabled={isLoading}
          fullWidthMobile={true}>
          {isLoading ? "Logging in..." : "Login"}
        </ActionButton>
      </form>
    </div>
  );
}
