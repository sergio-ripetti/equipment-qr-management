type MachineFiltersProps = {
  search: string;
  statusFilter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function MachineFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: MachineFiltersProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search equipment
          </label>

          <input
            type="text"
            value={search}
            onChange={onSearchChange}
            placeholder="Search by name, code, brand, model, location..."
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>

          <select
            value={statusFilter}
            onChange={onStatusChange}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Under maintenance">Under maintenance</option>
            <option value="Out of service">Out of service</option>
          </select>
        </div>
      </div>
    </div>
  );
}
