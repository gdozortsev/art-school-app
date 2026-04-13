"use client"
import { getOneSchool } from "@/src/lib/schools/schools";
import { use, useEffect, useState } from "react";
import { SchoolWithPrograms, programs } from "@/src/lib/utils/types";

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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#8abbb4" }}>
      <div style={{ fontFamily: "var(--font-sans)", width: "60%", height: "60vh", backgroundColor: "white", borderRadius: "12px", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ background: "#111", color: "white", textAlign: "center", padding: "2rem", borderRadius: "12px 12px 0 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 500, margin: 0, color: "white" }}>{school.school_name}</h1>
        </div>

        {/* Info bar */}
        <div style={{ background: "#008488" , display: "flex", padding: "1rem 1.5rem", marginTop: "10px", marginRight: "10px", marginLeft: "10px", borderRadius: "12px"}}>
          <div style={{ flex: 1, fontSize: "20px", color: "white", fontWeight: 800, paddingRight: "1rem", borderRight: "1.5px solid rgba(255,255,255,0.4)" }}>{school.location}</div>
          <div style={{ flex: 1, fontSize: "20px", color: "white", fontWeight: 800, padding: "0 1rem", borderRight: "1.5px solid rgba(255,255,255,0.4)", textAlign: "center" }}>Population: {school.school_size}</div>
          <div style={{ flex: 1, fontSize: "20px", color: "white", fontWeight: 800, paddingLeft: "1rem", textAlign: "right" }}>{school.admissions_email}</div>
        </div>

        {/* Programs grid */}
        <div style={{ background: "white", padding: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3rem" }}>
            {programs.map(program => (
              <button key={program} style={{ background: "#008488" , color: "white", border: "none", borderRadius: "8px", padding: ".75rem", fontSize: "17px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {program} Majors <span style={{ fontSize: "0.75rem", marginLeft: "3px" }}>▼</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}