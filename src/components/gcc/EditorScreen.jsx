import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, Spinner, EmptyState, Pill, inputStyle, labelStyle } from "./shared";

const GENRES  = ["Platformer","RPG","Open World","Fighting","Stealth","Arcade","Puzzle","Adventure","MOBA","RTS","MMO","Battle Royale","Horror","Metroidvania"];
const FORMATS = ["2D","3D","2.5D","VR","AR"];
const ENGINES = ["Phaser.js","Babylon.js","Three.js","PlayCanvas","PixiJS"];
const STYLES  = ["Dark Fantasy","Cyberpunk","Anime","Pixel Art","Realista AAA","Cartoon","Sci-Fi","Medieval","Post-Apocalíptico","Neon Noir","Steampunk"];

const STATUS_STYLE = {
  playable:   { bg:"rgba(34,197,94,0.12)",   color:"#22c55e",  border:"rgba(34,197,94,0.3)" },
  draft:      { bg:"rgba(124,58,237,0.12)",   color:"#c084fc",  border:"rgba(124,58,237,0.3)" },
  generating: { bg:"rgba(255,215,0,0.1)",     color:"#ffd700",  border:"rgba(255,215,0,0.3)" },
  published:  { bg:"rgba(150,191,72,0.12)",   color:"#96bf48",  border:"rgba(150,191,72,0.3)" },
};

// ── Motor de prompts para juegos (integrado) ──
function buildGamePrompt(form) {
  return `Actúa como un Game Director AAA (Blizzard + Nintendo + Riot). Diseña el juego "${form.title}" con estas specs:

GÉNERO: ${form.genre} | FORMATO: ${form.format} | ENGINE: ${form.engine} | ESTILO: ${form.style||"Dark Fantasy"}
DESCRIPCIÓN: ${form.description || "Juego épico con mecánicas innovadoras"}

ENTREGA:
1. GDD completo: sinopsis 3 actos, 5 mecánicas core con specs técnicas, sistema de progresión, 10 niveles/áreas
2. Código ${form.engine} funcional: game loop, físicas, HUD, colisiones, guardado
3. 15 enemigos con stats (HP/DMG/SPD/DROPS)
4. Árbol de habilidades del protagonista (20 nodos)
5. Prompt arte portada: estilo ${form.style||"Dark Fantasy"}, 8K, concept art AAA
6. Script trailer 60s con narración épica
7. SEO description Shopify (300 palabras, keywords incluidas)

Nivel: Nintendo Gold Master. Código listo para producción.`;
}

