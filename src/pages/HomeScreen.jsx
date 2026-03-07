import { useState, useEffect, Suspense, lazy } from "react";
// hyperBrainApi loaded via HyperBrainScreen directly
import Toast from "@/components/gcc/Toast";

export const config = { requiresAuth: true };

// ── Lazy loading para rendimiento ──
const DashboardHome    = lazy(() => import("@/components/gcc/DashboardHome"));
const EditorScreen     = lazy(() => import("@/components/gcc/EditorScreen"));
const CharsScreen      = lazy(() => import("@/components/gcc/CharsScreen"));
const VoiceScreen      = lazy(() => import("@/components/gcc/VoiceScreen"));
const AssetsScreen     = lazy(() => import("@/components/gcc/AssetsScreen"));
const PhysicsScreen    = lazy(() => import("@/components/gcc/PhysicsScreen"));
const PromptsScreen    = lazy(() => import("@/components/gcc/PromptsScreen"));
const MarketingScreen  = lazy(() => import("@/components/gcc/MarketingScreen"));
const TestScreen       = lazy(() => import("@/components/gcc/TestScreen"));
const ConfigScreen     = lazy(() => import("@/components/gcc/ConfigScreen"));
const HyperBrainScreen = lazy(() => import("@/components/gcc/HyperBrainScreen"));
const GuideScreen      = lazy(() => import("@/components/gcc/GuideScreen"));

const C = {
  bg:"#0f0a1e", sidebar:"#0a0718", border:"rgba(124,58,237,0.2)",
  cyan:"#00f5ff", muted:"#5a4080", text:"#e0e8ff", card:"#160d2e"
};

const NAV = [
  { id:"dashboard", icon:"🏠", label:"Dashboard"   },
  { id:"create",    icon:"🎮", label:"Mis Juegos"   },
  { id:"chars",     icon:"👥", label:"Personajes"   },
  { id:"voice",     icon:"🎙️", label:"Voces"        },
  { id:"assets",    icon:"📦", label:"Assets"       },
  { id:"physics",   icon:"⚙️", label:"Physics"      },
  { id:"prompts",   icon:"⚡", label:"Prompts"      },
  { id:"marketing", icon:"📣", label:"Marketing"    },
  { id:"test",      icon:"▶️", label:"Play"         },
  { id:"guide",     icon:"📚", label:"Guía"         },
  { id:"brain",     icon:"🧠", label:"Hyper Brain"  },
  { id:"config",    icon:"🔑", label:"Config API"   },
];

// ── Spinner de carga ──
function PageLoader() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"1rem" }}>
      <div style={{ width:40, height:40, border:"2px solid rgba(124,58,237,0.2)", borderTopColor:"#7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <div style={{ fontSize:"0.62rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Cargando...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Error boundary funcional ──
function SafeScreen({ children }) {
  try { return children; } catch(e) {
    return (
      <div style={{ padding:"2rem", textAlign:"center", color:"#ef4444" }}>
        <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>⚠️</div>
        <div style={{ fontSize:"0.8rem" }}>Error al cargar esta sección</div>
        <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:"0.3rem" }}>{e.message}</div>
      </div>
    );
  }
}

