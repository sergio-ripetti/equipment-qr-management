import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PublicNavbar from "../components/PublicNavbar";
import MachineInfoGrid from "../components/MachineInfoGrid";
import StatusBadge from "../components/StatusBadge";

import { getMachineById } from "../services/machineApi";
import { getMachineImageUrl } from "../utils/imageHelpers";
import { formatDate } from "../utils/formatDate";

import type { Machine } from "../types";

export default function PublicMachineDetail() {
  const { id } = useParams<{ id: string }>();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const privateMachinePath = id ? `/machine/${id}` : "/dashboard";

  // Loads machine data from MongoDB using the public QR route
  useEffect(() => {
    const loadMachine = async () => {
      if (!id) {
        setError("Invalid equipment ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getMachineById(id);
        setMachine(data);
      } catch (error) {
        console.error(error);
        setError("Could not load this equipment.");
      } finally {
        setLoading(false);
      }
    };

    loadMachine();
  }, [id]);

  if (loading) {
    return (
      <>
        <PublicNavbar privateMachinePath={privateMachinePath} />

        <div className="w-[92%] max-w-5xl mx-auto mt-10 py-6">
          <p className="text-gray-500">Loading equipment details...</p>
        </div>
      </>
    );
  }

  if (error || !machine) {
    return (
      <>
        <PublicNavbar privateMachinePath={privateMachinePath} />

        <div className="w-[92%] max-w-5xl mx-auto mt-10 py-6">
          <p className="text-red-600">{error || "Equipment not found."}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicNavbar privateMachinePath={privateMachinePath} />

      <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
        {/* Public detail card */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
          {/* Machine image */}
          <div className="w-full h-72 bg-gray-50 p-4 flex items-center justify-center">
            <img
              src={getMachineImageUrl(machine.imageUrl)}
              alt={machine.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="p-5 sm:p-6">
            {/* Public header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {machine.name}
                </h1>

                <p className="text-gray-500 mt-2">
                  Public equipment information and maintenance history.
                </p>
              </div>

              <div className="flex justify-center sm:justify-end">
                <StatusBadge status={machine.status} />
              </div>
            </div>

            {/* Read-only machine information */}
            <MachineInfoGrid machine={machine} />
          </div>
        </div>

        {/* Public maintenance history */}
        <div className="bg-white shadow-md rounded-xl border border-gray-100 mt-8 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Maintenance History
          </h2>

          <p className="text-gray-500 text-sm mt-1 mb-5">
            Read-only maintenance records for this equipment.
          </p>

          {machine.maintenanceHistory &&
          machine.maintenanceHistory.length > 0 ? (
            <ul className="space-y-4">
              {machine.maintenanceHistory.map((maintenance, index) => (
                <li
                  key={`${maintenance.date}-${index}`}
                  className="border border-gray-200 bg-gray-50 p-4 rounded-xl"
                >
                  <p className="text-sm text-gray-500">Maintenance date</p>

                  <p className="font-semibold text-gray-800">
                    {formatDate(maintenance.date)}
                  </p>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Company:</span>{" "}
                      {maintenance.company}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Description:</span>{" "}
                      {maintenance.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              No maintenance records found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}