"use client";
import Link from "next/link";

export default function Contacts() {
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      backgroundColor: "rgba(0, 132, 136, 0.15)",
      padding: "4rem 2rem",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        
        {/* Header Section */}
        <h1 style={{ 
          fontSize: "2.5rem", 
          color: "#004d4f", 
          marginBottom: "1rem",
          fontWeight: "800" 
        }}>
          Contact Us
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "3rem" }}>
          Have questions about the map or specific programs? We're here to help.
        </p>

        {/* Contact Card */}
        <div style={{
          backgroundColor: "white",
          padding: "3rem 2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          textAlign: "center",
          marginBottom: "3rem",
          border: "1px solid rgba(0, 132, 136, 0.1)"
        }}>
          <div style={{ 
            backgroundColor: "rgba(0, 132, 136, 0.1)", 
            width: "60px", 
            height: "60px", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 1.5rem"
          }}>
            <span style={{ fontSize: "1.5rem" }}>✉️</span>
          </div>
          
          <h2 style={{ color: "#004d4f", marginBottom: "0.5rem" }}>Email Us</h2>
          
          <a 
            href="mailto:dinaleahkats@gmail.com" 
            style={{ 
              color: "#008488", 
              textDecoration: "none", 
              fontSize: "1.2rem", 
              fontWeight: "600",
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.7"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            dinaleahkats@gmail.com
          </a>
        </div>

        {/* Navigation Section */}
        <div style={{ marginTop: "2rem" }}>
          <Link href="/" style={{
            backgroundColor: "#008488",
            color: "white",
            textDecoration: "none",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 500,
            display: "inline-block",
            transition: "transform 0.2s, background-color 0.2s",
            boxShadow: "0 4px 12px rgba(0, 132, 136, 0.2)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#006d71";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#008488";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          >
            ← Back to Map
          </Link>
        </div>
      </div>
    </div>
  );
}