import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ShopifyService } from "@/api/services";
import { C, SectionTitle, Spinner, EmptyState, Pill, inputStyle, labelStyle } from "./shared";

const SHOPIFY_PRODUCTS = ShopifyService.getProducts();

export default function MarketingScreen({ onNav, showToast }) {
  const [projects, setProjects]   = useState([]);
  const [kits, setKits]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [tab, setTab]             = useState("overview");
  const [shopifyProducts, setShopifyProducts] = useState(SHOPIFY_PRODUCTS);
  const [linkingShopify, setLinkingShopify]   = useState(false);
  const [publishingShopify, setPublishingShopify] = useState(false);
  const [showShopifyPanel, setShowShopifyPanel]   = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.GameProject.list("-updated_date", 20),
      base44.entities.MarketingKit.list("-created_date", 20).catch(() => []),
    ]).then(([projs, k]) => {
      setProjects(projs || []);
      setKits(k || []);
      if (projs?.[0]) setSelected(projs[0]);
    }).finally(() => setLoading(false));
  }, []);

  const publishToShopify = async () => {
    if (!selected) return;
    if (!ShopifyService.ok()) { showToast("⚠️ Configura Shopify token en ⚙️ Config API", "warning"); return; }
    setPublishing(true);
    try {
      const product = await ShopifyService.createProduct({
        title: selected.title,
        bodyHtml: selected.sales_description || selected.description || "",
        price: selected.price || "14.99",
        imageUrl: selected.marketing_poster_url || selected.cover_image_url || null,
        tags: [selected.genre, selected.format, "videojuego", "indie"].filter(Boolean).join(", ")
      });
      await base44.entities.GameProject.update(selected.id, {
        shopify_product_id: String(product.id),
        is_for_sale: true
      });
      setSelected(p => ({ ...p, shopify_product_id: String(product.id), is_for_sale: true }));
      setProjects(prev => prev.map(p => p.id===selected.id ? {...p, shopify_product_id: String(product.id)} : p));
      showToast(`✅ Publicado en Shopify — ID: ${product.id}`, "success");
    } catch(e) { showToast(`❌ Shopify: ${e.message}`, "error"); }
    setPublishing(false);
  };

  if (loading) return <Spinner />;
  if (projects.length === 0) return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit", marginBottom:"0.8rem", padding:0 }}>← Dashboard</button>
      <SectionTitle>📣 Marketing Kit</SectionTitle>
      <EmptyState icon="📣" title="Sin proyectos" sub="Crea un proyecto primero" action="✏️ Ir al Editor" onAction={() => onNav("create")} />
    </div>
  );

  const kit = kits.find(k => k.project_id === selected?.id);

  const TAB = (id, label) => (
    <button style={{
      flex:1, padding:"0.5rem", background: tab===id ? "rgba(124,58,237,0.2)" : "transparent",
      border:"none", borderBottom: tab===id ? "2px solid #7c3aed" : "2px solid transparent",
      color: tab===id ? "#c084fc" : C.muted, fontSize:"0.72rem", fontWeight:700,
      cursor:"pointer", fontFamily:"inherit"
    }} onClick={() => setTab(id)}>{label}</button>
  );

  // ── Vincular proyecto a producto Shopify existente ──
  const handleLinkShopify = async (productId, productTitle) => {
    setLinkingShopify(true);
    try {
      await base44.entities.GameProject.update(selected.id, {
        shopify_product_id: String(productId),
        is_for_sale: true,
        launch_page_url: `https://comic-crafter.myshopify.com/products/${productTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
      });
      setProjects(prev => prev.map(p => p.id === selected.id
        ? { ...p, shopify_product_id: String(productId), is_for_sale: true }
        : p
      ));
      setSelected(s => ({ ...s, shopify_product_id: String(productId), is_for_sale: true }));
      showToast(`✅ Vinculado a "${productTitle}"`, "success");
      setShowShopifyPanel(false);
    } catch(e) {
      showToast("❌ Error al vincular", "error");
    }
    setLinkingShopify(false);
  };

  // ── Copiar al portapapeles ──
  const copy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => showToast(`📋 ${label} copiado`, "success"));
  };

  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem",
        cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Dashboard</button>
      <SectionTitle>📣 Marketing Kit</SectionTitle>

      {/* Selector proyecto */}
      <div style={{ display:"flex", gap:"0.4rem", overflowX:"auto", paddingBottom:"0.4rem", marginBottom:"1rem" }}>
        {projects.map(p => (
          <button key={p.id} onClick={() => { setSelected(p); setTab("overview"); setShowShopifyPanel(false); }} style={{
            flexShrink:0, background: selected?.id===p.id ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.06)",
            border:`1px solid ${selected?.id===p.id ? "rgba(124,58,237,0.5)" : C.border}`,
            borderRadius:20, padding:"0.35rem 0.9rem",
            color: selected?.id===p.id ? "#c084fc" : C.muted,
            fontSize:"0.7rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"
          }}>{p.title}</button>
        ))}
      </div>

      {selected && (
        <>
          {/* TABS */}
          <div style={{ display:"flex", background:C.card, borderRadius:10, marginBottom:"1rem", overflow:"hidden", border:`1px solid ${C.border}` }}>
            {TAB("overview","📊 Overview")}
            {TAB("shopify","🛍️ Shopify")}
            {TAB("kit","🎨 Kit")}
            {TAB("export","📤 Export")}
          </div>

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div>
              <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}`, marginBottom:"0.8rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
                  <div>
                    <div style={{ fontSize:"1rem", fontWeight:800, color:C.text }}>{selected.title}</div>
                    <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>{selected.genre} · {selected.format} · {selected.engine}</div>
                  </div>
                  <Pill color={selected.status==="playable"?"green":"purple"}>{selected.status||"draft"}</Pill>
                </div>

                {selected.cover_image_url && (
                  <img src={selected.cover_image_url} alt={selected.title} style={{ width:"100%", borderRadius:10, maxHeight:140, objectFit:"cover", marginBottom:"0.8rem" }} />
                )}

                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.4rem" }}>
                  {[
                    { label:"Precio",   val: selected.is_for_sale ? `€${selected.price||"—"}` : "Free", icon:"💰" },
                    { label:"Shopify",  val: selected.shopify_product_id ? "✅" : "—", icon:"🛍️" },
                    { label:"Kit",      val: kit ? "✅" : "—", icon:"🎨" },
                    { label:"Status",   val: selected.status||"draft", icon:"📊" },
                  ].map(s => (
                    <div key={s.label} style={{ background:C.card2, borderRadius:10, padding:"0.5rem", textAlign:"center", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:"1rem" }}>{s.icon}</div>
                      <div style={{ fontSize:"0.72rem", fontWeight:700, color:C.cyan }}>{s.val}</div>
                      <div style={{ fontSize:"0.52rem", color:C.muted }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links rápidos */}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                {selected.playable_url && (
                  <a href={selected.playable_url} target="_blank" rel="noreferrer" style={{
                    display:"flex", alignItems:"center", gap:"0.6rem",
                    background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)",
                    borderRadius:10, padding:"0.75rem", textDecoration:"none", color:C.green
                  }}>
                    <span style={{ fontSize:"1.2rem" }}>▶️</span>
                    <div><div style={{ fontSize:"0.78rem", fontWeight:700 }}>Jugar Demo</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{selected.playable_url}</div></div>
                    <span style={{ marginLeft:"auto", fontSize:"0.65rem" }}>↗</span>
                  </a>
                )}
                {selected.shopify_product_id && (
                  <a href={`https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}`} target="_blank" rel="noreferrer" style={{
                    display:"flex", alignItems:"center", gap:"0.6rem",
                    background:"rgba(150,191,72,0.08)", border:"1px solid rgba(150,191,72,0.3)",
                    borderRadius:10, padding:"0.75rem", textDecoration:"none", color:"#96bf48"
                  }}>
                    <span style={{ fontSize:"1.2rem" }}>🛍️</span>
                    <div><div style={{ fontSize:"0.78rem", fontWeight:700 }}>Ver en Shopify</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7 }}>ID: {selected.shopify_product_id}</div></div>
                    <span style={{ marginLeft:"auto", fontSize:"0.65rem" }}>↗</span>
                  </a>
                )}
                {selected.marketing_poster_url && (
                  <a href={selected.marketing_poster_url} target="_blank" rel="noreferrer" style={{
                    display:"flex", alignItems:"center", gap:"0.6rem",
                    background:"rgba(233,30,140,0.08)", border:"1px solid rgba(233,30,140,0.3)",
                    borderRadius:10, padding:"0.75rem", textDecoration:"none", color:C.pink
                  }}>
                    <span style={{ fontSize:"1.2rem" }}>🎨</span>
                    <div><div style={{ fontSize:"0.78rem", fontWeight:700 }}>Poster Marketing</div></div>
                    <span style={{ marginLeft:"auto", fontSize:"0.65rem" }}>↗</span>
                  </a>
                )}
                {selected.launch_page_url && (
                  <a href={selected.launch_page_url} target="_blank" rel="noreferrer" style={{
                    display:"flex", alignItems:"center", gap:"0.6rem",
                    background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
                    borderRadius:10, padding:"0.75rem", textDecoration:"none", color:"#c084fc"
                  }}>
                    <span style={{ fontSize:"1.2rem" }}>🚀</span>
                    <div><div style={{ fontSize:"0.78rem", fontWeight:700 }}>Launch Page</div>
                    <div style={{ fontSize:"0.6rem", opacity:0.7, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{selected.launch_page_url}</div></div>
                    <span style={{ marginLeft:"auto", fontSize:"0.65rem" }}>↗</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ══ SHOPIFY TAB ══ */}
          {tab === "shopify" && (
            <div>
              {/* Status actual */}
              <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}`, marginBottom:"0.8rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.8rem" }}>
                  <div style={{ fontSize:"0.78rem", fontWeight:800, color:C.text }}>Estado en Shopify</div>
                  <a href="https://comic-crafter.myshopify.com/admin/products" target="_blank" rel="noreferrer" style={{
                    background:"rgba(150,191,72,0.1)", border:"1px solid rgba(150,191,72,0.3)",
                    borderRadius:8, padding:"0.3rem 0.7rem", color:"#96bf48",
                    fontSize:"0.65rem", fontWeight:700, textDecoration:"none"
                  }}>Abrir Admin ↗</a>
                </div>

                {selected.shopify_product_id ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }}/>
                      <span style={{ fontSize:"0.75rem", color:"#22c55e", fontWeight:700 }}>Vinculado a Shopify</span>
                    </div>
                    <div style={{ fontSize:"0.65rem", color:C.muted }}>Product ID: {selected.shopify_product_id}</div>
                    <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                      <a href={`https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}`} target="_blank" rel="noreferrer"
                        style={{ background:"rgba(150,191,72,0.1)", border:"1px solid rgba(150,191,72,0.3)", borderRadius:8, padding:"0.4rem 0.8rem", color:"#96bf48", fontSize:"0.7rem", fontWeight:700, textDecoration:"none" }}>
                        🛍️ Ver producto
                      </a>
                      <a href={`https://comic-crafter.myshopify.com/admin/products/${selected.shopify_product_id}`} target="_blank" rel="noreferrer"
                        style={{ background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`, borderRadius:8, padding:"0.4rem 0.8rem", color:"#c084fc", fontSize:"0.7rem", fontWeight:700, textDecoration:"none" }}>
                        ✏️ Editar en admin
                      </a>
                      <button onClick={() => copy(`https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}`, "URL")} style={{
                        background:"rgba(0,245,255,0.06)", border:"1px solid rgba(0,245,255,0.2)", borderRadius:8,
                        padding:"0.4rem 0.8rem", color:C.cyan, fontSize:"0.7rem", fontWeight:700,
                        cursor:"pointer", fontFamily:"inherit"
                      }}>📋 Copiar URL</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign:"center", padding:"0.5rem 0" }}>
                    <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:"0.7rem" }}>Este proyecto no está vinculado a Shopify</div>
                    <button onClick={() => setShowShopifyPanel(true)} style={{
                      background:"linear-gradient(135deg,#96bf48,#5a8c00)", border:"none",
                      borderRadius:10, padding:"0.6rem 1.4rem", color:"#fff",
                      fontSize:"0.75rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit"
                    }}>🛍️ Vincular a Shopify</button>
                  </div>
                )}
              </div>

              {/* Panel de vinculación */}
              {showShopifyPanel && (
                <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:"1px solid rgba(150,191,72,0.3)", marginBottom:"0.8rem" }}>
                  <div style={{ fontSize:"0.75rem", fontWeight:800, color:"#96bf48", marginBottom:"0.8rem" }}>
                    🛍️ Selecciona el producto de Shopify
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem", maxHeight:280, overflowY:"auto" }}>
                    {shopifyProducts.map(p => (
                      <div key={p.id} style={{
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        background:"rgba(150,191,72,0.05)", border:"1px solid rgba(150,191,72,0.15)",
                        borderRadius:10, padding:"0.65rem 0.85rem"
                      }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:"0.75rem", color:C.text, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</div>
                          <div style={{ display:"flex", gap:6, marginTop:2 }}>
                            <span style={{ fontSize:"0.58rem", color: p.status==="active" ? "#22c55e" : "#ffd700" }}>
                              {p.status==="active" ? "● Activo" : "○ Borrador"}
                            </span>
                            <span style={{ fontSize:"0.58rem", color:C.muted }}>€{p.price}</span>
                          </div>
                        </div>
                        <button onClick={() => handleLinkShopify(p.id, p.title)} disabled={linkingShopify} style={{
                          background:"rgba(150,191,72,0.15)", border:"1px solid rgba(150,191,72,0.4)",
                          borderRadius:8, padding:"0.3rem 0.7rem", color:"#96bf48",
                          fontSize:"0.65rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", flexShrink:0, marginLeft:8
                        }}>Vincular</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowShopifyPanel(false)} style={{
                    width:"100%", marginTop:"0.6rem", background:"transparent", border:`1px solid ${C.border}`,
                    borderRadius:8, padding:"0.4rem", color:C.muted,
                    fontSize:"0.65rem", cursor:"pointer", fontFamily:"inherit"
                  }}>Cancelar</button>
                </div>
              )}

              {/* Tienda completa */}
              <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:"0.72rem", fontWeight:800, color:C.text, marginBottom:"0.8rem" }}>📦 Todos los productos ({shopifyProducts.length})</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
                  {shopifyProducts.map(p => (
                    <div key={p.id} style={{
                      display:"flex", alignItems:"center", gap:"0.6rem",
                      padding:"0.5rem", borderRadius:8,
                      background: selected.shopify_product_id===String(p.id) ? "rgba(150,191,72,0.08)" : "transparent"
                    }}>
                      <span style={{ fontSize:"0.6rem", color: p.status==="active" ? "#22c55e" : "#ffd700" }}>
                        {p.status==="active" ? "●" : "○"}
                      </span>
                      <span style={{ flex:1, fontSize:"0.7rem", color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</span>
                      <span style={{ fontSize:"0.65rem", color:C.muted, flexShrink:0 }}>€{p.price}</span>
                      <a href={`https://comic-crafter.myshopify.com/admin/products/${p.id}`} target="_blank" rel="noreferrer"
                        style={{ fontSize:"0.6rem", color:C.muted, textDecoration:"none" }}>↗</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ KIT TAB ══ */}
          {tab === "kit" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
              {kit ? (
                <>
                  {kit.poster_url && (
                    <div>
                      <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.4rem" }}>Poster</div>
                      <img src={kit.poster_url} alt="poster" style={{ width:"100%", borderRadius:12, maxHeight:200, objectFit:"cover" }} />
                    </div>
                  )}
                  {kit.synopsis_es && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                        <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Sinopsis ES</div>
                        <button onClick={() => copy(kit.synopsis_es, "Sinopsis")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:"0.65rem", cursor:"pointer" }}>📋</button>
                      </div>
                      <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.5 }}>{kit.synopsis_es}</div>
                    </div>
                  )}
                  {kit.synopsis_en && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                        <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Synopsis EN</div>
                        <button onClick={() => copy(kit.synopsis_en, "Synopsis EN")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:"0.65rem", cursor:"pointer" }}>📋</button>
                      </div>
                      <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.5 }}>{kit.synopsis_en}</div>
                    </div>
                  )}
                  {kit.shopify_description && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                        <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Descripción Shopify</div>
                        <button onClick={() => copy(kit.shopify_description, "Descripción")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:"0.65rem", cursor:"pointer" }}>📋</button>
                      </div>
                      <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.5 }}>{kit.shopify_description}</div>
                    </div>
                  )}
                  {kit.seo_tags && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>SEO Tags</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
                        {(Array.isArray(kit.seo_tags) ? kit.seo_tags : kit.seo_tags.split(",")).map((tag, i) => (
                          <span key={i} style={{ background:"rgba(124,58,237,0.1)", color:"#c084fc", border:`1px solid ${C.border}`, borderRadius:20, padding:"2px 8px", fontSize:"0.6rem" }}>{tag.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {kit.trailer_audio_url && (
                    <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>Audio Trailer</div>
                      <audio controls src={kit.trailer_audio_url} style={{ width:"100%" }} />
                    </div>
                  )}
                  {kit.landing_page_url && (
                    <a href={kit.landing_page_url} target="_blank" rel="noreferrer" style={{
                      display:"flex", alignItems:"center", gap:"0.6rem",
                      background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
                      borderRadius:12, padding:"0.9rem", textDecoration:"none", color:"#c084fc"
                    }}>
                      <span style={{ fontSize:"1.2rem" }}>🚀</span>
                      <div><div style={{ fontSize:"0.78rem", fontWeight:700 }}>Landing Page</div>
                      <div style={{ fontSize:"0.62rem", opacity:0.7 }}>{kit.landing_page_url}</div></div>
                    </a>
                  )}
                </>
              ) : (
                <div style={{ textAlign:"center", padding:"2rem 1rem" }}>
                  <div style={{ fontSize:"3rem", marginBottom:"0.8rem" }}>🎨</div>
                  <div style={{ fontSize:"0.85rem", color:C.text, marginBottom:"0.4rem" }}>Sin kit de marketing</div>
                  <div style={{ fontSize:"0.7rem", color:C.muted, marginBottom:"1rem" }}>Genera el kit con el motor de prompts</div>
                  <button onClick={() => onNav("prompts")} style={{
                    background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
                    borderRadius:10, padding:"0.6rem 1.4rem", color:"#fff",
                    fontSize:"0.75rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit"
                  }}>⚡ Ir a Prompts</button>
                </div>
              )}
            </div>
          )}

          {/* ══ EXPORT TAB ══ */}
          {tab === "export" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:"0.75rem", fontWeight:800, color:C.text, marginBottom:"0.8rem" }}>📤 Export & Distribución</div>
                {[
                  { label:"Web Build", url: selected.export_url_web, icon:"🌐", color:C.cyan },
                  { label:"Android APK", url: selected.export_url_android, icon:"📱", color:"#22c55e" },
                  { label:"Play & Test", url: selected.playable_url, icon:"▶️", color:C.green },
                  { label:"Shopify Store", url: selected.shopify_product_id ? `https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}` : null, icon:"🛍️", color:"#96bf48" },
                  { label:"Launch Page", url: selected.launch_page_url, icon:"🚀", color:"#c084fc" },
                ].map(l => (
                  <div key={l.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.55rem 0", borderBottom:`1px solid rgba(124,58,237,0.08)` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                      <span style={{ fontSize:"1rem" }}>{l.icon}</span>
                      <span style={{ fontSize:"0.75rem", color:C.text }}>{l.label}</span>
                    </div>
                    {l.url ? (
                      <a href={l.url} target="_blank" rel="noreferrer" style={{
                        background:`${l.color}11`, border:`1px solid ${l.color}44`,
                        borderRadius:8, padding:"0.3rem 0.7rem", color:l.color,
                        fontSize:"0.65rem", fontWeight:700, textDecoration:"none"
                      }}>Abrir ↗</a>
                    ) : (
                      <span style={{ fontSize:"0.65rem", color:C.muted }}>No disponible</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Copiar todos los links */}
              <button onClick={() => {
                const links = [
                  selected.playable_url && `▶️ Demo: ${selected.playable_url}`,
                  selected.export_url_web && `🌐 Web: ${selected.export_url_web}`,
                  selected.shopify_product_id && `🛍️ Shopify: https://comic-crafter.myshopify.com/products/${selected.shopify_product_id}`,
                  selected.launch_page_url && `🚀 Launch: ${selected.launch_page_url}`,
                ].filter(Boolean).join("\n");
                navigator.clipboard.writeText(links).then(() => showToast("📋 Links copiados", "success"));
              }} style={{
                width:"100%", padding:"0.75rem",
                background:"rgba(0,245,255,0.06)", border:"1px solid rgba(0,245,255,0.2)",
                borderRadius:12, color:C.cyan, fontSize:"0.75rem", fontWeight:700,
                cursor:"pointer", fontFamily:"inherit"
              }}>📋 Copiar todos los links</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
