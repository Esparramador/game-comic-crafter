import { base44 } from "@/api/base44Client";

// ── Llama al backend real con API keys seguras en servidor ──
async function callBackend(mode, payload) {
  const res = await base44.functions.invoke("hyperBrainGenerate", { mode, payload });
  return res.data;
}

function parseJson(text) {
  if (!text) return {};
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { return { raw: text }; }
}

export const HyperBrain = {
  async forgeCharacter({ name, archetype, description, voiceId, onStep }) {
    onStep("start", `🚀 Forjando personaje: ${name}...`);
    onStep("lore", "🧠 Gemini generando lore + bio...");
    const result = await callBackend("character", { name, archetype, style: description, voice_id: voiceId });
    onStep("assets", "🎨 Replicate generando concept art...");
    onStep("done", "✅ Personaje forjado");

    const lore = parseJson(result.lore);

    return {
      name,
      archetype,
      bio: lore.bio || lore.description || result.lore || "",
      lore_prompt: lore.lore_prompt || "",
      decision_matrix: lore.decision_matrix || {},
      concept_image_url: result.concept_image_url,
      model_3d_url: result.model_3d_url,
      tags: lore.tags || [archetype],
      _voiceLine: lore.voice_description || "",
    };
  },

  async genesisGame({ title, genre, atmosphere, onStep }) {
    onStep("start", `🚀 Generando juego: ${title}...`);
    onStep("gdd", "📋 Gemini creando Game Design Document...");
    onStep("art", "🎨 Replicate generando cover art...");
    const result = await callBackend("game", { title, genre, style: atmosphere });
    onStep("done", "✅ Juego creado");

    const gdd = parseJson(result.gdd);

    return {
      title, genre, atmosphere,
      description: gdd.synopsis || gdd.description || "",
      game_design_document: result.gdd || "",
      cover_image_url: result.cover_image_url,
      combat_system: Array.isArray(gdd.mechanics) ? gdd.mechanics[0] : "",
      global_context: gdd,
      sales_description: gdd.shopify_description || "",
    };
  },

  async marketingBlitz({ project, onStep }) {
    onStep("start", `🚀 Generando marketing para: ${project.title}...`);
    onStep("copy", "✍️ Gemini redactando copy multiidioma...");
    onStep("poster", "🎨 Replicate generando póster...");
    const result = await callBackend("marketing", { title: project.title, genre: project.genre, style: project.atmosphere });
    onStep("done", "✅ Marketing Kit listo");

    const mkt = parseJson(result.marketing);

    return {
      poster_url: result.poster_url,
      trailer_script: mkt.trailer_script || "",
      synopsis_es: mkt.synopsis_es || "",
      synopsis_en: mkt.synopsis_en || "",
      synopsis_fr: mkt.synopsis_fr || "",
      shopify_description: mkt.shopify_description || "",
      seo_tags: mkt.seo_tags || [],
      instagram_copy: mkt.instagram_copy || mkt.synopsis_es || "",
      _posterPrompt: mkt.poster_prompt || "",
    };
  },

  async assetBatch({ prompts, onStep }) {
    onStep("start", `🚀 Generando ${prompts.length} assets en paralelo...`);
    onStep("assets", "🎨 Replicate procesando imágenes...");
    const results = await Promise.all(
      prompts.map(async (prompt) => {
        try {
          const r = await callBackend("image", { prompt });
          return { prompt, url: r.url };
        } catch (e) {
          return { prompt, error: e.message };
        }
      })
    );
    onStep("done", `✅ ${results.filter(r => r.url).length}/${prompts.length} assets generados`);
    return results;
  },

  async voiceBatch({ lines, voiceId, onStep }) {
    onStep("start", `🚀 Generando ${lines.length} líneas de voz...`);
    onStep("voice", "🎙️ ElevenLabs procesando en paralelo...");
    const results = await Promise.all(
      lines.map(async (text) => {
        try {
          const r = await callBackend("voice", { text, voice_id: voiceId });
          return { text, url: r.audio_data };
        } catch (e) {
          return { text, error: e.message };
        }
      })
    );
    onStep("done", `✅ ${results.filter(r => r.url).length}/${lines.length} audios generados`);
    return results;
  },
};

// Servicios siempre activos — keys en servidor
export function ALL_SERVICES_STATUS() {
  return {
    gemini:    { name: "Gemini",     ok: true, icon: "✨" },
    replicate: { name: "Replicate",  ok: true, icon: "🎨" },
    elevenlabs:{ name: "ElevenLabs", ok: true, icon: "🎙️" },
    tripo3d:   { name: "Tripo3D",    ok: true, icon: "🏺" },
  };
}

export function initHyperBrain() {}
export function initGCC() {}
export function autoInitKeys() {}