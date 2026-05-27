import mongoose, { Model, Schema, Types } from "mongoose";

type ActivityEntityType = "machine" | "maintenance" | "auth" | "user";

interface IActivityLog {
  user: Types.ObjectId | null;
  userName: string;
  userRole: string;
  action: string;
  entityType: ActivityEntityType;
  entityId: string;
  machineCode: string;
  machineName: string;
  description: string;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userName: {
      type: String,
      default: "System",
    },

    userRole: {
      type: String,
      default: "system",
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    entityType: {
      type: String,
      required: true,
      enum: ["machine", "maintenance", "auth", "user"],
    },

    entityId: {
      type: String,
      default: "",
    },

    machineCode: {
      type: String,
      default: "",
    },

    machineName: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const ActivityLog: Model<IActivityLog> = mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema,
);

export = ActivityLog;
