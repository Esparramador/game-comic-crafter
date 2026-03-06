import { GoogleLogin } from "@/components/ui/google_login";
import { createPageUrl } from "@/utils";
import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export const config = { requiresAuth: false };

const VIDEO1 = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/f1f6abb71_Configuracin_lista_triler_generado.mp4";
const VIDEO2 = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/10de00b17_Landing_Videos_y_Tienda_Shopify.mp4";

export default function Landing() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          window.location.href = createPageUrl("HomeScreen");
        }
      } catch (e) {
        console.log("Auth check:", e.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{minHeight:"100vh",background:"#0d0520",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{color:"#c4b5fd",fontSize:"0.85rem"}}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#0d0520",backgroundImage:"radial-gradient(circle,rgba(168,85,247,0.18) 1.5px,transparent 1.5px)",backgroundSize:"12px 12px",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Inter',sans-serif",padding:"2rem",position:"relative",overflow:"hidden"}}>
      <style>{`
        .glow-bg{position:absolute;top:10%;left:50%;transform:translateX(-50%);width:500px;height:500px;background:radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 70%);pointer-events:none}
        .land-pill{background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.3);border-radius:50px;padding:0.3rem 0.9rem;font-size:0.72rem;color:#c4b5fd}
        .land-card{background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.3);border-radius:14px;padding:1.5rem;width:100%;max-width:340px;display:flex;flex-direction:column;align-items:center;gap:1rem;backdrop-filter:blur(10px)}
        .vid-card{background:#160830;border:1px solid rgba(124,58,237,0.25);border-radius:14px;overflow:hidden;transition:all 0.3s;cursor:pointer}
        .vid-card:hover{border-color:rgba(124,58,237,0.6);box-shadow:0 0 30px rgba(124,58,237,0.2);transform:translateY(-3px)}
        .vid-card video{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
        .vid-label{padding:0.7rem 1rem;font-size:0.78rem;font-weight:600;color:#c4b5fd;border-top:1px solid rgba(124,58,237,0.15)}
        .section-title{font-size:1.1rem;font-weight:700;color:#fff;text-align:center;margin-bottom:1.2rem;letter-spacing:1px}
        .section-sub{font-size:0.72rem;color:#7060a0;text-align:center;margin-top:-0.8rem;margin-bottom:1.5rem}
      `}</style>

      <div className="glow-bg"/>

      {/* HERO */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:"2.5rem",zIndex:1,marginTop:"1rem"}}>
        <div style={{width:90,height:90,borderRadius:20,background:"linear-gradient(135deg,#7c3aed,#e91e8c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.8rem",marginBottom:"1.5rem",boxShadow:"0 0 0 6px rgba(124,58,237,0.15),0 0 40px rgba(124,58,237,0.4)",border:"2px solid rgba(168,85,247,0.5)"}}>🐧</div>
        <h1 style={{fontFamily:"monospace",fontSize:"clamp(1.6rem,5vw,2.5rem)",fontWeight:900,color:"#fff",textAlign:"center",textShadow:"0 0 30px rgba(124,58,237,0.6)",letterSpacing:2,marginBottom:"0.5rem",lineHeight:1.2}}>Game Comic<br/>Crafter</h1>
        <p style={{fontFamily:"monospace",fontSize:"0.65rem",letterSpacing:"4px",textTransform:"uppercase",color:"#a855f7",marginBottom:"1.2rem"}}>El Súper Cerebro del Creador</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",justifyContent:"center",marginBottom:"0"}}>
          {["⚙️ Physics Mixer AAA","🎙️ ElevenLabs Voices","🏺 Tripo3D Models","🛍️ Shopify Ready","🤖 6-AI Cluster"].map(f=>(
            <span key={f} className="land-pill">{f}</span>
          ))}
        </div>
      </div>

      {/* VIDEOS */}
      <div style={{width:"100%",maxWidth:900,zIndex:1,marginBottom:"2.5rem"}}>
        <div className="section-title">🎬 Ve lo que puedes crear</div>
        <div className="section-sub">Trailers y demos generados 100% con GCC Engine</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.2rem"}}>
          <div className="vid-card">
            <video src={VIDEO1} controls muted playsInline preload="metadata"/>
            <div className="vid-label">🎮 Trailer — Configuración lista · GCC Engine</div>
          </div>
          <div className="vid-card">
            <video src={VIDEO2} controls muted playsInline preload="metadata"/>
            <div className="vid-label">🛍️ Demo — Landing · Tienda Shopify integrada</div>
          </div>
        </div>
      </div>

      {/* LOGIN */}
      <div className="land-card" style={{zIndex:1}}>
        <p style={{fontSize:"0.85rem",color:"rgba(232,224,245,0.7)",textAlign:"center"}}>Accede con tu cuenta de Google para entrar al GCC Engine</p>
        <GoogleLogin />
      </div>

      <p style={{marginTop:"2rem",fontSize:"0.65rem",color:"rgba(120,90,160,0.5)",textAlign:"center",zIndex:1,marginBottom:"1rem"}}>
        GCC Engine v1.0 · 6-AI Cluster · Nintendo Polish Grade AAA
      </p>
    </div>
  );
}