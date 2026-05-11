"use client"
import { getOneSchool } from "@/src/lib/schools/schools";
import { getAllProgramsWithUmbrella } from "@/src/lib/programs/programs";
import { use, useEffect, useState } from "react";
import { programs } from "@/src/lib/utils/types";
import { Program} from "@prisma/client"
import Link from "next/link";

export default function SchoolPage({ params }: { params: Promise<{ school_name: string }> }) {
  const { school_name } = use(params);
  const decodedName = decodeURIComponent(school_name);
  const [school, setSchool] = useState<any>(null);
  const [openUmbrella, setOpenUmbrella] = useState<string | null>(null);
  const [programsWithUmbrella, setProgramsWithUmbrella] = useState<Program[]>([]);
  
  useEffect(() => {
    console.log("here")
    const load = async () => {
      const result = await getOneSchool({ school_name: decodedName });
      result? setSchool(result.school): null;
    };
    load();
  }, [decodedName]);

  if (!school) return <div>Loading...</div>;

  const dropDown = async (umbrella: string) => {
    // If the user clicks the same button again, close it
    if (openUmbrella === umbrella) {
        setOpenUmbrella(null);
        return;
    }

    try {
        const response = await getAllProgramsWithUmbrella({
            school: decodedName, 
            umbrella: umbrella
        });
        console.log(response)
        if (response && response.program){
          setProgramsWithUmbrella(response.program); 
          setOpenUmbrella(umbrella);
        } else {
          throw Error
        }
    } catch (error) {
        console.error("Failed to fetch programs:", error);
    }
};


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#8abbb4" }}>
      <div style={{ fontFamily: "var(--font-sans)", width: "60%", height: "60vh", backgroundColor: "white", borderRadius: "12px"}}>
        
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
              <div key={program} style={{ position: "relative" }}>
                <button 
                  onClick={() => dropDown(program)} 
                  style={{ 
                    width: "100%",
                    height: "100%",
                    background: "#008488", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    padding: ".75rem", 
                    fontSize: "17px", 
                    fontWeight: 800, 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between" 
                  }}
                >
                  {program} Majors 
                  <span style={{ 
                    fontSize: "0.75rem", 
                    marginLeft: "3px",
                    transform: openUmbrella === program ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s"
                  }}>
                    ▼
                  </span>
                </button>

                {/* Dropdown Menu */}
                {openUmbrella === program && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      left: 0,
                      width: "100%",
                      background: "#8cbfc8",
                      border: "1px solid #7ab0b9",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 10,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {programsWithUmbrella.length > 0 ? (
                      programsWithUmbrella.map((prg, idx) => (
                        <Link
                          href={prg.website!}
                          key={idx}
                          style={{
                            display: "block",
                            padding: "0.75rem 1rem",
                            borderBottom: idx === programsWithUmbrella.length - 1 ? "none" : "1px solid rgba(255,255,255,0.3)",
                            fontSize: "14px",
                            color: "white",
                            textDecoration: "none",
                            fontWeight: 500,
                            transition: "background 0.2s"
                          }}
                          // Optional: Add hover effect via a CSS class or inline logic
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {prg.degree}
                        </Link>
                      ))
                    ) : (
                      <div style={{ padding: "1rem", color: "white", textAlign: "center", fontSize: "14px" }}>
                        None available
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}