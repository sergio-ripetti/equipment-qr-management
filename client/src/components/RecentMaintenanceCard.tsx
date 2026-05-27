import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

import { formatDate } from "../utils/formatDate";
import ActionButton from "./ActionButton";

import type { MaintenanceWithMachine } from "../types";

type RecentMaintenanceCardProps = {
  maintenance: MaintenanceWithMachine;
};

export default function RecentMaintenanceCard({
  maintenance,
}: RecentMaintenanceCardProps) {
  return (
    <div className="border border-gray-100 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Maintenance information */}
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <WrenchScrewdriverIcon className="w-5 h-5" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              {maintenance.machineName}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Code: {maintenance.machineCode || "Not available"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Date: {formatDate(maintenance.date)}
            </p>

            <p className="text-sm text-gray-700 mt-2">
              <span className="font-semibold">Company:</span>{" "}
              {maintenance.company || "Not specified"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Description:</span>{" "}
              {maintenance.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="lg:pt-1">
          <ActionButton
            to={`/machine/${maintenance.machineId}`}
            variant="primary"
            fullWidthMobile={true}>
            View machine
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
