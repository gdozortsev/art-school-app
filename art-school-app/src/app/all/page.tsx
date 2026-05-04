"use client"
import { getAllSchools } from "@/src/lib/schools/schools";
import { useEffect, useState } from "react";
import { School } from "@/src/generated/prisma";
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

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#8abbb4" }}>
            <div style={{ fontFamily: "var(--font-sans)", width: "95%", height: "95vh", backgroundColor: "white", borderRadius: "12px" }}>
            
                {/* Header */}
                <div style={{ background: "#111", color: "white", textAlign: "center", padding: "2rem", borderRadius: "12px 12px 0 0" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 500, margin: 0, color: "white" }}>All Schools</h1>
                    <input
                        type="text"
                        placeholder="Search schools..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            marginTop: "1rem",
                            width: "50%",
                            padding: "0.5rem",
                            border: "1px solid #ced4da",
                            borderRadius: "4px",
                            fontSize: "0.9rem"
                        }}
                    />
                </div>

                {/* Schools grid */}
                <div style={{ background: "white", padding: "2rem", overflowY: "auto", height: "calc(95vh - 140px)", borderRadius: "0 0 12px 12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3rem" }}>
                        {filteredSchools.map(school => (
                            <button
                                key={school.school_name}
                                onClick={() => router.push(`/school/${encodeURIComponent(school.school_name!)}`)}
                                style={{ background: "#008488", color: "white", border: "none", borderRadius: "8px", height: "8vh", padding: ".75rem", fontSize: "17px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {school.school_name}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}