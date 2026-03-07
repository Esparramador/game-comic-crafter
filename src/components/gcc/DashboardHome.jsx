import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, Pill, Spinner, EmptyState } from "./shared";

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      flex:1, background:C.card, borderRadius:12,
      border:`1px solid ${C.border}`, padding:"0.9rem 0.7rem", textAlign:"center"
    }}>
      <div style={{ fontSize:"1.4rem", marginBottom:"0.3rem" }}>{icon}</div>
      <div style={{ fontSize:"1.1rem", fontWeight:800, color:color||C.cyan }}>{value ?? "—"}</div>
      <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{label}</div>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <div onClick={onClick} style={{
      minWidth:160, borderRadius:14, overflow:"hidden",
      border:`1px solid ${C.border}`, background:C.card,
      cursor:"pointer", flexShrink:0, transition:"all 0.25s"
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.55)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >
      <div style={{
        height:100, background: project.cover_image_url
          ? `url(${project.cover_image_url}) center/cover`
          : "linear-gradient(135deg,#160d2e,#7c3aed33)",
        display:"flex", alignItems:"center", justifyContent:"center"
      }}>
        {!project.cover_image_url && <span style={{ fontSize:"2rem" }}>🎮</span>}
      </div>
      <div style={{ padding:"0.6rem 0.7rem" }}>
        <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.text, marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {project.title || "Sin título"}
        </div>
        <div style={{ fontSize:"0.6rem", color:C.muted, textTransform:"uppercase", letterSpacing:0.8 }}>
          {project.genre||"—"} · {project.format||"—"}
        </div>
        <div style={{
          marginTop:6, display:"inline-block",
          background: project.status==="playable" ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)",
          color: project.status==="playable" ? C.green : "#c084fc",
          borderRadius:20, padding:"2px 8px", fontSize:"0.58rem", fontWeight:700, textTransform:"uppercase"
        }}>{project.status||"draft"}</div>
      </div>
    </div>
  );
}

function CharCard({ char }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:"0.7rem",
      background:C.card2, borderRadius:12, padding:"0.7rem",
      border:`1px solid ${C.border}`, marginBottom:"0.6rem"
    }}>
      <div style={{
        width:44, height:44, borderRadius:"50%", flexShrink:0,
        background: char.concept_image_url
          ? `url(${char.concept_image_url}) center/cover`
          : "linear-gradient(135deg,#7c3aed,#e91e8c)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"1.3rem", border:"2px solid rgba(124,58,237,0.3)"
      }}>
        {!char.concept_image_url && "👤"}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:"0.82rem", fontWeight:700, color:C.text }}>{char.name||"Personaje"}</div>
        <div style={{ fontSize:"0.62rem", color:C.muted, marginTop:2 }}>{char.archetype||char.gender||"—"}</div>
      </div>
      <Pill color="cyan">{char.behavior_logic||"npc"}</Pill>
    </div>
  );
}

