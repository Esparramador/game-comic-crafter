import { useState } from "react";
import { createPageUrl } from "@/utils";

const GAMES_LIBRARY = [
  { title: "Clash of Clan Emulator", genre: "Strategy", tag: "Battle Royale", img: "https://picsum.photos/seed/clash/80/80" },
  { title: "NFS Hot Pursuit", genre: "Racing", tag: "2/4", img: "https://picsum.photos/seed/nfs/80/80" },
  { title: "Ghost of Tsushima", genre: "Strategy", tag: "Open World", img: "https://picsum.photos/seed/ghost/80/80" },
  { title: "Overwatch Two", genre: "Strategy", tag: "Shooter", img: "https://picsum.photos/seed/ow2/80/80" },
];

const SUGGESTED = [
  { title: "Apex Legends Season IX", genre: "Strategy", tag: "Battle Royale", players: "1.2k Players", img: "https://picsum.photos/seed/apex/300/225" },
  { title: "Overwatch: Strategic Gameplay", genre: "Strategy", tag: "Shooter", players: "274 Players", img: "https://picsum.photos/seed/overwatch/300/225" },
  { title: "Marvel Rivals Gameplay", genre: "Video Game", tag: "Multiplayer", players: "3.5k Players", img: "https://picsum.photos/seed/marvel/300/225" },
  { title: "Street Fighter Four: Clash of Empire", genre: "Strategy", tag: "Fighting", players: "2.9k Players", img: "https://picsum.photos/seed/street/300/225" },
];

const NAV_ITEMS = [
  { icon: "⊞", label: "My Dashboard", active: true },
  { icon: "🎮", label: "Game's List" },
  { icon: "🔭", label: "Explore Store" },
  { icon: "⭐", label: "Promoted" },
  { icon: "👥", label: "Friends" },
  { icon: "💳", label: "Play now" },
  { icon: "🔔", label: "Notification" },
];

