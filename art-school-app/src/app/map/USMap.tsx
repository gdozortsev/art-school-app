import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { useNavigate } from "react-router-dom";
import { sample_programs, filterOptions, fullPrograms } from "../../lib/utils/types";
import type {Program} from "../../lib/utils/types";
import SchoolPopup from "../../components/map/SchoolPopup";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import '../../index.css'; 

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type StateFeature = Feature<any, GeoJsonProperties>;

interface Filters {
  type: string[];
  programs: string[];
  tuition: string[];
  searchText: string;
}

export default function USMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    type: [],
    programs: [],
    tuition: [],
    searchText: ""
  });

  const [droppedPrograms, setDroppedPrograms] = useState<Record<string, boolean>>(
    Object.fromEntries(filters.programs.map(program => [program, false]))
  );
  const [hoveredProgram, setHoveredProgram] = useState<Program | null>(null);

  // Filter art programs based on selected filters
  const filteredPrograms = sample_programs.filter(program => {
    if (filters.type.length > 0 && !filters.type.includes(program.type)) return false;
    if (filters.programs.length > 0 && !filters.programs.some(p => program.programs.includes(p))) return false;
    if (filters.tuition.length > 0 && !filters.tuition.includes(program.tuition)) return false;
    if (filters.searchText && !program.name.toLowerCase().includes(filters.searchText.toLowerCase())) return false;
    return true;
  });

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

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 900;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    d3.json<Topology>(geoUrl).then((topology) => {
      if (!topology) return;

      const states = feature(
        topology,
        topology.objects.states as GeometryCollection
      ).features as StateFeature[];

      const projection = d3.geoAlbersUsa()
        .fitSize([width, height], {
          type: "FeatureCollection",
          features: states,
        } as FeatureCollection);

      const path = d3.geoPath().projection(projection);

      // Draw states
      const statePaths = g.selectAll("path")
        .data(states)
        .enter()
        .append("path")
        .attr("d", (d: StateFeature) => path(d) || "")
        //MAP COLORS
        .attr("fill", "#c0acd4ff")
        .attr("stroke", "#482c68ff")
        .attr("class", "state-path")
        .style("cursor", "pointer")
        .on("click", function(event: MouseEvent, d: StateFeature) {
          const clickedState = d3.select(this);
          
          g.selectAll("path")
            .transition()
            .duration(300)
            .style("filter", function() {
              return this === clickedState.node() ? "none" : "blur(3px)";
            })
            .style("opacity", function() {
              return this === clickedState.node() ? 1 : 0.4;
            });

          clickedState.attr("fill", "#8176b2ff");

          const bounds = path.bounds(d);
          const dx = bounds[1][0] - bounds[0][0];
          const dy = bounds[1][1] - bounds[0][1];
          const x = (bounds[0][0] + bounds[1][0]) / 2;
          const y = (bounds[0][1] + bounds[1][1]) / 2;
          const scale = Math.min(8, 0.9 / Math.max(dx / width, dy / height));
          const translate = [width / 2 - scale * x, height / 2 - scale * y];

          g.transition()
            .duration(750)
            .attr("transform", `translate(${translate})scale(${scale})`)
            .on("end", () => {
              setTimeout(() => navigate(`/state/${d.id}`), 200);
            });
        })
        .on("mouseenter", function() {
          d3.select(this).attr("fill", "#97a6d3ff");
        })
        .on("mouseleave", function() {
          d3.select(this).attr("fill", "#AABCF0");
        });

      // Add Google-style pin markers for art programs
      const markers = g.selectAll(".marker")
        .data(filteredPrograms)
        .enter()
        .append("g")
        .attr("class", "marker")
        .attr("transform", (d: any) => {
          const coords = projection([d.longitude, d.latitude]);
          d.x = coords ? coords[0] : -100
          d.y = coords ? coords[1] : -100
          console.log("here are all the projected coords", coords, " and here are the ogs", d.longitude, d.latitude)
          return coords ? `translate(${coords[0]},${coords[1]})` : `translate(-100,-100)`;
        })
        .style("cursor", "pointer")
        .on("mouseenter", function(event: MouseEvent, d: any) {
          d3.select(this).select(".pin-body").attr("transform", "scale(1.2)");
          setHoveredProgram(d)
        })
        .on("mouseleave", function() {
          d3.select(this).select(".pin-body").attr("transform", "scale(1)");
          setHoveredProgram(null);
        });

      // Draw pin shape (Google Maps style)
      markers.each(function() {
        const marker = d3.select(this);
        
        const pinGroup = marker.append("g")
          .attr("class", "pin-body");
        
        // Pin body (teardrop shape)
        pinGroup.append("path")
          .attr("d", "M 0,-30 C -8,-30 -15,-23 -15,-15 C -15,-8 0,0 0,0 C 0,0 15,-8 15,-15 C 15,-23 8,-30 0,-30 Z")
          .attr("fill", "#cd2525ff")
          .attr("stroke", "#ffffffff")
          .attr("stroke-width", 2);
        
        // Inner circle
        pinGroup.append("circle")
          .attr("cx", 0)
          .attr("cy", -15)
          .attr("r", 6)
          .attr("fill", "#ffffffff");
      });

    });
  }, [navigate, filteredPrograms]);

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh",
      overflow: "hidden"
    }}>
      {/* Filter Sidebar */}
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
            {filterOptions.programs.map(program => (
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
      

      {/* Map Area */}
      <div style={{ flex: 1, textAlign: "center", paddingTop: "20px", position: "relative" }}>
        <svg ref={svgRef} width={900} height={600} />
        
        {/* Tooltip with tail */}
        {hoveredProgram && (<SchoolPopup hoveredProgram={hoveredProgram}/>)}
      </div>
    </div>
  );
}

