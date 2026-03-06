import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const C = {
  bg: "#0f0a1e", card: "#160d2e", card2: "#1f1340",
  purple: "#7c3aed", cyan: "#00f5ff", pink: "#e91e8c",
  gold: "#ffd700", green: "#22c55e", muted: "#5a7090", text: "#e0e8ff"
};

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      flex: 1, background: C.card, borderRadius: 12,
      border: `1px solid rgba(124,58,237,0.2)`, padding: "0.9rem 0.7rem",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{icon}</div>
      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: color || C.cyan }}>{value ?? "—"}</div>
      <div style={{ fontSize: "0.58rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <div onClick={onClick} style={{
      minWidth: 160, borderRadius: 14, overflow: "hidden",
      border: "1px solid rgba(124,58,237,0.25)", background: C.card,
      cursor: "pointer", flexShrink: 0
    }}>
      <div style={{
        height: 100, background: project.cover_image_url
          ? `url(${project.cover_image_url}) center/cover`
          : "linear-gradient(135deg,#160d2e,#7c3aed33)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {!project.cover_image_url && <span style={{ fontSize: "2rem" }}>🎮</span>}
      </div>
      <div style={{ padding: "0.6rem 0.7rem" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {project.title || "Sin título"}
        </div>
        <div style={{ fontSize: "0.6rem", color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {project.genre || "—"} · {project.format || "—"}
        </div>
        <div style={{
          marginTop: 6, display: "inline-block",
          background: project.status === "playable" ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)",
          color: project.status === "playable" ? C.green : "#c084fc",
          borderRadius: 20, padding: "2px 8px", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase"
        }}>
          {project.status || "draft"}
        </div>
      </div>
    </div>
  );
}

function CharCard({ char }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.7rem",
      background: C.card2, borderRadius: 12, padding: "0.7rem",
      border: "1px solid rgba(124,58,237,0.15)", marginBottom: "0.6rem"
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        background: char.concept_image_url
          ? `url(${char.concept_image_url}) center/cover`
          : "linear-gradient(135deg,#7c3aed,#e91e8c)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.3rem", border: "2px solid rgba(124,58,237,0.3)"
      }}>
        {!char.concept_image_url && "👤"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: C.text }}>{char.name || "Personaje"}</div>
        <div style={{ fontSize: "0.62rem", color: C.muted, marginTop: 2 }}>{char.archetype || char.gender || "—"}</div>
      </div>
      <div style={{
        fontSize: "0.58rem", background: "rgba(0,245,255,0.1)", color: C.cyan,
        borderRadius: 20, padding: "2px 8px", fontWeight: 700, textTransform: "uppercase"
      }}>
        {char.behavior_logic || "npc"}
      </div>
    </div>
  );
}

