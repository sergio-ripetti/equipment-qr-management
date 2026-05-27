import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import MachineForm from "../components/MachineForm";
import ActionButton from "../components/ActionButton";

import { useMachineForm } from "../hooks/useMachineForm";

import { getMachineById, updateMachine } from "../services/machineApi";

import {
  getMachineFormData,
  getMachineImagePreview,
} from "../utils/machineFormHelpers";

import { buildMachineFormData } from "../utils/formDataHelpers";

import {
  validateMachineForm,
  hasValidationErrors,
} from "../utils/validationHelpers";

import type { Machine } from "../types";
import type { MachineFormData } from "../constants/machineFormInitialState";

type MachineFormErrors = Partial<Record<keyof MachineFormData, string>>;

export default function EditMachine() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    formData,
    setFormData,
    previewImage,
    imageRemoved,
    setPreviewImage,
    imageFile,
    imageError,
    handleChange,
    handleImageChange,
    handleDrop,
    removeSelectedImage,
  } = useMachineForm();

  // Stores the selected machine from MongoDB
  const [machine, setMachine] = useState<Machine | null>(null);

  // Stores validation errors for the machine form
  const [machineErrors, setMachineErrors] = useState<MachineFormErrors>({});

  // Stores general server error messages
  const [serverError, setServerError] = useState("");

  // Loading state while fetching the machine
  const [loading, setLoading] = useState(true);

  // Loading state while saving changes
  const [isSaving, setIsSaving] = useState(false);

  // Loads machine data from MongoDB
  useEffect(() => {
    const loadMachine = async () => {
      if (!id) {
        setServerError("Invalid equipment ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getMachineById(id);

        setMachine(data);
        setFormData(getMachineFormData(data));
        setPreviewImage(getMachineImagePreview(data));
      } catch (error) {
        console.error(error);
        setServerError("Could not load this equipment from the server.");
      } finally {
        setLoading(false);
      }
    };

    loadMachine();
  }, [id, setFormData, setPreviewImage]);

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

  // Saves updated equipment into MongoDB
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      setServerError("Invalid equipment ID.");
      return;
    }

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

      const updatedMachine = await updateMachine(id, machinePayload);

      setMachineErrors({});
      setServerError("");

      navigate(`/machine/${updatedMachine._id}`);
    } catch (error) {
      console.error(error);
      setServerError("Could not update the equipment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-[92%] max-w-5xl mx-auto mt-10 py-6">
        <p className="text-gray-500">Loading equipment...</p>
      </div>
    );
  }

  if (serverError && !machine) {
    return (
      <div className="w-[92%] max-w-5xl mx-auto mt-10 py-6">
        <p className="text-red-600">{serverError}</p>

        <Link
          to="/machines"
          className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Back to Equipment List
        </Link>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="w-[92%] max-w-5xl mx-auto mt-10 py-6">
        <p className="text-red-600">Machine not found</p>
      </div>
    );
  }

  return (
    <div className="w-[92%] max-w-5xl mx-auto mt-10 py-6">
      <PageHeader
        title="Edit Equipment"
        description="Update the information for this registered equipment."
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
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <ActionButton
            to={`/machine/${machine._id}`}
            variant="outline"
            fullWidthMobile={true}>
            Cancel
          </ActionButton>

          <ActionButton
            type="submit"
            variant="danger"
            disabled={isSaving}
            fullWidthMobile={true}>
            {isSaving ? "Saving..." : "Save changes"}
          </ActionButton>
        </div>
      </form>
    </div>
  );
}
