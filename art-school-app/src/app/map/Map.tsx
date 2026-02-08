import { useState } from "react";
import { useParams } from "react-router-dom";
import { sample_programs } from "../../lib/utils/types";
import type { Program } from "../../lib/utils/types";
import Sidebar from "./Sidebar";
import USMap from "./USMap";
import StateMap from "./StateMap";

interface Filters {
  programs: string[];
  searchText: string;
}

export default function Map() {
  const { stateId } = useParams<{ stateId?: string }>();
  const [filters, setFilters] = useState<Filters>({
    programs: [],
    searchText: ""
  });
  const [hoveredProgram, setHoveredProgram] = useState<Program | null>(null);

  // Filter programs based on selected filters
  const filteredPrograms = sample_programs.filter(program => {
    if (filters.programs.length > 0 && !filters.programs.some(p => program.programs.includes(p))) return false;
    if (filters.searchText && !program.name.toLowerCase().includes(filters.searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex"}}>
      <Sidebar 
        filters={filters} 
        setFilters={setFilters} 
        filteredPrograms={filteredPrograms} 
      />
      
      {/* Map Area */}
      <div style={{ flex: 1, textAlign: "center", position: "relative"}}>
        {stateId ? (
          <StateMap 
            stateId={stateId}
            filteredPrograms={filteredPrograms}
            hoveredProgram={hoveredProgram}
            setHoveredProgram={setHoveredProgram}
          />
        ) : (
          <USMap 
            filteredPrograms={filteredPrograms}
            hoveredProgram={hoveredProgram}
            setHoveredProgram={setHoveredProgram}
          />
        )}
      </div>
    </div>
  );
}
