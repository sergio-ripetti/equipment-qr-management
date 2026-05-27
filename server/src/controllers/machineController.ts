import type { Request, Response } from "express";

import Machine = require("../models/Machine");
import { deleteUploadedImage } from "../utils/fileHelpers";
import { createActivityLog } from "../utils/activityLogger";

type AuthRequest = Request & {
  user?: {
    _id?: string;
    name?: string;
    role?: string;
  };
};

type MachineBody = {
  machineCode?: string;
  name?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  location?: string;
  status?: "Active" | "Under maintenance" | "Out of service";
  description?: string;
  imageUrl?: string;
  maintenanceHistory?: MaintenanceBody[];
  removeImage?: string;
};

type MaintenanceBody = {
  date: string;
  company: string;
  description: string;
};

type MachineParams = {
  id: string;
};

type MaintenanceParams = {
  id: string;
  maintenanceIndex: string;
};

// @desc    Get all machines
// @route   GET /api/machines
export const getMachines = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });

    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({
      message: "Error getting machines",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Get one machine by MongoDB ID
// @route   GET /api/machines/:id
export const getMachineById = async (
  req: Request<MachineParams>,
  res: Response,
): Promise<void> => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      res.status(404).json({
        message: "Machine not found",
      });
      return;
    }

    res.status(200).json(machine);
  } catch (error) {
    res.status(500).json({
      message: "Error getting machine",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Create a new machine
// @route   POST /api/machines
export const createMachine = async (
  req: AuthRequest & Request<unknown, unknown, MachineBody>,
  res: Response,
): Promise<void> => {
  try {
    // Gets all machine codes to generate the next clean code
    const machines = await Machine.find({}, "machineCode");

    const highestNumber = machines.reduce((maxNumber, machineItem) => {
      if (!machineItem.machineCode) {
        return maxNumber;
      }

      // Extracts the number from codes like kitchen-001
      const codeNumber = Number(
        machineItem.machineCode.replace("kitchen-", ""),
      );

      if (Number.isNaN(codeNumber)) {
        return maxNumber;
      }

      return codeNumber > maxNumber ? codeNumber : maxNumber;
    }, 0);

    // Generates the next clean machine code
    const nextMachineCode = `kitchen-${String(highestNumber + 1).padStart(
      3,
      "0",
    )}`;

    // If an image was uploaded, save its filename. Otherwise use default image.
    const imageUrl = req.file ? req.file.filename : "maquina1.webp";

    // Creates the machine first
    const machine = await Machine.create({
      ...req.body,
      machineCode: req.body.machineCode || nextMachineCode,
      imageUrl,
      maintenanceHistory: req.body.maintenanceHistory || [],
    });

    // Creates the activity log after the machine exists
    await createActivityLog({
      req,
      action: "MACHINE_CREATED",
      entityType: "machine",
      entityId: String(machine._id),
      machineCode: machine.machineCode,
      machineName: machine.name,
      description: `Created equipment ${machine.name} (${machine.machineCode}).`,
    });

    res.status(201).json(machine);
  } catch (error) {
    // If create fails after multer uploaded a file, remove that uploaded file
    if (req.file) {
      deleteUploadedImage(req.file.filename);
    }

    res.status(400).json({
      message: "Error creating machine",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Update an existing machine
// @route   PUT /api/machines/:id
export const updateMachine = async (
  req: AuthRequest & Request<MachineParams, unknown, MachineBody>,
  res: Response,
): Promise<void> => {
  try {
    const existingMachine = await Machine.findById(req.params.id);

    if (!existingMachine) {
      res.status(404).json({
        message: "Machine not found",
      });
      return;
    }

    let imageUrl = existingMachine.imageUrl;

    // If the user removed the image, delete the old uploaded image and use default image
    if (req.body.removeImage === "true") {
      deleteUploadedImage(existingMachine.imageUrl);

      // If for some reason a new file was also uploaded, remove it too
      if (req.file) {
        deleteUploadedImage(req.file.filename);
      }

      imageUrl = "maquina1.webp";
    }

    // If a new image was uploaded, delete the old uploaded image and use the new one
    if (req.file && req.body.removeImage !== "true") {
      deleteUploadedImage(existingMachine.imageUrl);
      imageUrl = req.file.filename;
    }

    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        imageUrl,
        machineCode: existingMachine.machineCode,
        maintenanceHistory: existingMachine.maintenanceHistory,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!machine) {
      res.status(404).json({
        message: "Machine not found",
      });
      return;
    }

    await createActivityLog({
      req,
      action: "MACHINE_UPDATED",
      entityType: "machine",
      entityId: String(machine._id),
      machineCode: machine.machineCode,
      machineName: machine.name,
      description: `Updated equipment ${machine.name} (${machine.machineCode}).`,
    });

    res.status(200).json(machine);
  } catch (error) {
    // If update fails after multer uploaded a file, remove that uploaded file
    if (req.file) {
      deleteUploadedImage(req.file.filename);
    }

    res.status(400).json({
      message: "Error updating machine",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Delete a machine
// @route   DELETE /api/machines/:id
export const deleteMachine = async (
  req: AuthRequest & Request<MachineParams>,
  res: Response,
): Promise<void> => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);

    if (!machine) {
      res.status(404).json({
        message: "Machine not found",
      });
      return;
    }

    // Deletes the uploaded image from server/uploads if it is not a demo image
    deleteUploadedImage(machine.imageUrl);

    await createActivityLog({
      req,
      action: "MACHINE_DELETED",
      entityType: "machine",
      entityId: String(machine._id),
      machineCode: machine.machineCode,
      machineName: machine.name,
      description: `Deleted equipment ${machine.name} (${machine.machineCode}).`,
    });

    res.status(200).json({
      message: "Machine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting machine",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Add maintenance record to a machine
// @route   POST /api/machines/:id/maintenance
export const addMaintenance = async (
  req: AuthRequest & Request<MachineParams, unknown, MaintenanceBody>,
  res: Response,
): Promise<void> => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      res.status(404).json({
        message: "Machine not found",
      });
      return;
    }

    machine.maintenanceHistory.push(req.body);

    await machine.save();

    await createActivityLog({
      req,
      action: "MAINTENANCE_ADDED",
      entityType: "maintenance",
      entityId: String(machine._id),
      machineCode: machine.machineCode,
      machineName: machine.name,
      description: `Added maintenance to ${machine.name} (${machine.machineCode}).`,
    });

    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({
      message: "Error adding maintenance",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Update maintenance record by index
// @route   PUT /api/machines/:id/maintenance/:maintenanceIndex
export const updateMaintenance = async (
  req: AuthRequest & Request<MaintenanceParams, unknown, MaintenanceBody>,
  res: Response,
): Promise<void> => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      res.status(404).json({
        message: "Machine not found",
      });
      return;
    }

    const maintenanceIndex = Number(req.params.maintenanceIndex);

    if (
      Number.isNaN(maintenanceIndex) ||
      maintenanceIndex < 0 ||
      maintenanceIndex >= machine.maintenanceHistory.length
    ) {
      res.status(404).json({
        message: "Maintenance record not found",
      });
      return;
    }

    machine.maintenanceHistory[maintenanceIndex] = req.body;

    await machine.save();

    await createActivityLog({
      req,
      action: "MAINTENANCE_UPDATED",
      entityType: "maintenance",
      entityId: String(machine._id),
      machineCode: machine.machineCode,
      machineName: machine.name,
      description: `Updated maintenance for ${machine.name} (${machine.machineCode}).`,
    });

    res.status(200).json(machine);
  } catch (error) {
    res.status(400).json({
      message: "Error updating maintenance",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Delete maintenance record by index
// @route   DELETE /api/machines/:id/maintenance/:maintenanceIndex
export const deleteMaintenance = async (
  req: AuthRequest & Request<MaintenanceParams>,
  res: Response,
): Promise<void> => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      res.status(404).json({
        message: "Machine not found",
      });
      return;
    }

    const maintenanceIndex = Number(req.params.maintenanceIndex);

    if (
      Number.isNaN(maintenanceIndex) ||
      maintenanceIndex < 0 ||
      maintenanceIndex >= machine.maintenanceHistory.length
    ) {
      res.status(404).json({
        message: "Maintenance record not found",
      });
      return;
    }

    machine.maintenanceHistory.splice(maintenanceIndex, 1);

    await machine.save();

    await createActivityLog({
      req,
      action: "MAINTENANCE_DELETED",
      entityType: "maintenance",
      entityId: String(machine._id),
      machineCode: machine.machineCode,
      machineName: machine.name,
      description: `Deleted maintenance record from ${machine.name} (${machine.machineCode}).`,
    });

    res.status(200).json(machine);
  } catch (error) {
    res.status(400).json({
      message: "Error deleting maintenance",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
