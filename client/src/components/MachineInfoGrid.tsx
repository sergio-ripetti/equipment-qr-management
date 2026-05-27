import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/formatDate";

import type { Machine } from "../types";

type InfoCardProps = {
  label: string;
  value?: string | null;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="font-semibold text-gray-800 mt-1">
        {value || "Not specified"}
      </p>
    </div>
  );
}

type MachineInfoGridProps = {
  machine: Machine;
};

export default function MachineInfoGrid({ machine }: MachineInfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <InfoCard
        label="Machine code"
        value={machine.machineCode || machine.id}
      />

      <InfoCard label="Brand" value={machine.brand} />

      <InfoCard label="Model" value={machine.model} />

      <InfoCard label="Serial number" value={machine.serialNumber} />

      <InfoCard
        label="Purchase date"
        value={formatDate(machine.purchaseDate)}
      />

      <InfoCard label="Location" value={machine.location} />

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-sm text-gray-500">Status</p>

        <div className="mt-2">
          <StatusBadge status={machine.status} />
        </div>
      </div>

      <InfoCard label="Description" value={machine.description} />
    </div>
  );
}
