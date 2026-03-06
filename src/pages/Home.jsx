import { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#080c1a", fontFamily: "'Inter', sans-serif", color: "#e0e8ff" }}>
      {/* Splash */}
      {showSplash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999, background: "#080c1a",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem"
        }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%", background: "rgba(0,245,255,0.05)",
            border: "2px solid rgba(0,245,255,0.3)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "2.2rem"
          }}>🎮</div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 900, color: "#00f5ff", letterSpacing: 3 }}>
            GCC
          </div>
          <div style={{ color: "#5a7090", fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase" }}>
            Game Comic Crafter
          </div>
          <div style={{ width: 220, height: 3, background: "rgba(0,245,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg,#00f5ff,#7c3aed)",
              animation: "loadBar 1.8s ease forwards"
            }} />
          </div>
          <style>{`@keyframes loadBar{0%{width:0}100%{width:100%}}`}</style>
        </div>
      )}

      {/* App Shell */}
      {!showSplash && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Topbar */}
          <div style={{
            flexShrink: 0, height: 56, background: "rgba(8,12,26,0.95)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,245,255,0.12)", display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 1rem"
          }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900, color: "#00f5ff", letterSpacing: 2 }}>
              GCC
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ position: "relative", cursor: "pointer", fontSize: "1.2rem" }}>
                🔔
                <div style={{
                  position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%",
                  background: "#ff00ff", border: "1px solid #080c1a"
                }} />
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#00f5ff,#7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", fontWeight: 700, color: "#080c1a", cursor: "pointer"
              }}>U</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {activeTab === "home" && <HomeScreen />}
            {activeTab === "create" && <CreateScreen />}
            {activeTab === "explore" && <ExploreScreen />}
            {activeTab === "profile" && <ProfileScreen />}
          </div>

          {/* FAB */}
          {activeTab === "home" && (
            <button
              onClick={() => setActiveTab("create")}
              style={{
                position: "fixed", bottom: "calc(74px)", right: "1.2rem",
                width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg,#00f5ff,#7c3aed)",
                border: "none", cursor: "pointer", fontSize: "1.4rem", color: "#080c1a",
                boxShadow: "0 4px 20px rgba(0,245,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99
              }}
            >+</button>
          )}

          {/* Bottom Nav */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, height: 60,
            background: "rgba(8,12,26,0.97)", backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(0,245,255,0.12)", display: "flex",
            alignItems: "center", justifyContent: "space-around", zIndex: 100
          }}>
            {[
              { id: "home", icon: "🏠", label: "Inicio" },
              { id: "create", icon: "✏️", label: "Crear" },
              { id: "explore", icon: "🔍", label: "Explorar" },
              { id: "profile", icon: "👤", label: "Perfil" },
            ].map(item => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 3, cursor: "pointer", padding: "8px 0",
                  color: activeTab === item.id ? "#00f5ff" : "#5a7090",
                  fontSize: "0.58rem", letterSpacing: "0.5px", textTransform: "uppercase",
                  position: "relative", transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: "1.25rem", transform: activeTab === item.id ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }}>
                  {item.icon}
                </span>
                {item.label}
                {activeTab === item.id && (
                  <div style={{
                    position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                    width: 22, height: 2, background: "#00f5ff", borderRadius: 2
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HomeScreen() {
  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg,rgba(0,245,255,0.06) 0%,transparent 100%)", padding: "1.2rem 1rem 1rem", borderBottom: "1px solid rgba(0,245,255,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.7rem", color: "#5a7090", letterSpacing: 2, textTransform: "uppercase" }}>
              Bienvenido de vuelta
            </div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.3rem", fontWeight: 900, color: "#00f5ff" }}>
              Creator Pro
            </div>
          </div>
          <span style={{ background: "rgba(0,245,255,0.12)", color: "#00f5ff", padding: "2px 9px", borderRadius: 50, fontSize: "0.62rem", letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 600 }}>
            PRO
          </span>
        </div>
        {/* Engine status */}
        <div style={{ marginTop: "0.8rem", background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.15)", borderRadius: 10, padding: "0.8rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>Motor IA Online</div>
            <div style={{ fontSize: "0.65rem", color: "#5a7090" }}>Listo para generar</div>
          </div>
          <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
            {[1,2,3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 4px #00f5ff" }} />)}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.65rem", padding: "1rem" }}>
        {[
          { icon: "🎨", label: "Nuevo Cómic" },
          { icon: "⚡", label: "Quick Gen" },
          { icon: "🎭", label: "Personajes" },
          { icon: "🗺️", label: "Escenas" },
          { icon: "💬", label: "Diálogos" },
          { icon: "📤", label: "Exportar" },
        ].map((a, i) => (
          <div key={i} style={{
            background: "#111827", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 12,
            padding: "0.9rem 0.4rem", display: "flex", flexDirection: "column", alignItems: "center",
            gap: "0.45rem", cursor: "pointer", transition: "all 0.2s"
          }}>
            <div style={{ fontSize: "1.5rem" }}>{a.icon}</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.5px", textAlign: "center", color: "#5a7090" }}>{a.label}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", color: "#5a7090", marginBottom: "0.7rem", padding: "0 1rem" }}>
        Tus Estadísticas
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.65rem", padding: "0 1rem 1rem" }}>
        {[
          { val: "12", label: "Cómics" },
          { val: "47", label: "Paneles" },
          { val: "8.4K", label: "Vistas" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#111827", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 12, padding: "0.9rem 0.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#00f5ff" }}>{s.val}</div>
            <div style={{ fontSize: "0.62rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Project */}
      <div style={{ fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", color: "#5a7090", marginBottom: "0.7rem", padding: "0 1rem" }}>
        Proyecto Reciente
      </div>
      <div style={{ margin: "0 1rem 1rem", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(0,245,255,0.12)", cursor: "pointer" }}>
        <img src="https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&q=80" alt="project" style={{ width: "100%", aspectRatio: "16/6", objectFit: "cover", display: "block" }} />
        <div style={{ padding: "1rem" }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Leyendas del Pixel
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ background: "rgba(0,245,255,0.12)", color: "#00f5ff", padding: "2px 9px", borderRadius: 50, fontSize: "0.62rem", fontWeight: 600 }}>En Progreso</span>
              <span style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", padding: "2px 9px", borderRadius: 50, fontSize: "0.62rem", fontWeight: 600 }}>RPG</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#5a7090" }}>8 paneles</div>
          </div>
          <div style={{ marginTop: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#5a7090", marginBottom: 4 }}>
              <span>Progreso</span><span style={{ color: "#00f5ff" }}>65%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: "65%", height: "100%", background: "linear-gradient(90deg,#00f5ff,#7c3aed)", borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateScreen() {
  const [step, setStep] = useState(1);
  const [genre, setGenre] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div style={{ padding: "1rem", paddingBottom: 80 }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#00f5ff", marginBottom: "1.5rem" }}>
        Crear Nuevo Cómic
      </div>

      {/* Steps */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {[1,2,3].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "linear-gradient(90deg,#00f5ff,#7c3aed)" : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ fontSize: "0.72rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.4rem" }}>Título</div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Nombre de tu cómic..."
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 10, padding: "0.7rem 1rem", color: "#e0e8ff", fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: "0.72rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", margin: "1rem 0 0.4rem" }}>Género</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
            {["RPG","Acción","Aventura","Sci-Fi","Fantasy","Horror"].map(g => (
              <div
                key={g}
                onClick={() => setGenre(g)}
                style={{
                  background: genre === g ? "rgba(0,245,255,0.15)" : "#111827",
                  border: genre === g ? "1px solid rgba(0,245,255,0.5)" : "1px solid rgba(0,245,255,0.12)",
                  borderRadius: 10, padding: "0.7rem", textAlign: "center", cursor: "pointer",
                  fontSize: "0.82rem", color: genre === g ? "#00f5ff" : "#e0e8ff"
                }}
              >{g}</div>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!title || !genre}
            style={{
              width: "100%", marginTop: "1.5rem", padding: "0.9rem", border: "none", borderRadius: 12,
              background: title && genre ? "linear-gradient(135deg,#00f5ff,#7c3aed)" : "rgba(255,255,255,0.05)",
              color: title && genre ? "#080c1a" : "#5a7090", fontWeight: 600, fontSize: "0.95rem", cursor: title && genre ? "pointer" : "not-allowed"
            }}
          >Siguiente →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ fontSize: "0.72rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.4rem" }}>Descripción de la Historia</div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe tu historia, personajes principales, mundo..."
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 10, padding: "0.7rem 1rem", color: "#e0e8ff", fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", outline: "none", resize: "none", minHeight: 120, boxSizing: "border-box" }}
          />
          <div style={{ fontSize: "0.72rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", margin: "1rem 0 0.4rem" }}>Estilo Visual</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
            {["Anime","Pixel Art","3D","Retro","Noir","Kawaii"].map(s => (
              <div key={s} style={{ background: "#111827", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 10, padding: "0.7rem", textAlign: "center", cursor: "pointer", fontSize: "0.82rem" }}>{s}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem" }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: "0.9rem", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 12, background: "transparent", color: "#e0e8ff", fontWeight: 600, cursor: "pointer" }}>← Atrás</button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: "0.9rem", border: "none", borderRadius: 12, background: "linear-gradient(135deg,#00f5ff,#7c3aed)", color: "#080c1a", fontWeight: 600, cursor: "pointer" }}>Generar IA ✨</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", color: "#00f5ff", marginBottom: "0.5rem" }}>¡Generando tu Cómic!</div>
          <div style={{ color: "#5a7090", fontSize: "0.82rem", marginBottom: "2rem" }}>La IA está creando los paneles de "{title}"...</div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: "2rem" }}>
            <div style={{ width: "75%", height: "100%", background: "linear-gradient(90deg,#00f5ff,#7c3aed)", borderRadius: 2, transition: "width 2s" }} />
          </div>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: "#111827", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 12, padding: "1rem", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,rgba(0,245,255,0.2),rgba(124,58,237,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🖼️</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>Panel {i}</div>
                <div style={{ fontSize: "0.65rem", color: "#5a7090" }}>Generando...</div>
              </div>
              <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 8px #00f5ff" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExploreScreen() {
  const comics = [
    { title: "Dragon's Quest", genre: "RPG", author: "PixelMaster", views: "12.4K", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80", badge: "TRENDING" },
    { title: "Neon Samurai", genre: "Acción", author: "CyberArt", views: "8.9K", cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80", badge: "NUEVO" },
    { title: "Space Pirates", genre: "Sci-Fi", author: "GalaxyDev", views: "6.2K", cover: "https://images.unsplash.com/photo-1462536943532-57a629f6cc60?w=400&q=80", badge: "" },
    { title: "Pixel Kingdom", genre: "Fantasy", author: "RetroKing", views: "15.1K", cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80", badge: "TOP" },
  ];

  return (
    <div style={{ padding: "1rem", paddingBottom: 80 }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#00f5ff", marginBottom: "1rem" }}>
        Explorar
      </div>
      <input placeholder="Buscar cómics..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 10, padding: "0.7rem 1rem", color: "#e0e8ff", fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }} />
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", overflowX: "auto" }}>
        {["Todos","RPG","Acción","Sci-Fi","Fantasy","Horror"].map((f, i) => (
          <div key={i} style={{ background: i === 0 ? "rgba(0,245,255,0.15)" : "rgba(255,255,255,0.05)", border: i === 0 ? "1px solid rgba(0,245,255,0.4)" : "1px solid rgba(0,245,255,0.12)", borderRadius: 50, padding: "4px 14px", fontSize: "0.72rem", color: i === 0 ? "#00f5ff" : "#5a7090", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600 }}>{f}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        {comics.map((c, i) => (
          <div key={i} style={{ background: "#111827", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ position: "relative" }}>
              <img src={c.cover} alt={c.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
              {c.badge && <div style={{ position: "absolute", top: 6, left: 6, background: c.badge === "TRENDING" ? "rgba(255,0,255,0.8)" : c.badge === "NUEVO" ? "rgba(0,245,255,0.8)" : "rgba(255,215,0,0.8)", color: "#080c1a", padding: "1px 7px", borderRadius: 4, fontSize: "0.55rem", fontWeight: 900, letterSpacing: 1 }}>{c.badge}</div>}
            </div>
            <div style={{ padding: "0.65rem" }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.72rem", fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
              <div style={{ fontSize: "0.6rem", color: "#5a7090" }}>@{c.author}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.6rem", color: "#5a7090" }}>
                <span>{c.genre}</span>
                <span>👁 {c.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(180deg,rgba(0,245,255,0.08) 0%,transparent 100%)", padding: "2rem 1rem 1.5rem", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#00f5ff,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1rem", boxShadow: "0 0 20px rgba(0,245,255,0.3)" }}>🎮</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#00f5ff" }}>Creator Pro</div>
        <div style={{ fontSize: "0.75rem", color: "#5a7090", marginTop: 4 }}>@gamecreator · Nivel 12</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.2rem" }}>
          {[{val:"12",label:"Cómics"},{val:"847",label:"Seguidores"},{val:"234",label:"Siguiendo"}].map((s,i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 900, color: "#00f5ff" }}>{s.val}</div>
              <div style={{ fontSize: "0.62rem", color: "#5a7090" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ background: "#111827", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 14, overflow: "hidden", marginBottom: "1rem" }}>
          {[
            { icon: "🏆", label: "Logros", val: "24 desbloqueados" },
            { icon: "⭐", label: "XP Total", val: "12,450 pts" },
            { icon: "🔥", label: "Racha", val: "7 días" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "0.9rem 1rem", borderBottom: i < 2 ? "1px solid rgba(0,245,255,0.08)" : "none" }}>
              <span style={{ fontSize: "1.2rem", marginRight: "0.8rem" }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: "0.85rem" }}>{item.label}</span>
              <span style={{ fontSize: "0.78rem", color: "#00f5ff" }}>{item.val}</span>
            </div>
          ))}
        </div>
        <button style={{ width: "100%", padding: "0.9rem", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, background: "rgba(239,68,68,0.08)", color: "#ef4444", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}