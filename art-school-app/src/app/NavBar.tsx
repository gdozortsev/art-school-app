
export default function NavBar({ currentPath = "/" }) {
  return (
    <nav style={{
      backgroundColor: "#008488",
      padding: "1rem 2rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style = {{display: "flex", gap: "2rem", alignItems: "center", whiteSpace: "nowrap"}}>
            <a 
            href="/" 
            style={{
              color: "#fffafaff",
              textDecoration: "none",
              fontSize: "1.5rem",
              fontWeight: "bold",
              flex: 1
            }}
          >
            Home
          </a>
          <a 
            href="/all" 
            style={{
              color: "#fffafaff",
              textDecoration: "none",
              fontSize: "1.5rem",
              fontWeight: "bold",
              flex: 1
            }}
          >
            All Schools
          </a>
        </div>
       
        
        <div style={{ display: "flex", gap: "2rem" }}>
          <a
            href="/contacts"
            style={{
              color: currentPath === "/" ? "#fffcfcff" : "white",
              textDecoration: "none",
              fontSize: "1.5rem",
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