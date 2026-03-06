import { useState } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function Landing() {
  const [activeVideo, setActiveVideo] = useState(0);

  const videos = [
    {
      url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/f1f6abb71_Configuracin_lista_triler_generado.mp4",
      title: "Configuración lista — Tráiler generado",
      desc: "Crea tu cómic de juegos con IA en segundos"
    },
    {
      url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/10de00b17_Landing_Videos_y_Tienda_Shopify.mp4",
      title: "Landing, Videos y Tienda Shopify",
      desc: "Monetiza tu contenido con nuestra integración de tienda"
    }
  ];

  return (
    <div style={{ background: "#0d0117", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(13,1,23,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(139,92,246,0.2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem", height: 64
      }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.2rem", fontWeight: 900, background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          GameComicCrafter
        </div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
          <span style={{ cursor: "pointer" }}>Características</span>
          <span style={{ cursor: "pointer" }}>Precios</span>
          <span style={{ cursor: "pointer" }}>Galería</span>
        </div>
        <button onClick={() => base44.auth.redirectToLogin(createPageUrl("Home"))} style={{
          background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff",
          border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", cursor: "pointer",
          fontWeight: 600, fontSize: "0.85rem"
        }}>
          Login con Google →
        </button>
      </nav>

      {/* HERO */}
      <div style={{
        paddingTop: 120, paddingBottom: 80, textAlign: "center", padding: "120px 2rem 80px",
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.25) 0%, transparent 70%)"
      }}>
        <div style={{
          display: "inline-block", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)",
          borderRadius: 50, padding: "4px 16px", fontSize: "0.75rem", color: "#a78bfa",
          letterSpacing: 2, textTransform: "uppercase", marginBottom: "1.5rem"
        }}>
          ✨ Powered by AI
        </div>
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)",
          fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem",
          background: "linear-gradient(135deg,#fff 0%,#a78bfa 50%,#ec4899 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Crea Cómics de Gaming<br />con Inteligencia Artificial
        </h1>
        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Transforma tus partidas en cómics épicos. Genera paneles, diálogos y personajes automáticamente con IA. Comparte, vende y conecta con la comunidad gamer.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={createPageUrl("Home")} style={{
            background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff",
            borderRadius: 12, padding: "0.9rem 2rem", fontWeight: 700, fontSize: "1rem",
            cursor: "pointer", textDecoration: "none", display: "inline-block",
            boxShadow: "0 0 30px rgba(139,92,246,0.4)"
          }}>
            Empezar Gratis →
          </a>
          <button style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", borderRadius: 12, padding: "0.9rem 2rem", fontWeight: 600,
            fontSize: "1rem", cursor: "pointer"
          }}>
            Ver Demo ▶
          </button>
        </div>
      </div>

      {/* VIDEO SECTION */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem" }}>
            Míralo en Acción
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Todo lo que puedes hacer con Game Comic Crafter</p>
        </div>

        {/* Video Tabs */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
          {videos.map((v, i) => (
            <button
              key={i}
              onClick={() => setActiveVideo(i)}
              style={{
                background: activeVideo === i ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                border: activeVideo === i ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.1)",
                color: activeVideo === i ? "#a78bfa" : "rgba(255,255,255,0.5)",
                borderRadius: 10, padding: "0.6rem 1.2rem", cursor: "pointer",
                fontSize: "0.82rem", fontWeight: 600, transition: "all 0.2s"
              }}
            >
              Video {i + 1}: {v.title}
            </button>
          ))}
        </div>

        {/* Video Player */}
        <div style={{
          borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 0 60px rgba(139,92,246,0.2)",
          background: "#000", aspectRatio: "16/9"
        }}>
          <video
            key={activeVideo}
            src={videos[activeVideo].url}
            controls
            autoPlay
            muted
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </div>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
          {videos[activeVideo].desc}
        </p>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 80px" }}>
        <h2 style={{ textAlign: "center", fontFamily: "'Orbitron',sans-serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "3rem", background: "linear-gradient(135deg,#fff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Todo lo que necesitas
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            { icon: "🎮", title: "Integración de Juegos", desc: "Conecta con tus capturas de pantalla y clips de gameplay para generar paneles automáticamente." },
            { icon: "🤖", title: "IA Generativa", desc: "Motor de IA avanzado que crea personajes, fondos y diálogos únicos para cada historia." },
            { icon: "🛍️", title: "Tienda Integrada", desc: "Vende tus cómics directamente desde la plataforma con integración Shopify." },
            { icon: "🌐", title: "Comunidad Global", desc: "Comparte tus creaciones con millones de gamers y recibe feedback en tiempo real." },
            { icon: "📱", title: "Multi-plataforma", desc: "Disponible en web, iOS y Android. Crea desde cualquier dispositivo." },
            { icon: "⚡", title: "Generación Rápida", desc: "De idea a cómic terminado en menos de 5 minutos. Sin conocimientos de diseño necesarios." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: 16, padding: "1.5rem", transition: "all 0.2s",
              cursor: "default"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{f.title}</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        textAlign: "center", padding: "80px 2rem",
        background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.2) 0%, transparent 70%)"
      }}>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "2rem", fontWeight: 900, marginBottom: "1rem" }}>
          ¿Listo para crear?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", fontSize: "1rem" }}>
          Únete a miles de gamers que ya crean su historia
        </p>
        <a href={createPageUrl("Home")} style={{
          background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff",
          borderRadius: 12, padding: "1rem 2.5rem", fontWeight: 700, fontSize: "1.1rem",
          cursor: "pointer", textDecoration: "none", display: "inline-block",
          boxShadow: "0 0 40px rgba(139,92,246,0.5)"
        }}>
          Empezar Gratis — Es Gratis →
        </a>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
        © 2026 GameComicCrafter. Todos los derechos reservados.
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}