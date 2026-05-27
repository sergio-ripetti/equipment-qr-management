import type { MachineStatus } from "../types";

type StatusBadgeProps = {
  status?: MachineStatus | string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusClasses: Record<string, string> = {
    Active: "bg-green-100 text-green-700 border-green-200",
    "Under maintenance": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Out of service": "bg-red-100 text-red-700 border-red-200",
  };

  const currentStatus = status || "Unknown";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${
        statusClasses[currentStatus] ||
        "bg-gray-100 text-gray-700 border-gray-200"
      }`}>
      {currentStatus}
    </span>
  );
}
