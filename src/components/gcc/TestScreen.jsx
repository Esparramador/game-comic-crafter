import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, Spinner, EmptyState } from "./shared";

export default function TestScreen({ onNav, showToast }) {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    base44.entities.GameProject.list("-updated_date", 50)
      .then(d => {
        setAllProjects(d||[]);
        const playable = (d||[]).filter(p => p.status==="playable" || p.playable_url);
        setProjects(playable);
        if (playable[0]) setSelected(playable[0]);
      }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{ background:"transparent", border:"none", color:"#5a4080", fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0 }}>← Volver al Dashboard</button>
      <SectionTitle>▶️ Play & Test</SectionTitle>

      {/* Stats rápidas */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1rem" }}>
        {[
          { label:"Jugables", val:projects.length, color:C.green },
          { label:"En Draft", val:allProjects.filter(p=>p.status==="draft").length, color:"#c084fc" },
          { label:"Total", val:allProjects.length, color:C.cyan },
        ].map(s => (
          <div key={s.label} style={{ flex:1, background:C.card, borderRadius:10, padding:"0.6rem", textAlign:"center", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:"1rem", fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:"0.55rem", color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <EmptyState icon="🎮" title="Sin juegos jugables" sub="Los proyectos en estado 'playable' aparecerán aquí" action="✏️ Ir al Editor" onAction={() => onNav("create")} />
      ) : (
        <>
          {/* Lista de juegos */}
          <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", marginBottom:"1rem" }}>
            {projects.map(p => (
              <div key={p.id} onClick={() => setSelected(p)} style={{
                background: selected?.id===p.id ? "rgba(124,58,237,0.15)" : C.card,
                borderRadius:12, padding:"0.85rem",
                border:`1px solid ${selected?.id===p.id ? "rgba(124,58,237,0.5)" : C.border}`,
                cursor:"pointer", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:"0.8rem"
              }}>
                <div style={{
                  width:44, height:44, borderRadius:10, flexShrink:0,
                  background: p.cover_image_url ? `url(${p.cover_image_url}) center/cover` : "linear-gradient(135deg,#7c3aed,#e91e8c)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem"
                }}>{!p.cover_image_url && "🎮"}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.85rem", fontWeight:700, color:C.text }}>{p.title}</div>
                  <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>{p.genre} · {p.format} · {p.engine}</div>
                </div>
                {selected?.id===p.id && (
                  <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, boxShadow:`0 0 8px ${C.green}` }}/>
                )}
              </div>
            ))}
          </div>

          {/* GAME IFRAME */}
          {selected?.playable_url && (
            <div style={{ background:C.card, borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
              <div style={{ padding:"0.7rem 1rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.text }}>🎮 {selected.title}</div>
                <div style={{ display:"flex", gap:"0.4rem" }}>
                  <a href={selected.playable_url} target="_blank" rel="noreferrer" style={{
                    background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.25)",
                    borderRadius:6, padding:"0.3rem 0.7rem", color:C.cyan,
                    fontSize:"0.65rem", fontWeight:700, textDecoration:"none"
                  }}>↗ Nueva pestaña</a>
                  <a href={selected.playable_url} target="_blank" rel="noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      const w = window.open(selected.playable_url, '_blank', 'fullscreen=yes,toolbar=no,menubar=no,scrollbars=no,resizable=yes');
                      if (w) w.focus();
                    }}
                    style={{
                      background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
                      borderRadius:6, padding:"0.3rem 0.7rem", color:"#fff",
                      fontSize:"0.65rem", fontWeight:700, textDecoration:"none", cursor:"pointer"
                    }}>📱 Instalar App</a>
                  <button onClick={() => setFullscreen(!fullscreen)} style={{
                    background:"rgba(124,58,237,0.1)", border:`1px solid ${C.border}`,
                    borderRadius:6, padding:"0.3rem 0.7rem", color:"#c084fc",
                    fontSize:"0.65rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>{fullscreen ? "⬇ Reducir" : "⬆ Expandir"}</button>
                </div>
              </div>
              <iframe
                src={selected.playable_url}
                style={{ width:"100%", height: fullscreen ? "70vh" : 320, border:"none", display:"block" }}
                title={selected.title}
                allow="fullscreen"
              />
            </div>
          )}

          {selected && !selected.playable_url && (
            <div style={{ background:C.card, borderRadius:14, padding:"2rem", border:`1px solid ${C.border}`, textAlign:"center" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.8rem" }}>⏳</div>
              <div style={{ fontSize:"0.85rem", color:C.text, marginBottom:"0.4rem" }}>URL de juego no disponible</div>
              <div style={{ fontSize:"0.72rem", color:C.muted }}>Este proyecto aún no tiene un build jugable</div>
            </div>
          )}
        </>
      )}

      {/* TODOS LOS PROYECTOS (no jugables) */}
      {allProjects.filter(p => !p.playable_url && p.status!=="playable").length > 0 && (
        <div style={{ marginTop:"1rem" }}>
          <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>En Desarrollo</div>
          {allProjects.filter(p => !p.playable_url && p.status!=="playable").slice(0,3).map(p => (
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:"0.7rem", padding:"0.6rem 0", borderBottom:`1px solid rgba(124,58,237,0.08)` }}>
              <div style={{ fontSize:"1.1rem" }}>📝</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.78rem", color:C.text }}>{p.title}</div>
                <div style={{ fontSize:"0.6rem", color:C.muted }}>{p.genre} · {p.status||"draft"}</div>
              </div>
              <span style={{ background:"rgba(124,58,237,0.1)", color:"#c084fc", borderRadius:20, padding:"2px 8px", fontSize:"0.58rem", fontWeight:700 }}>
                {p.status||"draft"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}