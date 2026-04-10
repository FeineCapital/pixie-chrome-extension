import { Link } from "wouter";
import pixieLogo from "@assets/image_1775817701275.png";

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
            color: "#171717",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <img src={pixieLogo} alt="Pixie" style={{ width: "24px", height: "24px", borderRadius: "5px" }} />
          Pixie
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {["Features", "Pricing"].map((label, i) => (
              <a
                key={label}
                href={["#features", "#pricing"][i]}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "rgba(0,0,0,0.45)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#171717")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,0,0,0.45)")}
              >
                {label}
              </a>
            ))}
          </div>

          <Link
            href="/download"
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "#ffffff",
              background: "#171717",
              borderRadius: "100px",
              padding: "8px 20px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Download
          </Link>
        </div>
      </div>
    </div>
  );
}
