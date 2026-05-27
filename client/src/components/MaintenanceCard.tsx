import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import { formatDate } from "../utils/formatDate";
import ActionButton from "./ActionButton";
import type { Maintenance } from "../types";

type MaintenanceErrors = Partial<Record<keyof Maintenance, string>>;

type MaintenanceCardProps = {
  maintenance: Maintenance;
  index: number;
  editIndex: number | null;
  editData: Maintenance;
  errors?: MaintenanceErrors;
  canEditMaintenance: boolean;
  canDeleteMaintenance: boolean;
  onStartEdit: (index: number) => void;
  onEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteMaintenance: (index: number) => void;
};

export default function MaintenanceCard({
  maintenance,
  index,
  editIndex,
  editData,
  errors = {},
  canEditMaintenance,
  canDeleteMaintenance,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteMaintenance,
}: MaintenanceCardProps) {
  const isEditing = editIndex === index;

  return (
    <li className="border border-gray-200 bg-white p-4 rounded-xl shadow-sm">
      {isEditing ? (
        <>
          {/* Edit maintenance date */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={editData.date}
              onChange={onEditChange}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.date
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />

            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Edit maintenance company */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>

            <input
              type="text"
              name="company"
              value={editData.company}
              onChange={onEditChange}
              placeholder="Company"
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.company
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />

            {errors.company && (
              <p className="text-sm text-red-600 mt-1">{errors.company}</p>
            )}
          </div>

          {/* Edit maintenance description */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={editData.description}
              onChange={onEditChange}
              rows={3}
              placeholder="Description"
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />

            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Edit actions */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <ActionButton
              variant="success"
              onClick={onSaveEdit}
              fullWidthMobile={true}>
              <CheckIcon className="w-4 h-4" />
              Save
            </ActionButton>

            <ActionButton
              variant="secondary"
              onClick={onCancelEdit}
              fullWidthMobile={true}>
              <XMarkIcon className="w-4 h-4" />
              Cancel
            </ActionButton>
          </div>
        </>
      ) : (
        <>
          {/* Maintenance information */}
          <div>
            <p className="text-sm text-gray-500">Maintenance date</p>

            <p className="font-semibold text-gray-800">
              {formatDate(maintenance.date)}
            </p>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Company:</span>{" "}
              {maintenance.company}
            </p>

            <p className="text-sm text-gray-700">
              <span className="font-semibold">Description:</span>{" "}
              {maintenance.description}
            </p>
          </div>

          {/* Maintenance actions */}
          {(canEditMaintenance || canDeleteMaintenance) && (
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              {canEditMaintenance && (
                <ActionButton
                  variant="warning"
                  onClick={() => onStartEdit(index)}
                  fullWidthMobile={true}>
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </ActionButton>
              )}

              {canDeleteMaintenance && (
                <ActionButton
                  variant="danger"
                  onClick={() => onDeleteMaintenance(index)}
                  fullWidthMobile={true}>
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </ActionButton>
              )}
            </div>
          )}
        </>
      )}
    </li>
  );
}
