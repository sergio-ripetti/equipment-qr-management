import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import MachineCard from "../components/MachineCard";
import MachineFilters from "../components/MachineFilters";
import EmptyState from "../components/EmptyState";
import ResultsCount from "../components/ResultsCount";

import { getMachines } from "../services/machineApi";
import { filterMachines } from "../utils/machineHelpers";

import type { Machine } from "../types";

export default function MachineList() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Loads machines from MongoDB through the backend API
  useEffect(() => {
    const loadMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
      } catch (error) {
        setError("Could not load equipment from the server.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  // Filter machines by search text and selected status
 const filteredMachines = filterMachines(machines, search, statusFilter);

  if (loading) {
    return (
      <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
        <p className="text-gray-500">Loading equipment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-[92%] max-w-6xl mx-auto mt-10 py-6">
      <PageHeader
        title="Equipment List"
        description="View, search, and manage all registered Ripe Deli Equipment."
      />

      <MachineFilters
        search={search}
        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        statusFilter={statusFilter}
        onStatusChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setStatusFilter(e.target.value)
        }
      />

      <ResultsCount
        count={filteredMachines.length}
        singularLabel="equipment item"
        pluralLabel="equipment items"
      />

      {/* Machine cards */}
      {filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredMachines.map((machine) => (
            <MachineCard key={machine._id} machine={machine} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No equipment found"
          message="Try changing the search text or selecting another status."
        />
      )}
    </div>
  );
}
