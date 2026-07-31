import dotenv from "dotenv";

import connectDB from "../config/db";
import User = require("../models/User");

dotenv.config();

const markProtectedUsers = async (): Promise<void> => {
  try {
    await connectDB();

    const adminEmail = process.env.PROTECTED_ADMIN_EMAIL;
    const technicianEmail = process.env.PROTECTED_TECHNICIAN_EMAIL;
    const viewerEmail = process.env.PROTECTED_VIEWER_EMAIL;

    if (!adminEmail || !technicianEmail || !viewerEmail) {
      console.error(
        "Error: PROTECTED_ADMIN_EMAIL, PROTECTED_TECHNICIAN_EMAIL, and PROTECTED_VIEWER_EMAIL must be set in .env"
      );
      process.exit(1);
    }

    const emails = [adminEmail, technicianEmail, viewerEmail];

    const results = await User.updateMany(
      { email: { $in: emails } },
      { $set: { isProtected: true } }
    );

    console.log(
      `Successfully marked ${results.modifiedCount} user(s) as protected.`
    );

    const markedUsers = await User.find({ email: { $in: emails } }).select(
      "name email role isProtected"
    );

    console.log("\nProtected users:");
    markedUsers.forEach((user) => {
      const userDoc = user as any;
      console.log(
        `  - ${userDoc.name} (${userDoc.email}) - Role: ${userDoc.role}, Protected: ${userDoc.isProtected}`
      );
    });

    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Migration error:", error.message);
    } else {
      console.error("Migration error:", error);
    }

    process.exit(1);
  }
};

markProtectedUsers();
