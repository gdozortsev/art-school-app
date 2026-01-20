import type {Program} from "../../lib/utils/types";
interface SchoolPopupProps {
    hoveredProgram: Program
}
const SchoolPopup = (props: SchoolPopupProps) => {
    const { hoveredProgram } = props;
    return (
        <div style={{
            position: "absolute",
            left: `${hoveredProgram.x - 20}px`,
            top: `${hoveredProgram.y - 200}px`,
            pointerEvents: "none",
            width: "300px",
            zIndex: 1000
          }}>
            
          <div style={{
              backgroundColor: "white",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              textAlign: "left",
              position: "relative"
            }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>{hoveredProgram.name}</h4>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#666" }}>
                📍 {hoveredProgram.city}, {hoveredProgram.state}
              </p>
              <p style={{ margin: "0.5rem 0 0.25rem 0", fontSize: "0.85rem", color: "#444" }}>
                <strong>Programs:</strong>
              </p>
              <p style={{ margin: "0", fontSize: "0.85rem", color: "#666" }}>
                {hoveredProgram.programs.join(", ")}
              </p>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                <strong>Type:</strong> {hoveredProgram.type} | <strong>Enrollment:</strong> {hoveredProgram.enrollment}
              </p>
              
              {/* Tail pointing down */}
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
        </div>
       
    );
    
}

export default SchoolPopup;