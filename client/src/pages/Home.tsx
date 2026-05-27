import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import SearchResultCard from "../components/SearchResultCard";
import HomeWelcome from "../components/HomeWelcome";

import { getMachines } from "../services/machineApi";
import { filterMachinesBySearch } from "../utils/machineHelpers";

import type { Machine } from "../types";

export default function Home() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [search, setSearch] = useState("");
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);

  // Loading state while fetching machines from MongoDB
  const [loading, setLoading] = useState(true);

  // Stores server error messages
  const [error, setError] = useState("");

  // Loads machines from MongoDB through the backend API
  useEffect(() => {
    const loadMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
      } catch (error) {
        console.error(error);
        setError("Could not load equipment from the server.");
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  // Filters machines every time the search value changes
  useEffect(() => {
    const filtered = filterMachinesBySearch(machines, search);
    setFilteredMachines(filtered);
  }, [machines, search]);

  const hasSearchValue = search.trim() !== "";

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6">
        <p className="text-gray-500">Loading equipment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6">
      <PageHeader
        title="Search Machine"
        description="Search your registered Ripe Deli Equipment by name, code, brand, model, serial number, or location."
      />

      {/* Search input */}
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          placeholder="Search by name, code, brand, model..."
        />
      </div>

      {/* Initial state */}
      {!hasSearchValue && <HomeWelcome />}

      {/* Machine results */}
      {filteredMachines.length > 0 && hasSearchValue ? (
        <div className="flex flex-col gap-4">
          {filteredMachines.map((machine) => (
            <SearchResultCard key={machine._id} machine={machine} />
          ))}
        </div>
      ) : (
        hasSearchValue && (
          <EmptyState
            title="No machines found"
            message="Try searching by machine name, code, brand, model, serial number, or location."
          />
        )
      )}
    </div>
  );
}
