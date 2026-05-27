import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import MachineForm from "../components/MachineForm";
import ActionButton from "../components/ActionButton";

import { useMachineForm } from "../hooks/useMachineForm";
import { createMachine } from "../services/machineApi";
import { buildMachineFormData } from "../utils/formDataHelpers";

import {
  validateMachineForm,
  hasValidationErrors,
} from "../utils/validationHelpers";

import type { MachineFormData } from "../constants/machineFormInitialState";

type MachineFormErrors = Partial<Record<keyof MachineFormData, string>>;

export default function CreateMachine() {
  const navigate = useNavigate();

  const {
    formData,
    previewImage,
    imageFile,
    imageRemoved,
    imageError,
    handleChange,
    handleImageChange,
    handleDrop,
    removeSelectedImage,
    clearForm,
  } = useMachineForm();

  // Stores validation errors for the machine form
  const [machineErrors, setMachineErrors] = useState<MachineFormErrors>({});

  // Stores a general server error message
  const [serverError, setServerError] = useState("");

  // Stores loading state while saving
  const [isSaving, setIsSaving] = useState(false);

  // Clears the validation error for a field when the user starts typing
  const handleMachineChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    handleChange(e);

    const { name } = e.target;

    setMachineErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  // Clears the form and validation errors
  const handleClearForm = () => {
    clearForm();
    setMachineErrors({});
    setServerError("");
  };

  // Saves the new equipment into MongoDB
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateMachineForm(formData);

    if (hasValidationErrors(errors)) {
      setMachineErrors(errors);
      return;
    }

    try {
      setIsSaving(true);

      const machinePayload = buildMachineFormData({
        formData,
        imageFile,
        imageRemoved,
      });

      const newMachine = await createMachine(machinePayload);

      setMachineErrors({});
      setServerError("");

      navigate(`/machine/${newMachine._id}`);
    } catch (error) {
      console.error(error);
      setServerError("Could not save the equipment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-[92%] max-w-5xl mx-auto mt-10 py-6">
      <PageHeader
        title="Register New Equipment"
        description="Add a new machine to the equipment management system."
      />

      {serverError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-gray-100 shadow-md rounded-xl p-5 sm:p-6 space-y-6">
        <MachineForm
          formData={formData}
          previewImage={previewImage}
          errors={machineErrors}
          imageError={imageError}
          onChange={handleMachineChange}
          onImageChange={handleImageChange}
          onDrop={handleDrop}
          onRemoveImage={removeSelectedImage}
        />

        {/* Form actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <ActionButton
            variant="outline"
            onClick={handleClearForm}
            disabled={isSaving}
            fullWidthMobile={true}>
            Clear form
          </ActionButton>

          <ActionButton
            type="submit"
            variant="success"
            disabled={isSaving}
            fullWidthMobile={true}>
            {isSaving ? "Saving..." : "Save equipment"}
          </ActionButton>
        </div>
      </form>
    </div>
  );
}
