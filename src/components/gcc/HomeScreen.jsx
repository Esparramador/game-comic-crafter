import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Pill, Btn } from "./shared.jsx";

const T = {
  bg: "#0f0a1e",
  sidebar: "#160d2e",
  card: "#1a1030",
  card2: "#1f1340",
  purple: "#7c3aed",
  cyan: "#00f5ff",
  pink: "#e91e8c",
  muted: "#6b7280",
  text: "#e0e8ff",
  border: "rgba(124,58,237,0.2)",
  green: "#22c55e",
  gold: "#ffd700",
};

const ENGINE_NODES = [
  { label: "Nintendo AI", status: "online" },
  { label: "Blizzard Engine", status: "online" },
  { label: "Sony Physics", status: "online" },
  { label: "Riot Hitbox", status: "online" },
  { label: "Atari Legacy", status: "idle" },
  { label: "Custom Logic", status: "online" },
];

export default function HomeScreen({ onNav, showToast }) {
  const [projects, setProjects] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.GameProject.list("-updated_date", 10),
      base44.entities.GameCharacter.list("-updated_date", 20),
      base44.entities.SuperUserProfile.filter({ email: "sadiagiljoan@gmail.com" }, "-created_date", 1),
    ]).then(([p, c, prof]) => {
      setProjects(p);
      setCharacters(c);
      setProfile(prof[0] || null);
    }).finally(() => setLoading(false));
  }, []);

  const activeProject = projects[0] || null;

  const stats = [
    { val: loading ? "—" : String(profile?.total_assets ?? 0), label: "Assets", color: T.cyan },
    { val: loading ? "—" : String(profile?.total_voices ?? 0), label: "Voces", color: T.cyan },
    { val: loading ? "—" : String(characters.length), label: "Chars", color: T.cyan },
    { val: loading ? "—" : profile?.total_revenue ? `€${profile.total_revenue}` : "€0", label: "Revenue", color: T.pink },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100%", color: T.text, fontFamily: "'Inter',sans-serif" }}>

      {/* HERO BANNER */}
      <div style={{ position: "relative", margin: "1rem", borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {activeProject?.cover_image_url ? (
          <img src={activeProject.cover_image_url} alt="cover" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{
            height: 180, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg,#160d2e 0%,#0f0a1e 50%,#1a0535 100%)",
          }}>
            {loading
              ? <span style={{ fontSize: "0.8rem", color: T.muted }}>Cargando...</span>
              : <span style={{ fontSize: "3rem" }}>🎮</span>
            }
          </div>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top,rgba(15,10,30,0.97) 0%,rgba(15,10,30,0.3) 50%,transparent 100%)"
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem" }}>
          {!loading && activeProject ? (
            <>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, marginBottom: "0.5rem", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                {activeProject.title || "Sin título"}
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {activeProject.genre && <Pill color="purple">{activeProject.genre}</Pill>}
                {activeProject.format && <Pill color="cyan">{activeProject.format}</Pill>}
                {activeProject.engine && <Pill color="gold">{activeProject.engine}</Pill>}
                {activeProject.status && <Pill color="green">{activeProject.status}</Pill>}
              </div>
            </>
          ) : !loading ? (
            <div style={{ fontSize: "0.85rem", color: T.muted }}>Sin proyectos aún — ¡crea el primero!</div>
          ) : null}
        </div>
        <button
          onClick={() => onNav("create")}
          style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(124,58,237,0.7)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(124,58,237,0.5)", borderRadius: 8,
            color: "#fff", fontSize: "0.65rem", fontWeight: 700,
            padding: "4px 10px", cursor: "pointer", letterSpacing: 1
          }}>
          EDITAR
        </button>
      </div>

      {/* STATS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem", padding: "0 1rem 1rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: "0.75rem 0.3rem", textAlign: "center"
          }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: "0.52rem", color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TWO COLUMN */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0 1rem 1rem" }}>

        {/* LEFT: Characters */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: "0.7rem" }}>
            Personajes
          </div>
          {loading ? (
            <div style={{ fontSize: "0.7rem", color: T.muted }}>Cargando...</div>
          ) : characters.length === 0 ? (
            <div style={{ fontSize: "0.7rem", color: T.muted }}>Sin personajes</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {characters.slice(0, 5).map((ch, i) => (
                <div key={ch.id || i} onClick={() => onNav("chars")} style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  cursor: "pointer", padding: "0.3rem", borderRadius: 8,
                  background: i === 0 ? "rgba(0,245,255,0.05)" : "transparent",
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0, overflow: "hidden",
                    background: "linear-gradient(135deg,#160d2e,#7c3aed22)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem"
                  }}>
                    {ch.concept_image_url
                      ? <img src={ch.concept_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : "👤"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ch.name || "Sin nombre"}
                    </div>
                    <div style={{ fontSize: "0.55rem", color: i === 0 ? T.cyan : T.muted }}>
                      {ch.archetype || ch.behavior_logic || "Personaje"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => onNav("chars")} style={{
            marginTop: "0.7rem", width: "100%", background: "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.2)", borderRadius: 8,
            color: T.cyan, fontSize: "0.65rem", fontWeight: 700,
            padding: "0.5rem", cursor: "pointer", letterSpacing: 1
          }}>+ NUEVO PERSONAJE</button>
        </div>

        {/* RIGHT: Projects Library + Engine */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: "0.7rem" }}>
              Mi Biblioteca
            </div>
            {loading ? (
              <div style={{ fontSize: "0.7rem", color: T.muted }}>Cargando...</div>
            ) : projects.length === 0 ? (
              <div style={{ fontSize: "0.7rem", color: T.muted }}>Sin proyectos</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {projects.slice(0, 4).map((p, i) => (
                  <div key={p.id || i} onClick={() => onNav("create")} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer",
                    padding: "0.3rem", borderRadius: 8,
                    background: i === 0 ? "rgba(124,58,237,0.1)" : "transparent",
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 6, flexShrink: 0, overflow: "hidden",
                      background: "linear-gradient(135deg,#160d2e,#7c3aed22)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem"
                    }}>
                      {p.cover_image_url
                        ? <img src={p.cover_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : "🎮"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.title || "Sin título"}
                      </div>
                      <div style={{ fontSize: "0.52rem", color: i === 0 ? T.cyan : T.muted }}>{p.status || "draft"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onNav("create")} style={{
              marginTop: "0.7rem", width: "100%", background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8,
              color: "#a78bfa", fontSize: "0.65rem", fontWeight: 700,
              padding: "0.5rem", cursor: "pointer", letterSpacing: 1
            }}>+ NUEVO PROYECTO</button>
          </div>

          {/* Engine Status */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: "0.7rem" }}>
              6-AI Cluster
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {ENGINE_NODES.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                    background: n.status === "online" ? "#22c55e" : "#f97316",
                    boxShadow: n.status === "online" ? "0 0 5px #22c55e" : "0 0 5px #f97316",
                  }} />
                  <div style={{ fontSize: "0.6rem", color: n.status === "online" ? T.text : T.muted, flex: 1 }}>{n.label}</div>
                  <div style={{ fontSize: "0.5rem", color: n.status === "online" ? "#22c55e" : "#f97316", fontWeight: 700 }}>
                    {n.status === "online" ? "ON" : "IDLE"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile strip */}
      {profile && (
        <div style={{ margin: "0 1rem 1rem", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
            : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#00f5ff,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 700, color: "#080c1a" }}>
                {(profile.display_name || profile.email || "U")[0].toUpperCase()}
              </div>
          }
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>{profile.display_name || profile.email}</div>
            <div style={{ fontSize: "0.6rem", color: T.muted }}>{profile.plan ? profile.plan.toUpperCase() : "FREE"} · {profile.email}</div>
          </div>
          <Pill color="cyan">{profile.plan || "free"}</Pill>
        </div>
      )}
    </div>
  );
}