import { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { initGCC } from "@/api/services";
import DashboardHome  from "@/components/gcc/DashboardHome";
import CharsScreen    from "@/components/gcc/CharsScreen";
import EditorScreen   from "@/components/gcc/EditorScreen";
import MarketingScreen from "@/components/gcc/MarketingScreen";
import PhysicsScreen  from "@/components/gcc/PhysicsScreen";
import TestScreen     from "@/components/gcc/TestScreen";
import AssetsScreen   from "@/components/gcc/AssetsScreen";
import PromptsScreen  from "@/components/gcc/PromptsScreen";
import VoiceScreen    from "@/components/gcc/VoiceScreen";
import ConfigScreen   from "@/components/gcc/ConfigScreen";
import Toast          from "@/components/gcc/Toast";

export const config = { requiresAuth: true };

const C = {
  bg:"#0f0a1e", sidebar:"#0a0718", border:"rgba(124,58,237,0.2)",
  cyan:"#00f5ff", muted:"#5a4080", text:"#e0e8ff"
};

const NAV = [
  { id:"dashboard", icon:"🏠", label:"Dashboard"  },
  { id:"create",    icon:"🎮", label:"Mis Juegos"  },
  { id:"chars",     icon:"👥", label:"Personajes"  },
  { id:"voice",     icon:"🎙️", label:"Voces"       },
  { id:"assets",    icon:"📦", label:"Assets"      },
  { id:"physics",   icon:"⚙️", label:"Physics"     },
  { id:"prompts",   icon:"⚡", label:"Prompts"     },
  { id:"marketing", icon:"📣", label:"Marketing"   },
  { id:"test",      icon:"▶️", label:"Play"        },
  { id:"config",    icon:"🔑", label:"Config API"  },
];

// Cargar config guardada al inicio
function loadSavedConfig() {
  try { return JSON.parse(localStorage.getItem("gcc_api_config") || "{}"); } catch { return {}; }
}

export default function HomeScreen() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  // Aplicar keys guardadas al arrancar
  useEffect(() => { initGCC(loadSavedConfig()); }, []);

  const showToast = (msg, type="info") => {
    setToast({ msg, type, key: Date.now() });
    setTimeout(() => setToast(null), 3200);
  };

  const screens = {
    dashboard:  <DashboardHome  onNav={setTab} showToast={showToast} />,
    create:     <EditorScreen   onNav={setTab} showToast={showToast} />,
    chars:      <CharsScreen    onNav={setTab} showToast={showToast} />,
    voice:      <VoiceScreen    onNav={setTab} showToast={showToast} />,
    assets:     <AssetsScreen   onNav={setTab} showToast={showToast} />,
    physics:    <PhysicsScreen  onNav={setTab} showToast={showToast} />,
    prompts:    <PromptsScreen  onNav={setTab} showToast={showToast} />,
    marketing:  <MarketingScreen onNav={setTab} showToast={showToast} />,
    test:       <TestScreen     onNav={setTab} showToast={showToast} />,
    config:     <ConfigScreen   onNav={setTab} showToast={showToast} />,
  };

  const current = NAV.find(n => n.id === tab);

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};font-family:'Inter',sans-serif;color:${C.text}}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#7c3aed;border-radius:2px}
        .sbi{display:flex;align-items:center;gap:0.55rem;padding:0.4rem 0.65rem;border-radius:8px;cursor:pointer;font-size:0.72rem;color:${C.muted};transition:all 0.15s;margin-bottom:1px;border:1px solid transparent;white-space:nowrap}
        .sbi:hover{background:rgba(124,58,237,0.1);color:${C.text}}
        .sba{background:linear-gradient(135deg,rgba(124,58,237,0.22),rgba(233,30,140,0.08));color:${C.text};border-color:rgba(124,58,237,0.28)!important}
        .extl{display:flex;align-items:center;gap:0.45rem;padding:0.35rem 0.6rem;border-radius:8px;text-decoration:none;transition:all 0.15s;font-size:0.62rem;font-weight:600;border:1px solid rgba(124,58,237,0.18);color:${C.muted};margin-bottom:0.3rem}
        .extl:hover{background:rgba(124,58,237,0.1);color:${C.text};border-color:rgba(124,58,237,0.4)}
        @media(max-width:768px){.sidebar{display:none!important}.bnav{display:flex!important}.maincontent{padding-bottom:68px!important}}
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>

        {/* ── SIDEBAR ── */}
        <div className="sidebar" style={{
          width:192, flexShrink:0, background:C.sidebar,
          borderRight:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column", overflowY:"auto"
        }}>
          {/* Logo */}
          <div style={{ padding:"0.85rem 0.85rem 0.7rem", display:"flex", alignItems:"center", gap:"0.5rem", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:30, height:30, borderRadius:7, background:"linear-gradient(135deg,#7c3aed,#e91e8c)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>🐧</div>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:"0.75rem", fontWeight:900, color:C.cyan, letterSpacing:1 }}>GCC Studio</div>
              <div style={{ fontSize:"0.45rem", color:C.muted, letterSpacing:1 }}>ENGINE v1.0</div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ padding:"0.55rem 0.5rem", flex:1 }}>
            {NAV.map(n => (
              <div key={n.id} onClick={() => setTab(n.id)} className={`sbi${tab===n.id?" sba":""}`}>
                <span style={{ fontSize:"0.85rem", width:16, textAlign:"center", flexShrink:0 }}>{n.icon}</span>
                {n.label}
                {n.id==="prompts" && <span style={{ marginLeft:"auto", fontSize:"0.42rem", background:"rgba(124,58,237,0.3)", color:"#c084fc", padding:"1px 4px", borderRadius:8, fontWeight:800 }}>NEW</span>}
                {n.id==="voice"   && <span style={{ marginLeft:"auto", fontSize:"0.42rem", background:"rgba(34,197,94,0.2)", color:"#22c55e", padding:"1px 4px", borderRadius:8, fontWeight:800 }}>NEW</span>}
              </div>
            ))}
          </div>

          {/* Links externos */}
          <div style={{ padding:"0.5rem 0.5rem", borderTop:`1px solid ${C.border}` }}>
            <div style={{ fontSize:"0.5rem", letterSpacing:2, textTransform:"uppercase", color:C.muted, marginBottom:"0.4rem", padding:"0 0.3rem" }}>Comunidad</div>
            <a href="https://www.instagram.com/comiccrafter_ai" target="_blank" rel="noreferrer" className="extl">
              <div style={{ width:15, height:15, borderRadius:3, background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2.5"/><circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2.5"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg>
              </div>
              Instagram
            </a>
            <a href="https://comic-crafter.myshopify.com" target="_blank" rel="noreferrer" className="extl" style={{ color:"#96bf48" }}>
              <span style={{ fontSize:"0.78rem" }}>🛍️</span> Shopify
            </a>
            <a href="https://comiccrafter.es" target="_blank" rel="noreferrer" className="extl" style={{ color:"#c084fc" }}>
              <span style={{ fontSize:"0.78rem" }}>🌐</span> comiccrafter.es
            </a>
          </div>

          {/* Salir */}
          <div style={{ padding:"0.45rem", borderTop:`1px solid ${C.border}` }}>
            <a href={createPageUrl("Landing")} style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem",
              padding:"0.35rem", borderRadius:8, textDecoration:"none",
              background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)",
              color:"rgba(239,68,68,0.4)", fontSize:"0.6rem", fontWeight:600, transition:"all 0.15s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.1)";e.currentTarget.style.color="#ef4444"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.05)";e.currentTarget.style.color="rgba(239,68,68,0.4)"}}
            >⏻ Salir</a>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Topbar */}
          <div style={{
            height:44, background:"rgba(10,7,24,0.97)", backdropFilter:"blur(10px)",
            borderBottom:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", gap:"0.8rem",
            padding:"0 1rem", flexShrink:0
          }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.8rem", fontWeight:700, color:C.cyan }}>
              {current?.icon} {current?.label}
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:"0.4rem", alignItems:"center" }}>
              <button onClick={() => setTab("prompts")} style={{
                background:"rgba(124,58,237,0.1)", border:`1px solid rgba(124,58,237,0.25)`,
                borderRadius:20, padding:"2px 9px", fontSize:"0.55rem",
                color:"#c084fc", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>⚡ Prompts</button>
              <button onClick={() => setTab("voice")} style={{
                background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)",
                borderRadius:20, padding:"2px 9px", fontSize:"0.55rem",
                color:"#22c55e", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>🎙️ Voces</button>
              <button onClick={() => setTab("config")} style={{
                background:"rgba(255,215,0,0.08)", border:"1px solid rgba(255,215,0,0.25)",
                borderRadius:20, padding:"2px 9px", fontSize:"0.55rem",
                color:"#ffd700", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>⚙️ APIs</button>
            </div>
          </div>

          {/* Content */}
          <div className="maincontent" style={{ flex:1, overflowY:"auto" }}>
            {screens[tab] || screens.dashboard}
          </div>
        </div>

        {/* ── BOTTOM NAV MOBILE ── */}
        <div className="bnav" style={{
          display:"none", position:"fixed", bottom:0, left:0, right:0,
          background:C.sidebar, borderTop:`1px solid ${C.border}`,
          justifyContent:"space-around", padding:"0.25rem 0 0.35rem", zIndex:100
        }}>
          {NAV.slice(0,8).map(n => (
            <div key={n.id} onClick={() => setTab(n.id)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:1,
              padding:"0.15rem 0.15rem", cursor:"pointer",
              color: tab===n.id ? C.cyan : C.muted,
              fontSize:"0.45rem", fontWeight: tab===n.id ? 700 : 400
            }}>
              <span style={{ fontSize:"0.95rem" }}>{n.icon}</span>
              {n.label.split(" ")[0]}
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast key={toast.key} message={toast.msg} type={toast.type} />}
    </>
  );
}
