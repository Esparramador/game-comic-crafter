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
  bg:"#0f0a1e", sidebar:"#0a0718", border:"rgba(124,58,237,0.2)",
  purple:"#7c3aed", cyan:"#00f5ff", pink:"#e91e8c",
  muted:"#5a4080", text:"#e0e8ff"
};

const NAV = [
  { id:"dashboard", icon:"🏠", label:"Dashboard" },
  { id:"create",    icon:"🎮", label:"Mis Juegos" },
  { id:"chars",     icon:"👥", label:"Personajes" },
  { id:"physics",   icon:"⚙️", label:"Physics Mixer" },
  { id:"marketing", icon:"📣", label:"Marketing" },
  { id:"test",      icon:"▶️", label:"Play & Test" },
];

const EXTERNAL = [
  { icon:"📸", label:"@comiccrafter_ai", url:"https://www.instagram.com/comiccrafter_ai", color:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" },
  { icon:"🛍️", label:"Tienda Shopify",  url:"https://comic-crafter.myshopify.com", color:"rgba(150,191,72,0.2)", border:"rgba(150,191,72,0.4)", textColor:"#96bf48" },
  { icon:"🌐", label:"comiccrafter.es",  url:"https://comiccrafter.es", color:"rgba(124,58,237,0.15)", border:"rgba(124,58,237,0.4)", textColor:"#c084fc" },
];

export default function HomeScreen() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const renderContent = () => {
    switch(tab) {
      case "dashboard":  return <DashboardHome onNav={setTab} showToast={showToast} />;
      case "create":     return <EditorScreen  onNav={setTab} showToast={showToast} />;
      case "chars":      return <CharsScreen   onNav={setTab} showToast={showToast} />;
      case "physics":    return <PhysicsScreen onNav={setTab} showToast={showToast} />;
      case "marketing":  return <MarketingScreen onNav={setTab} showToast={showToast} />;
      case "test":       return <TestScreen    onNav={setTab} showToast={showToast} />;
      default:           return <DashboardHome onNav={setTab} showToast={showToast} />;
    }
  };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};font-family:'Inter',sans-serif;color:${C.text}}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:${C.purple};border-radius:2px}
        .sb-item{
          display:flex;align-items:center;gap:0.7rem;
          padding:0.55rem 0.8rem;border-radius:8px;cursor:pointer;
          font-size:0.8rem;color:${C.muted};transition:all 0.2s;
          margin-bottom:2px;border:1px solid transparent;
        }
        .sb-item:hover{background:rgba(124,58,237,0.1);color:${C.text}}
        .sb-active{
          background:linear-gradient(135deg,rgba(124,58,237,0.25),rgba(233,30,140,0.1));
          color:${C.text};border-color:rgba(124,58,237,0.3)!important;
        }
        .ext-link{
          display:flex;align-items:center;gap:0.5rem;
          padding:0.45rem 0.7rem;border-radius:8px;
          text-decoration:none;transition:all 0.2s;
          font-size:0.68rem;font-weight:600;
          border:1px solid rgba(124,58,237,0.2);color:${C.muted};
        }
        .ext-link:hover{background:rgba(124,58,237,0.1);color:${C.text};border-color:rgba(124,58,237,0.4)}
        @media(max-width:768px){
          .sidebar{display:none!important}
          .bottomnav{display:flex!important}
          .main-content{padding-bottom:65px!important}
        }
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:C.bg }}>

        {/* ── SIDEBAR DESKTOP ── */}
        <div className="sidebar" style={{
          width:215, flexShrink:0, background:C.sidebar,
          borderRight:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column",
          overflowY:"auto"
        }}>
          {/* LOGO */}
          <div style={{ padding:"1.1rem 1rem 0.9rem", display:"flex", alignItems:"center", gap:"0.6rem", borderBottom:`1px solid ${C.border}` }}>
            <div style={{
              width:36, height:36, borderRadius:10, flexShrink:0,
              background:"linear-gradient(135deg,#7c3aed,#e91e8c)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem"
            }}>🐧</div>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:"0.85rem", fontWeight:900, color:C.cyan, letterSpacing:1 }}>GCC</div>
              <div style={{ fontSize:"0.52rem", color:C.muted, letterSpacing:1 }}>ENGINE v1.0</div>
            </div>
          </div>

          {/* NAV */}
          <div style={{ padding:"0.8rem 0.7rem", flex:1 }}>
            <div style={{ fontSize:"0.56rem", letterSpacing:"2px", textTransform:"uppercase", color:C.muted, marginBottom:"0.5rem", padding:"0 0.4rem" }}>Menú</div>
            {NAV.map(n => (
              <div key={n.id} onClick={() => setTab(n.id)} className={`sb-item${tab===n.id?" sb-active":""}`}>
                <span style={{ fontSize:"1rem", width:20, textAlign:"center" }}>{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>

          {/* LINKS EXTERNOS */}
          <div style={{ padding:"0.8rem 0.7rem", borderTop:`1px solid ${C.border}` }}>
            <div style={{ fontSize:"0.56rem", letterSpacing:"2px", textTransform:"uppercase", color:C.muted, marginBottom:"0.5rem", padding:"0 0.4rem" }}>Comunidad</div>

            {/* Instagram */}
            <a href="https://www.instagram.com/comiccrafter_ai" target="_blank" rel="noreferrer" className="ext-link" style={{ marginBottom:"0.35rem" }}>
              <div style={{ width:22, height:22, borderRadius:6, background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2.5"/>
                  <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2.5"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                </svg>
              </div>
              @comiccrafter_ai
            </a>

            {/* Shopify */}
            <a href="https://comic-crafter.myshopify.com" target="_blank" rel="noreferrer" className="ext-link" style={{ marginBottom:"0.35rem" }}>
              <div style={{ width:22, height:22, borderRadius:6, background:"rgba(150,191,72,0.2)", border:"1px solid rgba(150,191,72,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="11" height="13" viewBox="0 0 109 124" fill="#96bf48">
                  <path d="M74.7 14.8s-.3-1.6-1.3-2.1c-1-.5-2.2.2-2.2.2s-1.3.4-3.4 1c-.4-1.3-1-2.8-1.9-4.3-2.8-5.4-7-8.2-12-8.2-.3 0-.7 0-1 .1-.1-.2-.3-.3-.5-.5-2.3-2.4-5.2-3.5-8.7-3.4-6.8.2-13.5 5.1-19 13.8-3.9 6.1-6.8 13.8-7.7 19.8-7.8 2.4-13.3 4.1-13.4 4.2-4 1.2-4.1 1.3-4.6 5.1C.9 43.3 0 109.5 0 109.5l75.8 13.2V14.6c-.4.1-.8.1-1.1.2z"/>
                </svg>
              </div>
              <span style={{ color:"#96bf48" }}>Tienda Shopify</span>
            </a>

            {/* Web */}
            <a href="https://comiccrafter.es" target="_blank" rel="noreferrer" className="ext-link">
              <div style={{ width:22, height:22, borderRadius:6, background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"0.75rem" }}>🌐</div>
              <span style={{ color:"#c084fc" }}>comiccrafter.es</span>
            </a>
          </div>

          {/* SALIR */}
          <div style={{ padding:"0.7rem", borderTop:`1px solid ${C.border}` }}>
            <a href={createPageUrl("Landing")} style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem",
              padding:"0.45rem", borderRadius:8, textDecoration:"none",
              background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)",
              color:"rgba(239,68,68,0.6)", fontSize:"0.68rem", fontWeight:600, transition:"all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.12)"; e.currentTarget.style.color="#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(239,68,68,0.06)"; e.currentTarget.style.color="rgba(239,68,68,0.6)"; }}
            >⏻ Salir</a>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* TOPBAR */}
          <div style={{
            height:50, background:"rgba(10,7,24,0.97)", backdropFilter:"blur(10px)",
            borderBottom:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", gap:"0.8rem",
            padding:"0 1.2rem", flexShrink:0
          }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.88rem", fontWeight:700, color:C.cyan }}>
              {NAV.find(n=>n.id===tab)?.icon} {NAV.find(n=>n.id===tab)?.label}
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:"0.5rem", alignItems:"center" }}>
              <div style={{
                background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)",
                borderRadius:20, padding:"2px 10px", fontSize:"0.6rem", color:"#22c55e",
                fontWeight:700, display:"flex", alignItems:"center", gap:4
              }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block", boxShadow:"0 0 6px #22c55e" }}/>
                Online
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="main-content" style={{ flex:1, overflowY:"auto" }}>
            {renderContent()}
          </div>
        </div>

        {/* ── BOTTOM NAV MOBILE ── */}
        <div className="bottomnav" style={{
          display:"none", position:"fixed", bottom:0, left:0, right:0,
          background:C.sidebar, borderTop:`1px solid ${C.border}`,
          justifyContent:"space-around", padding:"0.4rem 0 0.5rem", zIndex:100
        }}>
          {NAV.map(n => (
            <div key={n.id} onClick={() => setTab(n.id)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              padding:"0.25rem 0.4rem", cursor:"pointer",
              color: tab===n.id ? C.cyan : C.muted,
              fontSize:"0.52rem", fontWeight: tab===n.id ? 700 : 400
            }}>
              <span style={{ fontSize:"1.15rem" }}>{n.icon}</span>
              {n.label.split(" ")[0]}
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </>
  );
}