export default function HomeScreen() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {}, []);

  const showToast = (msg, type="info") => {
    setToast({ msg, type, key: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const navigate = (id) => {
    setTab(id);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const current = NAV.find(n => n.id === tab);

  const screenProps = { onNav: navigate, showToast };

  const SCREENS = {
    dashboard:  <DashboardHome    {...screenProps} />,
    create:     <EditorScreen     {...screenProps} />,
    chars:      <CharsScreen      {...screenProps} />,
    voice:      <VoiceScreen      {...screenProps} />,
    assets:     <AssetsScreen     {...screenProps} />,
    physics:    <PhysicsScreen    {...screenProps} />,
    prompts:    <PromptsScreen    {...screenProps} />,
    marketing:  <MarketingScreen  {...screenProps} />,
    test:       <TestScreen       {...screenProps} />,
    guide:      <GuideScreen      {...screenProps} />,
    brain:      <HyperBrainScreen {...screenProps} />,
    config:     <ConfigScreen     {...screenProps} />,
  };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};font-family:'Inter',system-ui,sans-serif;color:${C.text};overflow-x:hidden}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#7c3aed44;border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:#7c3aed99}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .screen-enter{animation:fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)}
        .nav-item{display:flex;align-items:center;gap:0.55rem;padding:0.42rem 0.7rem;border-radius:9px;cursor:pointer;font-size:0.72rem;color:${C.muted};transition:all 0.15s;margin-bottom:2px;border:1px solid transparent;white-space:nowrap}
        .nav-item:hover{background:rgba(124,58,237,0.1);color:#e0e8ff}
        .nav-item.active{background:rgba(124,58,237,0.18);color:#c084fc;border-color:rgba(124,58,237,0.3)}
        .screen-enter{animation:fadeIn 0.2s ease}
        @media(max-width:600px){.desktop-sidebar{display:none!important}.mobile-topbar{display:flex!important}}
        @media(min-width:601px){.mobile-topbar{display:none!important}.desktop-sidebar{display:flex!important}}
      `}</style>

      {/* ── LAYOUT PRINCIPAL ── */}
      <div style={{ display:"flex", minHeight:"100vh" }}>

        {/* SIDEBAR DESKTOP */}
        <aside className="desktop-sidebar" style={{
          width:195, flexShrink:0, background:C.sidebar,
          borderRight:`1px solid ${C.border}`, padding:"1rem 0.7rem",
          display:"flex", flexDirection:"column", position:"sticky",
          top:0, height:"100vh", overflowY:"auto"
        }}>
          {/* Logo */}
          <div style={{ marginBottom:"1.2rem", padding:"0 0.3rem" }}>
            <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#fff", letterSpacing:1, fontFamily:"'Orbitron',sans-serif" }}>GCC</div>
            <div style={{ fontSize:"0.55rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Game Comic Crafter</div>
          </div>

          {/* Nav items */}
          <nav style={{ flex:1 }}>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item${tab===n.id?" active":""}`} onClick={() => navigate(n.id)}>
                <span style={{ flexShrink:0 }}>{n.icon}</span>
                <span>{n.label}</span>
                {n.id === "brain" && (
                  <span style={{ marginLeft:"auto", background:"linear-gradient(90deg,#7c3aed,#00f5ff)", borderRadius:99, padding:"1px 5px", fontSize:"0.48rem", color:"#fff", fontWeight:900, flexShrink:0 }}>5 IAs</span>
                )}
                {n.id === "guide" && (
                  <span style={{ marginLeft:"auto", background:"rgba(34,197,94,0.2)", borderRadius:99, padding:"1px 5px", fontSize:"0.48rem", color:"#22c55e", fontWeight:900, flexShrink:0 }}>NEW</span>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding:"0.6rem 0.3rem", borderTop:`1px solid ${C.border}`, marginTop:"0.5rem" }}>
            <div style={{ fontSize:"0.52rem", color:C.muted, lineHeight:1.6 }}>
              <div style={{ color:"#22c55e", fontWeight:700, marginBottom:2 }}>● 5 IAs Activas</div>
              <div>🏺 Tripo3D · 🎙️ ElevenLabs</div>
              <div>🎨 Replicate · 🧠 Manus</div>
              <div>✨ Gemini 2.0 Flash</div>
            </div>
          </div>
        </aside>

        {/* TOPBAR MOBILE */}
        <div className="mobile-topbar" style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100,
          background:`${C.sidebar}ee`, backdropFilter:"blur(12px)",
          borderBottom:`1px solid ${C.border}`,
          padding:"0.6rem 0.8rem", alignItems:"center", gap:"0.5rem"
        }}>
          <button onClick={() => setSidebarOpen(o=>!o)} style={{
            background:"transparent", border:`1px solid ${C.border}`, borderRadius:7,
            color:C.text, fontSize:"1rem", padding:"0.25rem 0.5rem", cursor:"pointer"
          }}>☰</button>
          <div style={{ fontSize:"0.82rem", fontWeight:800, color:"#fff", flex:1 }}>GCC</div>
          <div style={{ fontSize:"0.65rem", color:"#c084fc" }}>{current?.icon} {current?.label}</div>
        </div>

        {/* DRAWER MOBILE */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200 }} />
            <aside style={{
              position:"fixed", top:0, left:0, bottom:0, width:210, zIndex:201,
              background:C.sidebar, borderRight:`1px solid ${C.border}`,
              padding:"1rem 0.7rem", overflowY:"auto", display:"flex", flexDirection:"column"
            }}>
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ fontSize:"1rem", fontWeight:900, color:"#fff", letterSpacing:1 }}>GCC</div>
                <div style={{ fontSize:"0.52rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Game Comic Crafter</div>
              </div>
              {NAV.map(n => (
                <div key={n.id} className={`nav-item${tab===n.id?" active":""}`} onClick={() => navigate(n.id)}>
                  <span>{n.icon}</span><span>{n.label}</span>
                </div>
              ))}
            </aside>
          </>
        )}

        {/* MAIN CONTENT */}
        <main style={{
          flex:1, overflowY:"auto", overflowX:"hidden",
          paddingTop: "0",
          minHeight:"100vh",
          maxWidth:"100%",
        }}>
          {/* Mobile top spacing */}
          <div className="mobile-topbar" style={{ height:52, display:"block" }} />

          <div className="screen-enter" key={tab} style={{ minHeight:"100vh" }}>
            <Suspense fallback={<PageLoader />}>
              <SafeScreen>
                {SCREENS[tab] || <DashboardHome {...screenProps} />}
              </SafeScreen>
            </Suspense>
          </div>
        </main>
      </div>

      {/* TOAST */}
      {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} />}
    </>
  );
}