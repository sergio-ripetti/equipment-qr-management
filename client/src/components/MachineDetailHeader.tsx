import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";
import ProtectedDeleteButton from "./ProtectedDeleteButton";

import type { Machine } from "../types";

type MachineDetailHeaderProps = {
  machine: Machine;
  canEdit: boolean;
  canDelete: boolean;
  onDeleteMachine: () => void;
};

export default function MachineDetailHeader({
  machine,
  canEdit,
  canDelete,
  onDeleteMachine,
}: MachineDetailHeaderProps) {
  const machineId = machine._id || machine.id || "";

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
      {/* Machine title and subtitle */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800">{machine.name}</h1>
          {machine.isDemoRecord && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
              Demo Equipment
            </span>
          )}
        </div>

        <p className="text-gray-500 mt-2">
          Equipment details, QR code, and maintenance history.
        </p>
      </div>

      {/* Status and actions */}
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center text-center gap-3">
        <div className="flex justify-center w-full">
          <StatusBadge status={machine.status} />
        </div>

        {canEdit && (
          <ActionButton
            to={`/machine/${machineId}/edit`}
            variant="warning"
            fullWidthMobile={true}>
            Edit Equipment
          </ActionButton>
        )}

        {canDelete && !machine.isDemoRecord && (
          <ActionButton
            variant="danger"
            onClick={onDeleteMachine}
            fullWidthMobile={true}>
            Delete Equipment
          </ActionButton>
        )}

        {machine.isDemoRecord && <ProtectedDeleteButton />}
      </div>
    </div>
  );
}
