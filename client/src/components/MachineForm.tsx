import { useRef } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";

import ActionButton from "./ActionButton";
import type { MachineFormData } from "../constants/machineFormInitialState";

type MachineFormErrors = Partial<Record<keyof MachineFormData, string>>;

type MachineFormProps = {
  formData: MachineFormData;
  previewImage: string | null;
  errors?: MachineFormErrors;
  imageError?: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemoveImage: () => void;
};

export default function MachineForm({
  formData,
  previewImage,
  errors = {},
  imageError = "",
  onChange,
  onImageChange,
  onDrop,
  onRemoveImage,
}: MachineFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Opens the hidden file input when clicking the upload area
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Allows dropping files inside the upload area
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Removes selected image and clears file input value
  const handleRemoveImage = () => {
    onRemoveImage();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Machine name */}
      <div>
        <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
          Equipment name
        </label>

        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Industrial Oven"
          maxLength={100}
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
        />

        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Brand and model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="brand"
            className="block font-medium text-gray-700 mb-1">
            Brand
          </label>

          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            placeholder="Rational"
            maxLength={60}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            htmlFor="model"
            className="block font-medium text-gray-700 mb-1">
            Model
          </label>

          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={onChange}
            placeholder="Model number"
            maxLength={60}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Serial number and purchase date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="serialNumber"
            className="block font-medium text-gray-700 mb-1">
            Serial number
          </label>

          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={onChange}
            placeholder="SN-0001"
            maxLength={80}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            htmlFor="purchaseDate"
            className="block font-medium text-gray-700 mb-1">
            Purchase date
          </label>

          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={onChange}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
              errors.purchaseDate
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />

          {errors.purchaseDate && (
            <p className="text-sm text-red-600 mt-1">{errors.purchaseDate}</p>
          )}
        </div>
      </div>

      {/* Location and status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block font-medium text-gray-700 mb-1">
            Location
          </label>

          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="Kitchen area"
            maxLength={100}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block font-medium text-gray-700 mb-1">
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Active">Active</option>
            <option value="Under maintenance">Under maintenance</option>
            <option value="Out of service">Out of service</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block font-medium text-gray-700 mb-1">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
          placeholder="Equipment notes..."
          maxLength={500}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Equipment image
        </label>

        <div
          onClick={handleClick}
          onDrop={onDrop}
          onDragOver={handleDragOver}
          className="w-full min-h-56 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 hover:border-blue-500 cursor-pointer transition bg-gray-50 overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Machine preview"
              className="w-full h-56 object-contain bg-white"
            />
          ) : (
            <div className="text-center p-6">
              <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />

              <p className="font-medium text-gray-700">
                Click or drag an image here
              </p>

              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG, WEBP accepted
              </p>

              <p className="text-xs text-gray-400 mt-1">Maximum size: 3 MB</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            name="image"
            id="image"
            className="hidden"
            onChange={onImageChange}
          />
        </div>

        {imageError && (
          <p className="text-sm text-red-600 mt-2">{imageError}</p>
        )}

        {previewImage && (
          <div className="mt-3">
            <ActionButton variant="outline" onClick={handleRemoveImage}>
              <XMarkIcon className="w-4 h-4" />
              Remove selected image
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}
