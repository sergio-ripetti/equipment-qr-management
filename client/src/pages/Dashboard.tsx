import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import PageHeader from "../components/PageHeader";
import DashboardCard from "../components/DashboardCard";
import RecentMaintenanceCard from "../components/RecentMaintenanceCard";
import StatusBadge from "../components/StatusBadge";
import ActionButton from "../components/ActionButton";

import { getMachines } from "../services/machineApi";
import { formatDate } from "../utils/formatDate";
import {
  getDashboardStats,
  getRecentMaintenance,
  getMachinesNeedingAttention,
} from "../utils/dashboardHelpers";

import type { Machine } from "../types";

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Loads machines from MongoDB through the backend API
  useEffect(() => {
    const loadMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
      } catch (error) {
        console.error(error);
        setError("Could not load dashboard data from the server.");
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  // Gets the summary numbers for the dashboard cards
  const {
    totalEquipment,
    activeEquipment,
    underMaintenance,
    outOfService,
    totalMaintenanceRecords,
    lastMaintenanceDate,
  } = getDashboardStats(machines);

  // Gets the latest maintenance records across all machines
  const recentMaintenance = getRecentMaintenance(machines, 5);

  // Gets machines that require attention
  const machinesNeedingAttention = getMachinesNeedingAttention(machines, 5);

  if (loading) {
    return (
      <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
        <p className="text-gray-500">Loading dashboard...</p>
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
        title="Dashboard"
        description="Overview of your registered Ripe Deli equipment and recent maintenance."
      />

      {/* Dashboard summary */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 sm:p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Summary</h2>

        <p className="text-gray-500 text-sm mt-2">
          You currently have {totalEquipment} registered equipment items,{" "}
          {activeEquipment} active, {underMaintenance} under maintenance, and{" "}
          {outOfService} out of service.
        </p>

        <p className="text-gray-500 text-sm mt-1">
          The system has recorded {totalMaintenanceRecords} maintenance records
          so far.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard
          label="Total equipment"
          value={totalEquipment}
          icon={WrenchScrewdriverIcon}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />

        <DashboardCard
          label="Active"
          value={activeEquipment}
          icon={CheckCircleIcon}
          iconBg="bg-green-100"
          iconColor="text-green-700"
        />

        <DashboardCard
          label="Under maintenance"
          value={underMaintenance}
          icon={ExclamationTriangleIcon}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-700"
        />

        <DashboardCard
          label="Out of service"
          value={outOfService}
          icon={XCircleIcon}
          iconBg="bg-red-100"
          iconColor="text-red-700"
        />
      </div>

      {/* Extra metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <DashboardCard
          label="Maintenance records"
          value={totalMaintenanceRecords}
          icon={ClipboardDocumentListIcon}
          iconBg="bg-purple-100"
          iconColor="text-purple-700"
        />

        <DashboardCard
          label="Last maintenance"
          value={
            lastMaintenanceDate ? formatDate(lastMaintenanceDate) : "No records"
          }
          icon={ClockIcon}
          iconBg="bg-gray-100"
          iconColor="text-gray-700"
        />
      </div>

      {/* Needs attention section */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Needs Attention
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Equipment that is under maintenance, out of service, or has no
              maintenance records.
            </p>
          </div>

          <ActionButton to="/machines" variant="primary" fullWidthMobile={true}>
            View equipment
          </ActionButton>
        </div>

        {machinesNeedingAttention.length > 0 ? (
          <div className="space-y-3">
            {machinesNeedingAttention.map((machine) => {
              const machineId = machine._id || machine.id || "";

              return (
                <Link
                  key={machineId}
                  to={`/machine/${machineId}`}
                  className="block border border-gray-100 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {machine.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Code: {machine.machineCode || machine.id}
                      </p>

                      {(!machine.maintenanceHistory ||
                        machine.maintenanceHistory.length === 0) && (
                        <p className="text-sm text-yellow-700 mt-1">
                          No maintenance records yet
                        </p>
                      )}
                    </div>

                    <div className="flex justify-start sm:justify-end">
                      <StatusBadge status={machine.status} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No equipment needs attention right now.
          </p>
        )}
      </div>

      {/* Recent maintenance section */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Maintenance
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Latest maintenance records across all equipment.
            </p>
          </div>

          <ActionButton to="/machines" variant="primary" fullWidthMobile={true}>
            View equipment
          </ActionButton>
        </div>

        {recentMaintenance.length > 0 ? (
          <div className="space-y-3">
            {recentMaintenance.map((maintenance, index) => (
              <RecentMaintenanceCard
                key={`${maintenance.machineId}-${index}`}
                maintenance={maintenance}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No maintenance records found yet.
          </p>
        )}
      </div>
    </div>
  );
}
