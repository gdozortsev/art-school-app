import {useState } from "react";
import {sample_programs, programs, fullPrograms } from "../../lib/utils/types";
interface Filters{
   programs: string[],
   searchText: string
}
interface SidebarProps{
    filters: Filters,
    setFilters: any,
    filteredPrograms: any
}
export default function Sidebar(props: SidebarProps){
    const {filters, setFilters, filteredPrograms} = props
    // const [filters, setFilters] = useState<Filters>({programs: [], searchText: ""});
    const [droppedPrograms, setDroppedPrograms] = useState<Record<string, boolean>>(
        Object.fromEntries(programs.map(program => [program, false]))
    );
    const toggleFilter = (category: keyof Filters, value: string) => {
        setFilters(prev => {
          const current = prev[category];
          if (!Array.isArray(current)) return prev;
          
          // Check if this is a main program with subprograms
          const isMainProgram = fullPrograms.hasOwnProperty(value);
          
          if (isMainProgram) {
            const subPrograms = fullPrograms[value];
            const isCurrentlyChecked = current.includes(value);
            
            if (isCurrentlyChecked) {
              // Uncheck main program and all its subprograms
              const newValues = current.filter(v => v !== value && !subPrograms.includes(v));
              return { ...prev, [category]: newValues };
            } else {
              // Check main program and all its subprograms
              const newValues = [...current, value, ...subPrograms.filter(sp => !current.includes(sp))];
              return { ...prev, [category]: newValues };
            }
          } else {
            // Handle subprogram or regular item toggle
            const newValues = current.includes(value)
              ? current.filter(v => v !== value)
              : [...current, value];
            return { ...prev, [category]: newValues };
          }
        });
      };
      function toggleList(program: string): void {
        setDroppedPrograms(prev => ({
          ...prev,
          [program]: !prev[program]
        }));
      }
    return (
        <div style={{
                width: "300px",
                backgroundColor: "#77bbc7ff",
                padding: "1.5rem",
                overflowY: "auto",
                borderRight: "1px solid #dee2e6"
              }}>
                
        {/* Search */}
        <div style={{ marginBottom: "1.5rem" }}>
            <input
            type="text"
            placeholder="Search programs..."
            value={filters.searchText}
            onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
            style={{
                width: "95%",
                padding: "0.5rem",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                fontSize: "0.9rem"
            }}
            />
        </div>

        {/* Programs Filter */}
        <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ height: "600px", overflowY: "auto" }}>
            {programs.map(program => (
                <div key={program} style={{ marginBottom: "0.5rem" }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                    type="checkbox"
                    checked={filters.programs.includes(program)}
                    onChange={() => toggleFilter("programs", program)}
                    style={{ marginRight: '0.5rem' }}
                    />
                    <button 
                    onClick={() => toggleList(program)} 
                    className="text-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        cursor: 'pointer'
                    }}
                    > 
                    {program}
                    <div style={{
                        transform: droppedPrograms[program] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        marginLeft: '0.5rem'
                    }}>
                        ▼
                    </div>
                    </button>
                </div>
                
                {droppedPrograms[program] && 
                    <div style={{
                    marginLeft: '1.5rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                    }}>   
                    {fullPrograms[program].map(subProgram => (
                        <label 
                        key={subProgram} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                        >
                        <input
                            type="checkbox"
                            checked={filters.programs.includes(subProgram)}
                            onChange={() => toggleFilter("programs", subProgram)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        {subProgram}
                        </label>
                    ))}
                    </div>
                }
                </div>
            ))}
            </div>
        </div>

        <div style={{ fontSize: "0.85rem", color: "#6c757d", marginTop: "1rem" }}>
            Showing {filteredPrograms.length} of {sample_programs.length} programs
        </div>
        </div>
    );
}