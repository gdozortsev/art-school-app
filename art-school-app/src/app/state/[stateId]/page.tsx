"use client"
import { use, useEffect, useState } from "react";
import { SchoolWithPrograms, stateNames} from "../../../lib/utils/types";
import Sidebar from "../../map/Sidebar";
import StateMap from "../../map/StateMap";
import { Program } from "@prisma/client";
import { getStaticAllSchoolsByState } from "@/src/lib/utils/schools";

interface Filters {
  programs: string[];
  searchText: string;
}

export default function StatePage({ params }: { params: Promise<{ stateId: string }> }) {
  const { stateId } = use(params);
  const [filters, setFilters] = useState<Filters>({ programs: [], searchText: "" });
  const [hoveredPrograms, setHoveredPrograms] = useState<Program[]| null>(null);
  const [allSchools, setAllSchools] = useState<SchoolWithPrograms[] | null> (null);

  useEffect(() => {
        const fetchSchools = async () => {
            const data = await getStaticAllSchoolsByState(stateNames[stateId]);
            if(data){
              setAllSchools(data);
            }
          };
        fetchSchools();

  }, [])

  const filteredSchools: SchoolWithPrograms[] = (allSchools || []).filter(school => {
      if (filters.programs.length > 0) {
          const matchesCheckboxes = filters.programs.some(p =>
              school.Program.some((prg: any) => prg.discipline.includes(p))
          );
          if (!matchesCheckboxes) return false;
      }

      if (filters.searchText) {
          const searchLower = filters.searchText.toLowerCase();
          const matchesSearch = school.Program.some((prg: any) =>
              prg.discipline.toLowerCase().includes(searchLower) ||
              prg.degree?.toLowerCase().includes(searchLower)
          );
          if (!matchesSearch) return false;
      }

      return true;
    });


  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      <Sidebar filters={filters} setFilters={setFilters} filteredPrograms={filteredSchools} />
      <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
        <StateMap stateId={stateId} filteredPrograms={filteredSchools} hoveredPrograms={hoveredPrograms} setHoveredPrograms={setHoveredPrograms} />
      </div>
    </div>
  );
}


