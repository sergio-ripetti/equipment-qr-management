import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import { getActivityLogs } from "../services/activityLogApi";
import { formatDate } from "../utils/formatDate";

import type { ActivityLog as ActivityLogType } from "../types";

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    MACHINE_CREATED: "Machine created",
    MACHINE_UPDATED: "Machine updated",
    MACHINE_DELETED: "Machine deleted",

    MAINTENANCE_ADDED: "Maintenance added",
    MAINTENANCE_UPDATED: "Maintenance updated",
    MAINTENANCE_DELETED: "Maintenance deleted",

    USER_CREATED: "User created",
    USER_ROLE_UPDATED: "User role updated",
    USER_DELETED: "User deleted",
  };

  return labels[action] || action;
}

function getActionBadgeClass(action: string): string {
  if (action.includes("CREATED") || action.includes("ADDED")) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (action.includes("UPDATED")) {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (action.includes("DELETED")) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-gray-100 text-gray-700 border-gray-200";
}

export default function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Loads activity logs from backend
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getActivityLogs();
        setLogs(data);
      } catch (error) {
        console.error(error);
        setError("Could not load activity logs.");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  // Gets unique actions from logs
  const actionOptions = useMemo(() => {
    const actions = logs.map((log) => log.action);
    return [...new Set(actions)];
  }, [logs]);

  // Gets unique roles from logs
  const roleOptions = useMemo(() => {
    const roles = logs.map((log) => log.userRole).filter(Boolean);
    return [...new Set(roles)];
  }, [logs]);

  // Filters logs by search, action, and role
  const filteredLogs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !searchValue ||
        log.description?.toLowerCase().includes(searchValue) ||
        log.userName?.toLowerCase().includes(searchValue) ||
        log.userRole?.toLowerCase().includes(searchValue) ||
        log.machineName?.toLowerCase().includes(searchValue) ||
        log.machineCode?.toLowerCase().includes(searchValue) ||
        log.action?.toLowerCase().includes(searchValue);

      const matchesAction =
        actionFilter === "all" || log.action === actionFilter;

      const matchesRole = roleFilter === "all" || log.userRole === roleFilter;

      return matchesSearch && matchesAction && matchesRole;
    });
  }, [logs, search, actionFilter, roleFilter]);

  // Clears all filters
  const handleClearFilters = () => {
    setSearch("");
    setActionFilter("all");
    setRoleFilter("all");
  };

  if (loading) {
    return (
      <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
        <p className="text-gray-500">Loading activity logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
      <PageHeader
        title="Activity Log"
        description="Track important actions made inside the equipment management system."
      />

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
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
              placeholder="Search by user, machine, code, action..."
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Action filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>

            <select
              value={actionFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setActionFilter(e.target.value)
              }
              className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All actions</option>

              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {getActionLabel(action)}
                </option>
              ))}
            </select>
          </div>

          {/* Role filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRoleFilter(e.target.value)
              }
              className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All roles</option>

              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <p className="text-sm text-gray-500">
            Showing {filteredLogs.length} of {logs.length} activity logs
          </p>

          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:underline text-left sm:text-right"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Activity list */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredLogs.map((log) => (
              <div key={log._id} className="p-5 hover:bg-gray-50 transition">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center border px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeClass(
                          log.action
                        )}`}
                      >
                        {getActionLabel(log.action)}
                      </span>

                      <span className="text-xs text-gray-500 capitalize">
                        {log.entityType}
                      </span>
                    </div>

                    <p className="font-semibold text-gray-800">
                      {log.description}
                    </p>

                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      <p>
                        <span className="font-medium text-gray-700">
                          Machine:
                        </span>{" "}
                        {log.machineName || "Not available"}{" "}
                        {log.machineCode && `(${log.machineCode})`}
                      </p>

                      <p>
                        <span className="font-medium text-gray-700">User:</span>{" "}
                        {log.userName}{" "}
                        <span className="capitalize">({log.userRole})</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 lg:text-right">
                    <p>{formatDate(log.createdAt)}</p>

                    <p className="text-xs mt-1">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm p-5">
            No activity logs match your filters.
          </p>
        )}
      </div>
    </div>
  );
}