export default function DashboardHome({ onNav, showToast }) {
  const [projects, setProjects] = useState([]);
  const [chars, setChars] = useState([]);
  const [voices, setVoices] = useState([]);
  const [assets, setAssets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.auth.me().catch(() => null),
      base44.entities.GameProject.list("-updated_date", 20),
      base44.entities.GameCharacter.list("-created_date", 10),
      base44.entities.VoiceAsset.list("-created_date", 100).catch(() => []),
      base44.entities.AssetRepository.list("-created_date", 100).catch(() => []),
    ]).then(([u, projs, ch, v, a]) => {
      setUser(u);
      setProjects(projs||[]);
      setChars(ch||[]);
      setVoices(v||[]);
      setAssets(a||[]);
      // Intentar cargar perfil del usuario autenticado
      if (u?.email) {
        base44.entities.SuperUserProfile.filter({ email: u.email }, "-created_date", 1)
          .then(p => setProfile(Array.isArray(p) ? p[0] : p))
          .catch(() => {});
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const heroProject = projects.find(p => p.status === "playable") || projects[0] || null;
  const stats = {
    assets: profile?.total_assets ?? assets.length,
    voices: profile?.total_voices ?? voices.length,
    revenue: profile?.total_revenue ?? 0,
    projects: projects.length,
  };

  return (
    <div style={{ paddingBottom:"1rem" }}>

      {/* HERO BANNER */}
      <div style={{
        height:200, position:"relative", overflow:"hidden",
        background: heroProject?.cover_image_url
          ? `linear-gradient(to bottom,rgba(15,10,30,0) 0%,rgba(15,10,30,0.92) 100%),url(${heroProject.cover_image_url}) center/cover`
          : "linear-gradient(135deg,#160d2e 0%,#1f1340 100%)",
        display:"flex", alignItems:"flex-end", padding:"1.2rem"
      }}>
        {!heroProject?.cover_image_url && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"5rem", opacity:0.08 }}>🎮</div>
        )}
        <div style={{ position:"relative", zIndex:1, flex:1 }}>
          <div style={{ fontSize:"0.6rem", color:"#c084fc", letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>
            {heroProject ? `${heroProject.genre||""} · ${heroProject.format||""}` : "GCC Studio"}
          </div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"1.1rem", fontWeight:900, color:"#fff", textShadow:"0 2px 12px rgba(0,0,0,0.8)" }}>
            {heroProject?.title || `Bienvenido${user?.full_name ? ", "+user.full_name.split(" ")[0] : ""}`}
          </div>
          {heroProject?.description && (
            <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.55)", marginTop:4 }}>
              {heroProject.description.substring(0,80)}...
            </div>
          )}
        </div>
        {heroProject?.status && (
          <div style={{
            position:"absolute", top:"1rem", right:"1rem",
            background:"rgba(124,58,237,0.25)", border:"1px solid rgba(124,58,237,0.4)",
            borderRadius:20, padding:"3px 10px", fontSize:"0.6rem", color:"#c084fc",
            fontWeight:700, textTransform:"uppercase", letterSpacing:1
          }}>{heroProject.status}</div>
        )}
      </div>

      {/* STATS */}
      <div style={{ padding:"0.8rem 1rem 0" }}>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <StatCard icon="🎮" label="Proyectos" value={stats.projects} color={C.cyan} />
          <StatCard icon="📦" label="Assets" value={stats.assets} color="#c084fc" />
          <StatCard icon="🎙️" label="Voices" value={stats.voices} color={C.pink} />
          <StatCard icon="💰" label="Revenue" value={stats.revenue ? `€${stats.revenue}` : "€0"} color={C.gold} />
        </div>
      </div>

      {/* HYPER BRAIN CTA */}
      <div style={{ padding:"1rem 1rem 0" }}>
        <div onClick={() => onNav("brain")} style={{
          background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(0,245,255,0.08))",
          border:"1px solid rgba(124,58,237,0.4)", borderRadius:14,
          padding:"0.9rem 1rem", cursor:"pointer",
          display:"flex", alignItems:"center", gap:"0.8rem",
          transition:"all 0.2s"
        }}
        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(124,58,237,0.7)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(124,58,237,0.4)"}
        >
          <div style={{ fontSize:"1.8rem", flexShrink:0 }}>🧠</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.82rem", fontWeight:900, color:"#fff", letterSpacing:1 }}>HYPER BRAIN — 5 IAs</div>
            <div style={{ fontSize:"0.62rem", color:"#5a4080" }}>
            Personaje completo en 90s · Juego + cover en 60s · Marketing en 45s
          </div>
          <div style={{ display:"flex", gap:"0.4rem", marginTop:4, flexWrap:"wrap" }}>
            {["ElevenLabs","Tripo3D","Replicate","Gemini"].map(api => {
              const key = api === "ElevenLabs" ? localStorage.getItem("gcc_eleven_key") : localStorage.getItem(`gcc_${api.toLowerCase()}_key`) || (JSON.parse(localStorage.getItem("gcc_api_config")||"{}")[api.toLowerCase()+"_key"]);
              return (
                <span key={api} style={{ fontSize:"0.5rem", padding:"1px 6px", borderRadius:99, fontWeight:700, background: key ? "rgba(34,197,94,0.15)" : "rgba(90,64,128,0.2)", color: key ? "#22c55e" : "#5a4080", border: `1px solid ${key ? "rgba(34,197,94,0.3)" : "rgba(90,64,128,0.2)"}` }}>
                  {key ? "●" : "○"} {api}
                </span>
              );
            })}
          </div>
          </div>
          <div style={{ background:"linear-gradient(90deg,#7c3aed,#00f5ff)", borderRadius:99, padding:"3px 10px", fontSize:"0.6rem", color:"#fff", fontWeight:900, flexShrink:0 }}>
            ACTIVAR →
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ padding:"0.8rem 1rem 0" }}>
        <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>Acciones Rápidas</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.5rem", marginBottom:"0.6rem" }}>
          {[
            { icon:"✏️", label:"Nuevo Juego",  tab:"create" },
            { icon:"👥", label:"Personajes",   tab:"chars" },
            { icon:"📣", label:"Marketing",    tab:"marketing" },
            { icon:"▶️", label:"Play & Test",  tab:"test" },
          ].map(a => (
            <button key={a.tab} onClick={() => onNav(a.tab)} style={{
              flex:1, background:"rgba(124,58,237,0.1)", border:`1px solid rgba(124,58,237,0.25)`,
              borderRadius:10, padding:"0.6rem 0.3rem", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              color:"#c084fc", fontSize:"0.58rem", fontWeight:700,
              letterSpacing:0.5, textTransform:"uppercase", fontFamily:"inherit",
              transition:"all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(124,58,237,0.1)"}
            >
              <span style={{ fontSize:"1.2rem" }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginTop:"0.4rem" }}>
          <div onClick={() => onNav("guide")} style={{
            background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.25)",
            borderRadius:10, padding:"0.6rem", cursor:"pointer", textAlign:"center"
          }}>
            <div style={{ fontSize:"1.2rem" }}>📚</div>
            <div style={{ fontSize:"0.62rem", color:"#22c55e", fontWeight:700 }}>Guía Experta</div>
            <div style={{ fontSize:"0.55rem", color:"#5a4080" }}>Prompts + Flujo</div>
          </div>
          <div onClick={() => onNav("prompts")} style={{
            background:"rgba(192,132,252,0.06)", border:"1px solid rgba(192,132,252,0.25)",
            borderRadius:10, padding:"0.6rem", cursor:"pointer", textAlign:"center"
          }}>
            <div style={{ fontSize:"1.2rem" }}>⚡</div>
            <div style={{ fontSize:"0.62rem", color:"#c084fc", fontWeight:700 }}>Prompts Lab</div>
            <div style={{ fontSize:"0.55rem", color:"#5a4080" }}>Mejorar textos</div>
          </div>
        </div>
      </div>

      {/* PROYECTOS */}
      {projects.length > 0 && (
        <div style={{ padding:"1rem 0 0" }}>
          <div style={{ padding:"0 1rem", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem" }}>
            <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Tus Proyectos</div>
            <div onClick={() => onNav("create")} style={{ fontSize:"0.62rem", color:C.purple, cursor:"pointer" }}>{projects.length} proyectos →</div>
          </div>
          <div style={{ display:"flex", gap:"0.8rem", overflowX:"auto", padding:"0 1rem 0.5rem" }}>
            {projects.map(p => <ProjectCard key={p.id} project={p} onClick={() => onNav("create")} />)}
          {/* Navegar a detail al hacer click en un proyecto requiere pasar ID — usamos create que lista proyectos */}
          </div>
        </div>
      )}

      {/* PERSONAJES */}
      {chars.length > 0 && (
        <div style={{ padding:"1rem 1rem 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem" }}>
            <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Personajes</div>
            <div onClick={() => onNav("chars")} style={{ fontSize:"0.62rem", color:C.purple, cursor:"pointer" }}>Ver todos →</div>
          </div>
          {chars.slice(0,4).map(c => <CharCard key={c.id} char={c} />)}
        </div>
      )}

      {/* EMPTY STATE */}
      {projects.length === 0 && chars.length === 0 && (
        <EmptyState icon="🎮" title="¡Tu estudio está vacío!" sub="Crea tu primer proyecto de juego" action="✏️ Crear Primer Juego" onAction={() => onNav("create")} />
      )}

      {/* ACTIVIDAD */}
      {projects.length > 0 && (
        <div style={{ padding:"1rem 1rem 0" }}>
          <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>Actividad Reciente</div>
          {projects.slice(0,4).map((p,i) => (
            <div key={p.id} onClick={() => onNav("create")} style={{
              display:"flex", alignItems:"center", gap:"0.7rem",
              padding:"0.6rem 0", borderBottom:`1px solid rgba(124,58,237,0.1)`,
              cursor:"pointer"
            }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:i===0 ? C.pink : C.purple, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.75rem", color:C.text }}>{p.title||"Proyecto sin título"}</div>
                <div style={{ fontSize:"0.6rem", color:C.muted }}>
                  {p.updated_date ? new Date(p.updated_date).toLocaleDateString("es-ES") : "—"} · {p.status||"draft"}
                </div>
              </div>
              <div style={{ fontSize:"0.8rem" }}>
                {p.status==="playable" ? "✅" : p.status==="generating" ? "⏳" : "📝"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER LINKS */}
      <div style={{
        margin:"1.5rem 1rem 0",
        background:C.card2, borderRadius:14,
        border:`1px solid ${C.border}`,
        padding:"0.9rem 1rem",
        display:"flex", alignItems:"center", justifyContent:"space-around", gap:"0.5rem"
      }}>
        {/* Instagram */}
        <a href="https://www.instagram.com/comiccrafter_ai" target="_blank" rel="noreferrer" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, textDecoration:"none" }}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize:"0.65rem", color:C.muted, letterSpacing:0.5 }}>Instagram</span>
        </a>

        <div style={{ width:1, height:40, background:C.border }}/>

        {/* Shopify */}
        <a href="https://comic-crafter.myshopify.com" target="_blank" rel="noreferrer" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, textDecoration:"none" }}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:"rgba(150,191,72,0.15)", border:"1px solid rgba(150,191,72,0.35)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <svg width="20" height="20" viewBox="0 0 109 124" fill="#96bf48">
              <path d="M74.7 14.8s-.3-1.6-1.3-2.1c-1-.5-2.2.2-2.2.2s-1.3.4-3.4 1c-.4-1.3-1-2.8-1.9-4.3-2.8-5.4-7-8.2-12-8.2-.3 0-.7 0-1 .1-.1-.2-.3-.3-.5-.5-2.3-2.4-5.2-3.5-8.7-3.4-6.8.2-13.5 5.1-19 13.8-3.9 6.1-6.8 13.8-7.7 19.8-7.8 2.4-13.3 4.1-13.4 4.2-4 1.2-4.1 1.3-4.6 5.1C.9 43.3 0 109.5 0 109.5l75.8 13.2V14.6c-.4.1-.8.1-1.1.2zm-22 6.7c-4.6 1.4-9.6 3-14.6 4.5.5-2 1.1-4 2-5.8 1.3-2.5 3.2-4.9 5.5-6.5 2.7 1.4 4.9 4.2 7.1 7.8zm-8.8-16.2c1.8 0 3.3.4 4.6 1.2-2.1 1.1-4.2 2.8-6.1 5-5 5.8-8.9 14.8-10.3 23.4-4.8 1.5-9.4 2.9-13.7 4.3 2.5-11.4 12.3-33.5 25.5-33.9zm-1 98.5l-32.3-8 9.2-20.5 23.1 5.7v22.8zm0-27.7l-21.3-5.3 14-31.2 7.3 2.3v34.2zm0-39.3L34.4 34l8.5-19 2.3.8-.3 21zm4 67v-26l17.6 4.4L44.9 108zm0-30.3V44.2l15.9 5.3-15.9 28.2z"/>
            </svg>
          </div>
          <span style={{ fontSize:"0.65rem", color:C.muted, letterSpacing:0.5 }}>Tienda</span>
        </a>

        <div style={{ width:1, height:40, background:C.border }}/>

        {/* Web */}
        <a href="https://comiccrafter.es" target="_blank" rel="noreferrer" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, textDecoration:"none" }}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1.2rem"
          }}>🌐</div>
          <span style={{ fontSize:"0.65rem", color:C.muted, letterSpacing:0.5 }}>Web Oficial</span>
        </a>
      </div>

      <div style={{ padding:"0.8rem 1rem", textAlign:"center", fontSize:"0.58rem", color:"rgba(90,64,128,0.5)", letterSpacing:2 }}>
        GCC ENGINE v1.0 · 6-AI CLUSTER
      </div>
    </div>
  );
}