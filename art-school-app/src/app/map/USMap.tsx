"use client"
import { useRef, useEffect} from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { feature } from "topojson-client";
import SchoolPopup from "../../components/map/SchoolPopup";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import { Program } from "@prisma/client";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type StateFeature = Feature<any, GeoJsonProperties>;

interface USMapProps {
  filteredPrograms: Program[];
  hoveredPrograms: Program[] | null;
  setHoveredPrograms: any;
}

export default function USMap({ filteredPrograms, hoveredPrograms, setHoveredPrograms }: USMapProps) {
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
              setTimeout(() => router.push(`/state/${d.id}`), 200);
            });
        })
        .on("mouseenter", function() {
          d3.select(this).attr("fill", "#97a6d3ff");
        })
        .on("mouseleave", function() {
          d3.select(this).attr("fill", "#AABCF0");
        });

    });
  }, [router, filteredPrograms, setHoveredPrograms]);

  return (
    <>
      <svg ref={svgRef} width='100%' height='100%' />

      {/* Tooltip with tail */}
      {/* {hoveredProgram && <SchoolPopup hoveredProgram={hoveredProgram} />} */}
    </>
  );
}
