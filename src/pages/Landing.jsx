import { useState } from "react";
import { GoogleLogin } from "@/components/ui/google_login.jsx";

export const config = { requiresAuth: false };

const VIDEO1 = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/f1f6abb71_Configuracin_lista_triler_generado.mp4";
const VIDEO2 = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/10de00b17_Landing_Videos_y_Tienda_Shopify.mp4";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; max-width: 100%; }

        .land-pill {
          background: rgba(124,58,237,0.18);
          border: 1px solid rgba(168,85,247,0.35);
          border-radius: 50px;
          padding: 0.3rem 0.85rem;
          font-size: 0.7rem;
          color: #c4b5fd;
          backdrop-filter: blur(6px);
        }

        .enter-btn {
          background: linear-gradient(135deg, #7c3aed, #e91e8c);
          border: none;
          border-radius: 50px;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.85rem 2.5rem;
          cursor: pointer;
          letter-spacing: 1px;
          box-shadow: 0 0 30px rgba(124,58,237,0.5);
          transition: all 0.2s;
          font-family: inherit;
        }
        .enter-btn:hover {
          box-shadow: 0 0 50px rgba(124,58,237,0.8);
          transform: scale(1.04);
        }

        .login-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .login-card {
          background: rgba(10, 5, 28, 0.75);
          border: 1px solid rgba(168,85,247,0.4);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 360px;
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          box-shadow: 0 0 60px rgba(124,58,237,0.3);
        }

        @media (max-width: 480px) {
          .login-card { padding: 2rem 1.5rem; margin: 1rem; }
        }
      `}</style>

      {/* ── VIDEO FONDO LANDING ── */}
      <video
        src={VIDEO1}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: 0
        }}
      />

      {/* ── OVERLAY OSCURO SOBRE VIDEO ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(8,4,20,0.55) 0%, rgba(8,4,20,0.3) 50%, rgba(8,4,20,0.8) 100%)",
        zIndex: 1
      }} />

      {/* ── CONTENIDO LANDING ── */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem",
        textAlign: "center"
      }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: "linear-gradient(135deg,#7c3aed,#e91e8c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.5rem", marginBottom: "1.2rem",
          boxShadow: "0 0 0 6px rgba(124,58,237,0.2), 0 0 50px rgba(124,58,237,0.5)",
          border: "2px solid rgba(168,85,247,0.5)"
        }}>🐧</div>

        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(1.8rem, 6vw, 3rem)",
          fontWeight: 900, color: "#fff",
          textShadow: "0 0 40px rgba(124,58,237,0.8)",
          letterSpacing: 2, lineHeight: 1.15, marginBottom: "0.6rem"
        }}>
          Game Comic<br/>Crafter
        </h1>

        <p style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.6rem", letterSpacing: "4px",
          textTransform: "uppercase", color: "#a855f7",
          marginBottom: "1.5rem"
        }}>El Súper Cerebro del Creador</p>

        {/* Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "2.5rem" }}>
          {["⚙️ Physics AAA","🎙️ ElevenLabs","🏺 Tripo3D","🛍️ Shopify","🤖 6-AI Cluster"].map(f => (
            <span key={f} className="land-pill">{f}</span>
          ))}
        </div>

        {/* CTA */}
        <button className="enter-btn" onClick={() => setShowLogin(true)}>
          🚀 Entrar al GCC Engine
        </button>

        <p style={{ marginTop: "1.5rem", fontSize: "0.6rem", color: "rgba(168,130,220,0.5)", letterSpacing: 1 }}>
          GCC Engine v1.0 · Nintendo Polish Grade AAA
        </p>
      </div>

      {/* ── LOGIN OVERLAY CON VIDEO2 DE FONDO ── */}
      {showLogin && (
        <div className="login-overlay">
          {/* Video fondo login */}
          <video
            src={VIDEO2}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              zIndex: 0
            }}
          />

          {/* Overlay oscuro */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(5, 2, 15, 0.7)",
            zIndex: 1
          }} />

          {/* Cerrar */}
          <button
            onClick={() => setShowLogin(false)}
            style={{
              position: "absolute", top: "1.2rem", right: "1.2rem",
              zIndex: 3, background: "rgba(124,58,237,0.2)",
              border: "1px solid rgba(168,85,247,0.4)",
              borderRadius: "50%", width: 36, height: 36,
              color: "#c4b5fd", fontSize: "1rem",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >✕</button>

          {/* Card login centrada */}
          <div style={{
            position: "relative", zIndex: 2,
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem"
          }}>
            <div className="login-card">
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: "linear-gradient(135deg,#7c3aed,#e91e8c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem",
                boxShadow: "0 0 30px rgba(124,58,237,0.5)"
              }}>🐧</div>

              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "1.1rem", fontWeight: 900,
                  color: "#fff", letterSpacing: 1, marginBottom: "0.3rem"
                }}>GCC Engine</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(196,181,253,0.7)" }}>
                  Accede con tu cuenta de Google
                </div>
              </div>

              <GoogleLogin />

              <p style={{ fontSize: "0.6rem", color: "rgba(120,90,160,0.5)", textAlign: "center" }}>
                Al entrar aceptas los términos de uso del GCC Engine
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}