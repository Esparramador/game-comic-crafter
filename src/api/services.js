// GCC SERVICES — Tripo3D · ElevenLabs · Shopify
const TRIPO_KEY = () => (window.__GCC_CONFIG__?.tripoKey || import.meta.env.VITE_TRIPO_KEY || "");
const cfg = () => window.__GCC_CONFIG__ || {};

// ── TRIPO3D ──────────────────────────────────────────────────
export const TripoService = {
  async getTask(taskId) {
    const r = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
      headers: { Authorization: `Bearer ${TRIPO_KEY()}` }
    });
    const d = await r.json();
    if (d.code !== 0) throw new Error(d.message || "Tripo3D error");
    return d.data;
  },
  async generate(prompt) {
    const r = await fetch("https://api.tripo3d.ai/v2/openapi/task", {
      method: "POST",
      headers: { Authorization: `Bearer ${TRIPO_KEY()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ type:"text_to_model", prompt, model_version:"v2.5-20250123", texture:true, pbr:true, texture_alignment:"geometry", export_uv:true, geometry_quality:"standard" })
    });
    const d = await r.json();
    if (d.code !== 0) throw new Error(d.message || "Tripo generate failed");
    return d.data;
  },
  async poll(taskId, onProg, maxS = 180) {
    for (let i = 0; i < Math.ceil(maxS/5); i++) {
      await new Promise(r => setTimeout(r, 5000));
      const data = await this.getTask(taskId);
      if (onProg) onProg(data.progress || 0, data.status);
      if (data.status === "success") return data;
      if (["failed","cancelled","error"].includes(data.status)) throw new Error(`Task ${data.status}`);
    }
    throw new Error("Timeout: generación tardó más de 3 minutos");
  },
  glb(t)      { return t?.output?.pbr_model?.split("?Policy=")[0] || null; },
  glbSigned(t){ return t?.output?.pbr_model || null; },
  thumb(t)    { return t?.output?.rendered_image || null; },
};

// ── ELEVENLABS ───────────────────────────────────────────────
export const ElevenService = {
  BASE: "https://api.elevenlabs.io/v1",
  key()  { return cfg().elevenKey || ""; },
  ok()   { return !!this.key(); },
  hdrs() { return { "xi-api-key": this.key(), "Content-Type": "application/json" }; },

  async voices() {
    if (!this.ok()) throw new Error("ElevenLabs key no configurada — ve a ⚙️ Configuración");
    const r = await fetch(`${this.BASE}/voices`, { headers: { "xi-api-key": this.key() } });
    if (!r.ok) throw new Error(`ElevenLabs ${r.status}`);
    return (await r.json()).voices || [];
  },

  async tts({ voiceId, text, stability=0.65, similarityBoost=0.80, style=0.30 }) {
    if (!this.ok()) throw new Error("ElevenLabs key no configurada");
    const r = await fetch(`${this.BASE}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { ...this.hdrs(), Accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2",
        voice_settings: { stability, similarity_boost: similarityBoost, style, use_speaker_boost: true } })
    });
    if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.detail?.message || `ElevenLabs TTS ${r.status}`); }
    return URL.createObjectURL(await r.blob());
  },

  async usage() {
    if (!this.ok()) throw new Error("ElevenLabs key no configurada");
    const r = await fetch(`${this.BASE}/user/subscription`, { headers: { "xi-api-key": this.key() } });
    return r.json();
  }
};

// ── SHOPIFY ──────────────────────────────────────────────────
export const ShopifyService = {
  domain()  { return cfg().shopifyDomain || "comic-crafter.myshopify.com"; },
  token()   { return cfg().shopifyToken || ""; },
  ok()      { return !!this.token(); },
  url(p)    { return `https://${this.domain()}/admin/api/2024-01/${p}`; },
  hdrs()    { return { "X-Shopify-Access-Token": this.token(), "Content-Type": "application/json" }; },

  async products(limit = 20) {
    if (!this.ok()) throw new Error("Shopify token no configurado — ve a ⚙️ Configuración");
    const r = await fetch(this.url(`products.json?limit=${limit}`), { headers: this.hdrs() });
    if (!r.ok) throw new Error(`Shopify ${r.status}`);
    return (await r.json()).products || [];
  },

  async createProduct({ title, bodyHtml, price = "14.99", imageUrl, tags = "" }) {
    if (!this.ok()) throw new Error("Shopify token no configurado");
    const body = { product: {
      title, body_html: bodyHtml, vendor: "Game Comic Crafter",
      product_type: "Videojuego", status: "draft", tags,
      variants: [{ price: String(price), inventory_management: null, inventory_policy: "continue" }],
      ...(imageUrl ? { images: [{ src: imageUrl }] } : {})
    }};
    const r = await fetch(this.url("products.json"), { method:"POST", headers: this.hdrs(), body: JSON.stringify(body) });
    if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(JSON.stringify(e.errors || `Shopify ${r.status}`)); }
    return (await r.json()).product;
  },

  async updateProduct(id, updates) {
    if (!this.ok()) throw new Error("Shopify token no configurado");
    const r = await fetch(this.url(`products/${id}.json`), { method:"PUT", headers: this.hdrs(), body: JSON.stringify({ product: updates }) });
    if (!r.ok) throw new Error(`Shopify update ${r.status}`);
    return (await r.json()).product;
  },

  async publish(id) { return this.updateProduct(id, { status: "active" }); },
  storeUrl(handle) { return `https://${this.domain()}/products/${handle}`; }
};

// ── INIT ─────────────────────────────────────────────────────
export function initGCC(config = {}) {
  window.__GCC_CONFIG__ = { ...(window.__GCC_CONFIG__ || {}), ...config };
}

