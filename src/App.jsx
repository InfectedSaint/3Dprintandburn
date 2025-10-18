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
        return (
          <ServicePage
            title="3D Print & Design"
            desc="High-quality FDM and resin printing, custom modeling, and prototyping."
            extraDesc="We support a wide range of engineering-grade materials including carbon fiber PLA, nylon, ABS, and various PLA blends. For ultra-high-detail work, we offer 16K resin printing with specialty resins available on demand—from dental-grade to lost wax casting models."
            goBack={() => setPage("home")}
            videoSrc="/videos/3dprint.mp4"
            galleryFolder="/gallery/3dprint_gallery/"
            galleryImages={[
              "dicetower.webp",
  "grim_group.webp",
  "grim.webp",
  "color_roo.webp",
  "skel_rose.webp",
  "fal_cor.webp",
  "dino.webp",
  "drag2.webp",
  "dragbig.webp",
  "frog.webp",
  "blue_dev.webp",
  "c_op.webp",
  "frog2.webp",
  "Pumpkins_guy.webp",
  "frogs3.webp",
  "heyh.webp",
  "o1.webp",
  "o2.webp",
  "o3.webp",
  "puzzel.webp",
  "tap.webp",
  "tap2.webp",
  "tap3.webp",
  "turt1.webp",
  "turt2.webp"
            ]}
          />
        );
      case "3dscan":
        return (
          <ServicePage
            title="3D Scanning"
            desc="Accurate scanning for both large and small items. Great for duplicates or custom work."
            extraDesc="We offer detailed scans for everything from jewelry and small keepsakes to full face and body scans, automotive components, and dashboard panels—perfect for personalization, replication, and repair."
            goBack={() => setPage("home")}
            videoSrc="/videos/3dscan.mp4"
            galleryFolder="/gallery/3dscan_gallery/"
            galleryImages={["Scan_Pendent.webp"]}
          />
        );
      case "uvprint":
        return (
          <ServicePage
            title="UV Color Printing (February 2026)"
            desc="Vibrant full-color prints on cups, signs, and more using UV-cured ink. This service will be available starting February - March 2026."
            goBack={() => setPage("home")}
            imageSrc="/images/uvprinter.png"
          />
        );
      case "laser":
        return (
          <ServicePage
            title="Laser Engraving & Etching"
            desc="Detailed laser work on wood, metal, and acrylic with high precision."
            extraDesc="Our laser services span thousands of personalized items—leather keychains, bottle openers, jewelry, pendants, book covers, knives, signage, stainless steel cups, glassware, tools, battery labeling, picture frames, and more."
            goBack={() => setPage("home")}
            videoSrc="/videos/laser.mp4"
            galleryFolder="/gallery/laser_gallery/"
            galleryImages={[
              "sheri1.webp",
  "sheri2.webp",
  "josh1.webp",
  "josh2.webp",
  "janice1.webp",
  "janice2.webp",
  "den1.webp",
  "david1.webp",
  "david2.webp",
  "clay.webp",
  "ecoin.webp",
  "ecoin2.webp",
  "lkc.webp",
  "lorcup.webp",
  "lorcup2.webp",
  "cutt_b.webp",
  "marco.webp",
  "coin_south.webp",
  "pwco.webp",
  "harper1.webp",
  "harper2.webp",
  "Noah1.webp",
  "Noah2.webp",
  "pops.webp",
  "scotp.webp",
  "sscup1.webp",
  "sscup2.webp"
            ]}
          />
        );
      case "schedule":
        return <SchedulePage goBack={() => setPage("home")} />;
      default:
        return <SplashPage navigate={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#000000" }}>
      {/* Page content with bottom padding so it doesn't get hidden under footer */}
      <div style={{ flex: 1, padding: "1rem", paddingBottom: "3rem" }}>
        {renderPage()}
      </div>

      {/* Sticky footer */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          textAlign: "center",
          padding: "0.5rem",
          fontSize: "0.9rem",
          backgroundColor: "#000000",
          color: "#FFA94D",
          borderTop: "1px solid #333"
        }}
      >
        <a
          href="https://www.facebook.com/profile.php?id=61580311744433"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#FFA94D", textDecoration: "none" }}
        >
          Connect with us on Facebook
        </a>
      </footer>
    </div>
  );
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

      {/* ✅ Gallery with thumbnail strip */}
      {galleryFolder && galleryImages && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Gallery</h3>

          {/* Main image */}
          <div style={{ position: "relative", padding: "1rem" }}>
            <img
              src={`${galleryFolder}${galleryImages[galleryIndex]}`}
              alt="Gallery Image"
              style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "0.5rem" }}
            />
            <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem", gap: "1rem" }}>
              <button
                style={buttonStyle}
                onClick={() => setGalleryIndex((galleryIndex - 1 + galleryImages.length) % galleryImages.length)}
                aria-label="Previous image"
              >
                ⬅ Prev
              </button>
              <button
                style={buttonStyle}
                onClick={() => setGalleryIndex((galleryIndex + 1) % galleryImages.length)}
                aria-label="Next image"
              >
                Next ➡
              </button>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.5rem",
              background: "#0b1220",
              borderRadius: "0.5rem",
              overflowX: "auto",
              whiteSpace: "nowrap"
            }}
            aria-label="Thumbnail gallery"
          >
            {galleryImages.map((img, i) => {
              const isActive = i === galleryIndex;
              return (
                <button
                  key={img + i}
                  onClick={() => setGalleryIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  style={{
                    display: "inline-block",
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    marginRight: "0.5rem",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <img
                    src={`${galleryFolder}${img}`}
                    alt={`Thumbnail ${i + 1}`}
                    loading="lazy"
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      borderRadius: "0.4rem",
                      border: isActive ? "2px solid #60a5fa" : "2px solid transparent",
                      boxShadow: isActive ? "0 0 0 2px rgba(96,165,250,0.3)" : "none",
                      opacity: isActive ? 1 : 0.85
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = isActive ? "1" : "0.85")}
                  />
                </button>
              );
            })}
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

  // 🔗 Build a mailto link with prefilled subject/body for available days
  const mailtoForDay = (dayNum) => {
    const dateLabel = `${months[currentMonth - 7]} ${dayNum}, ${currentYear}`;
    const to = "John@3dprintandburn.com";
    const subject = encodeURIComponent(`Appointment request for ${dateLabel}`);
    const body = encodeURIComponent(
      `Hello 3D Print & Burn,

I'd like to request an appointment on ${dateLabel}.

Project type:
Preferred time:
Notes:

Thanks!`
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const tileBase = {
    padding: "0.5rem",
    borderRadius: "0.25rem",
    textAlign: "center",
    userSelect: "none"
  };

  return (
    <div style={{ color: "white", textAlign: "center" }}>
      <h2>{months[currentMonth - 7]} 2025</h2>
      <p style={{ maxWidth: "600px", margin: "0 auto 1rem", color: "#9ca3af" }}>
        Blue days are available. Red days are unavailable. To request an appointment, click a blue day to open your email client (or email{" "}
        <a href="mailto:John@3dprintandburn.com" style={{ color: "#60a5fa" }}>
          John@3dprintandburn.com
        </a>
        ).
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => changeMonth(-1)} disabled={currentMonth === 7} style={buttonStyle}>⬅ Prev</button>
        <button onClick={() => changeMonth(1)} disabled={currentMonth === 11} style={buttonStyle}>Next ➡</button>
      </div>

      {/* 📅 Calendar grid with links on available (blue) days only */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.5rem",
          maxWidth: "400px",
          margin: "0 auto"
        }}
      >
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1;
          const isAvailable = availableDays.includes(dayNum);

          if (isAvailable) {
            // Link tile for available day
            return (
              <a
                key={dayNum}
                href={mailtoForDay(dayNum)}
                style={{
                  ...tileBase,
                  backgroundColor: "#2563eb",
                  color: "white",
                  textDecoration: "none",
                  display: "block",
                  outline: "none",
                  transition: "transform 0.05s ease"
                }}
                aria-label={`Request appointment for ${months[currentMonth - 7]} ${dayNum}, ${currentYear}`}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {dayNum}
              </a>
            );
          }

          // Unavailable (red) non-link tile
          return (
            <div key={dayNum} style={{ ...tileBase, backgroundColor: "#dc2626" }}>
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
