import React from "react";

export default function NavBar({ currentPath = "/" }) {
  return (
    <nav style={{
      backgroundColor: "#18295E",
      padding: "1rem 2rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <a 
          href="/" 
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold"
          }}
        >
          Home
        </a>
        
        <div style={{ display: "flex", gap: "2rem" }}>
          <a
            href="./contacts"
            style={{
              color: currentPath === "/" ? "#3498db" : "white",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: currentPath === "/" ? "600" : "400",
              transition: "color 0.3s"
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}