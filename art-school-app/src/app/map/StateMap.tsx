import { useRef, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { getStateName } from "../../lib/utils/types";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type StateFeature = Feature<any, GeoJsonProperties>;

export default function StateMap() {
  const { stateId } = useParams<{ stateId: string }>();
  const svgRef = useRef<SVGSVGElement>(null);
  const [stateFeature, setStateFeature] = useState<StateFeature | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 600;

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
        .attr("d", (d: StateFeature) => path(d) || "")
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
      const scale = Math.min(8, 0.9 / Math.max(dx / width, dy / height));
      const translate = [width / 2 - scale * x, height / 2 - scale * y];

      // Apply zoom transform
      g.attr("transform", `translate(${translate})scale(${scale})`);
    });
  }, [stateId]);

  return (
    <div style={{ 
      height: "calc(100vh - 64px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      boxSizing: "border-box",
      overflow: "auto"
    }}>
      <h2 style={{ margin: 0, marginBottom: "1rem" }}>
        {stateFeature ? getStateName(stateId) : "Loading..."}
      </h2>
      <svg ref={svgRef} width={900} height={600} style={{ display: "block" }} />
      <div style={{ marginTop: "2rem" }}>
        <Link to="/" style={{
          color: "#77bbc7ff",
          textDecoration: "none",
          fontSize: "1rem"
        }}>
          ← Back to US Map
        </Link>
      </div>
    </div>
  );
}