import { C, Pill, Btn } from "./shared.jsx";

export default function MarketingScreen({ showToast }) {
  return (
    <div>
      <div style={{ padding: "1rem 1rem 0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900 }}>Marketing Kit</div>
        <Pill color="green">Ready ✓</Pill>
      </div>

      <div style={{ padding: "0 1rem" }}>
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/53073646b_generated_image.png"
          alt="poster"
          style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 14, display: "block", marginBottom: "1rem" }}
          onError={e => e.target.style.display = "none"}
        />

        <div style={{ background: C.card, borderLeft: `3px solid ${C.cyan}`, borderRadius: "0 12px 12px 0", padding: "1rem", marginBottom: "0.8rem" }}>
          <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.4rem" }}>🇪🇸 Sinopsis</div>
          <div style={{ fontSize: "0.84rem", lineHeight: 1.6 }}>
            Adrián Voss, el último guerrero del Imperio caído, debe recuperar la Espada Celeste. Acción épica 2D con física Nintendo × Crash Bandicoot y hitboxes Riot.
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg,rgba(150,191,72,0.08),rgba(92,130,40,0.05))", border: "1px solid rgba(150,191,72,0.2)", borderRadius: 14, padding: "1.1rem", marginBottom: "1rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#96bf48", marginBottom: "0.3rem" }}>🛍️ comic-crafter.myshopify.com</div>
          <div style={{ fontSize: "0.72rem", color: C.muted, marginBottom: "0.7rem" }}>Product ID: 16158363320665</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Pill color="green">Listado ✓</Pill>
            <span style={{ fontFamily: "'Orbitron',sans-serif", color: C.gold, fontWeight: 700 }}>€15.00</span>
          </div>
        </div>

        <Btn full variant="primary" onClick={() => showToast("📸 Publicando en Instagram...")}>
          📸 Publicar en @comiccrafter_ai
        </Btn>
      </div>
    </div>
  );
}