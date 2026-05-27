import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";
import ConfirmModal from "../components/ConfirmModal";

import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "../services/userApi";

import { getSavedUser } from "../utils/authStorage";
import { USER_ROLES } from "../constants/userRoles";

import type { AppUser, UserRole } from "../types";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type ConfirmModalState = {
  isOpen: boolean;
  userId: string | null;
  userName: string;
};

const INITIAL_FORM: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: USER_ROLES.TECHNICIAN,
};

export default function UserManagement() {
  const currentUser = getSavedUser();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    userId: null,
    userName: "",
  });

  // Loads users from backend
  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Updates form state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccessMessage("");
  };

  // Creates a new user
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Name, email, and password are required.");
      return;
    }

    try {
      setIsSaving(true);

      const newUser = await createUser(formData);

      setUsers((prev) => [newUser, ...prev]);
      setFormData(INITIAL_FORM);
      setSuccessMessage("User created successfully.");
      setError("");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message || "Could not create user.");
      } else {
        setError("Could not create user.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Updates a user role
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const updatedUser = await updateUserRole(userId, newRole);

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? updatedUser : user))
      );

      setSuccessMessage("User role updated successfully.");
      setError("");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message || "Could not update user role.");
      } else {
        setError("Could not update user role.");
      }
    }
  };

  // Opens delete confirmation modal
  const handleOpenDeleteModal = (user: AppUser) => {
    setConfirmModal({
      isOpen: true,
      userId: user._id,
      userName: user.name,
    });
  };

  // Closes delete confirmation modal
  const handleCloseDeleteModal = () => {
    setConfirmModal({
      isOpen: false,
      userId: null,
      userName: "",
    });
  };

  // Deletes selected user
  const handleConfirmDelete = async () => {
    if (!confirmModal.userId) {
      return;
    }

    try {
      await deleteUser(confirmModal.userId);

      setUsers((prev) =>
        prev.filter((user) => user._id !== confirmModal.userId)
      );

      setSuccessMessage("User deleted successfully.");
      setError("");
      handleCloseDeleteModal();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message || "Could not delete user.");
      } else {
        setError("Could not delete user.");
      }

      handleCloseDeleteModal();
    }
  };

  // Filters users by search and role
  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.role?.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return (
      <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
      <PageHeader
        title="User Management"
        description="Create users, manage roles, and control access to the system."
      />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Create user form */}
      <form
        onSubmit={handleCreateUser}
        noValidate
        className="bg-white border border-gray-100 shadow-md rounded-xl p-5 sm:p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Create New User
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="User name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@test.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={USER_ROLES.ADMIN}>Admin</option>
              <option value={USER_ROLES.TECHNICIAN}>Technician</option>
              <option value={USER_ROLES.VIEWER}>Viewer</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <ActionButton
            type="submit"
            variant="primary"
            disabled={isSaving}
            fullWidthMobile={true}
          >
            {isSaving ? "Creating..." : "Create User"}
          </ActionButton>
        </div>
      </form>

      {/* Filters */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email, or role..."
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRoleFilter(e.target.value as UserRole | "all")
              }
              className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All roles</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
              <option value={USER_ROLES.TECHNICIAN}>Technician</option>
              <option value={USER_ROLES.VIEWER}>Viewer</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Users list */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => {
              const isCurrentUser = user._id === currentUser?._id;

              return (
                <div
                  key={user._id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>

                    <p className="text-sm text-gray-500">{user.email}</p>

                    {isCurrentUser && (
                      <p className="text-xs text-blue-600 mt-1">
                        Current logged user
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <select
                      value={user.role}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleRoleChange(user._id, e.target.value as UserRole)
                      }
                      disabled={isCurrentUser}
                      className="border border-gray-300 p-2 rounded-lg bg-white capitalize focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                    >
                      <option value={USER_ROLES.ADMIN}>Admin</option>
                      <option value={USER_ROLES.TECHNICIAN}>Technician</option>
                      <option value={USER_ROLES.VIEWER}>Viewer</option>
                    </select>

                    <ActionButton
                      variant="danger"
                      onClick={() => handleOpenDeleteModal(user)}
                      disabled={isCurrentUser}
                      fullWidthMobile={true}
                    >
                      Delete
                    </ActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm p-5">No users found.</p>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete user?"
        message={`User "${confirmModal.userName}" will be permanently deleted. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />
    </div>
  );
}