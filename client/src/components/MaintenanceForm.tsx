import { CheckIcon } from "@heroicons/react/24/solid";

import ActionButton from "./ActionButton";
import type { Maintenance } from "../types";

type MaintenanceErrors = Partial<Record<keyof Maintenance, string>>;

type MaintenanceFormProps = {
  newMaintenance: Maintenance;
  errors?: MaintenanceErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: () => void;
};

export default function MaintenanceForm({
  newMaintenance,
  errors = {},
  onChange,
  onSubmit,
}: MaintenanceFormProps) {
  return (
    <div className="mb-6 border border-gray-200 rounded-xl p-5 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        New Maintenance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Maintenance date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={newMaintenance.date}
            onChange={onChange}
            className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${
              errors.date
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />

          {errors.date && (
            <p className="text-sm text-red-600 mt-1">{errors.date}</p>
          )}
        </div>

        {/* Maintenance company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>

          <input
            type="text"
            name="company"
            value={newMaintenance.company}
            onChange={onChange}
            placeholder="Company"
            maxLength={100}
            className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${
              errors.company
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />

          {errors.company && (
            <p className="text-sm text-red-600 mt-1">{errors.company}</p>
          )}
        </div>
      </div>

      {/* Maintenance description */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>

        <textarea
          name="description"
          value={newMaintenance.description}
          onChange={onChange}
          rows={3}
          placeholder="Maintenance details..."
          maxLength={1000}
          className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${
            errors.description
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
        />

        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Form action */}
      <div className="mt-4">
        <ActionButton
          variant="success"
          onClick={onSubmit}
          fullWidthMobile={true}>
          <CheckIcon className="w-5 h-5" />
          Save Maintenance
        </ActionButton>
      </div>
    </div>
  );
}
