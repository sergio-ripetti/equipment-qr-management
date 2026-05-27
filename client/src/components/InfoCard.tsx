type InfoCardProps = {
  label: string;
  value?: string | number | null;
};

export default function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      {/* Small label */}
      <p className="text-sm text-gray-500">{label}</p>

      {/* Main value */}
      <p className="font-semibold text-gray-800 mt-1">
        {value || "Not registered"}
      </p>
    </div>
  );
}
