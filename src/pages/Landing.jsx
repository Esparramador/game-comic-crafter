import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";

export default function Landing() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0d0520", color: "#fff",
      fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden"
    }}>
      {/* Halftone dot pattern */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.18) 1px, transparent 1px)",
        backgroundSize: "28px 28px"
      }} />

      {/* Glow center */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, transparent 70%)",
        zIndex: 0
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "2rem", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%", margin: "0 auto 1.5rem",
          background: "rgba(124,58,237,0.15)", border: "2px solid rgba(124,58,237,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.6rem", boxShadow: "0 0 40px rgba(124,58,237,0.4)"
        }}>🐧</div>

        {/* Title */}
        <div style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.6rem, 6vw, 2.4rem)",
          fontWeight: 900, letterSpacing: 2, lineHeight: 1.1, marginBottom: "0.6rem",
          background: "linear-gradient(135deg,#fff 0%,#c084fc 50%,#e91e8c 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Game Comic Crafter
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: "0.85rem", color: "rgba(192,132,252,0.8)", letterSpacing: 2,
          textTransform: "uppercase", marginBottom: "2.5rem"
        }}>
          El Súper Cerebro del Creador
        </div>

        {/* Google Login Button */}
        <button
          onClick={() => base44.auth.redirectToLogin(createPageUrl("Home"))}
          style={{
            width: "100%", padding: "0.95rem 1.5rem",
            background: "linear-gradient(135deg,#7c3aed,#e91e8c)",
            border: "none", borderRadius: 14, color: "#fff",
            fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            letterSpacing: 0.5, boxShadow: "0 0 30px rgba(124,58,237,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
            marginBottom: "2rem", fontFamily: "inherit"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" fillOpacity="0.9"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" fillOpacity="0.9"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" fillOpacity="0.9"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" fillOpacity="0.9"/>
          </svg>
          Entrar con Google
        </button>

        {/* Feature Pills */}
        <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {[
            { icon: "⚙️", label: "Physics Mixer AAA" },
            { icon: "🎙️", label: "ElevenLabs Voices" },
            { icon: "🛍️", label: "Shopify Ready" },
          ].map((pill) => (
            <div key={pill.label} style={{
              background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.35)",
              borderRadius: 50, padding: "5px 14px",
              fontSize: "0.72rem", color: "#c084fc", fontWeight: 600,
              letterSpacing: 0.5, display: "flex", alignItems: "center", gap: "0.3rem"
            }}>
              {pill.icon} {pill.label}
            </div>
          ))}
        </div>

        {/* Videos Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
          <div style={{
            borderRadius: 12, overflow: "hidden",
            border: "1px solid rgba(124,58,237,0.25)", background: "#160d2e"
          }}>
            <video
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/f1f6abb71_Configuracin_lista_triler_generado.mp4"
              style={{ width: "100%", height: 160, objectFit: "cover" }}
              muted
              autoPlay
              loop
            />
          </div>
          <div style={{
            borderRadius: 12, overflow: "hidden",
            border: "1px solid rgba(124,58,237,0.25)", background: "#160d2e"
          }}>
            <video
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/10de00b17_Landing_Videos_y_Tienda_Shopify.mp4"
              style={{ width: "100%", height: 160, objectFit: "cover" }}
              muted
              autoPlay
              loop
            />
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}