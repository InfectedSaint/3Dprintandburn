import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "3dprint":
        return <ServicePage title="3D Print & Design" desc="High-quality FDM and resin printing, custom modeling, and prototyping." goBack={() => setPage("home")} />;
      case "3dscan":
        return <ServicePage title="3D Scanning" desc="Accurate scanning for both large and small items. Great for duplicates or custom work." goBack={() => setPage("home")} />;
      case "uvprint":
        return <ServicePage title="UV Color Printing" desc="Vibrant full-color prints on cups, signs, and more using UV-cured ink." goBack={() => setPage("home")} />;
      case "laser":
        return <ServicePage title="Laser Engraving & Etching" desc="Detailed laser work on wood, metal, and acrylic with high precision." goBack={() => setPage("home")} />;
      default:
        return <SplashPage navigate={setPage} />;
    }
  };

  return <div style={{ padding: "1rem", minHeight: "100vh", background: "linear-gradient(to bottom right, #f1f5f9, #e2e8f0)" }}>{renderPage()}</div>;
}

function SplashPage({ navigate }) {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <img src="/logo_print_burn_better.png" alt="3D Print & Burn Logo" style={{ margin: "0 auto", width: "300px" }} />
      <p style={{ color: "#4b5563", fontSize: "1.125rem", margin: "1rem 0" }}>Custom Fabrication Services</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "400px", margin: "0 auto" }}>
        <div onClick={() => navigate("3dprint")} style={cardStyle}>🖨️ 3D Print & Design</div>
        <div onClick={() => navigate("3dscan")} style={cardStyle}>🧠 3D Scanning</div>
        <div onClick={() => navigate("uvprint")} style={cardStyle}>🎨 UV Color Printing</div>
        <div onClick={() => navigate("laser")} style={cardStyle}>🔥 Laser Engraving</div>
      </div>
    </div>
  );
}

function ServicePage({ title, desc, goBack }) {
  return (
    <div style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "600" }}>{title}</h2>
      <p style={{ color: "#374151", marginBottom: "1rem" }}>{desc}</p>
      <div style={{ background: "white", borderRadius: "1rem", padding: "1rem", border: "2px dashed #cbd5e1", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
        <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>[Image Placeholder]</p>
      </div>
      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={goBack} style={buttonStyle}>⬅ Back</button>
        <button onClick={() => window.scrollTo(0, 0)} style={buttonStyle}>⬆ Top</button>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "0.75rem",
  padding: "1.5rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  cursor: "pointer",
  fontWeight: "500"
};

const buttonStyle = {
  backgroundColor: "#1f2937",
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer"
};
