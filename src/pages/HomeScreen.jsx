import { useState } from "react";
import { createPageUrl } from "@/utils";
import DashboardHome from "@/components/gcc/DashboardHome";
import CharsScreen from "@/components/gcc/CharsScreen";
import EditorScreen from "@/components/gcc/EditorScreen";
import MarketingScreen from "@/components/gcc/MarketingScreen";
import PhysicsScreen from "@/components/gcc/PhysicsScreen";
import TestScreen from "@/components/gcc/TestScreen";
import Toast from "@/components/gcc/Toast";

export const config = { requiresAuth: true };

const C = {
  bg: "#0f0a1e", sidebar: "#0a0718", border: "rgba(124,58,237,0.2)",
  purple: "#7c3aed", cyan: "#00f5ff", pink: "#e91e8c",
  muted: "#5a4080", text: "#e0e8ff"
};

const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "create",    icon: "✏️", label: "Mis Juegos" },
  { id: "chars",     icon: "👥", label: "Personajes" },
  { id: "physics",   icon: "⚙️", label: "Physics Mixer" },
  { id: "marketing", icon: "📣", label: "Marketing" },
  { id: "test",      icon: "▶️", label: "Play & Test" },
];

export default function HomeScreen() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":  return <DashboardHome onNav={setTab} showToast={showToast} />;
      case "create":     return <EditorScreen onNav={setTab} showToast={showToast} />;
      case "chars":      return <CharsScreen onNav={setTab} showToast={showToast} />;
      case "physics":    return <PhysicsScreen onNav={setTab} showToast={showToast} />;
      case "marketing":  return <MarketingScreen onNav={setTab} showToast={showToast} />;
      case "test":       return <TestScreen onNav={setTab} showToast={showToast} />;
      default:           return <DashboardHome onNav={setTab} showToast={showToast} />;
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; font-family: 'Inter', sans-serif; color: ${C.text}; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: ${C.purple}; border-radius: 2px; }

        .sb-item {
          display: flex; align-items: center; gap: 0.7rem;
          padding: 0.6rem 0.8rem; border-radius: 8px; cursor: pointer;
          font-size: 0.82rem; color: ${C.muted}; transition: all 0.2s;
          margin-bottom: 2px; border: 1px solid transparent;
        }
        .sb-item:hover { background: rgba(124,58,237,0.1); color: ${C.text}; }
        .sb-active {
          background: linear-gradient(135deg,rgba(124,58,237,0.25),rgba(233,30,140,0.1));
          color: ${C.text}; border-color: rgba(124,58,237,0.3);
        }
        @media(max-width:768px) {
          .sidebar { display: none !important; }
          .bottomnav { display: flex !important; }
        }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg }}>

        {/* SIDEBAR DESKTOP */}
        <div className="sidebar" style={{
          width: 210, flexShrink: 0, background: C.sidebar,
          borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          padding: "1rem 0", overflowY: "auto"
        }}>
          {/* LOGO */}
          <div style={{ padding: "0 1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg,#7c3aed,#e91e8c)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem"
            }}>🐧</div>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 900, color: C.cyan, letterSpacing: 1 }}>GCC</div>
              <div style={{ fontSize: "0.55rem", color: C.muted, letterSpacing: 1 }}>ENGINE v1.0</div>
            </div>
          </div>

          <div style={{ height: 1, background: C.border, margin: "0 1rem 0.8rem" }} />

          {/* NAV */}
          <div style={{ padding: "0 0.8rem", flex: 1 }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.muted, marginBottom: "0.5rem", padding: "0 0.4rem" }}>
              Menú
            </div>
            {NAV.map(n => (
              <div
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`sb-item${tab === n.id ? " sb-active" : ""}`}
              >
                <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: C.border, margin: "0.8rem 1rem" }} />

          {/* FOOTER */}
          <div style={{ padding: "0 1rem" }}>
            <div style={{ fontSize: "0.58rem", color: C.muted, textAlign: "center", letterSpacing: 1 }}>
              GCC · 6-AI Cluster
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.5rem", justifyContent: "center" }}>
              {["🎤","🧠","🏺","🤖","🎙️","🛍️"].map(e => (
                <span key={e} style={{ fontSize: "0.85rem" }}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* TOPBAR */}
          <div style={{
            height: 52, background: "rgba(10,7,24,0.95)", backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: "0.8rem",
            padding: "0 1.2rem", flexShrink: 0
          }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: C.cyan }}>
              {NAV.find(n => n.id === tab)?.icon} {NAV.find(n => n.id === tab)?.label}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div style={{
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 20, padding: "2px 10px", fontSize: "0.6rem", color: "#22c55e",
                fontWeight: 700, display: "flex", alignItems: "center", gap: 4
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}/>
                Online
              </div>
              <a
                href={createPageUrl("Landing")}
                style={{
                  background: "rgba(124,58,237,0.1)", border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: "4px 10px", fontSize: "0.65rem",
                  color: C.muted, cursor: "pointer", textDecoration: "none"
                }}
              >
                Salir
              </a>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {renderContent()}
          </div>
        </div>

        {/* BOTTOM NAV MOBILE */}
        <div className="bottomnav" style={{
          display: "none", position: "fixed", bottom: 0, left: 0, right: 0,
          background: C.sidebar, borderTop: `1px solid ${C.border}`,
          justifyContent: "space-around", padding: "0.5rem 0", zIndex: 100
        }}>
          {NAV.map(n => (
            <div
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "0.3rem 0.5rem", cursor: "pointer",
                color: tab === n.id ? C.cyan : C.muted,
                fontSize: "0.55rem", fontWeight: tab === n.id ? 700 : 400
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </div>
      </div>

      {/* TOAST */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </>
  );
}
