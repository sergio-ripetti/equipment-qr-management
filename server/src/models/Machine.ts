import mongoose, { Model, Schema } from "mongoose";

type MachineStatus = "Active" | "Under maintenance" | "Out of service";

interface IMaintenance {
  date: string;
  company: string;
  description: string;
}

interface IMachine {
  machineCode: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  location: string;
  status: MachineStatus;
  description: string;
  imageUrl: string;
  maintenanceHistory: IMaintenance[];
}

// Maintenance schema used inside each machine
const maintenanceSchema = new Schema<IMaintenance>(
  {
    date: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

// Machine schema for kitchen equipment
const machineSchema = new Schema<IMachine>(
  {
    machineCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    model: {
      type: String,
      trim: true,
      default: "",
    },

    serialNumber: {
      type: String,
      trim: true,
      default: "",
    },

    purchaseDate: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Under maintenance", "Out of service"],
      default: "Active",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "maquina1.webp",
    },

    maintenanceHistory: {
      type: [maintenanceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Machine: Model<IMachine> = mongoose.model<IMachine>(
  "Machine",
  machineSchema,
);

export = Machine;
