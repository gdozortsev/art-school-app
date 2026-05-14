"use client"
import { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { SchoolWithPrograms, stateNames} from "../../lib/utils/types";
import SchoolPopup from "../../components/map/SchoolPopup";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import { getStaticCities } from "@/src/lib/utils/cities";
import { Program } from "@prisma/client";
import pin from "../../assets/pin.svg"
//"/Users/gdozorts/Downloads/art-school-app/art-school-app/src/app/map/StateMap.tsx"


const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const countiesUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

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
  scale: number;
  pinScreenSize: number;
}

export default function StateMap({ stateId, filteredPrograms, hoveredPrograms, setHoveredPrograms }: StateMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [stateFeature, setStateFeature] = useState<StateFeature | null>(null);
  const [cityMappings, setCityMappings] = useState<CityCoord[]>([]);
  const [projected_coords, setProjectedCoords] = useState<ProjectedCoords | null>(null);

  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const initialScaleRef = useRef<number>(1);
  const setHoveredProgramsRef = useRef(setHoveredPrograms);
  const setProjectedCoordsRef = useRef(setProjectedCoords);

  useEffect(() => {
    const fetchMapping = async () => {
      const data = await getStaticCities(stateNames[stateId]);
      if (data) setCityMappings(data);
    };
    fetchMapping();
  }, [stateId]);

  // Effect 1: Only runs on stateId/cityMappings change — sets up SVG, zoom, state drawing
  useEffect(() => {
    if (!svgRef.current) return;
    if (cityMappings.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 750;

    d3.json<Topology>(geoUrl).then(async (topology) => {
      if (!topology) return;

      const states = feature(topology, topology.objects.states as GeometryCollection).features as StateFeature[];
      const state = states.find((s) => String(s.id) === String(stateId));
      if (!state) return;
      setStateFeature(state);

      const projection = d3.geoAlbersUsa().fitSize([width, height], {
        type: "FeatureCollection",
        features: states,
      } as FeatureCollection);
      projectionRef.current = projection;

      const path = d3.geoPath().projection(projection);
      const g = svg.append("g");
      gRef.current = g;

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

      const [countyTopology] = await Promise.all([
        d3.json<Topology>(countiesUrl)
      ]);

      if (!countyTopology) return;

      const counties = feature(
        countyTopology,
        countyTopology.objects.counties as GeometryCollection
      ).features as StateFeature[];

      const stateCounties = counties.filter((c) =>
        String(c.id).startsWith(String(stateId).padStart(2, "0"))
      );

      g.selectAll(".county")
        .data(stateCounties)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.4)")
        .attr("stroke-width", 0.5)
        .style("opacity", 0.2);

      const bounds = path.bounds(state);
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const initialScale = Math.min(32, 0.9 / Math.max(dx / width, dy / height));
      initialScaleRef.current = initialScale;
      const initialTranslate: [number, number] = [width / 2 - initialScale * x, height / 2 - initialScale * y];

      const initialTransform = d3.zoomIdentity
        .translate(initialTranslate[0], initialTranslate[1])
        .scale(initialScale);

      transformRef.current = initialTransform;
      g.attr("transform", initialTransform.toString());

      const getPinScale = (zoomScale: number) => 1.2 / zoomScale;

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([initialScale * 0.8, initialScale * 10])
        .on("zoom", (event) => {
          transformRef.current = event.transform;
          g.attr("transform", event.transform.toString());
          g.selectAll<SVGGElement, any>(".pin-container")
            .attr("transform", `scale(${getPinScale(event.transform.k)})`);
        });

      svg.call(zoom).call(zoom.transform, initialTransform);
    });
  }, [stateId, cityMappings]); // NO filteredPrograms here

  // Effect 2: Only updates markers when filteredPrograms changes
  useEffect(() => {
    const g = gRef.current;
    const projection = projectionRef.current;
    if (!g || !projection) return;

    const getPinScale = (zoomScale: number) => 1.2 / zoomScale;

    const cityMappingsFiltered = cityMappings
      .map((cityCoord: CityCoord) => ({
        ...cityCoord,
        Program: cityCoord.Program.filter(program =>
          filteredPrograms.some((school: SchoolWithPrograms) => school.school_name === program.school_name)
        )
      }))
      .filter((cityCoord: CityCoord) => cityCoord.Program.length > 0);

    // Remove old markers only, not the state paths
    g.selectAll(".marker").remove();

    const markers = g.selectAll(".marker")
      .data(cityMappingsFiltered)
      .enter()
      .append("g")
      .attr("class", "marker")
      .attr("transform", (d: any) => {
        const coords = projection([d.lng, d.lat]);
        // THIS IS THE FIX FOR CONSTANTLY RELOADING!! DO NOT DELETE
        d.x = coords ? coords[0] : -100;
        d.y = coords ? coords[1] : -100;
        return coords ? `translate(${coords[0]},${coords[1]})` : `translate(-100,-100)`;
      })
      .style("cursor", "pointer")
      .on("mouseenter", function(event: MouseEvent, d: any) {
        const svgEl = svgRef.current;
        if (!svgEl) return;
        const rect = svgEl.getBoundingClientRect();
        const t = transformRef.current;
        const screenX = (d.x * t.k + t.x) / 1200 * rect.width + rect.left;
        const screenY = (d.y * t.k + t.y) / 750 * rect.height + rect.top;

        d3.select(this).select(".pin-container").attr("transform", `scale(${getPinScale(t.k) * 1.2})`);
        setHoveredProgramsRef.current(d.Program);
        const pinVisualSize = (22 * 1.2) / t.k * (rect.height / 750); // 22=image height, 1.2=pinScale base
        setProjectedCoordsRef.current({ x: screenX, y: screenY, scale: t.k, pinScreenSize: pinVisualSize});
      })
      .on("mouseleave", function() {
        const t = transformRef.current;
        d3.select(this).select(".pin-container").attr("transform", `scale(${getPinScale(t.k)})`);
        setHoveredProgramsRef.current(null);
      });

    markers.each(function(d: any) {
      const marker = d3.select(this);
      const pinGroup = marker.append("g")
        .attr("class", "pin-container")
        .attr("transform", `scale(${getPinScale(transformRef.current.k)})`);

      pinGroup.append("circle")
        .attr("r", 12)
        .attr("fill", "rgba(0, 132, 136, 0.15)")
        .attr("cy", -10);

      pinGroup.append("image")
        .attr("href", pin.src)
        .attr("width", 22)
        .attr("height", 22)
        .attr("x", -11)
        .attr("y", -22)
        .style("filter", "drop-shadow(0px 2px 2px rgba(0,0,0,0.2))");

      pinGroup.insert("rect", "text")
        .attr("x", -(d.city.length * 3) - 6)
        .attr("y", 6)
        .attr("width", (d.city.length * 6) + 12)
        .attr("height", 14)
        .attr("rx", 7)
        .attr("fill", "rgba(255, 255, 255, 0.9)")
        .style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.1))");

      pinGroup.append("text")
        .attr("x", 0)
        .attr("y", 16)
        .attr("text-anchor", "middle")
        .style("font-size", "9px")
        .style("font-weight", "600")
        .style("fill", "#000000")
        .style("text-transform", "uppercase")
        .text(d.city);
    });
  }, [cityMappings, filteredPrograms]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg ref={svgRef} width="100%" height="100%" style={{ marginTop: 0 }} />
      <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
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
          projected_coords={projected_coords!}
          onClose={() => setHoveredPrograms(null)}
        />}
    </div>
  );
}
