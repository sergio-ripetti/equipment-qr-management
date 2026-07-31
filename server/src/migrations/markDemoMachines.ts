import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db";
import Machine = require("../models/Machine");

dotenv.config();

const markDemoMachines = async (): Promise<void> => {
  try {
    await connectDB();
    console.log("✓ Database connected");

    // Require explicit machine IDs via environment variables
    const demoId1 = process.env.DEMO_MACHINE_ID_1;
    const demoId2 = process.env.DEMO_MACHINE_ID_2;
    const demoId3 = process.env.DEMO_MACHINE_ID_3;

    if (!demoId1 || !demoId2 || !demoId3) {
      console.error("\n✗ Migration error: All three DEMO_MACHINE_ID_* env vars are required");
      console.error("  Set: DEMO_MACHINE_ID_1, DEMO_MACHINE_ID_2, DEMO_MACHINE_ID_3");
      process.exit(1);
    }

    // Validate all three are valid MongoDB ObjectIds
    const objectIds = [demoId1, demoId2, demoId3];
    for (const id of objectIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`\n✗ Migration error: Invalid MongoDB ObjectId: ${id}`);
        process.exit(1);
      }
    }

    // Validate all three are unique
    const uniqueIds = new Set(objectIds);
    if (uniqueIds.size !== 3) {
      console.error("\n✗ Migration error: The three machine IDs must be unique");
      process.exit(1);
    }

    // Verify all three records exist
    const machines = await Machine.find({
      _id: { $in: objectIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).select("_id name machineCode isDemoRecord");

    if (machines.length !== 3) {
      console.error(
        `\n✗ Migration error: Expected 3 machines but found ${machines.length}`
      );
      console.error("  Verify that all three DEMO_MACHINE_ID_* values exist in the database.");
      process.exit(1);
    }

    console.log("\n✓ Validating specified machine IDs:");
    machines.forEach((machine) => {
      const machineDoc = machine as any;
      console.log(
        `  ✓ ${machineDoc._id} - ${machineDoc.name} (${machineDoc.machineCode})`
      );
    });

    // Mark only these three machines as demo records
    const result = await Machine.updateMany(
      { _id: { $in: objectIds.map((id) => new mongoose.Types.ObjectId(id)) } },
      { $set: { isDemoRecord: true } }
    );

    console.log(`\n✓ Successfully marked ${result.modifiedCount} machine(s) as demo records.`);

    // Verify the update preserved all other fields
    const updatedMachines = await Machine.find({
      _id: { $in: objectIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).select("name machineCode isDemoRecord maintenanceHistory imageUrl");

    console.log("\n✓ Verification (all fields preserved):");
    updatedMachines.forEach((machine) => {
      const machineDoc = machine as any;
      console.log(
        `  ✓ ${machineDoc.name} - isDemoRecord: ${machineDoc.isDemoRecord}, maintenance records: ${
          machineDoc.maintenanceHistory?.length || 0
        }, image: ${machineDoc.imageUrl ? "preserved" : "none"}`
      );
    });

    console.log(
      "\n✓✓✓ Demo machines successfully marked by explicit ID! ✓✓✓"
    );
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

markDemoMachines();
