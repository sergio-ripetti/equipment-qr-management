import type { ComponentType } from "react";

type DashboardCardProps = {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
};

export default function DashboardCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: DashboardCardProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{label}</p>

          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
