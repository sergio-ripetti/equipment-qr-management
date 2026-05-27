import dotenv from "dotenv";

import connectDB from "./config/db";
import Machine = require("./models/Machine");
import demoMachines = require("./data/demoMachines");

// Loads environment variables from .env
dotenv.config();

// Connects to MongoDB
connectDB();

// Imports demo machines into MongoDB
const importData = async (): Promise<void> => {
  try {
    // Clears existing machines before inserting demo data
    await Machine.deleteMany();

    // Inserts demo machines
    await Machine.insertMany(demoMachines);

    process.exit();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error importing demo machines:", error.message);
    } else {
      console.error("Error importing demo machines:", error);
    }

    process.exit(1);
  }
};

// Deletes all machines from MongoDB
const destroyData = async (): Promise<void> => {
  try {
    await Machine.deleteMany();

    // console.log("All machines deleted successfully");

    process.exit();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting machines:", error.message);
    } else {
      console.error("Error deleting machines:", error);
    }

    process.exit(1);
  }
};

// Checks the terminal command argument
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}