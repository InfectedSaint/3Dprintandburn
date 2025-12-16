import { useState, useRef, useEffect } from "react";
import SEO from "./SEO"; // ✅ import SEO component

// 🔥 Logo glow/burn CSS (best with transparent PNG)
const logoStyles = `
  .logo-wrapper{
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .logo-base{
    display:block;
    width:100%;
    height:auto;
  }

  /* Glow overlay sits above base and is "cut" by a moving mask band */
  .logo-glow{
    position:absolute;
    inset:0;
    display:block;
    width:100%;
    height:auto;
    pointer-events:none;

    /* Brighten only the logo pixels */
    mix-blend-mode: screen;

    /* Always present but masked to a thin moving band */
    opacity: 1;

    filter:
      blur(0.6px)
      brightness(1.2)
      saturate(1.4)
      drop-shadow(0 0 10px rgba(255,140,0,0.55))
      drop-shadow(0 0 18px rgba(255,60,0,0.7));

    /* Masked sweep (webkit required for Chrome/Edge) */
    -webkit-mask-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 42%,
      rgba(0,0,0,0.0) 44%,
      rgba(0,0,0,1) 50%,
      rgba(0,0,0,0.0) 56%,
      transparent 58%,
      transparent 100%
    );
    -webkit-mask-size: 220% 100%;
    -webkit-mask-position: 0% 0%;
    -webkit-mask-repeat: no-repeat;

    /* (Firefox mask fallback) */
    mask-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 42%,
      rgba(0,0,0,0.0) 44%,
      rgba(0,0,0,1) 50%,
      rgba(0,0,0,0.0) 56%,
      transparent 58%,
      transparent 100%
    );
    mask-size: 220% 100%;
    mask-position: 0% 0%;
    mask-repeat: no-repeat;

    /* Sweep happens “from time to time” */
    animation: burnSweep 18s ease-in-out infinite;
    will-change: transform, filter, -webkit-mask-position, mask-position;
  }

  /* Hover ignite: whole logo glows (not just band) */
  .logo-wrapper.is-hover .logo-glow{
  -webkit-mask-image: none;
  mask-image: none;

  opacity: 1;              /* 🔥 FORCE VISIBILITY */
  animation: none;         /* 🔥 STOP WAITING FOR SWEEP */

  filter:
    blur(1.2px)
    brightness(1.55)
    saturate(1.75)
    drop-shadow(0 0 14px rgba(255,140,0,0.85))
    drop-shadow(0 0 28px rgba(255,60,0,0.95));
}

  /* Subtle extra flicker only during the sweep window */
  @keyframes burnSweep{
    /* idle */
    0%, 68%{
      opacity: 0;
      -webkit-mask-position: -120% 0%;
      mask-position: -120% 0%;
      filter: blur(0.6px) brightness(1.15) saturate(1.35);
    }

    /* sweep begins */
    72%{
      opacity: 1;
      -webkit-mask-position: -40% 0%;
      mask-position: -40% 0%;
      filter:
        blur(0.8px)
        brightness(1.25)
        saturate(1.45)
        drop-shadow(0 0 10px rgba(255,140,0,0.55))
        drop-shadow(0 0 18px rgba(255,60,0,0.75));
    }

    /* flicker hit */
    75%{ opacity: 0.75; }
    76%{ opacity: 1; }

    /* sweep across */
    80%{
      opacity: 1;
      -webkit-mask-position: 60% 0%;
      mask-position: 60% 0%;
      filter:
        blur(1.0px)
        brightness(1.35)
        saturate(1.55)
        drop-shadow(0 0 12px rgba(255,140,0,0.65))
        drop-shadow(0 0 22px rgba(255,60,0,0.85));
    }

    /* finish */
    86%{
      opacity: 0.85;
      -webkit-mask-position: 120% 0%;
      mask-position: 120% 0%;
    }

    /* fade back to idle */
    100%{
      opacity: 0;
      -webkit-mask-position: 160% 0%;
      mask-position: 160% 0%;
      filter: blur(0.6px) brightness(1.15) saturate(1.35);
    }
  }

  @media (prefers-reduced-motion: reduce){
    .logo-glow{ animation:none; opacity: 0; }
    .logo-wrapper.is-hover .logo-glow{ opacity: 1; }
  }
`;

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
  2026: {
    0: Array.from({ length: 31 - 8 + 1 }, (_, i) => i + 8),
    1: [1, 2, 3],
    2: Array.from({ length: 31 - 5 + 1 }, (_, i) => i + 5),
    3: [30],
    4: Array.from({ length: 25 }, (_, i) => i + 1),
    5: Array.from({ length: 30 - 25 + 1 }, (_, i) => i + 25),
    6: Array.from({ length: 20 }, (_, i) => i + 1),
    7: Array.from({ length: 31 - 20 + 1 }, (_, i) => i + 20),
    8: Array.from({ length: 15 }, (_, i) => i + 1),
    9: Array.from({ length: 31 - 15 + 1 }, (_, i) => i + 15),
    10: Array.from({ length: 9 }, (_, i) => i + 1),
    11: Array.from({ length: 31 - 10 + 1 }, (_, i) => i + 10)
  }
};