export default function DashboardHome({ onNav, showToast, user }) {
  const [projects, setProjects] = useState([]);
  const [chars, setChars] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroBg, setHeroBg] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.GameProject.list("-updated_date", 20),
      base44.entities.GameCharacter.list("-created_date", 10),
      base44.entities.SuperUserProfile.filter({ email: "sadiagiljoan@gmail.com" }, "-created_date", 1)
        .catch(() => [])
    ]).then(([projs, ch, profs]) => {
      setProjects(projs || []);
      setChars(ch || []);
      const p = Array.isArray(profs) ? profs[0] : profs;
      setProfile(p || null);
      const hero = (projs || []).find(pr => pr.cover_image_url);
      if (hero) setHeroBg(hero.cover_image_url);
    }).finally(() => setLoading(false));
  }, []);

  const heroProject = projects[0] || null;
  const stats = {
    assets: profile?.total_assets ?? projects.length,
    voices: profile?.total_voices ?? chars.length,
    revenue: profile?.total_revenue ?? 0,
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: C.muted }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem", animation: "spin 1s linear infinite" }}>⚙️</div>
          <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase" }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 1rem" }}>

      {/* HERO BANNER */}
      <div style={{
        height: 200, position: "relative", overflow: "hidden",
        background: heroBg
          ? `linear-gradient(to bottom, rgba(15,10,30,0) 0%, rgba(15,10,30,0.9) 100%), url(${heroBg}) center/cover`
          : "linear-gradient(135deg,#160d2e 0%,#1f1340 100%)",
        display: "flex", alignItems: "flex-end", padding: "1.2rem"
      }}>
        {!heroBg && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", opacity: 0.15 }}>🎮</div>
        )}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.6rem", color: "#c084fc", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            {heroProject ? `${heroProject.genre || ""} · ${heroProject.format || ""}` : "GCC Studio"}
          </div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
            {heroProject?.title || "Bienvenido al Estudio"}
          </div>
          {heroProject && (
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              {heroProject.description?.substring(0, 80) || ""}
            </div>
          )}
        </div>
        <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1 }}>
          <div style={{
            background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: 20, padding: "3px 10px", fontSize: "0.6rem", color: "#c084fc",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: 1
          }}>
            {heroProject?.status || "Studio"}
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ padding: "0.8rem 1rem 0" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <StatCard icon="📦" label="Assets" value={stats.assets} color={C.cyan} />
          <StatCard icon="🎙️" label="Voices" value={stats.voices} color="#c084fc" />
          <StatCard icon="💰" label="Revenue" value={stats.revenue ? `$${stats.revenue}` : "$0"} color={C.gold} />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ padding: "1rem 1rem 0" }}>
        <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.6rem" }}>Acciones Rápidas</div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { icon: "✏️", label: "Nuevo Juego", tab: "create" },
            { icon: "👥", label: "Personajes", tab: "chars" },
            { icon: "📣", label: "Marketing", tab: "marketing" },
          ].map(a => (
            <button key={a.tab} onClick={() => onNav(a.tab)} style={{
              flex: 1, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 10, padding: "0.6rem 0.3rem", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              color: "#c084fc", fontSize: "0.6rem", fontWeight: 700,
              letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "inherit"
            }}>
              <span style={{ fontSize: "1.2rem" }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECTS HORIZONTAL SCROLL */}
      {projects.length > 0 && (
        <div style={{ padding: "1rem 0 0" }}>
          <div style={{ padding: "0 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
            <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Tus Proyectos</div>
            <div style={{ fontSize: "0.62rem", color: "#7c3aed", cursor: "pointer" }}>{projects.length} proyectos</div>
          </div>
          <div style={{ display: "flex", gap: "0.8rem", overflowX: "auto", padding: "0 1rem 0.5rem" }}>
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onClick={() => onNav("create")} />
            ))}
          </div>
        </div>
      )}

      {/* CHARACTERS */}
      {chars.length > 0 && (
        <div style={{ padding: "1rem 1rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
            <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Personajes</div>
            <div onClick={() => onNav("chars")} style={{ fontSize: "0.62rem", color: "#7c3aed", cursor: "pointer" }}>Ver todos →</div>
          </div>
          {chars.slice(0, 4).map(c => <CharCard key={c.id} char={c} />)}
        </div>
      )}

      {/* EMPTY STATE */}
      {projects.length === 0 && chars.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 2rem", color: C.muted }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎮</div>
          <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem", color: C.text }}>¡Tu estudio está vacío!</div>
          <div style={{ fontSize: "0.75rem", marginBottom: "1.5rem" }}>Crea tu primer proyecto de juego</div>
          <button onClick={() => onNav("create")} style={{
            background: "linear-gradient(135deg,#7c3aed,#e91e8c)", border: "none",
            borderRadius: 10, padding: "0.7rem 1.5rem", color: "#fff",
            fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit"
          }}>
            ✏️ Crear Primer Juego
          </button>
        </div>
      )}

      {/* ACTIVITY FEED */}
      <div style={{ padding: "1rem 1rem 0" }}>
        <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.6rem" }}>Actividad Reciente</div>
        {[...projects.slice(0, 3)].map((p, i) => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", gap: "0.7rem",
            padding: "0.6rem 0", borderBottom: "1px solid rgba(124,58,237,0.1)"
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? C.pink : "#7c3aed", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", color: C.text }}>{p.title || "Proyecto sin título"}</div>
              <div style={{ fontSize: "0.6rem", color: C.muted }}>
                {p.updated_date ? new Date(p.updated_date).toLocaleDateString("es-ES") : "—"} · {p.status || "draft"}
              </div>
            </div>
            <div style={{ fontSize: "0.8rem" }}>
              {p.status === "playable" ? "✅" : p.status === "generating" ? "⏳" : "📝"}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ fontSize: "0.75rem", color: C.muted, textAlign: "center", padding: "1rem 0" }}>Sin actividad aún</div>
        )}
      </div>

      <style>{`
        @keyframes spin { 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}