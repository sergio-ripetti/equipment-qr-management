import QRCodeBox from "./QRCodeBox";
import ActionButton from "./ActionButton";

import { formatDate } from "../utils/formatDate";
import { getLastMaintenance } from "../utils/machineHelpers";
import { getMachineImageUrl } from "../utils/imageHelpers";

import type { Machine } from "../types";

type SearchResultCardProps = {
  machine: Machine;
};

export default function SearchResultCard({ machine }: SearchResultCardProps) {
  const lastMaintenance = getLastMaintenance(machine);
  const machineId = machine._id || machine.id || "";
  const machineCode = machine.machineCode || machine.id || "Not available";

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center border border-gray-100 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition gap-4">
      {/* Machine image */}
      <img
        src={getMachineImageUrl(machine.imageUrl)}
        alt={machine.name}
        className="w-28 h-28 object-cover rounded-lg mx-auto sm:mx-0"
      />

      {/* Machine information */}
      <div className="flex-1 px-2 text-center sm:text-left">
        <h2 className="text-xl font-bold text-gray-800">{machine.name}</h2>

        <p className="text-sm text-gray-500 mt-1">Code: {machineCode}</p>

        <p className="text-sm text-gray-500 mt-1">
          Last maintenance date:{" "}
          {lastMaintenance
            ? formatDate(lastMaintenance.date)
            : "No maintenance records"}
        </p>
      </div>

      {/* QR code and action button */}
      <div className="flex flex-col items-center sm:items-end gap-2">
        <QRCodeBox
          machineId={machineId}
          displayId={machineCode}
          size={80}
          showId={false}
        />

        <ActionButton to={`/machine/${machineId}`} variant="primary">
          View details
        </ActionButton>
      </div>
    </div>
  );
}
