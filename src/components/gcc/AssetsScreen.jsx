import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, Spinner, EmptyState, Pill, inputStyle, labelStyle } from "./shared";

const TYPE_ICON = {
  image:"🖼️", audio:"🎵", model_3d:"🏺", video:"🎬", sprite:"🎨",
  animation:"✨", code:"💻", font:"🔤", shader:"🌈", other:"📦",
};

const TYPE_COLORS = {
  image:"cyan", audio:"purple", model_3d:"gold", video:"pink",
  sprite:"green", animation:"cyan", code:"purple", other:"purple",
};

const ASSET_TYPES = ["image","audio","model_3d","video","sprite","animation","code","font","shader","other"];

export default function AssetsScreen({ onNav, showToast }) {
  const [assets, setAssets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [saleFilter, setSaleFilter] = useState("all"); // all | for_sale | not_sale
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [editSale, setEditSale] = useState(false);

  useEffect(() => {
    base44.entities.AssetRepository.list("-created_date", 200)
      .then(d => {
        const list = d || [];
        setAssets(list);
        setFiltered(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...assets];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => (a.name||"").toLowerCase().includes(q) || (a.tags||[]).some(t=>t.toLowerCase().includes(q)));
    }
    if (typeFilter !== "all") result = result.filter(a => a.type === typeFilter);
    if (saleFilter === "for_sale") result = result.filter(a => a.is_for_sale);
    if (saleFilter === "not_sale") result = result.filter(a => !a.is_for_sale);
    setFiltered(result);
  }, [search, typeFilter, saleFilter, assets]);

  const openAsset = (asset) => {
    setSelected(asset);
    setEditPrice(asset.shopify_price || asset.metadata?.price || "");
    setEditSale(!!asset.is_for_sale);
  };

  const handleToggleSale = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const newSaleState = !editSale;
      await base44.entities.AssetRepository.update(selected.id, {
        is_for_sale: newSaleState,
        metadata: { ...(selected.metadata||{}), price: editPrice || "0" }
      });
      setEditSale(newSaleState);
      setAssets(prev => prev.map(a => a.id===selected.id
        ? { ...a, is_for_sale:newSaleState, metadata:{ ...(a.metadata||{}), price:editPrice } }
        : a
      ));
      setSelected(prev => ({ ...prev, is_for_sale:newSaleState }));
      showToast(newSaleState ? "🛍️ Asset puesto en venta" : "✅ Asset retirado de venta", newSaleState ? "success" : "info");
    } catch(e) {
      showToast("❌ Error al actualizar", "error");
    }
    setSaving(false);
  };

  const handleSavePrice = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await base44.entities.AssetRepository.update(selected.id, {
        metadata: { ...(selected.metadata||{}), price: editPrice }
      });
      setAssets(prev => prev.map(a => a.id===selected.id
        ? { ...a, metadata:{ ...(a.metadata||{}), price:editPrice } }
        : a
      ));
      showToast("✅ Precio actualizado", "success");
    } catch(e) { showToast("❌ Error", "error"); }
    setSaving(false);
  };

  const formatSize = (mb) => mb ? `${mb.toFixed(1)} MB` : "—";

  const stats = {
    total: assets.length,
    for_sale: assets.filter(a=>a.is_for_sale).length,
    types: [...new Set(assets.map(a=>a.type).filter(Boolean))].length,
  };

  if (loading) return <Spinner />;

  // DETAIL VIEW
  if (selected) return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => setSelected(null)} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver a Assets</button>

      <div style={{ background:C.card, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>
        {/* Preview */}
        <div style={{
          minHeight:160, background:"rgba(255,255,255,0.02)",
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative", overflow:"hidden"
        }}>
          {selected.type === "image" && selected.file_url ? (
            <img src={selected.file_url} alt={selected.name} style={{ width:"100%", maxHeight:200, objectFit:"contain" }} />
          ) : selected.type === "audio" && (selected.file_url || selected.audio_url) ? (
            <div style={{ width:"100%", padding:"1.5rem" }}>
              <div style={{ fontSize:"3rem", textAlign:"center", marginBottom:"1rem" }}>🎵</div>
              <audio controls src={selected.file_url || selected.audio_url} style={{ width:"100%" }} />
            </div>
          ) : selected.type === "model_3d" && selected.file_url ? (
            <a href={selected.file_url} target="_blank" rel="noreferrer" style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem",
              textDecoration:"none", color:C.gold, padding:"2rem"
            }}>
              <span style={{ fontSize:"4rem" }}>🏺</span>
              <span style={{ fontSize:"0.75rem", fontWeight:700 }}>Ver modelo 3D ↗</span>
            </a>
          ) : (
            <span style={{ fontSize:"5rem", opacity:0.4 }}>{TYPE_ICON[selected.type]||"📦"}</span>
          )}
          {selected.is_for_sale && (
            <div style={{ position:"absolute", top:10, right:10, background:"rgba(150,191,72,0.2)", color:"#96bf48", border:"1px solid rgba(150,191,72,0.4)", borderRadius:20, padding:"3px 10px", fontSize:"0.6rem", fontWeight:800 }}>
              🛍️ EN VENTA
            </div>
          )}
        </div>

        <div style={{ padding:"1rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
            <div>
              <div style={{ fontSize:"1rem", fontWeight:800, color:C.text }}>{selected.name || "Asset sin nombre"}</div>
              <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>{selected.source || "—"} · {formatSize(selected.file_size_mb)}</div>
            </div>
            <Pill color={TYPE_COLORS[selected.type]||"purple"}>{selected.type||"asset"}</Pill>
          </div>

          {/* TAGS */}
          {selected.tags && selected.tags.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem", marginBottom:"0.8rem" }}>
              {selected.tags.map((t,i) => (
                <span key={i} style={{ background:"rgba(124,58,237,0.1)", color:"#c084fc", border:`1px solid ${C.border}`, borderRadius:20, padding:"2px 8px", fontSize:"0.6rem" }}>{t}</span>
              ))}
            </div>
          )}

          {/* LINKS */}
          <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem", marginBottom:"1rem" }}>
            {selected.file_url && (
              <a href={selected.file_url} target="_blank" rel="noreferrer" style={{
                display:"flex", alignItems:"center", gap:"0.5rem",
                background:"rgba(0,245,255,0.06)", border:"1px solid rgba(0,245,255,0.2)",
                borderRadius:8, padding:"0.6rem 0.8rem", textDecoration:"none", color:C.cyan
              }}>
                <span>📥</span>
                <div>
                  <div style={{ fontSize:"0.72rem", fontWeight:700 }}>Descargar / Ver archivo</div>
                  <div style={{ fontSize:"0.58rem", opacity:0.6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>{selected.file_url}</div>
                </div>
              </a>
            )}
            {selected.file_uri && (
              <div style={{
                display:"flex", alignItems:"center", gap:"0.5rem",
                background:"rgba(124,58,237,0.06)", border:`1px solid ${C.border}`,
                borderRadius:8, padding:"0.6rem 0.8rem"
              }}>
                <span>🔒</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#c084fc" }}>Archivo privado</div>
                  <div style={{ fontSize:"0.58rem", color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.file_uri}</div>
                </div>
              </div>
            )}
          </div>

          {/* VENTA */}
          <div style={{ background:C.card2, borderRadius:12, padding:"1rem", border:`1px solid ${C.border}`, marginBottom:"0.8rem" }}>
            <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.8rem" }}>💰 Configurar Venta</div>

            <div style={{ marginBottom:"0.7rem" }}>
              <label style={labelStyle}>Precio (€)</label>
              <input
                style={{ ...inputStyle, width:"50%" }}
                type="number" min="0" step="0.01"
                placeholder="Ej: 4.99"
                value={editPrice}
                onChange={e => setEditPrice(e.target.value)}
              />
            </div>

            <div style={{ display:"flex", gap:"0.5rem" }}>
              <button onClick={handleSavePrice} disabled={saving} style={{
                flex:1, padding:"0.55rem", background:"rgba(0,245,255,0.08)",
                border:"1px solid rgba(0,245,255,0.25)", borderRadius:8,
                color:C.cyan, fontSize:"0.72rem", fontWeight:700,
                cursor:saving?"not-allowed":"pointer", fontFamily:"inherit"
              }}>💾 Guardar Precio</button>

              <button onClick={handleToggleSale} disabled={saving} style={{
                flex:1, padding:"0.55rem",
                background: editSale ? "rgba(239,68,68,0.1)" : "rgba(150,191,72,0.1)",
                border: editSale ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(150,191,72,0.35)",
                borderRadius:8,
                color: editSale ? C.red : "#96bf48",
                fontSize:"0.72rem", fontWeight:700,
                cursor:saving?"not-allowed":"pointer", fontFamily:"inherit"
              }}>
                {editSale ? "🚫 Retirar de Venta" : "🛍️ Poner en Venta"}
              </button>
            </div>

            {editSale && (
              <a href="https://comic-crafter.myshopify.com/admin/products" target="_blank" rel="noreferrer" style={{
                display:"block", marginTop:"0.6rem", textAlign:"center",
                background:"rgba(150,191,72,0.08)", border:"1px solid rgba(150,191,72,0.3)",
                borderRadius:8, padding:"0.5rem", color:"#96bf48",
                fontSize:"0.7rem", fontWeight:700, textDecoration:"none"
              }}>🛒 Gestionar en Shopify Admin ↗</a>
            )}
          </div>

          {/* META */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem" }}>
            {[
              { label:"Formato", val:selected.format||"—" },
              { label:"Tamaño", val:formatSize(selected.file_size_mb) },
              { label:"LOD", val:selected.lod_level||"—" },
              { label:"UTF8", val:selected.utf8_verified?"✅":"—" },
            ].map(m => (
              <div key={m.label} style={{ background:"rgba(255,255,255,0.02)", borderRadius:8, padding:"0.5rem 0.7rem" }}>
                <div style={{ fontSize:"0.55rem", color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{m.label}</div>
                <div style={{ fontSize:"0.75rem", color:C.text, fontWeight:600, marginTop:2 }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // LIST VIEW
  return (
    <div style={{ padding:"1rem" }}>
      {/* BACK */}
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      <SectionTitle>📦 Repositorio de Assets</SectionTitle>

      {/* STATS */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1rem" }}>
        {[
          { label:"Total", val:stats.total, color:C.cyan },
          { label:"En Venta", val:stats.for_sale, color:"#96bf48" },
          { label:"Tipos", val:stats.types, color:"#c084fc" },
        ].map(s => (
          <div key={s.label} style={{ flex:1, background:C.card, borderRadius:10, padding:"0.6rem", textAlign:"center", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:"1.1rem", fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:"0.55rem", color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FILTROS */}
      <div style={{ marginBottom:"0.8rem" }}>
        <input
          style={{ ...inputStyle, marginBottom:"0.5rem" }}
          placeholder="🔍 Buscar por nombre o tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display:"flex", gap:"0.4rem", overflowX:"auto", paddingBottom:"0.3rem" }}>
          {["all","for_sale","not_sale"].map(f => (
            <button key={f} onClick={() => setSaleFilter(f)} style={{
              flexShrink:0, background: saleFilter===f ? "rgba(150,191,72,0.2)" : "transparent",
              border:`1px solid ${saleFilter===f ? "rgba(150,191,72,0.5)" : C.border}`,
              borderRadius:20, padding:"0.25rem 0.8rem", color: saleFilter===f ? "#96bf48" : C.muted,
              fontSize:"0.65rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
            }}>
              {f==="all"?"Todos":f==="for_sale"?"🛍️ En venta":"Sin venta"}
            </button>
          ))}
          <div style={{ width:1, background:C.border, flexShrink:0 }}/>
          {["all",...ASSET_TYPES].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              flexShrink:0, background: typeFilter===t ? "rgba(124,58,237,0.2)" : "transparent",
              border:`1px solid ${typeFilter===t ? "rgba(124,58,237,0.5)" : C.border}`,
              borderRadius:20, padding:"0.25rem 0.8rem", color: typeFilter===t ? "#c084fc" : C.muted,
              fontSize:"0.65rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
            }}>
              {t==="all"?"Todos los tipos":`${TYPE_ICON[t]||"📦"} ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      {filtered.length === 0 ? (
        <EmptyState icon="📦" title="Sin assets" sub={assets.length > 0 ? "Prueba otro filtro" : "No hay assets en el repositorio aún"} />
      ) : (
        <div style={{ display:"grid", gap:"0.55rem" }}>
          {filtered.map(a => (
            <div key={a.id} onClick={() => openAsset(a)} style={{
              background:C.card, borderRadius:12, padding:"0.8rem",
              border:`1px solid ${a.is_for_sale ? "rgba(150,191,72,0.3)" : C.border}`,
              display:"flex", alignItems:"center", gap:"0.8rem",
              cursor:"pointer", transition:"all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.5)"}
            onMouseLeave={e => e.currentTarget.style.borderColor=a.is_for_sale?"rgba(150,191,72,0.3)":C.border}
            >
              {/* Preview miniatura */}
              <div style={{
                width:48, height:48, borderRadius:10, flexShrink:0, overflow:"hidden",
                background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                {a.type==="image" && a.file_url ? (
                  <img src={a.file_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                ) : (
                  <span style={{ fontSize:"1.4rem" }}>{TYPE_ICON[a.type]||"📦"}</span>
                )}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.82rem", fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {a.name || "Sin nombre"}
                </div>
                <div style={{ fontSize:"0.62rem", color:C.muted, marginTop:2 }}>
                  {a.source||"—"} · {formatSize(a.file_size_mb)}
                </div>
                {a.tags && a.tags.length > 0 && (
                  <div style={{ fontSize:"0.58rem", color:C.muted, marginTop:2 }}>
                    {a.tags.slice(0,3).join(" · ")}
                  </div>
                )}
              </div>

              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                <Pill color={TYPE_COLORS[a.type]||"purple"}>{a.type||"asset"}</Pill>
                {a.is_for_sale && (
                  <span style={{ fontSize:"0.58rem", color:"#96bf48", fontWeight:700 }}>
                    🛍️ {a.metadata?.price ? `€${a.metadata.price}` : "EN VENTA"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
