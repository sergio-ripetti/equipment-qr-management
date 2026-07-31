import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

type UserRole = "admin" | "technician" | "viewer";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isProtected: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "technician", "viewer"],
      default: "viewer",
    },

    isProtected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Encrypts password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compares entered password with encrypted password
userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export = User;
