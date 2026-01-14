import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { useNavigate } from "react-router-dom";
import { sample_programs, filterOptions } from "../../lib/utils/types";
import type {Program} from "../../lib/utils/types";
import SchoolPopup from "../../components/map/SchoolPopup";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";

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
      
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: newValues };
    });
  };

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
        .attr("fill", "#AABCF0")
        .attr("stroke", "#8176b2ff")
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
          return coords ? `translate(${coords[0]},${coords[1]})` : `translate(-100,-100)`;
        })
        .style("cursor", "pointer")
        .on("mouseenter", function(event: MouseEvent, d: any) {
          d3.select(this).select(".pin-body").attr("transform", "scale(1.2)");
          const coords = projection([d.longitude, d.latitude]);
          if (coords) {
            setHoveredProgram({ ...d, x: coords[0], y: coords[1] });
          }
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
          .attr("fill", "#EA4335")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
        
        // Inner circle
        pinGroup.append("circle")
          .attr("cx", 0)
          .attr("cy", -15)
          .attr("r", 6)
          .attr("fill", "#fff");
      });

    });
  }, [navigate, filteredPrograms]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
      {/* Filter Sidebar */}
      <div style={{
        width: "300px",
        backgroundColor: "#f8f9fa",
        padding: "1.5rem",
        overflowY: "auto",
        borderRight: "1px solid #dee2e6"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Filters</h3>
        
        {/* Search */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search programs..."
            value={filters.searchText}
            onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "0.9rem"
            }}
          />
        </div>

        {/* Type Filter */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>School Type</h4>
          {filterOptions.type.map(type => (
            <label key={type} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={() => toggleFilter("type", type)}
                style={{ marginRight: "0.5rem" }}
              />
              {type}
            </label>
          ))}
        </div>

        {/* Programs Filter */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>Programs</h4>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filterOptions.programs.map(program => (
              <label key={program} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={filters.programs.includes(program)}
                  onChange={() => toggleFilter("programs", program)}
                  style={{ marginRight: "0.5rem" }}
                />
                {program}
              </label>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "0.85rem", color: "#6c757d", marginTop: "1rem" }}>
          Showing {filteredPrograms.length} of {sample_programs.length} programs
        </div>
      </div>

      {/* Map Area */}
      <div style={{ flex: 1, textAlign: "center", position: "relative", paddingTop: "20px" }}>
        <svg ref={svgRef} width="1350" height={600} />
        
        {/* Tooltip with tail */}
        {hoveredProgram && (<SchoolPopup hoveredProgram={hoveredProgram}/>)}
      </div>
    </div>
  );
}