"use client"
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import USMap from "./USMap";
import { SchoolWithPrograms } from "../../lib/utils/types";
import { getStaticAllSchools } from "../../lib/utils/schools";

interface Filters {
  programs: string[]; //all of the selected disciplines (in Program, stored as Program.umbrella_discipline & Program.discipline)
  searchText: string;
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({ programs: [], searchText: "" });
  const [allSchools, setAllSchools] = useState<SchoolWithPrograms[] | null>(null);

  useEffect(() => {
      const fetchSchools = async () => {
          const data = await getStaticAllSchools();
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

    if (!allSchools) {
      return <div>Loading...</div>;
    }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      <Sidebar filters={filters} setFilters={setFilters} filteredPrograms={filteredSchools} />
      <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
        <USMap filteredSchools={filteredSchools}/>
      </div>
    </div>
  );
}