export default function EditorScreen({ onNav, showToast }) {
  const [view, setView]     = useState("list");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    title:"", description:"", genre:"RPG", format:"2D",
    engine:"Phaser.js", style:"Dark Fantasy", atmosphere:"dark", status:"draft"
  });
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPrompt, setShowPrompt]     = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.GameProject.list("-updated_date", 30)
      .then(d => setProjects(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.title.trim()) { showToast("⚠️ Escribe un título", "warning"); return; }
    setSaving(true);
    try {
      const p = await base44.entities.GameProject.create({ ...form, status:"draft" });
      setProjects(prev => [p, ...prev]);
      showToast("✅ Proyecto creado", "success");
      setForm({ title:"", description:"", genre:"RPG", format:"2D", engine:"Phaser.js", style:"Dark Fantasy", atmosphere:"dark", status:"draft" });
      setView("list");
    } catch(e) { showToast("❌ Error al crear", "error"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este proyecto?")) return;
    setDeleting(true);
    try {
      await base44.entities.GameProject.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast("🗑️ Proyecto eliminado", "info");
      setView("list"); setSelected(null);
    } catch(_) { showToast("❌ Error al eliminar", "error"); }
    setDeleting(false);
  };

  const copyPrompt = () => {
    const prompt = buildGamePrompt(form);
    navigator.clipboard.writeText(prompt).then(() => {
      setPromptCopied(true);
      showToast("⚡ Prompt maestro copiado — pégalo en ChatGPT/Claude/Gemini", "success");
      setTimeout(() => setPromptCopied(false), 2500);
    });
  };

  if (loading) return <Spinner />;

  // ─── DETAIL ───
  if (view === "detail" && selected) {
    const sc = STATUS_STYLE[selected.status] || STATUS_STYLE.draft;
    return (
      <div style={{ padding:"1rem" }}>
        <button onClick={() => { setView("list"); setSelected(null); }} style={{
          background:"transparent", border:"none", color:C.muted,
          fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
          display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
        }}>← Volver a Mis Juegos</button>

        <div style={{ background:C.card, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>
          {selected.cover_image_url && (
            <img src={selected.cover_image_url} alt={selected.title} style={{ width:"100%", height:160, objectFit:"cover" }} />
          )}
          {!selected.cover_image_url && (
            <div style={{ height:120, background:"linear-gradient(135deg,#7c3aed22,#e91e8c22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"4rem" }}>🎮</div>
          )}

          <div style={{ padding:"1rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
              <div>
                <div style={{ fontSize:"1.05rem", fontWeight:800, color:C.text }}>{selected.title}</div>
                <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>{selected.genre} · {selected.format} · {selected.engine}</div>
              </div>
              <span style={{ ...sc, borderRadius:20, padding:"3px 10px", fontSize:"0.6rem", fontWeight:700, border:`1px solid ${sc.border}` }}>
                {selected.status || "draft"}
              </span>
            </div>

            {selected.description && (
              <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.6, marginBottom:"1rem" }}>
                {selected.description}
              </div>
            )}

            {/* Stats rápidos */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem", marginBottom:"1rem" }}>
              {[
                { label:"Precio", val: selected.is_for_sale ? `€${selected.price||"—"}` : "Free", icon:"💰" },
                { label:"Shopify", val: selected.shopify_product_id ? "✅" : "—", icon:"🛍️" },
                { label:"Export", val: selected.export_status || "—", icon:"📦" },
              ].map(s => (
                <div key={s.label} style={{ background:C.card2, borderRadius:10, padding:"0.55rem", textAlign:"center", border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:"1rem" }}>{s.icon}</div>
                  <div style={{ fontSize:"0.75rem", fontWeight:700, color:C.cyan }}>{s.val}</div>
                  <div style={{ fontSize:"0.52rem", color:C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Links */}
            <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem", marginBottom:"1rem" }}>
              {selected.playable_url && (
                <a href={selected.playable_url} target="_blank" rel="noreferrer" style={{
                  display:"flex", alignItems:"center", gap:"0.6rem",
                  background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)",
                  borderRadius:10, padding:"0.7rem", textDecoration:"none", color:"#22c55e"
                }}>
                  <span>▶️</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Jugar Demo</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.playable_url}</div>
                  </div>
                </a>
              )}
              {selected.export_url_web && (
                <a href={selected.export_url_web} target="_blank" rel="noreferrer" style={{
                  display:"flex", alignItems:"center", gap:"0.6rem",
                  background:"rgba(0,245,255,0.06)", border:"1px solid rgba(0,245,255,0.25)",
                  borderRadius:10, padding:"0.7rem", textDecoration:"none", color:C.cyan
                }}>
                  <span>🌐</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Build Web</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.export_url_web}</div>
                  </div>
                </a>
              )}
              {selected.launch_page_url && (
                <a href={selected.launch_page_url} target="_blank" rel="noreferrer" style={{
                  display:"flex", alignItems:"center", gap:"0.6rem",
                  background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
                  borderRadius:10, padding:"0.7rem", textDecoration:"none", color:"#c084fc"
                }}>
                  <span>🚀</span>
                  <div>
                    <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Launch Page</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7 }}>{selected.launch_page_url.substring(0,45)}...</div>
                  </div>
                </a>
              )}
              {selected.shopify_product_id && (
                <a href={`https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}`} target="_blank" rel="noreferrer" style={{
                  display:"flex", alignItems:"center", gap:"0.6rem",
                  background:"rgba(150,191,72,0.08)", border:"1px solid rgba(150,191,72,0.3)",
                  borderRadius:10, padding:"0.7rem", textDecoration:"none", color:"#96bf48"
                }}>
                  <span>🛍️</span>
                  <div>
                    <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Shopify</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7 }}>ID: {selected.shopify_product_id}</div>
                  </div>
                </a>
              )}
              {selected.marketing_poster_url && (
                <a href={selected.marketing_poster_url} target="_blank" rel="noreferrer" style={{
                  display:"flex", alignItems:"center", gap:"0.6rem",
                  background:"rgba(233,30,140,0.08)", border:"1px solid rgba(233,30,140,0.3)",
                  borderRadius:10, padding:"0.7rem", textDecoration:"none", color:C.pink
                }}>
                  <span>🎨</span>
                  <div>
                    <div style={{ fontSize:"0.78rem", fontWeight:700 }}>Poster Marketing</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7 }}>Ver imagen</div>
                  </div>
                </a>
              )}
            </div>

            {/* Acciones */}
            <div style={{ display:"flex", gap:"0.5rem" }}>
              <button onClick={() => { onNav("marketing"); }} style={{
                flex:1, background:"rgba(233,30,140,0.08)", border:"1px solid rgba(233,30,140,0.3)",
                borderRadius:8, padding:"0.55rem", color:C.pink,
                fontSize:"0.72rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>📣 Marketing</button>
              <button onClick={() => { onNav("physics"); }} style={{
                flex:1, background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
                borderRadius:8, padding:"0.55rem", color:"#c084fc",
                fontSize:"0.72rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>⚙️ Physics</button>
              <button onClick={() => handleDelete(selected.id)} disabled={deleting} style={{
                background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:8, padding:"0.55rem", color:"#ef4444",
                fontSize:"0.72rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                minWidth:60
              }}>{deleting ? "..." : "🗑️"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CREATE ───
  if (view === "create") return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => setView("list")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver a Mis Juegos</button>
      <SectionTitle>✏️ Nuevo Proyecto</SectionTitle>

      <div style={{ marginBottom:"0.75rem" }}>
        <label style={labelStyle}>Título del Juego *</label>
        <input style={inputStyle} placeholder="Ej: El Resurgir del Pingüino de Cristal" value={form.title} onChange={e => set("title", e.target.value)} />
      </div>

      <div style={{ marginBottom:"0.75rem" }}>
        <label style={labelStyle}>Descripción</label>
        <textarea style={{ ...inputStyle, resize:"vertical", height:75 }} placeholder="¿De qué trata tu juego? Cuantos más detalles, mejor el prompt generado..." value={form.description} onChange={e => set("description", e.target.value)} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.55rem", marginBottom:"0.75rem" }}>
        <div>
          <label style={labelStyle}>Género</label>
          <select style={inputStyle} value={form.genre} onChange={e => set("genre", e.target.value)}>
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Formato</label>
          <select style={inputStyle} value={form.format} onChange={e => set("format", e.target.value)}>
            {FORMATS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Motor</label>
          <select style={inputStyle} value={form.engine} onChange={e => set("engine", e.target.value)}>
            {ENGINES.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Estilo Visual</label>
          <select style={inputStyle} value={form.style} onChange={e => set("style", e.target.value)}>
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ⚡ PROMPT MAESTRO INTEGRADO */}
      <div style={{ background:"rgba(124,58,237,0.06)", borderRadius:12, padding:"0.9rem", border:"1px solid rgba(124,58,237,0.25)", marginBottom:"1rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
          <div>
            <div style={{ fontSize:"0.75rem", fontWeight:800, color:"#c084fc" }}>⚡ Prompt Maestro AAA</div>
            <div style={{ fontSize:"0.58rem", color:C.muted }}>Genera el GDD, código y arte con IA</div>
          </div>
          <div style={{ display:"flex", gap:"0.4rem" }}>
            <button onClick={() => setShowPrompt(!showPrompt)} style={{
              background:"rgba(124,58,237,0.15)", border:`1px solid rgba(124,58,237,0.4)`,
              borderRadius:8, padding:"0.3rem 0.7rem", color:"#c084fc",
              fontSize:"0.62rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
            }}>{showPrompt ? "Ocultar" : "👁 Ver"}</button>
            <button onClick={copyPrompt} disabled={!form.title} style={{
              background: promptCopied ? "rgba(34,197,94,0.15)" : "rgba(0,245,255,0.1)",
              border: promptCopied ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(0,245,255,0.3)",
              borderRadius:8, padding:"0.3rem 0.8rem",
              color: promptCopied ? "#22c55e" : C.cyan,
              fontSize:"0.65rem", fontWeight:800,
              cursor: form.title ? "pointer" : "not-allowed",
              fontFamily:"inherit", transition:"all 0.2s"
            }}>{promptCopied ? "✅ Copiado!" : "📋 Copiar"}</button>
          </div>
        </div>
        {showPrompt && form.title && (
          <pre style={{ fontSize:"0.62rem", color:C.text, lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, maxHeight:180, overflowY:"auto", fontFamily:"monospace" }}>
            {buildGamePrompt(form)}
          </pre>
        )}
        {!form.title && (
          <div style={{ fontSize:"0.65rem", color:C.muted, fontStyle:"italic" }}>Escribe un título para generar el prompt maestro...</div>
        )}
      </div>

      <button onClick={handleCreate} disabled={saving} style={{
        width:"100%", padding:"0.9rem",
        background: saving ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#e91e8c)",
        border:"none", borderRadius:12, color:"#fff",
        fontWeight:800, fontSize:"0.9rem",
        cursor: saving ? "not-allowed" : "pointer", fontFamily:"inherit", letterSpacing:1
      }}>{saving ? "Guardando..." : "🎮 Crear Proyecto"}</button>
    </div>
  );

  // ─── LIST ───
  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <SectionTitle>🎮 Mis Juegos</SectionTitle>
        <button onClick={() => setView("create")} style={{
          background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
          borderRadius:10, padding:"0.5rem 1rem", color:"#fff",
          fontSize:"0.72rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit"
        }}>+ Nuevo</button>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon="🎮" title="Sin proyectos" sub="Crea tu primer juego" action="✏️ Crear Proyecto" onAction={() => setView("create")} />
      ) : (
        <div style={{ display:"grid", gap:"0.7rem" }}>
          {projects.map(p => {
            const sc = STATUS_STYLE[p.status] || STATUS_STYLE.draft;
            return (
              <div key={p.id} onClick={() => { setSelected(p); setView("detail"); }} style={{
                background:C.card, borderRadius:14, overflow:"hidden",
                border:`1px solid ${C.border}`, cursor:"pointer", transition:"all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.5)"}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                {p.cover_image_url && (
                  <img src={p.cover_image_url} alt={p.title} style={{ width:"100%", height:90, objectFit:"cover" }} />
                )}
                <div style={{ padding:"0.85rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.4rem" }}>
                    <div>
                      <div style={{ fontSize:"0.88rem", fontWeight:700, color:C.text }}>{p.title}</div>
                      <div style={{ fontSize:"0.62rem", color:C.muted, marginTop:2 }}>{p.genre} · {p.format} · {p.engine}</div>
                    </div>
                    <span style={{ ...sc, borderRadius:20, padding:"2px 8px", fontSize:"0.58rem", fontWeight:700, border:`1px solid ${sc.border}`, flexShrink:0, marginLeft:8 }}>
                      {p.status || "draft"}
                    </span>
                  </div>
                  {p.description && (
                    <div style={{ fontSize:"0.68rem", color:C.muted, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", marginBottom:"0.5rem" }}>
                      {p.description}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                    {p.playable_url && (
                      <a href={p.playable_url} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          background:"rgba(34,197,94,0.1)", color:"#22c55e",
                          border:"1px solid rgba(34,197,94,0.3)", borderRadius:8,
                          padding:"0.3rem 0.7rem", fontSize:"0.65rem", fontWeight:700,
                          textDecoration:"none"
                        }}>▶️ Jugar</a>
                    )}
                    {p.export_url_web && (
                      <a href={p.export_url_web} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          background:"rgba(0,245,255,0.06)", color:C.cyan,
                          border:"1px solid rgba(0,245,255,0.2)", borderRadius:8,
                          padding:"0.3rem 0.7rem", fontSize:"0.65rem", fontWeight:700,
                          textDecoration:"none"
                        }}>🌐 Build</a>
                    )}
                    {p.is_for_sale && p.price && (
                      <span style={{ background:"rgba(150,191,72,0.1)", color:"#96bf48", border:"1px solid rgba(150,191,72,0.3)", borderRadius:8, padding:"0.3rem 0.7rem", fontSize:"0.65rem", fontWeight:700 }}>
                        💰 €{p.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
