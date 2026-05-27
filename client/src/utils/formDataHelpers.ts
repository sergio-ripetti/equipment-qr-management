import type { MachineFormData } from "../constants/machineFormInitialState";

// Builds FormData to send machine data and optional image file
export function buildMachineFormData({
  formData,
  imageFile,
  imageRemoved,
}: {
  formData: MachineFormData;
  imageFile: File | null;
  imageRemoved: boolean;
}): FormData {
  const machineFormData = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    machineFormData.append(key, value);
  });

  if (imageFile) {
    machineFormData.append("image", imageFile);
  }

  if (imageRemoved) {
    machineFormData.append("removeImage", "true");
  }

  return machineFormData;
}
