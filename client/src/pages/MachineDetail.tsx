import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import QRCodeBox from "../components/QRCodeBox";
import MachineDetailHeader from "../components/MachineDetailHeader";
import MachineInfoGrid from "../components/MachineInfoGrid";
import MaintenanceSection from "../components/MaintenanceSection";
import ConfirmModal from "../components/ConfirmModal";

import { getMachineImageUrl } from "../utils/imageHelpers";
import { getSavedUser } from "../utils/authStorage";

import {
  getMachineById,
  addMaintenanceToMachine,
  updateMaintenanceInMachine,
  deleteMachine,
  deleteMaintenanceFromMachine,
} from "../services/machineApi";

import {
  validateMaintenanceForm,
  hasValidationErrors,
} from "../utils/validationHelpers";

import {
  canEditEquipment,
  canDeleteEquipment,
  canAddMaintenance,
  canEditMaintenance,
  canDeleteMaintenance,
  canManageQr,
} from "../utils/permissionHelpers";

import type { Machine, Maintenance } from "../types";

type MaintenanceErrors = Partial<Record<keyof Maintenance, string>>;

type ConfirmModalState = {
  isOpen: boolean;
  type: "equipment" | "maintenance" | null;
  maintenanceIndex: number | null;
};

const EMPTY_MAINTENANCE: Maintenance = {
  date: "",
  company: "",
  description: "",
};