export default function HomePage() {
  const [page, setPage] = useState("home");

  // ✅ Simple responsive flag for “tight” mobile layout
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 420 : false
  );

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 420);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
              "Rad_ant.webp","Rad_Controler.webp","dicetower.webp","grim_group.webp","grim.webp",
              "color_roo.webp","skel_rose.webp","fal_cor.webp","dino.webp","drag2.webp","dragbig.webp",
              "frog.webp","blue_dev.webp","c_op.webp","frog2.webp","Pumpkins_guy.webp","frogs3.webp",
              "heyh.webp","o1.webp","o2.webp","o3.webp","puzzel.webp","tap.webp","tap2.webp","tap3.webp",
              "turt1.webp","turt2.webp"
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
              "sheri1.webp","sheri2.webp","Barb_1.webp","Barb_2.webp","IDNC.webp","Traci.webp",
              "josh1.webp","josh2.webp","janice1.webp","janice2.webp","den1.webp","david1.webp",
              "david2.webp","clay.webp","ecoin.webp","ecoin2.webp","lkc.webp","lorcup.webp","lorcup2.webp",
              "cutt_b.webp","marco.webp","coin_south.webp","pwco.webp","harper1.webp","harper2.webp",
              "Noah1.webp","Noah2.webp","pops.webp","scotp.webp","sscup1.webp","sscup2.webp"
            ]}
          />
        );
      case "schedule":
        return <SchedulePage goBack={() => setPage("home")} />;
      default:
        return <SplashPage navigate={setPage} isSmall={isSmall} />;
    }
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "#000000" }}>
      {/* ✅ Inject logo CSS once */}
      <style>{logoStyles}</style>

      {/* Page content padding adjusted for fixed footer height */}
      <div style={{ flex: 1, padding: "1rem", paddingBottom: "calc(44px + 0.75rem)" }}>
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
      <SEO
        title={`${title} | 3D Print & Burn`}
        description={desc}
        image={imageSrc || (galleryFolder && `${galleryFolder}${galleryImages?.[0]}`) || "/logo_print_burn_transparent.png"}
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

