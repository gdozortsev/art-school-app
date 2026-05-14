import { Program } from "@prisma/client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SchoolPopupProps {
    hoveredPrograms: Program[];
    projected_coords: ProjectedCoords;
    onClose: () => void;
}
interface ProjectedCoords {
  x: number;
  y: number;
  scale: number;
  pinScreenSize: number;
}

const SchoolPopup = ({ hoveredPrograms, projected_coords, onClose }: SchoolPopupProps) => {
    if (!hoveredPrograms.length) return null;

    const first = hoveredPrograms[0];
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: -9999, left: -9999, flipped: false }); // hidden until measured

    const organized = hoveredPrograms.reduce((acc, program) => {
        if (!acc[program.school_name]) acc[program.school_name] = [];
        acc[program.school_name].push(program.discipline);
        return acc;
    }, {} as Record<string, string[]>);

    const popupWidth = 300;
    const navbarHeight = 60;

    useEffect(() => {
        if (!cardRef.current) return;
        const actualHeight = cardRef.current.getBoundingClientRect().height;

        const pinOffset = projected_coords.pinScreenSize * projected_coords.scale * 0.8;
        const idealTop = projected_coords.y - actualHeight - pinOffset - 20; // extra 20px higher
        
        const wouldGoAboveNavbar = idealTop < navbarHeight + 8;
        
        const top = wouldGoAboveNavbar
            ? projected_coords.y + pinOffset + 10 // flip below the pin
            : Math.min(window.innerHeight - actualHeight - 16, idealTop);
        
        const left = Math.min(
            projected_coords.x - popupWidth / 2,
            window.innerWidth - popupWidth - 16
        );
        setPosition({ top, left, flipped: wouldGoAboveNavbar });
    }, [hoveredPrograms, projected_coords]);

    return (
        <div style={{
            position: "fixed",
            left: `${position.left}px`,
            top: `${position.top}px`,
            width: `${popupWidth}px`,
            zIndex: 1000,
            pointerEvents: "auto",
            // invisible on first render while we measure, then snaps into place
            visibility: position.top === -9999 ? "hidden" : "visible",
        }}>
            <div ref={cardRef} style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                minHeight: "80px",
            }}>
                {/* Sticky header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem 0.5rem",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    borderBottom: "1px solid #eee",
                    zIndex: 1,
                }}>
                    <h4 style={{ margin: 0, color: "#333", fontSize: "0.95rem" }}>
                        📍 {first.city}, {first.state.charAt(0) + first.state.slice(1).toLowerCase()}
                    </h4>
                    <button onClick={onClose} style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                        color: "#999",
                        lineHeight: 1,
                        padding: "0 0 0 0.5rem",
                    }}>✕</button>
                </div>

                {/* Scrollable list */}
                <div style={{ maxHeight: "160px", overflowY: "auto", padding: "0.5rem" }}>
                    {Object.entries(organized).map(([school_name, disciplines], i) => (
                        <Link
                            href={`/school/${school_name}`}
                            key={i}
                            style={{
                                display: "block",
                                textDecoration: "none",
                                borderTop: i > 0 ? "1px solid #eee" : "none",
                                padding: "0.5rem",
                                borderRadius: "6px",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            <p style={{ margin: "0 0 0.2rem 0", fontSize: "0.9rem", color: "#333", fontWeight: "600" }}>
                                {school_name}
                            </p>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>
                                {disciplines.join(", ")}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tail */}
            {position.flipped ? (
                // Tail pointing UP (popup is below the pin)
                <div style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: "10px solid white",
                    filter: "drop-shadow(0 -2px 2px rgba(0,0,0,0.1))"
                }} />
            ) : (
                // Tail pointing DOWN (popup is above the pin)
                <div style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "10px solid white",
                    filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))"
                }} />
            )}
        </div>
    );
}

export default SchoolPopup;