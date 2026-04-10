import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import slackLogo from "@assets/image_1775815402627.png";

function StepChart({ values, height = 50 }: { values: number[]; height?: number }) {
  const max = Math.max(...values);
  const w = 200;
  const h = height;
  let d = "";
  for (let i = 0; i < values.length; i++) {
    const x = (i / (values.length - 1)) * w;
    const y = h - (values[i] / max) * (h - 4) - 2;
    if (i === 0) {
      d = `M ${x} ${y}`;
    } else {
      const prevX = ((i - 1) / (values.length - 1)) * w;
      d += ` L ${x} ${y}`;
      if (i < values.length - 1) {
        const nextY = h - (values[i] / max) * (h - 4) - 2;
        d += ` L ${x} ${nextY}`;
      }
    }
  }
  const fillD = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={fillD} fill="url(#chartGrad)" opacity="0.15" />
      <path d={d} fill="none" stroke="#635bff" strokeWidth="1.5" />
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#635bff" />
          <stop offset="100%" stopColor="#635bff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const MRR = [800,800,1200,1200,1800,1800,2200,2200,2600,2600,3100,3100,3400,3400,3900,3900,4200,4200,4600,4600,5100,5100,5600,5900];
const ARR = [8000,10000,10000,14000,14000,18000,18000,24000,24000,32000,32000,40000,40000,48000,48000,55000,55000,62000,62000,66000,66000,70000,70000,70800];
const GROSS = [2000,4000,3000,5000,4000,7000,5000,8000,9000,7000,10000,12000,9000,11000,13000,12000,14000,12000,15000,14000,16000,14000,16000,16100];
const SUBS = [0,0,1,1,1,2,2,2,3,3,3,4,4,4,4,5,5,5,5,5];

function StripeDashboard({ isHovered, isCaptured }: { isHovered: boolean; isCaptured: boolean }) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f6f9fc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}>
      <div style={{ width: "44px", background: "#fff", borderRight: "1px solid #e3e8ee", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "12px", gap: "16px", flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#635bff"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
        <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#f0f0ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#635bff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        </div>
        {[
          <svg key="a" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8792a2" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
          <svg key="b" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8792a2" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg>,
          <svg key="c" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8792a2" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
          <svg key="d" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8792a2" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
          <svg key="e" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8792a2" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        ))}
      </div>

      <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#1a1f36", marginBottom: "5px" }}>Your overview</div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "10px", color: "#697386" }}>Date range</span>
              <span style={{ fontSize: "10px", color: "#1a1f36", border: "1px solid #d8dee4", borderRadius: "4px", padding: "1px 8px", background: "#fff" }}>All time ▾</span>
              <span style={{ fontSize: "10px", color: "#1a1f36", border: "1px solid #d8dee4", borderRadius: "4px", padding: "1px 8px", background: "#fff" }}>Daily ▾</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <span style={{ fontSize: "10px", color: "#1a1f36", border: "1px solid #d8dee4", borderRadius: "5px", padding: "3px 10px", background: "#fff" }}>+ Add</span>
            <span style={{ fontSize: "10px", color: "#1a1f36", border: "1px solid #d8dee4", borderRadius: "5px", padding: "3px 10px", background: "#fff" }}>✎ Edit</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
          <motion.div
            style={{ borderRadius: "8px", background: "#fff", padding: "12px 14px", position: "relative", zIndex: 5 }}
            animate={{
              boxShadow: isCaptured || isHovered
                ? "0 0 0 2px #34D399, 0 1px 3px rgba(0,0,0,0.08)"
                : "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)",
            }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#697386" }}>MRR ⓘ</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c1c9d2" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#1a1f36", margin: "3px 0 6px" }}>$5,899.96</div>
            <div style={{ height: "48px" }}><StepChart values={MRR} height={48} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              {["Feb 1", "Apr 1"].map(l => <span key={l} style={{ fontSize: "8px", color: "#c1c9d2" }}>{l}</span>)}
              <span style={{ fontSize: "8px", color: "#c1c9d2" }}>$6K</span>
            </div>
            <div style={{ fontSize: "7px", color: "#c1c9d2", marginTop: "4px" }}>Updated 20 minutes ago · <span style={{ color: "#635bff" }}>More details</span></div>
          </motion.div>

          <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)", padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#697386" }}>ARR ⓘ</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c1c9d2" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#1a1f36", margin: "3px 0 6px" }}>$70,799.52</div>
            <div style={{ height: "48px" }}><StepChart values={ARR} height={48} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              {["Feb 1", "Apr 1"].map(l => <span key={l} style={{ fontSize: "8px", color: "#c1c9d2" }}>{l}</span>)}
              <span style={{ fontSize: "8px", color: "#c1c9d2" }}>$80K</span>
            </div>
            <div style={{ fontSize: "7px", color: "#c1c9d2", marginTop: "4px" }}>Updated 20 minutes ago · <span style={{ color: "#635bff" }}>More details</span></div>
          </div>

          <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)", padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#697386" }}>Gross volume ⓘ</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c1c9d2" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#1a1f36", margin: "3px 0 6px" }}>$16,099.84</div>
            <div style={{ height: "48px" }}><StepChart values={GROSS} height={48} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              {["Feb 1", "Apr 1"].map(l => <span key={l} style={{ fontSize: "8px", color: "#c1c9d2" }}>{l}</span>)}
              <span style={{ fontSize: "8px", color: "#c1c9d2" }}>$4K</span>
            </div>
            <div style={{ fontSize: "7px", color: "#c1c9d2", marginTop: "4px" }}>Updated 20 minutes ago · <span style={{ color: "#635bff" }}>More details</span></div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
          <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)", padding: "12px 14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#1a1f36", marginBottom: "8px" }}>Top customers by spend ⓘ</div>
            {[
              { name: "Hectors Magic Carpet", email: "hectorsmagic@gmail.com", amount: "$5,699.91" },
              { name: "Cars2Work Auto Repair", email: "cars2workllc@gmail.com", amount: "$2,999.96" },
              { name: "Bullitt County Auto", email: "wilson74@cwi.com", amount: "$2,500.00" },
              { name: "Xtreme Pressure Washing", email: "jraystreme@hotmail.com", amount: "$2,400.00" },
            ].map(c => (
              <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderTop: "1px solid #f2f5f9" }}>
                <div>
                  <div style={{ fontSize: "9px", fontWeight: 600, color: "#1a1f36" }}>{c.name}</div>
                  <div style={{ fontSize: "7px", color: "#8792a2" }}>{c.email}</div>
                </div>
                <span style={{ fontSize: "9px", fontWeight: 600, color: "#1a1f36" }}>{c.amount}</span>
              </div>
            ))}
            <div style={{ fontSize: "7px", color: "#8792a2", marginTop: "5px" }}>Updated yesterday · <span style={{ color: "#635bff" }}>View all</span></div>
          </div>

          <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)", padding: "12px 14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#1a1f36", marginBottom: "2px" }}>Active subscribers ⓘ</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#1a1f36", marginBottom: "4px" }}>5</div>
            <div style={{ height: "50px" }}><StepChart values={SUBS} height={50} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
              {["Feb 1", "Apr 1"].map(l => <span key={l} style={{ fontSize: "8px", color: "#c1c9d2" }}>{l}</span>)}
            </div>
            <div style={{ fontSize: "7px", color: "#c1c9d2", marginTop: "3px" }}>Updated 20 minutes ago</div>
          </div>

          <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)", padding: "12px 14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#1a1f36", marginBottom: "2px" }}>New customers ⓘ</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#1a1f36", marginBottom: "4px" }}>10</div>
            <svg width="100%" height="50" viewBox="0 0 200 50" preserveAspectRatio="none">
              {[[12,32],[38,50],[64,26],[90,44],[116,20],[142,38],[168,46],[190,30]].map(([x, h], i) => (
                <rect key={i} x={x - 8} y={50 - h} width="14" height={h} fill="#635bff" opacity="0.6" rx="2" />
              ))}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
              {["Feb 1", "Apr 1"].map(l => <span key={l} style={{ fontSize: "8px", color: "#c1c9d2" }}>{l}</span>)}
            </div>
            <div style={{ fontSize: "7px", color: "#c1c9d2", marginTop: "3px" }}>Updated 20 minutes ago</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "8px" }}>
          <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)", padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#1a1f36" }}>Recent payments</span>
              <span style={{ fontSize: "9px", color: "#635bff", fontWeight: 500 }}>View all →</span>
            </div>
            {[
              { id: "pi_3R3x...KfL0", customer: "alex@startup.io", amount: "$99.00", status: "Succeeded", color: "#0e6245" },
              { id: "pi_3R3w...Mn2P", customer: "sarah@design.co", amount: "$49.00", status: "Succeeded", color: "#0e6245" },
              { id: "pi_3R3v...Qx7R", customer: "mike@agency.com", amount: "$199.00", status: "Pending", color: "#c26e13" },
            ].map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderTop: "1px solid #f2f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.color }} />
                  <div>
                    <div style={{ fontSize: "9px", color: "#1a1f36", fontWeight: 500 }}>{p.amount} — {p.customer}</div>
                    <div style={{ fontSize: "7px", color: "#8792a2" }}>{p.id}</div>
                  </div>
                </div>
                <span style={{ fontSize: "8px", fontWeight: 500, color: p.color }}>{p.status}</span>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)", padding: "12px 14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#1a1f36", marginBottom: "8px" }}>Payouts</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#1a1f36", marginBottom: "2px" }}>$3,240.00</div>
            <div style={{ fontSize: "9px", color: "#0e6245", marginBottom: "8px" }}>On the way · Apr 3</div>
            <div style={{ height: "3px", background: "#e3e8ee", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: "65%", height: "100%", background: "#635bff", borderRadius: "2px" }} />
            </div>
            <div style={{ fontSize: "8px", color: "#8792a2", marginTop: "4px" }}>$4,960 estimated this month</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlackChat({ showPasted, showSent }: { showPasted: boolean; showSent: boolean }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1d21", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#635bff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>S</span>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Sarah Chen</span>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#2bac76" }} />
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Active now</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: "12px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 1.05 3.18 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.8"/></svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 20px", display: "flex", flexDirection: "column", gap: "14px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#635bff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>S</span>
          </div>
          <div>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Sarah Chen</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginLeft: "8px" }}>10:42 AM</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>Hey, can you drop me the MRR screenshot? Need it for the deck</div>
          </div>
        </div>

        <AnimatePresence>
          {showSent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#2bac76", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Y</span>
              </div>
              <div>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>You</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginLeft: "8px" }}>10:43 AM</span>
                </div>
                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "#fff", width: "220px", marginBottom: "6px" }}>
                  <div style={{ padding: "10px 12px", background: "#f6f9fc" }}>
                    <div style={{ fontSize: "8px", color: "#697386", marginBottom: "2px" }}>MRR</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1f36", marginBottom: "4px" }}>$5,899.96</div>
                    <svg width="100%" height="28" viewBox="0 0 200 28" preserveAspectRatio="none">
                      <path d="M0 26 L20 24 L40 22 L60 19 L80 16 L100 13 L120 10 L140 8 L160 6 L180 4 L200 2" fill="none" stroke="#635bff" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>Here you go, just grabbed it</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(255,255,255,0.1)", minHeight: "40px" }}>
          <AnimatePresence>
            {showPasted && !showSent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ width: "50px", height: "32px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div style={{ width: "100%", height: "100%", background: "#f6f9fc", padding: "3px 5px", boxSizing: "border-box" }}>
                  <div style={{ fontSize: "5px", color: "#697386" }}>MRR</div>
                  <div style={{ fontSize: "8px", fontWeight: 700, color: "#1a1f36" }}>$5,899</div>
                  <svg width="100%" height="7" viewBox="0 0 200 10" preserveAspectRatio="none">
                    <path d="M0 9 L40 7 L80 5 L120 3 L200 2" fill="none" stroke="#635bff" strokeWidth="2"/>
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <span style={{ fontSize: "13px", color: showPasted && !showSent ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)", flex: 1 }}>
            {showPasted && !showSent ? "Here you go, just grabbed it" : "Message Sarah Chen..."}
          </span>
          <AnimatePresence>
            {showPasted && !showSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#007a5a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function CaptureDemo() {
  const [step, setStep] = useState(0);

  // 0  = idle on Stripe, cursor in center
  // 1  = cursor moves toward MRR card
  // 2  = cursor arrives on MRR card, hover border appears, "Click to capture" tooltip
  // 3  = click — capture flash / dark overlay
  // 4  = "Copied to clipboard" notification, cursor still on card
  // 5  = cursor moves up toward the Slack tab
  // 6  = cursor arrives on Slack tab (hovering it)
  // 7  = click Slack tab — tab switches, Slack view loads
  // 8  = cursor moves down to the message input box
  // 9  = cursor arrives at input — paste appears (screenshot thumbnail + text)
  // 10 = cursor moves to the Send button
  // 11 = click Send — message appears in chat thread
  // 12 = pause on sent message before looping
  useEffect(() => {
    const timings = [
      2200,  // 0: idle, look at stripe
      1200,  // 1: moving toward MRR
      1800,  // 2: hovering MRR, tooltip visible
      600,   // 3: click capture flash
      2000,  // 4: "Copied to clipboard" visible
      1000,  // 5: moving toward Slack tab
      800,   // 6: hovering Slack tab
      1200,  // 7: Slack tab clicked, view switches
      1200,  // 8: moving to message input
      1800,  // 9: paste appears in input
      800,   // 10: moving to Send button
      600,   // 11: click Send
      3000,  // 12: pause on sent message
    ];
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % 13;
        setStep(next);
        advance(next);
      }, timings[s]);
    }
    advance(0);
    return () => clearTimeout(t);
  }, []);

  const isHovered = step >= 2 && step <= 4;
  const isCaptured = step >= 3 && step <= 4;
  const showCopied = step === 4;
  const showSlack = step >= 7;
  const showPasted = step >= 9;
  const showSent = step >= 11;
  const activeTab = step >= 7 ? "slack" : "stripe";

  const cursorPositions: Record<number, { left: string; top: string }> = {
    0:  { left: "50%", top: "28%" },
    1:  { left: "28%", top: "34%" },
    2:  { left: "14%", top: "38%" },
    3:  { left: "14%", top: "38%" },
    4:  { left: "14%", top: "38%" },
    5:  { left: "26%", top: "14%" },
    6:  { left: "38%", top: "2%" },
    7:  { left: "38%", top: "2%" },
    8:  { left: "55%", top: "60%" },
    9:  { left: "65%", top: "88%" },
    10: { left: "88%", top: "88%" },
    11: { left: "92%", top: "88%" },
    12: { left: "70%", top: "60%" },
  };
  const pos = cursorPositions[step] || { left: "50%", top: "28%" };

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none">
      <div className="overflow-hidden" style={{ borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", background: "#111" }}>
        {/* Chrome tab bar */}
        <div style={{ background: "#202124", paddingTop: "8px", paddingLeft: "10px", paddingRight: "10px", display: "flex", alignItems: "flex-end" }}>
          <div className="flex gap-1.5 items-center" style={{ padding: "0 6px 0 4px", alignSelf: "center", marginBottom: "4px", marginRight: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px 7px 12px",
              borderRadius: "8px 8px 0 0",
              background: activeTab === "stripe" ? "#292a2d" : "transparent",
              cursor: "default",
              transition: "background 0.2s",
              position: "relative",
              minWidth: "120px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#635bff"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
            <span style={{ fontSize: "11px", color: activeTab === "stripe" ? "#e8eaed" : "#9aa0a6", fontWeight: activeTab === "stripe" ? 500 : 400 }}>Stripe Dashboard</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={activeTab === "stripe" ? "#9aa0a6" : "#6b6e73"} strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: "auto" }}><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px 7px 12px",
              borderRadius: "8px 8px 0 0",
              background: activeTab === "slack" ? "#292a2d" : "transparent",
              cursor: "default",
              transition: "background 0.2s",
              position: "relative",
              minWidth: "120px",
            }}
          >
            <img src={slackLogo} width="14" height="14" style={{ borderRadius: "2px" }} alt="" />
            <span style={{ fontSize: "11px", color: activeTab === "slack" ? "#e8eaed" : "#9aa0a6", fontWeight: activeTab === "slack" ? 500 : 400 }}>Slack — Sarah Chen</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={activeTab === "slack" ? "#9aa0a6" : "#6b6e73"} strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: "auto" }}><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ marginBottom: "4px", display: "flex", gap: "8px", marginRight: "4px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>

        {/* Chrome URL bar */}
        <div style={{ padding: "4px 10px 6px", display: "flex", alignItems: "center", gap: "8px", background: "#292a2d" }}>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a3c3f" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </div>
          <div style={{ flex: 1, background: "#202124", borderRadius: "20px", padding: "5px 14px", display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ fontSize: "11px", color: "#9aa0a6" }}>
              {activeTab === "slack" ? "app.slack.com/client/feine-capital" : "dashboard.stripe.com/dashboard"}
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>

        {/* Content area */}
        <div className="relative" style={{ height: "530px", overflow: "hidden" }}>
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: showSlack ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <StripeDashboard isHovered={isHovered} isCaptured={isCaptured} />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            animate={{ opacity: showSlack ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SlackChat showPasted={showPasted} showSent={showSent} />
          </motion.div>

          {/* Cursor */}
          <motion.div
            className="absolute z-40 pointer-events-none"
            animate={{ left: pos.left, top: pos.top }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
              <path d="M4 2L4 17L7.5 13.5L10 19L12 18L9.5 12.5L14 12.5L4 2Z" fill="white" stroke="#555" strokeWidth="0.8" strokeLinejoin="round"/>
            </svg>
            <AnimatePresence>
              {isHovered && !isCaptured && (
                <motion.div
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "14px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Click to capture
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.4)", zIndex: 3 }}
            animate={{ opacity: isCaptured && !showSlack ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* "Copied to clipboard" notification */}
          <AnimatePresence>
            {showCopied && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50"
                style={{
                  bottom: "14px",
                  right: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 12px",
                  borderRadius: "8px",
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", fontWeight: 600, color: "#34D399" }}>Copied to clipboard</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="w-full px-6 md:px-8 pt-12 pb-24 md:pb-36 flex flex-col items-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "rgba(0,0,0,0.45)",
          textAlign: "center",
          marginBottom: "28px",
          letterSpacing: "0.01em",
        }}
      >
        No dragging or dropping. Just hover and click.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full"
      >
        <CaptureDemo />
      </motion.div>
    </section>
  );
}
