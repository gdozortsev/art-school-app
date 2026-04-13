"use client"
import { getOneSchool } from "@/src/lib/schools/schools";
import { use, useEffect, useState } from "react";
import { SchoolWithPrograms } from "@/src/lib/utils/types";

export default function SchoolPage({ params }: { params: Promise<{ school_name: string }> }) {
  const { school_name } = use(params);
  const decodedName = decodeURIComponent(school_name);
  const [school, setSchool] = useState<any>(null);
  
  useEffect(() => {
    const load = async () => {
      const result = await getOneSchool({ school_name: decodedName });
      result? setSchool(result.school): null;
    };
    load();
  }, [decodedName]);

  if (!school) return <div>Loading...</div>;


  return (
    <div style={{ fontFamily: "var(--font-sans)", width: "50%", height: "50%" }}>
      
      {/* Header */}
      <div style={{ background: "#111", color: "white", textAlign: "center", padding: "2rem", borderRadius: "12px 12px 0 0" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 500, margin: 0, color: "white" }}>{school.school_name}</h1>
      </div>

      {/* Info bar */}
      <div style={{ background: "#1D9E75", display: "flex", padding: "1rem 1.5rem" }}>
        <div style={{ flex: 1, color: "white", fontWeight: 500, paddingRight: "1rem", borderRight: "1.5px solid rgba(255,255,255,0.4)" }}>{school.location}</div>
        <div style={{ flex: 1, color: "white", fontWeight: 500, padding: "0 1rem", borderRight: "1.5px solid rgba(255,255,255,0.4)", textAlign: "center" }}>Population: {school.school_size}</div>
        <div style={{ flex: 1, color: "white", fontWeight: 500, paddingLeft: "1rem", textAlign: "right" }}>{school.admissions_email}</div>
      </div>

      {/* Programs grid */}
      <div style={{ background: "white", border: "0.5px solid #e0e0e0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {/* {school.programs.map(program => (
            <button key={program} style={{ background: "#1D9E75", color: "white", border: "none", borderRadius: "8px", padding: "1rem 1.25rem", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {program} <span style={{ fontSize: "0.75rem" }}>▼</span>
            </button>
          ))} */}
          hi!
        </div>
      </div>

    </div>
  );
}