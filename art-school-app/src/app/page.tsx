"use client"
import { useEffect, useState } from "react";
import Sidebar from "./map/Sidebar";
import USMap from "./map/USMap";
import { SchoolWithPrograms } from "../lib/utils/types";
import { getStaticAllSchools } from "../lib/utils/schools";

interface Filters {
  programs: string[];
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
        // if (filters.programs.length > 0 && !filters.programs.some(p => school.Program.includes(p))) return false;
        if (filters.searchText && !school.school_name.toLowerCase().includes(filters.searchText.toLowerCase())) return false;
        return true;
    });

    console.log("the filteredPrograms", filteredSchools.length)
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