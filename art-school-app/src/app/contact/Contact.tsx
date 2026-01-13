import { Link } from "react-router-dom";

export default function Contacts() {
  return (
    <div style={{
      textAlign: "center",
      padding: "2rem",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      <h1>Contact Us</h1>
      
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: "2rem",
        textAlign: "left"
      }}>
        <h2>Get in Touch</h2>
        <p>Did Dina fuck up? Do you hate how Gaby made this app? We'd love to hear from you!</p>
        
        <div style={{ marginTop: "2rem" }}>
          <h3>Email</h3>
          <p>
            <a href="dinaleahkats@gmail.com" style={{ color: "#4a90e2", textDecoration: "none" }}>
              dinaleahkats@gmail.com
            </a>
          </p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3>Phone</h3>
          <p>617-YOUR-MOM</p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3>Address</h3>
          <p>
            YOUR MOMS HOUSE<br />
            YOUR MOM, MA 12345<br />
            United States
          </p>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/" style={{
          color: "#4a90e2",
          textDecoration: "none",
          fontSize: "1rem"
        }}>
          ← Back to Map
        </Link>
      </div>
    </div>
  );
}