"use client"
import { useState } from "react";
import { sample_programs } from "../lib/utils/types";
import type { Program } from "../lib/utils/types";
import Sidebar from "./map/Sidebar";
import USMap from "./map/USMap";

interface Filters {
  programs: string[];
  searchText: string;
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({ programs: [], searchText: "" });
  const [hoveredProgram, setHoveredProgram] = useState<Program | null>(null);

  const filteredPrograms: Program[] = sample_programs.filter(program => {
    if (filters.programs.length > 0 && !filters.programs.some(p => program.programs.includes(p))) return false;
    if (filters.searchText && !program.name.toLowerCase().includes(filters.searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      <Sidebar filters={filters} setFilters={setFilters} filteredPrograms={filteredPrograms} />
      <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
        <USMap filteredPrograms={filteredPrograms} hoveredProgram={hoveredProgram} setHoveredProgram={setHoveredProgram} />
      </div>
    </div>
  );
}