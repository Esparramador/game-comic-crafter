import { useState, useEffect } from "react";
import { C, SectionTitle, labelStyle, inputStyle } from "./shared";
import { initGCC, ElevenService, ShopifyService, TripoService } from "@/api/services";
import { initHyperBrain, ReplicateService, ManusService } from "@/api/hyperBrain";

const STORAGE_KEY = "gcc_api_config";

function loadConfig() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  initGCC(cfg);
  initHyperBrain(cfg);
}

export default function ConfigScreen({ onNav, showToast }) {
  const [cfg, setCfg] = useState(loadConfig);
  const [testing, setTesting] = useState({});
  const [status, setStatus] = useState({});
  const [show, setShow] = useState({});

  // Aplicar config guardada al montar
  useEffect(() => { initGCC(cfg); initHyperBrain(cfg); }, []);

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));
  const toggleShow = (k) => setShow(s => ({ ...s, [k]: !s[k] }));

  const save = () => {
    saveConfig(cfg);
    showToast("✅ Configuración guardada y activa", "success");
  };

  const testElevenLabs = async () => {
    if (!cfg.elevenKey) { showToast("⚠️ Escribe tu ElevenLabs key primero", "warning"); return; }
    setTesting(t => ({ ...t, eleven: true }));
    setStatus(s => ({ ...s, eleven: null }));
    try {
      initGCC(cfg);
      const usage = await ElevenService.usage();
      const chars = usage?.character_limit - usage?.character_count;
      setStatus(s => ({ ...s, eleven: { ok: true, msg: `✅ Conectado — ${chars?.toLocaleString() || "?"} créditos disponibles` } }));
      showToast("✅ ElevenLabs conectado", "success");
    } catch(e) {
      setStatus(s => ({ ...s, eleven: { ok: false, msg: `❌ ${e.message}` } }));
      showToast(`❌ ElevenLabs: ${e.message}`, "error");
    }
    setTesting(t => ({ ...t, eleven: false }));
  };

  const testShopify = async () => {
    if (!cfg.shopifyToken) { showToast("⚠️ Escribe tu Shopify token primero", "warning"); return; }
    setTesting(t => ({ ...t, shopify: true }));
    setStatus(s => ({ ...s, shopify: null }));
    try {
      initGCC(cfg);
      const products = await ShopifyService.products(5);
      setStatus(s => ({ ...s, shopify: { ok: true, msg: `✅ Conectado — ${products.length} productos encontrados` } }));
      showToast("✅ Shopify conectado", "success");
    } catch(e) {
      setStatus(s => ({ ...s, shopify: { ok: false, msg: `❌ ${e.message}` } }));
      showToast(`❌ Shopify: ${e.message}`, "error");
    }
    setTesting(t => ({ ...t, shopify: false }));
  };

  const testTripo = async () => {
    setTesting(t => ({ ...t, tripo: true }));
    setStatus(s => ({ ...s, tripo: null }));
    try {
      const data = await TripoService.getTask("d0caf21d-ba5a-4d6d-9d11-4422d274c0a8");
      setStatus(s => ({ ...s, tripo: { ok: true, msg: `✅ Conectado — Task status: ${data.status}` } }));
      showToast("✅ Tripo3D conectado", "success");
    } catch(e) {
      setStatus(s => ({ ...s, tripo: { ok: false, msg: `❌ ${e.message}` } }));
    }
    setTesting(t => ({ ...t, tripo: false }));
  };

  const API_SECTIONS = [
    {
      id: "tripo",
      icon: "🏺",
      title: "Tripo3D",
      color: C.cyan,
      status: "✅ Key incluida — siempre activa",
      statusOk: true,
      fields: [],
      onTest: testTripo,
      note: "API key ya configurada. Genera modelos 3D desde texto o imagen.",
      links: [{ label:"Dashboard Tripo3D", url:"https://platform.tripo3d.ai" }, { label:"Usage History", url:"https://platform.tripo3d.ai/usage/history" }]
    },
    {
      id: "eleven",
      icon: "🎙️",
      title: "ElevenLabs",
      color: "#22c55e",
      fields: [{ key:"elevenKey", label:"API Key", placeholder:"sk_...", type:"password" }],
      onTest: testElevenLabs,
      note: "Genera voces en tiempo real para tus personajes.",
      links: [{ label:"Conseguir API Key", url:"https://elevenlabs.io/app/settings/api-keys" }, { label:"Voice Library", url:"https://elevenlabs.io/app/voice-library" }]
    },
    {
      id: "shopify",
      icon: "🛍️",
      title: "Shopify",
      color: "#96bf48",
      fields: [
        { key:"shopifyDomain", label:"Store Domain", placeholder:"comic-crafter.myshopify.com", type:"text" },
        { key:"shopifyToken", label:"Admin API Token", placeholder:"shpat_...", type:"password" }
      ],
      onTest: testShopify,
      note: "Crea y publica productos de tus juegos automáticamente.",
      links: [
        { label:"Shopify Admin", url:"https://comic-crafter.myshopify.com/admin" },
        { label:"Crear App / Token", url:"https://comic-crafter.myshopify.com/admin/settings/apps" }
      ]
    },
    {
      id: "replicate",
      icon: "🎨",
      title: "Replicate AI",
      color: "#f59e0b",
      fields: [{ key:"replicateKey", label:"API Token", placeholder:"r8_...", type:"password" }],
      onTest: async () => {
        if (!cfg.replicateKey) { showToast("⚠️ Escribe tu Replicate token primero", "warning"); return; }
        setTesting(t => ({ ...t, replicate: true }));
        try {
          initHyperBrain(cfg);
          const r = await fetch("https://api.replicate.com/v1/account", { headers: { Authorization: `Bearer ${cfg.replicateKey}` } });
          const d = await r.json();
          if (!r.ok) throw new Error(d.detail || `Replicate ${r.status}`);
          setStatus(s => ({ ...s, replicate: { ok:true, msg:`✅ Conectado — @${d.username}` } }));
          showToast("✅ Replicate conectado", "success");
        } catch(e) { setStatus(s => ({ ...s, replicate: { ok:false, msg:`❌ ${e.message}` } })); }
        setTesting(t => ({ ...t, replicate: false }));
      },
      note: "Genera imágenes con FLUX Schnell, FLUX Dev y Stable Diffusion.",
      links: [{ label:"Conseguir Token", url:"https://replicate.com/account/api-tokens" }, { label:"Explorar Modelos", url:"https://replicate.com/explore" }]
    },
    {
      id: "manus",
      icon: "🧠",
      title: "Manus AI",
      color: "#c084fc",
      fields: [{ key:"manusKey", label:"API Key", placeholder:"sk-...", type:"password" }],
      onTest: async () => {
        if (!cfg.manusKey) { showToast("⚠️ Escribe tu Manus key primero", "warning"); return; }
        setTesting(t => ({ ...t, manus: true }));
        try {
          initHyperBrain(cfg);
          const text = await ManusService.generate("Responde solo: OK", "", { maxTokens: 10 });
          setStatus(s => ({ ...s, manus: { ok:true, msg:`✅ Conectado — respuesta: ${text}` } }));
          showToast("✅ Manus AI conectado", "success");
        } catch(e) { setStatus(s => ({ ...s, manus: { ok:false, msg:`❌ ${e.message}` } })); }
        setTesting(t => ({ ...t, manus: false }));
      },
      note: "LLM avanzado para lore, GDD, copy y razonamiento creativo.",
      links: [{ label:"Manus Dashboard", url:"https://manus.im" }]
    }
  ];

  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      <SectionTitle>⚙️ Configuración API</SectionTitle>
      <div style={{ fontSize:"0.65rem", color:C.muted, marginBottom:"1.5rem" }}>
        Las keys se guardan en tu navegador (localStorage). No salen del dispositivo.
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"1.2rem" }}>
        {API_SECTIONS.map(sec => (
          <div key={sec.id} style={{
            background:C.card, borderRadius:14, overflow:"hidden",
            border:`1px solid ${sec.color}33`
          }}>
            {/* Header */}
            <div style={{ padding:"0.85rem 1rem", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:`${sec.color}08` }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                <span style={{ fontSize:"1.4rem" }}>{sec.icon}</span>
                <div>
                  <div style={{ fontSize:"0.88rem", fontWeight:800, color:C.text }}>{sec.title}</div>
                  <div style={{ fontSize:"0.6rem", color:C.muted }}>{sec.note}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                {/* Estado conexión */}
                {status[sec.id] && (
                  <span style={{ fontSize:"0.6rem", color: status[sec.id].ok ? "#22c55e" : "#ef4444", fontWeight:700 }}>
                    {status[sec.id].ok ? "✅" : "❌"}
                  </span>
                )}
                {sec.statusOk && !status[sec.id] && (
                  <span style={{ fontSize:"0.6rem", color:"#22c55e", fontWeight:700 }}>✅ Activo</span>
                )}
                <button onClick={sec.onTest} disabled={testing[sec.id]} style={{
                  background:`${sec.color}18`, border:`1px solid ${sec.color}44`,
                  borderRadius:8, padding:"0.3rem 0.8rem",
                  color: sec.color, fontSize:"0.65rem", fontWeight:700,
                  cursor: testing[sec.id] ? "not-allowed" : "pointer", fontFamily:"inherit"
                }}>{testing[sec.id] ? "⏳ Testeando..." : "🔌 Testear"}</button>
              </div>
            </div>

            <div style={{ padding:"0.85rem 1rem" }}>
              {/* Status message */}
              {status[sec.id] && (
                <div style={{
                  background: status[sec.id].ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${status[sec.id].ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  borderRadius:8, padding:"0.5rem 0.75rem",
                  fontSize:"0.68rem", color: status[sec.id].ok ? "#22c55e" : "#ef4444",
                  marginBottom: sec.fields.length ? "0.8rem" : 0, fontWeight:600
                }}>{status[sec.id].msg}</div>
              )}

              {/* Fields */}
              {sec.fields.map(f => (
                <div key={f.key} style={{ marginBottom:"0.65rem" }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position:"relative" }}>
                    <input
                      style={{ ...inputStyle, paddingRight:"2.5rem" }}
                      type={show[f.key] ? "text" : f.type}
                      placeholder={f.placeholder}
                      value={cfg[f.key] || ""}
                      onChange={e => set(f.key, e.target.value)}
                    />
                    {f.type === "password" && (
                      <button onClick={() => toggleShow(f.key)} style={{
                        position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                        background:"transparent", border:"none", color:C.muted,
                        cursor:"pointer", fontSize:"0.75rem", padding:2
                      }}>{show[f.key] ? "🙈" : "👁"}</button>
                    )}
                  </div>
                </div>
              ))}

              {/* Nota para Tripo */}
              {sec.id === "tripo" && !sec.fields.length && (
                <div style={{ fontSize:"0.68rem", color:C.muted, lineHeight:1.5 }}>
                  Key: <code style={{ color:"#c084fc", fontSize:"0.65rem" }}>tsk_zlOClu...IFvLDK</code> — activa y funcionando
                </div>
              )}

              {/* Links */}
              <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginTop:"0.6rem" }}>
                {sec.links.map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={{
                    fontSize:"0.6rem", color: sec.color, textDecoration:"none",
                    background:`${sec.color}10`, border:`1px solid ${sec.color}30`,
                    borderRadius:6, padding:"0.2rem 0.6rem"
                  }}>{l.label} ↗</a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SAVE */}
      <button onClick={save} style={{
        width:"100%", padding:"0.9rem",
        background:"linear-gradient(135deg,#7c3aed,#22c55e)",
        border:"none", borderRadius:12, color:"#fff",
        fontWeight:900, fontSize:"0.9rem", cursor:"pointer",
        fontFamily:"inherit", letterSpacing:1
      }}>💾 GUARDAR CONFIGURACIÓN</button>

      <div style={{ fontSize:"0.6rem", color:C.muted, textAlign:"center", marginTop:"0.8rem" }}>
        🔒 Las keys se guardan localmente en tu navegador. Nunca se envían a servidores externos.
      </div>
    </div>
  );
}
