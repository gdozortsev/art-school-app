"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar({}) {
  const pathname = usePathname(); // This hook automatically detects the current URL

  const linkStyle = (path: string) => {
    // Check if the current URL matches the link path
    const isActive = pathname === path;

    return {
      color: "white",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: isActive ? "600" : "400",
      opacity: isActive ? 1 : 0.8,
      transition: "all 0.2s ease",
      padding: "0.5rem 0.8rem",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      // Active background highlight
      backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
    };
  };

  return (
    <nav style={{
      backgroundColor: "#008488",
      height: "60px", // Fixed height to match your main container's calc
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      zIndex: 100,
      boxSizing: "border-box",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>

        {/* Left Side: Brand/Main Links */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/" style={linkStyle("/")}>
            Home
          </Link>

          <Link href="/all" style={linkStyle("/all")}>
            All Schools
          </Link>

          <Link href="/apply" style={linkStyle("/apply")}>
            How Do I Apply?
          </Link>

          <Link href="/careers" style={linkStyle("/careers")}>
            Careers in the Arts
          </Link>
        </div>

        {/* Right Side: Secondary Links */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/contacts"
            style={{
              ...linkStyle("/contacts"),
              border: "1px solid rgba(255, 255, 255, 0.3)", // Highlight contact
            }}
          >
            Contact
          </Link>
        </div>
      </div>

      <style jsx>{`
        a:hover {
          opacity: 1 !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </nav>
  );
}