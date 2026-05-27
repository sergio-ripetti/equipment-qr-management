import express from "express";

import upload from "../middleware/middleware";

import {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/machineController";

import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// Public / read routes
router.get("/", getMachines);
router.get("/:id", getMachineById);

// Machine private routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createMachine,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateMachine,
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteMachine);

// Maintenance private routes
router.post(
  "/:id/maintenance",
  protect,
  authorizeRoles("admin", "technician"),
  addMaintenance,
);

router.put(
  "/:id/maintenance/:maintenanceIndex",
  protect,
  authorizeRoles("admin", "technician"),
  updateMaintenance,
);

router.delete(
  "/:id/maintenance/:maintenanceIndex",
  protect,
  authorizeRoles("admin"),
  deleteMaintenance,
);

export default router;
