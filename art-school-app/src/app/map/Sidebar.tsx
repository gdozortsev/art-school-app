"use client"
import { useEffect, useState } from "react";
import { programs } from "../../lib/utils/types";
import { getStaticDisciplines } from "@/src/lib/utils/disciplines";

interface Filters {
  programs: string[],
  searchText: string
}

interface SidebarProps {
  filters: Filters,
  setFilters: any,
  filteredPrograms: any
}

export default function Sidebar({ filters, setFilters, filteredPrograms }: SidebarProps) {
  const [droppedPrograms, setDroppedPrograms] = useState<Record<string, boolean>>(
    Object.fromEntries(programs.map(program => [program, false]))
  );
  const [disciplineMapping, setDisciplineMapping] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchMapping = async () => {
      const data = await getStaticDisciplines();
      setDisciplineMapping(data);
    };
    fetchMapping();
  }, []);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters((prev: any) => {
      const current = prev[category];
      const subPrograms = disciplineMapping[value] || [];
      const isMainProgram = !!disciplineMapping[value];

      if (isMainProgram) {
        const isCurrentlyChecked = current.includes(value);
        return {
          ...prev,
          [category]: isCurrentlyChecked
            ? current.filter((v: string) => v !== value && !subPrograms.includes(v))
            : [...new Set([...current, value, ...subPrograms])]
        };
      }
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v: string) => v !== value)
          : [...current, value]
      };
    });
  };

  return (
    <div style={{
      width: "320px",
      backgroundColor: "#008488",
      padding: "1.5rem 1rem",
      display: "flex",
      flexDirection: "column",
      color: "white",
      height: "100%",
      boxSizing: "border-box",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      
      {/* Search Header */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{
          display: "block",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05rem",
          marginBottom: "0.5rem",
          opacity: 0.9,
          fontWeight: 600
        }}>
          Search Programs
        </label>
        <input
          type="text"
          placeholder="e.g. Art History..."
          value={filters.searchText}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, searchText: e.target.value }))}
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            fontSize: "0.9rem",
            color: "white",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Scrollable Filter Area */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.8, marginBottom: "1rem", textTransform: "uppercase" }}>
          Categories
        </p>
        
        {programs.map(program => (
          <div key={program} style={{ marginBottom: "0.5rem" }}>
            {/* Main Program Row */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: droppedPrograms[program] ? "rgba(255, 255, 255, 0.1)" : "transparent",
              borderRadius: "8px",
              padding: "0.4rem 0.6rem",
              transition: "background 0.2s ease"
            }}>
              <input
                type="checkbox"
                checked={filters.programs.includes(program)}
                onChange={() => toggleFilter("programs", program)}
                style={{ 
                    cursor: "pointer",
                    width: "16px",
                    height: "16px",
                    accentColor: "#ffffff" 
                }}
              />
              <div 
                onClick={() => setDroppedPrograms(p => ({ ...p, [program]: !p[program] }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  cursor: 'pointer',
                  padding: "0.4rem 0.6rem",
                  fontSize: '0.95rem',
                  fontWeight: filters.programs.includes(program) ? "600" : "400",
                }}
              > 
                <span style={{ flex: 1 }}>{program}</span>
                <span style={{ 
                  fontSize: "0.6rem", 
                  opacity: 0.6,
                  transform: droppedPrograms[program] ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s"
                }}>▼</span>
              </div>
            </div>
            
            {/* Sub-Programs with clean indentation line */}
            {droppedPrograms[program] && disciplineMapping[program] && (
              <div style={{
                marginLeft: '1.2rem',
                marginTop: '0.2rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                paddingLeft: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem'
              }}>   
                {disciplineMapping[program].map(sub => (
                  <label key={sub} style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    opacity: filters.programs.includes(sub) ? 1 : 0.7,
                    transition: "opacity 0.2s"
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.programs.includes(sub)}
                      onChange={() => toggleFilter("programs", sub)}
                      style={{ marginRight: '0.8rem', accentColor: "#ffffff"}}
                    />
                    {sub}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Stats Card */}
      <div style={{
        marginTop: "1rem",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "0.7rem", opacity: 0.9, textTransform: "uppercase" }}>Showing {filteredPrograms.length} of {filteredPrograms.length} Programs</div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}