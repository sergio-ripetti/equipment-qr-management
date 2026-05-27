import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";

import { formatDate } from "../utils/formatDate";
import { getMachineImageUrl } from "../utils/imageHelpers";
import { getSavedUser } from "../utils/authStorage";
import { canEditEquipment } from "../utils/permissionHelpers";

import type { Machine } from "../types";

type MachineCardProps = {
  machine: Machine;
};

export default function MachineCard({ machine }: MachineCardProps) {
  const machineId = machine._id || machine.id || "";
  const machineCode = machine.machineCode || machine.id || "Not available";
  const user = getSavedUser();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Machine image */}
      <div className="w-full h-44 bg-gray-50 p-3 flex items-center justify-center">
        <img
          src={getMachineImageUrl(machine.imageUrl)}
          alt={machine.name}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* Machine information */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title and status */}
        <div className="flex items-start justify-between gap-3 mb-3 min-h-[56px]">
          <h2 className="text-lg font-bold text-gray-800 leading-snug line-clamp-2">
            {machine.name}
          </h2>

          <div className="shrink-0">
            <StatusBadge status={machine.status} />
          </div>
        </div>

        {/* Machine details */}
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Code:</span>{" "}
            {machineCode}
          </p>

          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Purchase date:</span>{" "}
            {formatDate(machine.purchaseDate)}
          </p>
        </div>

        {/* Card actions */}
        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <ActionButton to={`/machine/${machineId}`} variant="primary">
            View details
          </ActionButton>

          {canEditEquipment(user) && (
            <ActionButton to={`/machine/${machineId}/edit`} variant="warning">
              Edit
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
}