const ONLINE = [
  { name: "Dalton Howard", avatar: "DH", color: "#a855f7" },
  { name: "Jacob Jones", avatar: "JJ", color: "#ec4899" },
  { name: "Cody Fisher", avatar: "CF", color: "#3b82f6" },
  { name: "Alex Peynes", avatar: "AP", color: "#10b981" },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState(0);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#1a0533", color: "#fff", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: 220, flexShrink: 0, background: "rgba(10,2,20,0.95)",
        borderRight: "1px solid rgba(139,92,246,0.15)",
        display: "flex", flexDirection: "column", padding: "1.5rem 0",
        overflowY: "auto"
      }} className="sidebar-desktop">
        {/* Logo */}
        <div style={{ padding: "0 1.2rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.85rem", fontWeight: 900, background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            GameComicCrafter
          </div>
        </div>

        {/* Nav */}
        {NAV_ITEMS.map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveNav(i)}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.7rem 1.2rem", cursor: "pointer", borderRadius: "0 10px 10px 0",
              marginRight: "0.8rem", marginBottom: 2,
              background: activeNav === i ? "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(236,72,153,0.15))" : "transparent",
              borderLeft: activeNav === i ? "2px solid #a855f7" : "2px solid transparent",
              color: activeNav === i ? "#fff" : "rgba(255,255,255,0.45)",
              fontSize: "0.8rem", transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: "1rem" }}>{item.icon}</span>
            {item.label}
          </div>
        ))}

        {/* Online Friends */}
        <div style={{ marginTop: "auto", padding: "1rem 1.2rem 0" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.8rem" }}>
            Online Friends
          </div>
          {ONLINE.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.7rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0 }}>{u.avatar}</div>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>{u.name}</span>
            </div>
          ))}
          <button style={{
            width: "100%", marginTop: "1rem", padding: "0.6rem", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
          }}>
            ↓ Log Out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* TOPBAR */}
        <div style={{
          flexShrink: 0, height: 56, background: "rgba(10,2,20,0.8)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(139,92,246,0.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem"
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "0.45rem 1rem", flex: 1, maxWidth: 340
          }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>🔍</span>
            <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)" }}>Search for games...</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ cursor: "pointer", fontSize: "1.1rem", color: "rgba(255,255,255,0.5)" }}>🔔</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>AR</div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>Alex Ryan</div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>gamer pro</div>
              </div>
            </div>
            <span style={{ cursor: "pointer", fontSize: "1.1rem", color: "rgba(255,255,255,0.5)" }}>⚙️</span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          
          {/* HERO BANNER */}
          <div style={{
            borderRadius: 16, overflow: "hidden", position: "relative",
            background: "linear-gradient(135deg,#3b0764 0%,#1e1b4b 50%,#0c0a1e 100%)",
            marginBottom: "1.5rem", minHeight: 220,
            display: "flex", alignItems: "center"
          }}>
            <div style={{ padding: "2rem", flex: 1, zIndex: 2, position: "relative" }}>
              <div style={{ display: "inline-block", background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.4)", borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", color: "#fbbf24", fontWeight: 700, letterSpacing: 1, marginBottom: "0.8rem" }}>
                ⭐ FEATURED
              </div>
              <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.2rem,3vw,2rem)", fontWeight: 900, marginBottom: "0.7rem", lineHeight: 1.2 }}>
                Marvel's Spider-Man<br />Remastered
              </h1>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", maxWidth: 320, lineHeight: 1.6, marginBottom: "1rem" }}>
                An Open World Adventure game developed and published by Insomniac Games. In the game, players take control of Spider-Man and its alias...
              </p>
              <button style={{
                background: "linear-gradient(135deg,#7c3aed,#db2777)", border: "none",
                color: "#fff", borderRadius: 8, padding: "0.6rem 1.4rem",
                fontWeight: 700, fontSize: "0.82rem", cursor: "pointer"
              }}>
                Read Now
              </button>
            </div>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "45%", background: "linear-gradient(90deg,#3b0764,transparent)", zIndex: 1 }} />
            <img
              src="https://picsum.photos/seed/spiderman/500/300"
              alt="hero"
              style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
            {/* Slide indicators */}
            <div style={{ position: "absolute", bottom: 12, left: "2rem", display: "flex", gap: 6, zIndex: 3 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: i===0?20:6, height: 6, borderRadius: 3, background: i===0?"#a855f7":"rgba(255,255,255,0.3)" }} />)}
            </div>
            <div style={{ position: "absolute", bottom: 12, right: "2rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", zIndex: 3 }}>1/6</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }}>
            
            {/* LEFT: Suggested */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>You Might Also Like</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}>‹</button>
                  <button style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#db2777)", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}>›</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "1rem" }}>
                {SUGGESTED.map((g, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ position: "relative" }}>
                      <img src={g.img} alt={g.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.6)", borderRadius: 4, padding: "2px 6px", fontSize: "0.55rem", color: "rgba(255,255,255,0.8)" }}>👤 {g.players}</div>
                    </div>
                    <div style={{ padding: "0.7rem" }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{g.title}</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", padding: "1px 6px", borderRadius: 4, fontSize: "0.55rem", fontWeight: 600 }}>{g.genre}</span>
                        <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", padding: "1px 6px", borderRadius: 4, fontSize: "0.55rem" }}>{g.tag}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: In Library */}
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>In Library</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {GAMES_LIBRARY.map((g, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)",
                    borderRadius: 10, padding: "0.65rem", cursor: "pointer"
                  }}>
                    <img src={g.img} alt={g.title} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.title}</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", padding: "1px 5px", borderRadius: 3, fontSize: "0.52rem", fontWeight: 600 }}>{g.genre}</span>
                        <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", padding: "1px 5px", borderRadius: 3, fontSize: "0.52rem" }}>{g.tag}</span>
                      </div>
                    </div>
                    <button style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", border: "none", color: "#fff", width: 26, height: 26, borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", flexShrink: 0 }}>↓</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}