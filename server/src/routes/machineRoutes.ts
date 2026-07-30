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
import { validate } from "../middleware/validate";

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
  validate([
    { field: "name", required: true, minLength: 2, maxLength: 100 },
    { field: "purchaseDate", required: true },
  ]),
  createMachine,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  validate([
    { field: "name", required: true, minLength: 2, maxLength: 100 },
    { field: "purchaseDate", required: true },
  ]),
  updateMachine,
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteMachine);

// Maintenance private routes
router.post(
  "/:id/maintenance",
  protect,
  authorizeRoles("admin", "technician"),
  validate([
    { field: "date", required: true },
    { field: "company", required: true, minLength: 2 },
    { field: "description", required: true, minLength: 5 },
  ]),
  addMaintenance,
);

router.put(
  "/:id/maintenance/:maintenanceIndex",
  protect,
  authorizeRoles("admin", "technician"),
  validate([
    { field: "date", required: true },
    { field: "company", required: true, minLength: 2 },
    { field: "description", required: true, minLength: 5 },
  ]),
  updateMaintenance,
);

router.delete(
  "/:id/maintenance/:maintenanceIndex",
  protect,
  authorizeRoles("admin"),
  deleteMaintenance,
);

export default router;
