import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, Spinner, EmptyState, Pill } from "./shared";

export default function MarketingScreen({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("overview"); // overview | kit | export

  useEffect(() => {
    Promise.all([
      base44.entities.GameProject.list("-updated_date", 20),
      base44.entities.MarketingKit.list("-created_date", 20).catch(() => []),
    ]).then(([projs, k]) => {
      setProjects(projs||[]);
      setKits(k||[]);
      if (projs && projs[0]) setSelected(projs[0]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (projects.length === 0) return (
    <div style={{ padding:"1rem" }}>
      <SectionTitle>📣 Marketing Kit</SectionTitle>
      <EmptyState icon="📣" title="Sin proyectos" sub="Crea un proyecto para generar su kit de marketing" />
    </div>
  );

  const kit = kits.find(k => k.project_id === selected?.id);

  const TAB_STYLE = (active) => ({
    flex:1, padding:"0.5rem", background: active ? "rgba(124,58,237,0.2)" : "transparent",
    border:"none", borderBottom: active ? "2px solid #7c3aed" : "2px solid transparent",
    color: active ? "#c084fc" : C.muted, fontSize:"0.72rem", fontWeight:700,
    cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s"
  });

  return (
    <div style={{ padding:"1rem" }}>
      <SectionTitle>📣 Marketing Kit</SectionTitle>

      {/* Selector proyecto */}
      <div style={{ marginBottom:"1rem", display:"flex", gap:"0.5rem", overflowX:"auto", paddingBottom:"0.3rem" }}>
        {projects.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} style={{
            flexShrink:0, background: selected?.id===p.id ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.06)",
            border:`1px solid ${selected?.id===p.id ? "rgba(124,58,237,0.5)" : C.border}`,
            borderRadius:20, padding:"0.35rem 0.9rem", color: selected?.id===p.id ? "#c084fc" : C.muted,
            fontSize:"0.7rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"
          }}>{p.title}</button>
        ))}
      </div>

      {selected && (
        <>
          {/* TABS */}
          <div style={{ display:"flex", background:C.card, borderRadius:10, marginBottom:"1rem", overflow:"hidden", border:`1px solid ${C.border}` }}>
            <button style={TAB_STYLE(tab==="overview")} onClick={() => setTab("overview")}>📊 Overview</button>
            <button style={TAB_STYLE(tab==="kit")} onClick={() => setTab("kit")}>🎨 Kit</button>
            <button style={TAB_STYLE(tab==="export")} onClick={() => setTab("export")}>📤 Export</button>
          </div>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div>
              <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}`, marginBottom:"0.8rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
                  <div>
                    <div style={{ fontSize:"1rem", fontWeight:800, color:C.text }}>{selected.title}</div>
                    <div style={{ fontSize:"0.68rem", color:C.muted, marginTop:2 }}>{selected.genre} · {selected.format}</div>
                  </div>
                  <Pill color={selected.status==="playable"?"green":"purple"}>{selected.status||"draft"}</Pill>
                </div>

                {selected.cover_image_url && (
                  <img src={selected.cover_image_url} alt={selected.title} style={{ width:"100%", borderRadius:10, maxHeight:140, objectFit:"cover", marginBottom:"0.8rem" }} />
                )}

                {selected.sales_description && (
                  <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.5, marginBottom:"0.8rem" }}>
                    {selected.sales_description}
                  </div>
                )}

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.4rem" }}>
                  {[
                    { label:"Precio", val: selected.is_for_sale ? `€${selected.price||"—"}` : "N/A", icon:"💰" },
                    { label:"Shopify", val: selected.shopify_product_id ? "✅" : "—", icon:"🛍️" },
                    { label:"Kit", val: kit ? "✅" : "—", icon:"🎨" },
                  ].map(s => (
                    <div key={s.label} style={{ background:C.card2, borderRadius:10, padding:"0.5rem", textAlign:"center" }}>
                      <div style={{ fontSize:"1.1rem" }}>{s.icon}</div>
                      <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.cyan }}>{s.val}</div>
                      <div style={{ fontSize:"0.55rem", color:C.muted }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links existentes */}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                {selected.playable_url && (
                  <a href={selected.playable_url} target="_blank" rel="noreferrer" style={{
                    display:"flex", alignItems:"center", gap:"0.6rem",
                    background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)",
                    borderRadius:10, padding:"0.7rem", textDecoration:"none", color:C.green
                  }}>
                    <span style={{ fontSize:"1.1rem" }}>▶️</span>
                    <div>
                      <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Jugar Demo</div>
                      <div style={{ fontSize:"0.62rem", opacity:0.7 }}>{selected.playable_url.substring(0,40)}...</div>
                    </div>
                  </a>
                )}
                {selected.launch_page_url && (
                  <a href={selected.launch_page_url} target="_blank" rel="noreferrer" style={{
                    display:"flex", alignItems:"center", gap:"0.6rem",
                    background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
                    borderRadius:10, padding:"0.7rem", textDecoration:"none", color:"#c084fc"
                  }}>
                    <span style={{ fontSize:"1.1rem" }}>🚀</span>
                    <div>
                      <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Página de lanzamiento</div>
                      <div style={{ fontSize:"0.62rem", opacity:0.7 }}>{selected.launch_page_url.substring(0,40)}...</div>
                    </div>
                  </a>
                )}
                {selected.shopify_product_id && (
                  <a href={`https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}`} target="_blank" rel="noreferrer" style={{
                    display:"flex", alignItems:"center", gap:"0.6rem",
                    background:"rgba(150,191,72,0.08)", border:"1px solid rgba(150,191,72,0.3)",
                    borderRadius:10, padding:"0.7rem", textDecoration:"none", color:"#96bf48"
                  }}>
                    <span style={{ fontSize:"1.1rem" }}>🛍️</span>
                    <div>
                      <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Ver en Shopify</div>
                      <div style={{ fontSize:"0.62rem", opacity:0.7 }}>ID: {selected.shopify_product_id}</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* KIT TAB */}
          {tab === "kit" && (
            <div>
              {kit ? (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
                  {kit.poster_url && (
                    <div>
                      <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.4rem" }}>Poster</div>
                      <img src={kit.poster_url} alt="poster" style={{ width:"100%", borderRadius:12, maxHeight:200, objectFit:"cover" }} />
                    </div>
                  )}
                  {kit.synopsis_es && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.4rem" }}>Sinopsis (ES)</div>
                      <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.5 }}>{kit.synopsis_es}</div>
                    </div>
                  )}
                  {kit.synopsis_en && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.4rem" }}>Synopsis (EN)</div>
                      <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.5 }}>{kit.synopsis_en}</div>
                    </div>
                  )}
                  {kit.seo_tags && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>SEO Tags</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
                        {(Array.isArray(kit.seo_tags) ? kit.seo_tags : kit.seo_tags.split(",")).map((t,i) => (
                          <span key={i} style={{ background:"rgba(124,58,237,0.12)", color:"#c084fc", border:`1px solid ${C.border}`, borderRadius:20, padding:"2px 8px", fontSize:"0.62rem" }}>{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {kit.trailer_audio_url && (
                    <div>
                      <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.4rem" }}>Audio Trailer</div>
                      <audio controls src={kit.trailer_audio_url} style={{ width:"100%" }} />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"2rem 1rem" }}>
                  <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎨</div>
                  <div style={{ fontSize:"0.85rem", color:C.text, marginBottom:"0.4rem" }}>Sin kit de marketing aún</div>
                  <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:"1.2rem" }}>Genera el kit automáticamente para este proyecto</div>
                  <button onClick={() => showToast("🤖 Generación de kit en construcción — próximamente con IA", "info")} style={{
                    background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
                    borderRadius:10, padding:"0.7rem 1.5rem", color:"#fff",
                    fontWeight:700, fontSize:"0.82rem", cursor:"pointer", fontFamily:"inherit"
                  }}>🎨 Generar Kit con IA</button>
                </div>
              )}
            </div>
          )}

          {/* EXPORT TAB */}
          {tab === "export" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
              {[
                { icon:"🌐", label:"Web Build", url:selected.export_url_web, status:"web" },
                { icon:"📱", label:"Android APK", url:selected.export_url_android, status:"android" },
                { icon:"🛍️", label:"Shopify Store", url: selected.shopify_product_id ? `https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}` : null, status:"shopify" },
              ].map(ex => (
                <div key={ex.status} style={{ background:C.card, borderRadius:12, padding:"1rem", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:"0.8rem" }}>
                  <span style={{ fontSize:"1.8rem" }}>{ex.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"0.82rem", fontWeight:700, color:C.text }}>{ex.label}</div>
                    {ex.url ? (
                      <div style={{ fontSize:"0.65rem", color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ex.url}</div>
                    ) : (
                      <div style={{ fontSize:"0.65rem", color:C.muted }}>No disponible</div>
                    )}
                  </div>
                  {ex.url ? (
                    <a href={ex.url} target="_blank" rel="noreferrer" style={{
                      background:"rgba(34,197,94,0.12)", color:C.green,
                      border:"1px solid rgba(34,197,94,0.3)", borderRadius:8,
                      padding:"0.4rem 0.8rem", fontSize:"0.68rem", fontWeight:700,
                      textDecoration:"none", whiteSpace:"nowrap"
                    }}>Abrir ↗</a>
                  ) : (
                    <span style={{ background:"rgba(124,58,237,0.1)", color:C.muted, border:`1px solid ${C.border}`, borderRadius:8, padding:"0.4rem 0.8rem", fontSize:"0.68rem" }}>—</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
