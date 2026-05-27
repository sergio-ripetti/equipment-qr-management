import { useState } from "react";

import {
  MACHINE_FORM_INITIAL_STATE,
  type MachineFormData,
} from "../constants/machineFormInitialState";

const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export function useMachineForm(
  initialData: MachineFormData = MACHINE_FORM_INITIAL_STATE,
  initialImage: string | null = null,
) {
  // Stores the form information
  const [formData, setFormData] = useState<MachineFormData>(initialData);

  // Stores the selected image preview
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage);

  // Stores the selected image file
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Tracks if the user removed the current image
  const [imageRemoved, setImageRemoved] = useState(false);

  // Stores image validation errors
  const [imageError, setImageError] = useState("");

  // Updates text, date, select, and textarea fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validates the selected image before saving it in state
  const validateAndSetImage = (file?: File | null) => {
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError(`Image size must be less than ${MAX_IMAGE_SIZE_MB} MB.`);
      setImageFile(null);
      setPreviewImage(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImageFile(file);
    setPreviewImage(imageUrl);
    setImageRemoved(false);
    setImageError("");
  };

  // Handles image selection from file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    validateAndSetImage(file);
  };

  // Handles drag and drop image upload
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    validateAndSetImage(file);
  };

  // Removes the selected image before saving
  const removeSelectedImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    setImageRemoved(true);
    setImageError("");
  };

  // Clears the form and image preview
  const clearForm = () => {
    setFormData(MACHINE_FORM_INITIAL_STATE);
    setPreviewImage(null);
    setImageFile(null);
    setImageRemoved(false);
    setImageError("");
  };

  return {
    formData,
    setFormData,
    previewImage,
    setPreviewImage,
    imageFile,
    setImageFile,
    imageRemoved,
    setImageRemoved,
    imageError,
    setImageError,
    handleChange,
    handleImageChange,
    handleDrop,
    removeSelectedImage,
    clearForm,
  };
}
