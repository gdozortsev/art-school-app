"use client"
import { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { stateNames} from "../../lib/utils/types";
import SchoolPopup from "../../components/map/SchoolPopup";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import { getStaticCities } from "@/src/lib/utils/cities";
import { Program } from "@prisma/client";
import pin from "../../assets/pin.svg"
//"/Users/gdozorts/Downloads/art-school-app/art-school-app/src/app/map/StateMap.tsx"


const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type StateFeature = Feature<any, GeoJsonProperties>;

interface StateMapProps {
  stateId: string;
  filteredPrograms: any;
  hoveredPrograms: Program[] | null;
  setHoveredPrograms: any;
}

interface CityCoord {
  lng: number;
  lat: number;
  city: string;
  Program: Program[];
}

interface ProjectedCoords {
  x: number;
  y: number;
  scale: number
}

export default function StateMap({ stateId, filteredPrograms, hoveredPrograms, setHoveredPrograms }: StateMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [stateFeature, setStateFeature] = useState<StateFeature | null>(null);

  const [cityMappings, setCityMappings] = useState<CityCoord[]>([]);
  const [projected_coords, setProjectedCoords] = useState<ProjectedCoords | null>(null);

  useEffect(() => {
    const fetchMapping = async () => {
        const data = await getStaticCities(stateNames[stateId]);
        if(data){
          setCityMappings(data);
        }
      };
    fetchMapping();
  }, [stateId])
  useEffect(() => {
    if (!svgRef.current) return;
    if (cityMappings.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 750;

    d3.json<Topology>(geoUrl).then((topology) => {
      if (!topology) return;

      const states = feature(
        topology,
        topology.objects.states as GeometryCollection
      ).features as StateFeature[];

      const state = states.find((s) => String(s.id) === String(stateId));

      if (!state) return;

      setStateFeature(state);

      const projection = d3.geoAlbersUsa()
        .fitSize([width, height], {
          type: "FeatureCollection",
          features: states,
        } as FeatureCollection);

      const path = d3.geoPath().projection(projection);

      const g = svg.append("g");

      // Draw all states
      g.selectAll("path")
        .data(states)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d: StateFeature) => String(d.id) === String(stateId) ? "#8176b2ff" : "#AABCF0")
        .attr("stroke", "#8176b2ff")
        .attr("stroke-width", (d: StateFeature) => String(d.id) === String(stateId) ? 2 : 1)
        .style("filter", (d: StateFeature) => String(d.id) === String(stateId) ? "none" : "blur(3px)")
        .style("opacity", (d: StateFeature) => String(d.id) === String(stateId) ? 1 : 0.4);

      // Calculate zoom transform for selected state
      const bounds = path.bounds(state);
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const scale = Math.min(32, 0.9 / Math.max(dx / width, dy / height));
      const translate = [width / 2 - scale * x, height / 2 - scale * y];

      // Apply zoom transform
      g.attr("transform", `translate(${translate})scale(${scale})`);

      // Filter programs for this state
      const statePrograms = filteredPrograms.filter((program: any) =>
        String(program.stateId) === String(stateId)
      );

      // Add Google-style pin markers for art programs in this state
      const markers = g.selectAll(".marker")
        .data(cityMappings)
        .enter()
        .append("g")
        .attr("class", "marker")
        .attr("transform", (d: any) => {
          const coords = projection([d.lng, d.lat]);
          //THIS IS THE FIX FOR CONSTANTLY RELOADING!! DO NOT DELETE
          d.x = coords ? coords[0] : -100
          d.y = coords ? coords[1] : -100
          return coords ? `translate(${coords[0]},${coords[1]})` : `translate(-100,-100)`;
        })
        .style("cursor", "pointer")
        .on("mouseenter", function(event: MouseEvent, d: any) {
          const svgEl = svgRef.current;
          if (!svgEl) return;
          const rect = svgEl.getBoundingClientRect();

          // Apply the same zoom transform that g has, then map to screen coords
          const screenX = (d.x * scale + translate[0]) / 1200 * rect.width + rect.left;
          const screenY = (d.y * scale + translate[1]) / 750 * rect.height + rect.top;

          d3.select(this).select(".pin-body").attr("transform", `scale(${1.4 / scale})`);
          setHoveredPrograms(d.Program);
          setProjectedCoords({ x: screenX, y: screenY, scale: scale });
        })
        .on("mouseleave", function() {
          d3.select(this).select(".pin-body").attr("transform", `scale(${1.5/scale})`);
          setHoveredPrograms(null);
        });

      // Draw pin shape (Google Maps style)
      markers.each(function(d) {
        const marker = d3.select(this);

        const pinGroup = marker.append("g")
          .attr("class", "pin-container")
          // Use a slightly smoother transition for the scale
          .attr("transform", `scale(${1.2 / scale})`);

        // 1. The Pin (Shadow/Glow effect)
        // Adding a subtle circle behind the pin makes it pop without looking "busy"
        pinGroup.append("circle")
          .attr("r", 12)
          .attr("fill", "rgba(0, 132, 136, 0.15)") // Your teal, but very light
          .attr("cy", -10);

        pinGroup.append("image")
          .attr("href", pin.src)
          .attr("width", 22)
          .attr("height", 22)
          .attr("x", -11)
          .attr("y", -22)
          .style("filter", "drop-shadow(0px 2px 2px rgba(0,0,0,0.2))");

        pinGroup.insert("rect", "text")
          .attr("x", (d: any) => -(d.city.length * 3) - 6) // Dynamic width based on city name
          .attr("y", 6)
          .attr("width", (d: any) => (d.city.length * 6) + 12)
          .attr("height", 14)
          .attr("rx", 7) // Rounded corners
          .attr("fill", "rgba(255, 255, 255, 0.9)")
          .style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.1))");

        // 2. Append the text on top
        pinGroup.append("text")
          .attr("x", 0)
          .attr("y", 16)
          .attr("text-anchor", "middle")
          .style("font-size", "9px")
          .style("font-weight", "600")
          .style("fill", "#000000") // Use your teal color for the text
          .style("text-transform", "uppercase")
          .text((d: any) => d.city);
      });

    });
  }, [stateId, cityMappings, filteredPrograms, setHoveredPrograms]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg ref={svgRef} width="100%" height="100%" style={{ marginTop: 0 }} />

      <div style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem"
      }}>
        <a href="/" style={{
          color: "#4a90e2",
          textDecoration: "none",
          fontSize: "1rem",
          backgroundColor: "white",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
        }}>
          ← Back to US Map
        </a>
      </div>

      {hoveredPrograms &&
      <SchoolPopup
        hoveredPrograms={hoveredPrograms}
        projected_coords = {projected_coords!}
        onClose = {() => setHoveredPrograms(null)}
      />}
    </div>
  );
}
