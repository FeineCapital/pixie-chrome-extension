import { Link } from "wouter";

export function Nav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ padding: "20px 24px 0" }}>
      <div
        className="glass-nav flex items-center justify-between"
        style={{
          maxWidth: "860px",
          width: "100%",
          borderRadius: "100px",
          padding: "14px 28px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34D399" }} />
          Pixie
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {["How it works", "Features", "Pricing"].map((label, i) => (
              <a
                key={label}
                href={["#showcase", "#features", "#pricing"][i]}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="https://github.com/FeineCapital/pixie-desktop-app/releases/latest/download/Pixie.dmg"
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "#000000",
              background: "#ffffff",
              borderRadius: "100px",
              padding: "8px 20px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
