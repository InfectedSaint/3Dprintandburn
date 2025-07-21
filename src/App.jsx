import { useState, useRef, useEffect } from "react";

// SVG Icons
const icons = {
    print: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="10" rx="2" stroke="white" strokeWidth="2" />
            <rect x="6" y="16" width="12" height="4" fill="white" />
        </svg>
    ),
    scan: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00FF00" strokeWidth="2" strokeDasharray="4 2" fill="black" />
        </svg>
    ),
    uvprint: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" fill="#ff00ff" stroke="#ffffff" strokeWidth="2" />
            <text x="6" y="16" fontSize="10" fill="white">UV</text>
        </svg>
    ),
    laser: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v20" stroke="red" strokeWidth="2" />
            <path d="M4 12h16" stroke="red" strokeWidth="2" />
        </svg>
    )
};

export default function HomePage() {
    const [page, setPage] = useState("home");

    const renderPage = () => {
        switch (page) {
            case "3dprint":
                return <ServicePage title="3D Print & Design" desc="High-quality FDM and resin printing, custom modeling, and prototyping." extraDesc="We support a wide range of engineering-grade materials including carbon fiber PLA, nylon, ABS, and various PLA blends. For ultra-high-detail work, we offer 16K resin printing with specialty resins available on demand—from dental-grade to lost wax casting models." goBack={() => setPage("home")} videoSrc="/videos/3dprint.mp4" />;
            case "3dscan":
                return <ServicePage title="3D Scanning" desc="Accurate scanning for both large and small items. Great for duplicates or custom work." extraDesc="We offer detailed scans for everything from jewelry and small keepsakes to full face and body scans, automotive components, and dashboard panels—perfect for personalization, replication, and repair." goBack={() => setPage("home")} videoSrc="/videos/3dscan.mp4" />;
            case "uvprint":
                return <ServicePage title="UV Color Printing (Coming October 2025)" desc="Vibrant full-color prints on cups, signs, and more using UV-cured ink. This service will be available starting October 2025." goBack={() => setPage("home")} imageSrc="/images/uvprinter.png" />;
            case "laser":
                return <ServicePage title="Laser Engraving & Etching" desc="Detailed laser work on wood, metal, and acrylic with high precision." extraDesc="Our laser services span thousands of personalized items—leather keychains, bottle openers, jewelry, pendants, book covers, knives, signage, stainless steel cups, glassware, tools, battery labeling, picture frames, and more." goBack={() => setPage("home")} videoSrc="/videos/laser.mp4" />;
            default:
                return <SplashPage navigate={setPage} />;
        }
    };

    return <div style={{ padding: "1rem", minHeight: "100vh", backgroundColor: "#000000" }}>{renderPage()}</div>;
}

function SplashPage({ navigate }) {
    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <img src="/logo_print_burn_better.png" alt="3D Print & Burn Logo" style={{ margin: "0 auto", width: "300px" }} />
            <p style={{ color: "#4b5563", fontSize: "1.125rem", margin: "1rem 0" }}>Custom Fabrication Services</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "400px", margin: "0 auto" }}>
                <div onClick={() => navigate("3dprint")} style={cardStyle}>{icons.print} <div>3D Print & Design</div></div>
                <div onClick={() => navigate("3dscan")} style={cardStyle}>{icons.scan} <div>3D Scanning</div></div>
                <div onClick={() => navigate("uvprint")} style={cardStyle}>{icons.uvprint} <div>UV Color Printing</div></div>
                <div onClick={() => navigate("laser")} style={cardStyle}>{icons.laser} <div>Laser Engraving</div></div>
            </div>
        </div>
    );
}

function ServicePage({ title, desc, extraDesc, goBack, videoSrc, imageSrc }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play();
            const handleEnded = () => {
                video.pause();
            };
            video.addEventListener("ended", handleEnded);
            return () => video.removeEventListener("ended", handleEnded);
        }
    }, [videoSrc]);

    return (
        <div style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center", backgroundColor: "#000000", padding: "1rem", borderRadius: "1rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "600", color: "#ffffff" }}>{title}</h2>
            <p style={{ color: "#d1d5db", marginBottom: "1rem" }}>{desc}</p>
            <div style={{ background: "#111827", borderRadius: "1rem", padding: "1rem", border: "2px dashed #4b5563", boxShadow: "0 0 10px rgba(255,255,255,0.05)" }}>
                {imageSrc ? (
                    <img src={imageSrc} alt={title} style={{ width: "100%", borderRadius: "0.75rem" }} />
                ) : (
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", borderRadius: "0.75rem" }}>
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
            {extraDesc && <p style={{ color: "#9ca3af", marginTop: "1rem" }}>{extraDesc}</p>}
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button onClick={goBack} style={buttonStyle}>⬅ Back</button>
                <button onClick={() => window.scrollTo(0, 0)} style={buttonStyle}>⬆ Top</button>
            </div>
        </div>
    );
}

const cardStyle = {
    background: "#1f2937",
    color: "white",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem"
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