function SplashPage({ navigate, isSmall }) {
  const splashCardStyle = isSmall
    ? { ...cardStyle, padding: "1.1rem", gap: "0.4rem" }
    : cardStyle;

  return (
    <div style={{ textAlign: "center", marginTop: isSmall ? "1rem" : "2rem" }}>
      <SEO
        title="3D Print & Burn – Custom Fabrication Services"
        description="Explore 3D printing, scanning, laser engraving, and UV color printing services in Northwest Florida & Lower Alabama."
        image="/logo_print_burn_transparent.png"
      />

      <div style={{ maxWidth: `min(92vw, ${isSmall ? "380px" : "400px"})`, margin: "0 auto" }}>
        {/* 🔥 Logo: base + animated glow overlay */}
        <div
  className="logo-wrapper"
  onMouseEnter={(e) => e.currentTarget.classList.add("is-hover")}
  onMouseLeave={(e) => e.currentTarget.classList.remove("is-hover")}
  onTouchStart={(e) => {
    const el = e.currentTarget;
    el.classList.add("is-hover");

    // 🔥 Auto-cool after tap
    setTimeout(() => {
      el.classList.remove("is-hover");
    }, 1200);
  }}
>
          <img
            src="/logo_print_burn_transparent.png"
            alt="3D Print & Burn Logo"
            className="logo-base"
          />
          <img
            src="/logo_print_burn_transparent.png"
            alt=""
            aria-hidden="true"
            className="logo-glow"
          />
        </div>

        <p
          style={{
            color: "#4b5563",
            fontSize: isSmall ? "1rem" : "1.125rem",
            margin: isSmall ? "0.5rem 0 0.75rem" : "1rem 0"
          }}
        >
          Custom Fabrication Services
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: isSmall ? "0.75rem" : "1rem",
            maxWidth: "400px",
            margin: "0 auto"
          }}
        >
          <div onClick={() => navigate("3dprint")} style={splashCardStyle}>{icons.print} <div>3D Print & Design</div></div>
          <div onClick={() => navigate("3dscan")} style={splashCardStyle}>{icons.scan} <div>3D Scanning</div></div>
          <div onClick={() => navigate("uvprint")} style={splashCardStyle}>{icons.uvprint} <div>UV Color Printing</div></div>
          <div onClick={() => navigate("laser")} style={splashCardStyle}>{icons.laser} <div>Laser Engraving</div></div>
        </div>
      </div>

      <p
        style={{
          color: "#9ca3af",
          marginTop: isSmall ? "0.75rem" : "1rem",
          marginBottom: isSmall ? "0.5rem" : "1rem"
        }}
      >
        Some services require an appointment.
      </p>

      <div style={{ marginTop: isSmall ? "0.5rem" : "1rem", display: "flex", justifyContent: "center" }}>
        <div onClick={() => navigate("schedule")} style={{ ...splashCardStyle, maxWidth: "300px" }}>
          {icons.schedule} <div>Click here to see available appointments by day</div>
        </div>
      </div>
    </div>
  );
}

function SchedulePage({ goBack }) {
  const currentYear = 2026;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [currentMonth, setCurrentMonth] = useState(0);

  const changeMonth = (offset) => {
    setCurrentMonth((prev) => Math.min(11, Math.max(0, prev + offset)));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const availableDays = availability?.[currentYear]?.[currentMonth] || [];

  const mailtoForDay = (dayNum) => {
    const dateLabel = `${monthNames[currentMonth]} ${dayNum}, ${currentYear}`;
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
      <h2>{monthNames[currentMonth]} {currentYear}</h2>

      <p style={{ maxWidth: "600px", margin: "0 auto 1rem", color: "#9ca3af" }}>
        Blue days are available. Red days are unavailable. To request an appointment, click a blue day to open your email client (or email{" "}
        <a href="mailto:John@3dprintandburn.com" style={{ color: "#60a5fa" }}>
          John@3dprintandburn.com
        </a>
        ).
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => changeMonth(-1)} disabled={currentMonth === 0} style={buttonStyle}>⬅ Prev</button>
        <button onClick={() => changeMonth(1)} disabled={currentMonth === 11} style={buttonStyle}>Next ➡</button>
      </div>

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
                aria-label={`Request appointment for ${monthNames[currentMonth]} ${dayNum}, ${currentYear}`}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {dayNum}
              </a>
            );
          }

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
