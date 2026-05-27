import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

import MaintenanceForm from "./MaintenanceForm";
import MaintenanceCard from "./MaintenanceCard";
import type { Maintenance } from "../types";

type MaintenanceErrors = Partial<Record<keyof Maintenance, string>>;

type MaintenanceSectionProps = {
  maintenanceList: Maintenance[];
  showForm: boolean;
  newMaintenance: Maintenance;
  maintenanceErrors: MaintenanceErrors;
  editIndex: number | null;
  editData: Maintenance;
  editMaintenanceErrors: MaintenanceErrors;
  canAddMaintenance: boolean;
  canEditMaintenance: boolean;
  canDeleteMaintenance: boolean;
  onToggleForm: () => void;
  onNewMaintenanceChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onAddMaintenance: () => void;
  onStartEdit: (index: number) => void;
  onEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteMaintenance: (index: number) => void;
};

export default function MaintenanceSection({
  maintenanceList,
  showForm,
  newMaintenance,
  maintenanceErrors,
  editIndex,
  editData,
  editMaintenanceErrors,
  canAddMaintenance,
  canEditMaintenance,
  canDeleteMaintenance,
  onToggleForm,
  onNewMaintenanceChange,
  onAddMaintenance,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteMaintenance,
}: MaintenanceSectionProps) {
  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-100 mt-8 p-5 sm:p-6">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Maintenance History
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Track repairs, services, inspections, and equipment changes.
          </p>
        </div>

        {canAddMaintenance && (
          <button
            type="button"
            onClick={onToggleForm}
            className={`px-4 py-2 flex items-center justify-center gap-2 rounded-lg text-white transition ${
              showForm
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {showForm ? (
              <>
                <XMarkIcon className="w-5 h-5" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                Add Maintenance
              </>
            )}
          </button>
        )}
      </div>

      {/* Add maintenance form */}
      {showForm && canAddMaintenance && (
        <MaintenanceForm
          newMaintenance={newMaintenance}
          errors={maintenanceErrors}
          onChange={onNewMaintenanceChange}
          onSubmit={onAddMaintenance}
        />
      )}

      {/* Maintenance list */}
      {maintenanceList.length > 0 ? (
        <ul className="space-y-4">
          {maintenanceList.map((maintenance, index) => (
            <MaintenanceCard
              key={`${maintenance.date}-${index}`}
              maintenance={maintenance}
              index={index}
              editIndex={editIndex}
              editData={editData}
              errors={editMaintenanceErrors}
              canEditMaintenance={canEditMaintenance}
              canDeleteMaintenance={canDeleteMaintenance}
              onStartEdit={onStartEdit}
              onEditChange={onEditChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDeleteMaintenance={onDeleteMaintenance}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No maintenance records yet.</p>
      )}
    </div>
  );
}
