import { useState, useRef, useEffect } from "react";
import SEO from "./SEO";  // ✅ import SEO component

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
    ),
    schedule: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
            <path d="M3 10h18" stroke="white" strokeWidth="2" />
        </svg>
    )
};

const availability = {
    2025: {
        7: Array.from({ length: 19 }, (_, i) => i + 1),
        8: Array.from({ length: 14 }, (_, i) => i + 17),
        9: Array.from({ length: 15 }, (_, i) => i + 1),
        10: Array.from({ length: 18 }, (_, i) => i + 13),
        11: Array.from({ length: 9 }, (_, i) => i + 1),
    }
};

export default function HomePage() {
    const [page, setPage] = useState("home");

    const renderPage = () => {
        switch (page) {
            case "3dprint":
                return <ServicePage title="3D Print & Design" desc="High-quality FDM and resin printing, custom modeling, and prototyping." extraDesc="We support a wide range of engineering-grade materials including carbon fiber PLA, nylon, ABS, and various PLA blends. For ultra-high-detail work, we offer 16K resin printing with specialty resins available on demand—from dental-grade to lost wax casting models." goBack={() => setPage("home")} videoSrc="/videos/3dprint.mp4" galleryFolder="/gallery/3dprint_gallery/" galleryImages={["dicetower.JPG", "dino.JPG", "drag2.JPG", "dragbig.JPG", "frog.JPG", "frog2.JPG", "frogs3.jpg", "heyh.JPG", "o1.jpg", "o2.jpg", "o3.JPG", "puzzel.jpg", "tap.JPG", "tap2.JPG", "tap3.JPG", "turt1.JPG", "turt2.JPG"]} />;
            case "3dscan":
                return <ServicePage title="3D Scanning" desc="Accurate scanning for both large and small items. Great for duplicates or custom work." extraDesc="We offer detailed scans for everything from jewelry and small keepsakes to full face and body scans, automotive components, and dashboard panels—perfect for personalization, replication, and repair." goBack={() => setPage("home")} videoSrc="/videos/3dscan.mp4" />;
            case "uvprint":
                return <ServicePage title="UV Color Printing (Coming October 2025)" desc="Vibrant full-color prints on cups, signs, and more using UV-cured ink. This service will be available starting October 2025." goBack={() => setPage("home")} imageSrc="/images/uvprinter.png" />;
            case "laser":
                return <ServicePage title="Laser Engraving & Etching" desc="Detailed laser work on wood, metal, and acrylic with high precision." extraDesc="Our laser services span thousands of personalized items—leather keychains, bottle openers, jewelry, pendants, book covers, knives, signage, stainless steel cups, glassware, tools, battery labeling, picture frames, and more." goBack={() => setPage("home")} videoSrc="/videos/laser.mp4" galleryFolder="/gallery/laser_gallery/" galleryImages={["clay.JPG", "ecoin.JPG", "ecoin2.JPG", "lkc.JPG", "lorcup.JPG", "lorcup2.JPG", "marco.JPG", "pwco.JPG", "scotp.JPG", "sscup1.JPG", "sscup2.JPG"]} />;
            case "schedule":
                return <SchedulePage goBack={() => setPage("home")} />;
            default:
                return <SplashPage navigate={setPage} />;
        }
    };

    return <div style={{ padding: "1rem", minHeight: "100vh", backgroundColor: "#000000" }}>{renderPage()}</div>;
}

