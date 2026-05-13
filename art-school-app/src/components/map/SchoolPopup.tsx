import { Program } from "@prisma/client";
import Link from "next/link";

interface SchoolPopupProps {
    hoveredPrograms: Program[];
    projected_coords: ProjectedCoords;
    onClose: () => void;
}
interface ProjectedCoords {
  x: number;
  y: number;
  scale: number;
}

const SchoolPopup = ({ hoveredPrograms, projected_coords, onClose}: SchoolPopupProps) => {
    if (!hoveredPrograms.length) return null;

    const first = hoveredPrograms[0];

    const popupWidth = 300;
    const popupHeight = 200;
    const left = Math.min(projected_coords.x - popupWidth / 2, window.innerWidth - popupWidth - 16);
    const top = Math.max(8, projected_coords.y - popupHeight - 20);

    return (
        <div style={{
            position: "fixed",
            left: `${left}px`,
            //TODO: adjust for scale here
            top: `${top - 60}px`,
            width: `${popupWidth}px`,
            zIndex: 1000,
            pointerEvents: "auto",
        }}>
            {/* Main card */}
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Sticky header with X button */}
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
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            color: "#999",
                            lineHeight: 1,
                            padding: "0 0 0 0.5rem",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable list */}
                <div style={{ maxHeight: "200px", overflowY: "auto", padding: "0.5rem" }}>
                    {hoveredPrograms.map((program, i) => (
                        <Link
                            href={`/school/${program.school_name}`}
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
                                {program.school_name}
                            </p>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>
                                {program.degree}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tail pointing down — outside the scrollable div */}
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
        </div>
    );
}

export default SchoolPopup;