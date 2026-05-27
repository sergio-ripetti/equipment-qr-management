import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";

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
        <h1 className="text-3xl font-bold text-gray-800">{machine.name}</h1>

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

        {canDelete && (
          <ActionButton
            variant="danger"
            onClick={onDeleteMachine}
            fullWidthMobile={true}>
            Delete Equipment
          </ActionButton>
        )}
      </div>
    </div>
  );
}
