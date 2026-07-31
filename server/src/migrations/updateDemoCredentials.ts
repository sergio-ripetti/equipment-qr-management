import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db";
import User = require("../models/User");

dotenv.config();

interface DemoCredential {
  role: string;
  email: string;
  plainPassword: string;
}

const demoCredentials: Record<string, DemoCredential> = {
  admin: {
    role: "admin",
    email: "demo.admin@ripeqr.app",
    plainPassword: "RipeAdmin26!",
  },
  technician: {
    role: "technician",
    email: "demo.tech@ripeqr.app",
    plainPassword: "RipeTech26!!",
  },
  viewer: {
    role: "viewer",
    email: "demo.viewer@ripeqr.app",
    plainPassword: "RipeView26!!",
  },
};

const updateDemoCredentials = async (): Promise<void> => {
  try {
    await connectDB();
    console.log("✓ Database connected");

    // Step 1: Validate new credentials format
    console.log("\n--- Validating new credentials ---");
    for (const [key, cred] of Object.entries(demoCredentials)) {
      if (cred.plainPassword.length !== 12) {
        throw new Error(
          `Password for ${key} is not 12 characters: ${cred.plainPassword.length}`
        );
      }
      if (cred.plainPassword.length < 6 || cred.plainPassword.length > 12) {
        throw new Error(
          `Password for ${key} does not comply with 6-12 character policy`
        );
      }
      console.log(`✓ ${key}: password is exactly 12 characters`);
    }

    // Step 2: Find protected users by role
    console.log("\n--- Finding protected users by role ---");
    const protectedAdmin = await User.findOne({
      isProtected: true,
      role: "admin",
    });
    const protectedTechnician = await User.findOne({
      isProtected: true,
      role: "technician",
    });
    const protectedViewer = await User.findOne({
      isProtected: true,
      role: "viewer",
    });

    if (!protectedAdmin || !protectedTechnician || !protectedViewer) {
      throw new Error(
        "Could not find all three protected users. Current state: admin=" +
          !!protectedAdmin +
          ", technician=" +
          !!protectedTechnician +
          ", viewer=" +
          !!protectedViewer
      );
    }

    console.log("✓ Found protected admin");
    console.log("✓ Found protected technician");
    console.log("✓ Found protected viewer");

    // Step 3: Check for email conflicts with other users
    console.log("\n--- Checking for email conflicts ---");
    const newEmails = Object.values(demoCredentials).map((c) => c.email);
    const existingUsers = await User.find({
      email: { $in: newEmails },
      isProtected: false,
    });

    if (existingUsers.length > 0) {
      throw new Error(
        `Email conflict: ${existingUsers.length} non-protected user(s) already use one of the new emails`
      );
    }

    console.log("✓ No email conflicts with non-protected users");

    // Step 4: Validate total protected user count
    const totalProtected = await User.countDocuments({ isProtected: true });
    if (totalProtected !== 3) {
      throw new Error(`Expected 3 protected users, found ${totalProtected}`);
    }
    console.log("✓ Exactly 3 protected users found");

    // Step 5: Hash new passwords
    console.log("\n--- Hashing new passwords ---");
    const hashedPasswords: Record<string, string> = {};
    for (const [key, cred] of Object.entries(demoCredentials)) {
      const salt = await bcrypt.genSalt(10);
      hashedPasswords[key] = await bcrypt.hash(cred.plainPassword, salt);
      console.log(`✓ ${key}: password hashed`);
    }

    // Step 6: Update protected users
    console.log("\n--- Updating protected users ---");

    await User.findByIdAndUpdate(protectedAdmin._id, {
      email: demoCredentials.admin.email,
      password: hashedPasswords.admin,
    });
    console.log(`✓ Updated admin: ${demoCredentials.admin.email}`);

    await User.findByIdAndUpdate(protectedTechnician._id, {
      email: demoCredentials.technician.email,
      password: hashedPasswords.technician,
    });
    console.log(`✓ Updated technician: ${demoCredentials.technician.email}`);

    await User.findByIdAndUpdate(protectedViewer._id, {
      email: demoCredentials.viewer.email,
      password: hashedPasswords.viewer,
    });
    console.log(`✓ Updated viewer: ${demoCredentials.viewer.email}`);

    // Step 7: Verify the updates
    console.log("\n--- Verifying updates ---");
    const updatedAdmin = await User.findById(protectedAdmin._id).select(
      "name email role isProtected"
    );
    const updatedTechnician = await User.findById(protectedTechnician._id).select(
      "name email role isProtected"
    );
    const updatedViewer = await User.findById(protectedViewer._id).select(
      "name email role isProtected"
    );

    console.log("\nUpdated protected users:");
    const users = [
      { name: "Admin", user: updatedAdmin },
      { name: "Technician", user: updatedTechnician },
      { name: "Viewer", user: updatedViewer },
    ];

    for (const { name, user } of users) {
      const userData = user as any;
      console.log(
        `  ✓ ${name}: ${userData.email} - Role: ${userData.role}, Protected: ${userData.isProtected}`
      );
    }

    // Step 8: Final validation
    const finalProtectedCount = await User.countDocuments({
      isProtected: true,
    });
    if (finalProtectedCount !== 3) {
      throw new Error(
        `Final verification failed: Expected 3 protected users, found ${finalProtectedCount}`
      );
    }

    const finalTotalUsers = await User.countDocuments({});
    console.log(
      `\n✓ Database integrity verified: ${finalTotalUsers} total users, 3 protected`
    );

    console.log("\n✓✓✓ Demo credentials successfully updated! ✓✓✓");
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error("\n✗ Migration error:", error.message);
    } else {
      console.error("\n✗ Migration error:", error);
    }

    process.exit(1);
  }
};

updateDemoCredentials();