function ServicePage({ title, desc, extraDesc, goBack, videoSrc, imageSrc, galleryFolder, galleryImages }) {
    const videoRef = useRef(null);
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play();
            const handleEnded = () => video.pause();
            video.addEventListener("ended", handleEnded);
            return () => video.removeEventListener("ended", handleEnded);
        }
    }, [videoSrc]);

    return (
        <div style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center", color: "white" }}>
            {/* ✅ SEO tags per service */}
            <SEO
                title={`${title} | 3D Print & Burn`}
                description={desc}
                image={imageSrc || (galleryFolder && `${galleryFolder}${galleryImages?.[0]}`) || "/logo_print_burn_better2.png"}
            />

            <h2 style={{ fontSize: "2rem", fontWeight: "600" }}>{title}</h2>
            <p style={{ marginBottom: "1rem" }}>{desc}</p>
            <div style={{ background: "#111827", padding: "1rem", borderRadius: "1rem" }}>
                {imageSrc ? (
                    <img src={imageSrc} alt={title} style={{ width: "100%", borderRadius: "0.75rem" }} />
                ) : (
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", borderRadius: "0.75rem" }}>
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
            {extraDesc && <p style={{ marginTop: "1rem", color: "#9ca3af" }}>{extraDesc}</p>}
            {galleryFolder && galleryImages && (
                <div style={{ marginTop: "2rem" }}>
                    <h3>Gallery</h3>
                    <div style={{ position: "relative", padding: "1rem" }}>
                        <img src={`${galleryFolder}${galleryImages[galleryIndex]}`} alt="Gallery Image" style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }} />
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem", gap: "1rem" }}>
                            <button style={buttonStyle} onClick={() => setGalleryIndex((galleryIndex - 1 + galleryImages.length) % galleryImages.length)}>⬅ Prev</button>
                            <button style={buttonStyle} onClick={() => setGalleryIndex((galleryIndex + 1) % galleryImages.length)}>Next ➡</button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button onClick={goBack} style={buttonStyle}>⬅ Back</button>
                <button onClick={() => window.scrollTo(0, 0)} style={buttonStyle}>⬆ Top</button>
            </div>
        </div>
    );
}

function SplashPage({ navigate }) {
    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            {/* ✅ SEO for homepage */}
            <SEO
                title="3D Print & Burn – Custom Fabrication Services"
                description="Explore 3D printing, scanning, laser engraving, and UV color printing services in Northwest Florida & Lower Alabama."
                image="/logo_print_burn_better2.png"
            />

            <div style={{ maxWidth: "min(92vw, 400px)", margin: "0 auto" }}>
                <img
                    src="/logo_print_burn_better2.png"
                    alt="3D Print & Burn Logo"
                    style={{ display: "block", width: "100%", height: "auto" }}
                />
                <p style={{ color: "#4b5563", fontSize: "1.125rem", margin: "1rem 0" }}>Custom Fabrication Services</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "400px", margin: "0 auto" }}>
                    <div onClick={() => navigate("3dprint")} style={cardStyle}>{icons.print} <div>3D Print & Design</div></div>
                    <div onClick={() => navigate("3dscan")} style={cardStyle}>{icons.scan} <div>3D Scanning</div></div>
                    <div onClick={() => navigate("uvprint")} style={cardStyle}>{icons.uvprint} <div>UV Color Printing</div></div>
                    <div onClick={() => navigate("laser")} style={cardStyle}>{icons.laser} <div>Laser Engraving</div></div>
                </div>
            </div>

            <p style={{ color: "#9ca3af", marginTop: "1rem", marginBottom: "1rem" }}>
                Some services require an appointment.
            </p>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                <div onClick={() => navigate("schedule")} style={{ ...cardStyle, maxWidth: "300px" }}>
                    {icons.schedule} <div>Click here to see available appointments by day</div>
                </div>
            </div>
        </div>
    );
}

function SchedulePage({ goBack }) {
    const [currentMonth, setCurrentMonth] = useState(7);
    const currentYear = 2025;
    const months = ["August", "September", "October", "November", "December"];

    const changeMonth = (offset) => {
        setCurrentMonth((prev) => Math.min(11, Math.max(7, prev + offset)));
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const availableDays = availability[currentYear][currentMonth] || [];

    return (
        <div style={{ color: "white", textAlign: "center" }}>
            <h2>{months[currentMonth - 7]} 2025</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto 1rem", color: "#9ca3af" }}>
                Blue days are available. Red days are unavailable. To request an appointment, select a blue day and email <a href="mailto:John@3dprintandburn.com" style={{ color: "#60a5fa" }}>John@3dprintandburn.com</a> with your request.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
                <button onClick={() => changeMonth(-1)} disabled={currentMonth === 7} style={buttonStyle}>⬅ Prev</button>
                <button onClick={() => changeMonth(1)} disabled={currentMonth === 11} style={buttonStyle}>Next ➡</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", maxWidth: "400px", margin: "0 auto" }}>
                {[...Array(daysInMonth)].map((_, day) => {
                    const dayNum = day + 1;
                    const isAvailable = availableDays.includes(dayNum);
                    return (
                        <div key={dayNum} style={{ padding: "0.5rem", backgroundColor: isAvailable ? "#2563eb" : "#dc2626", borderRadius: "0.25rem" }}>
                            {dayNum}
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: "2rem" }}>
                <button onClick={goBack} style={buttonStyle}>⬅ Back to Home</button>
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
