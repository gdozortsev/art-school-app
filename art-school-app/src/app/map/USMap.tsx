"use client"
import { useRef, useEffect} from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { feature } from "topojson-client";
import SchoolPopup from "../../components/map/SchoolPopup";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import { SchoolWithPrograms } from "@/src/lib/utils/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type StateFeature = Feature<any, GeoJsonProperties>;

interface Filters {
  programs: string[]; //all of the selected disciplines (in Program, stored as Program.umbrella_discipline & Program.discipline)
  searchText: string;
}
interface USMapProps {
  filteredSchools: SchoolWithPrograms[];
  filters: Filters; 
}

export default function USMap({ filteredSchools, filters }: USMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1100;
    const height = 750;

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
      g.selectAll("path")
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
              const params = new URLSearchParams();
              if (filters.programs.length > 0) {
                params.set("programs", filters.programs.join(","));
              }
              if (filters.searchText) {
                params.set("search", filters.searchText);
              }
              const query = params.toString();
              setTimeout(() => router.push(`/state/${d.id}${query ? `?${query}` : ""}`), 200);
            });
        })
        .on("mouseenter", function() {
          d3.select(this).attr("fill", "#97a6d3ff");
        })
        .on("mouseleave", function() {
          d3.select(this).attr("fill", "#AABCF0");
        });
        

        const markers = g.selectAll(".marker")
          .data(filteredSchools)
          .enter()
          .append("g")
          .attr("class", "marker")
          .style("pointer-events", "none")
          .attr("transform", (d: any) => {
            const coords = projection([d.longitude, d.latitude]);
            //THIS IS THE FIX FOR CONSTANTLY RELOADING!!
            d.x = coords ? coords[0] : -100
            d.y = coords ? coords[1] : -100
            return coords ? `translate(${coords[0]},${coords[1]})` : `translate(-100,-100)`;
          })

        markers.each(function() {
          const marker = d3.select(this);

          const pinGroup = marker.append("g")
            .attr("class", "pin-body")
            .style("pointer-events", "none");


          pinGroup.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("font-weight", "bold")
            .attr("fill", "#fff8aa")
            .text(".");
        });

    });
  }, [router, filteredSchools]);

  return (
    <>
      <svg ref={svgRef} width='100%' height='100%' />

      <div style={{
        position: "absolute",
        top: "1.5rem",
        left: "85%",
        transform: "translateX(-50%)",

        // Glassmorphism effect
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",

        // Branding colors
        border: "1px solid rgba(0, 132, 136, 0.2)",
        color: "#006d71", // Deeper teal for text

        padding: "0.5rem 1rem",
        borderRadius: "12px", // Matching your school card radius
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",

        fontSize: "1rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "all 0.3s ease",
        opacity: "0.9"
      }}>
        {/* A cleaner icon presentation */}
        <span style={{ 
          backgroundColor: "rgba(0, 132, 136, 0.1)", 
          padding: "4px 8px", 
          borderRadius: "6px",
          fontSize: "1.1rem"
        }}>
          📍
        </span>
        <span>Click on state to get started!</span>
      </div>
    </>
  );
}
