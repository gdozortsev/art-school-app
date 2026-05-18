"use client"
import { getAllSchools } from "@/src/lib/schools/schools";
import { useEffect, useState } from "react";
import { School } from "@prisma/client"
import { useRouter } from "next/navigation";

export default function SchoolPage() {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState<string>("");

    const router = useRouter();

    const filteredSchools = schools.filter(school =>
        school.school_name?.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        const load = async () => {
            const result = await getAllSchools();
            if (result?.schools) {
                setSchools(result.schools);
            }
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#008488", fontWeight: 600 }}>
            Loading Schools...
        </div>
    );

    return (
        <div style={{ 
            minHeight: "100vh",
            padding: "2rem" 
        }}>
            <div style={{ 
                maxWidth: "1200px", 
                margin: "0 auto",
                fontFamily: "Inter, system-ui, sans-serif" 
            }}>
            
                {/* Header Section */}
                <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                    <h1 style={{ 
                        fontSize: "2.5rem", 
                        fontWeight: "800", 
                        color: "#004d4f", // Dark teal
                        marginBottom: "1.5rem" 
                    }}>
                        Explore Schools
                    </h1>
                    
                    <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
                        <input
                            type="text"
                            placeholder="Search by school name..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "1rem 1.5rem",
                                border: "1px solid rgba(0, 132, 136, 0.2)",
                                borderRadius: "12px",
                                fontSize: "1rem",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                </div>

                {/* Schools grid */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
                    gap: "1.5rem" 
                }}>
                    {filteredSchools.map(school => (
                        <div
                            key={school.school_name}
                            onClick={() => router.push(`/school/${encodeURIComponent(school.school_name!)}`)}
                            style={{ 
                                background: "white", 
                                color: "#333", 
                                borderRadius: "12px", 
                                padding: "1.5rem", 
                                cursor: "pointer", 
                                display: "flex", 
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                border: "1px solid rgba(0,0,0,0.05)",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 12px 20px rgba(0, 132, 136, 0.1)";
                                e.currentTarget.style.borderColor = "#008488";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                                e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
                            }}
                        >
                            <div style={{ 
                                width: "40px", 
                                height: "40px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1rem",
                                color: "#008488",
                                fontSize: "1.2rem"
                            }}>
                                🏫
                            </div>
                            
                            <h3 style={{ 
                                fontSize: "1.1rem", 
                                fontWeight: "700", 
                                margin: 0, 
                                color: "#004d4f",
                                lineHeight: "1.4"
                            }}>
                                {school.school_name}
                            </h3>
                            
                            <div style={{ 
                                marginTop: "1.5rem", 
                                fontSize: "0.85rem", 
                                fontWeight: "600", 
                                color: "#008488",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                            }}>
                                View Programs →
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSchools.length === 0 && (
                    <div style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
                        No schools found matching "{searchText}"
                    </div>
                )}

            </div>
        </div>
    );
}