export default function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Gets logged user to control permissions
  const user = getSavedUser();

  // Data state
  const [machine, setMachine] = useState<Machine | null>(null);
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);

  // UI state
  const [uiState, setUiState] = useState({
    loading: true,
    error: "",
    showForm: false,
  });

  // Form state: new maintenance
  const [newMaintenance, setNewMaintenance] =
    useState<Maintenance>(EMPTY_MAINTENANCE);
  const [maintenanceErrors, setMaintenanceErrors] = useState<MaintenanceErrors>(
    {},
  );

  // Form state: edit maintenance
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Maintenance>(EMPTY_MAINTENANCE);
  const [editMaintenanceErrors, setEditMaintenanceErrors] =
    useState<MaintenanceErrors>({});

  // Modal state
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    type: null,
    maintenanceIndex: null,
  });

  // Loads the selected machine from MongoDB
  useEffect(() => {
    const loadMachine = async () => {
      if (!id) {
        setUiState((prev) => ({
          ...prev,
          error: "Invalid equipment ID.",
          loading: false,
        }));
        return;
      }

      try {
        const data = await getMachineById(id);

        setMachine(data);
        setMaintenanceList(data.maintenanceHistory || []);
      } catch (error) {
        setUiState((prev) => ({
          ...prev,
          error: "Could not load this equipment from the server.",
        }));
        console.error(error);
      } finally {
        setUiState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadMachine();
  }, [id]);

  // Updates the new maintenance form values and clears field errors
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setNewMaintenance((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMaintenanceErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Adds a new maintenance item to MongoDB
  const handleAddMaintenance = async () => {
    if (!id) {
      setUiState((prev) => ({ ...prev, error: "Invalid equipment ID." }));
      return;
    }

    const errors = validateMaintenanceForm(newMaintenance);

    if (hasValidationErrors(errors)) {
      setMaintenanceErrors(errors);
      return;
    }

    try {
      const updatedMachine = await addMaintenanceToMachine(id, newMaintenance);

      setMachine(updatedMachine);
      setMaintenanceList(updatedMachine.maintenanceHistory || []);

      setNewMaintenance(EMPTY_MAINTENANCE);
      setMaintenanceErrors({});
      setUiState((prev) => ({ ...prev, showForm: false }));
    } catch (error) {
      console.error(error);
      setUiState((prev) => ({
        ...prev,
        error: "Could not save the maintenance record.",
      }));
    }
  };

  // Updates the edit form values and clears field errors
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setEditMaintenanceErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Starts editing a selected maintenance item
  const handleStartEdit = (index: number) => {
    setEditIndex(index);
    setEditData(maintenanceList[index]);
    setEditMaintenanceErrors({});
  };

  // Saves the edited maintenance item to MongoDB
  const handleSaveEdit = async () => {
    if (!id || editIndex === null) {
      setUiState((prev) => ({
        ...prev,
        error: "Invalid maintenance record.",
      }));
      return;
    }

    const errors = validateMaintenanceForm(editData);

    if (hasValidationErrors(errors)) {
      setEditMaintenanceErrors(errors);
      return;
    }

    try {
      const updatedMachine = await updateMaintenanceInMachine(
        id,
        editIndex,
        editData,
      );

      setMachine(updatedMachine);
      setMaintenanceList(updatedMachine.maintenanceHistory || []);

      setEditIndex(null);
      setEditData(EMPTY_MAINTENANCE);
      setEditMaintenanceErrors({});
    } catch (error) {
      console.error(error);
      setUiState((prev) => ({
        ...prev,
        error: "Could not update the maintenance record.",
      }));
    }
  };

  // Cancels maintenance editing
  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditData(EMPTY_MAINTENANCE);
    setEditMaintenanceErrors({});
  };

  // Opens confirmation modal for deleting equipment
  const handleDeleteMachine = () => {
    // Prevent deletion of demo records
    if (machine?.isDemoRecord) {
      setUiState((prev) => ({
        ...prev,
        error: "This demo equipment cannot be deleted.",
      }));
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: "equipment",
      maintenanceIndex: null,
    });
  };

  // Opens confirmation modal for deleting maintenance
  const handleDeleteMaintenance = (maintenanceIndex: number) => {
    setConfirmModal({
      isOpen: true,
      type: "maintenance",
      maintenanceIndex,
    });
  };

  // Closes confirmation modal
  const handleCancelDelete = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      maintenanceIndex: null,
    });
  };

  // Confirms delete action depending on modal type
  const handleConfirmDelete = async () => {
    if (!id) {
      setUiState((prev) => ({ ...prev, error: "Invalid equipment ID." }));
      return;
    }

    try {
      if (confirmModal.type === "equipment") {
        await deleteMachine(id);

        navigate("/machines");
        return;
      }

      if (
        confirmModal.type === "maintenance" &&
        confirmModal.maintenanceIndex !== null
      ) {
        const updatedMachine = await deleteMaintenanceFromMachine(
          id,
          confirmModal.maintenanceIndex,
        );

        setMachine(updatedMachine);
        setMaintenanceList(updatedMachine.maintenanceHistory || []);

        setEditIndex(null);
        setEditMaintenanceErrors({});
      }

      handleCancelDelete();
    } catch (error) {
      console.error(error);

      let errorMessage = "";
      if (error instanceof Error) {
        if (error.message.includes("403") || error.message.includes("demo equipment cannot be deleted")) {
          errorMessage = "This demo equipment cannot be deleted.";
        } else {
          errorMessage =
            confirmModal.type === "equipment"
              ? "Could not delete the equipment."
              : "Could not delete the maintenance record.";
        }
      } else {
        errorMessage =
          confirmModal.type === "equipment"
            ? "Could not delete the equipment."
            : "Could not delete the maintenance record.";
      }

      setUiState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      handleCancelDelete();
    }
  };

  if (uiState.loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <p className="text-gray-500">Loading equipment details...</p>
      </div>
    );
  }

  if (uiState.error) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <p className="text-red-600">{uiState.error}</p>
      </div>
    );
  }

  if (!machine) {
    return <p className="text-center mt-10 text-red-600">Machine not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      {/* Machine main card */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        {/* Machine image */}
        <div className="w-full h-72 bg-gray-50 p-4 flex items-center justify-center">
          <img
            src={getMachineImageUrl(machine.imageUrl)}
            alt={machine.name}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Machine information */}
        <div className="p-6">
          <MachineDetailHeader
            machine={machine}
            canEdit={canEditEquipment(user)}
            canDelete={canDeleteEquipment(user)}
            onDeleteMachine={handleDeleteMachine}
          />

          <MachineInfoGrid machine={machine} />

          {/* QR code section */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">
              <QRCodeBox
                machineId={machine._id}
                displayId={machine.machineCode}
                machineName={machine.name}
                machineLocation={machine.location}
                size={180}
                showId={true}
                showDownload={canManageQr(user)}
                showPrint={canManageQr(user)}
                showSizeSelector={canManageQr(user)}
              />
            </div>
          </div>
        </div>
      </div>

      <MaintenanceSection
        maintenanceList={maintenanceList}
        showForm={uiState.showForm}
        newMaintenance={newMaintenance}
        maintenanceErrors={maintenanceErrors}
        editIndex={editIndex}
        editData={editData}
        editMaintenanceErrors={editMaintenanceErrors}
        canAddMaintenance={canAddMaintenance(user)}
        canEditMaintenance={canEditMaintenance(user)}
        canDeleteMaintenance={canDeleteMaintenance(user)}
        onToggleForm={() =>
          setUiState((prev) => ({ ...prev, showForm: !prev.showForm }))
        }
        onNewMaintenanceChange={handleChange}
        onAddMaintenance={handleAddMaintenance}
        onStartEdit={handleStartEdit}
        onEditChange={handleEditChange}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onDeleteMaintenance={handleDeleteMaintenance}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === "equipment"
            ? "Delete equipment?"
            : "Delete maintenance record?"
        }
        message={
          confirmModal.type === "equipment"
            ? "This equipment and its maintenance history will be permanently deleted. This action cannot be undone."
            : "This maintenance record will be permanently deleted. This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
