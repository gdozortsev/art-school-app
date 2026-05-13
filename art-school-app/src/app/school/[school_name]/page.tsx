"use client"
import { getOneSchool } from "@/src/lib/schools/schools";
import { getAllProgramsWithUmbrella } from "@/src/lib/programs/programs";
import { use, useEffect, useState } from "react";
import { programs as programCategories } from "@/src/lib/utils/types";
import { Program } from "@prisma/client"
import Link from "next/link";

export default function SchoolPage({ params }: { params: Promise<{ school_name: string }> }) {
  const { school_name } = use(params);
  const decodedName = decodeURIComponent(school_name);
  const [school, setSchool] = useState<any>(null);
  const [openUmbrella, setOpenUmbrella] = useState<string | null>(null);
  const [programsWithUmbrella, setProgramsWithUmbrella] = useState<Program[]>([]);
  
  useEffect(() => {
    const load = async () => {
      const result = await getOneSchool({ school_name: decodedName });
      result ? setSchool(result.school) : null;
    };
    load();
  }, [decodedName]);

  if (!school) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#008488", fontWeight: 600 }}>
      Loading School Details...
    </div>
  );

  const dropDown = async (umbrella: string) => {
    if (openUmbrella === umbrella) {
        setOpenUmbrella(null);
        return;
    }
    try {
        const response = await getAllProgramsWithUmbrella({
            school: decodedName, 
            umbrella: umbrella
        });
        if (response && response.program){
          setProgramsWithUmbrella(response.program); 
          setOpenUmbrella(umbrella);
        }
    } catch (error) {
        console.error("Failed to fetch programs:", error);
    }
  };

  return (
    <div style={{ 
      minHeight: "calc(100vh - 60px)", 
      backgroundColor: "rgba(0, 132, 136, 0.15)", // Matches All Schools background
      paddingBottom: "4rem",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>

      {/* Hero Header - Matching All Schools Title Style */}
      <div style={{ 
        padding: "4rem 2rem 6rem", 
        textAlign: "center"
      }}>
        <Link href="/all" style={{ 
            color: "#008488", 
            textDecoration: "none", 
            fontSize: "0.9rem", 
            fontWeight: "600",
            display: "inline-block",
            marginBottom: "1rem"
        }}>
          ← Back to All Schools
        </Link>
        <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "800", 
            color: "#004d4f", 
            margin: "0",
            letterSpacing: "-1px" 
        }}>
          {school.school_name}
        </h1>
      </div>

      <div style={{ maxWidth: "1100px", margin: "-4rem auto 0", padding: "0 1.5rem" }}>
        
        {/* Info Cards Row - Matches the card style from All Schools */}
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "1.5rem",
            marginBottom: "2rem"
        }}>
          {[
            { label: "Location", val: school.location, icon: "📍" },
            { label: "Population", val: `${school.school_size} Students`, icon: "👥" },
            { label: "Admissions", val: school.admissions_email, icon: "✉️" }
          ].map((item, i) => (
            <div key={i} style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
            }}>
                <span style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#008488", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{item.label}</span>
                <span style={{ fontSize: "1rem", fontWeight: "600", color: "#333" }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Programs Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          padding: "3rem 2rem", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.05)"
        }}>
          
          <h2 style={{ 
            color: "#004d4f", 
            fontSize: "1.5rem", 
            fontWeight: "800", 
            marginBottom: "2rem", 
            textAlign: "center" 
          }}>
            Available Program Majors
          </h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
            gap: "1rem" 
          }}>
            {programCategories.map(category => (
              <div key={category} style={{ position: "relative" }}>
                <button 
                  onClick={() => dropDown(category)} 
                  style={{ 
                    width: "100%",
                    backgroundColor: openUmbrella === category ? "#008488" : "rgba(0, 132, 136, 0.05)",
                    color: openUmbrella === category ? "white" : "#008488",
                    border: "none",
                    borderRadius: "10px",
                    padding: "1rem 1.2rem",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    if (openUmbrella !== category) e.currentTarget.style.backgroundColor = "rgba(0, 132, 136, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    if (openUmbrella !== category) e.currentTarget.style.backgroundColor = "rgba(0, 132, 136, 0.05)";
                  }}
                >
                  {category}
                  <span style={{ 
                    transform: openUmbrella === category ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                    fontSize: "0.7rem",
                    opacity: 0.7
                  }}>▼</span>
                </button>

                {openUmbrella === category && (
                  <div style={{
                    position: "absolute",
                    top: "105%",
                    left: 0,
                    width: "100%",
                    background: "white",
                    border: "1px solid rgba(0, 132, 136, 0.2)",
                    borderRadius: "10px",
                    boxShadow: "0px 12px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    maxHeight: "250px",
                    overflowY: "auto",
                    padding: "0.5rem"
                  }}>
                    {programsWithUmbrella.length > 0 ? (
                      programsWithUmbrella.map((prg, idx) => (
                        <a
                          href={prg.website || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={idx}
                          style={{
                            display: "block",
                            padding: "0.7rem 1rem",
                            fontSize: "0.85rem",
                            color: "#444",
                            textDecoration: "none",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                            fontWeight: "500"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f7f7")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {prg.degree}
                        </a>
                      ))
                    ) : (
                      <div style={{ padding: "1rem", color: "#999", textAlign: "center", fontSize: "0.8rem" }}>
                        No programs found
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