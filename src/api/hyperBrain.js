// ═══════════════════════════════════════════════════════════════════════
//  🧠 HYPER BRAIN — Motor de IA en paralelo
//  ElevenLabs · Tripo3D · Replicate · Manus · Base44
//  Todas las IAs trabajan a la vez, se complementan y se retroalimentan
// ═══════════════════════════════════════════════════════════════════════

import { TripoService, ElevenService, ShopifyService } from "./services";

const cfg = () => window.__GCC_CONFIG__ || {};

// ════════════════════════════════════════════════
//  REPLICATE SERVICE — Imágenes & Video
// ════════════════════════════════════════════════
export const ReplicateService = {
  key() { return cfg().replicateKey || ""; },
  ok()  { return !!this.key(); },

  async run(model, input) {
    if (!this.ok()) throw new Error("Replicate key no configurada");
    const r = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.key()}`,
        "Content-Type": "application/json",
        Prefer: "wait=60"
      },
      body: JSON.stringify({ version: model, input })
    });
    if (!r.ok) { const e = await r.json(); throw new Error(e.detail || `Replicate ${r.status}`); }
    const pred = await r.json();
    if (pred.status === "succeeded") return pred.output;
    if (pred.status === "failed") throw new Error(pred.error || "Replicate failed");
    // Poll si no terminó
    return this.poll(pred.id);
  },

  async poll(predId, maxS = 120) {
    for (let i = 0; i < maxS / 3; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const r = await fetch(`https://api.replicate.com/v1/predictions/${predId}`, {
        headers: { Authorization: `Bearer ${this.key()}` }
      });
      const p = await r.json();
      if (p.status === "succeeded") return p.output;
      if (p.status === "failed") throw new Error(p.error || "Replicate failed");
    }
    throw new Error("Replicate timeout");
  },

  // FLUX Schnell — imagen ultrarrápida (4 pasos)
  async generateImage({ prompt, width = 1024, height = 1024, steps = 4, guidance = 3.5 }) {
    const out = await this.run(
      "black-forest-labs/flux-schnell",  // modelo sin versión fija
      { prompt, width, height, num_inference_steps: steps }
    );
    return Array.isArray(out) ? out[0] : out;
  },

  // FLUX Dev — imagen alta calidad
  async generateImageHQ({ prompt, width = 1024, height = 1024, steps = 28 }) {
    const out = await this.run(
      "black-forest-labs/flux-dev",
      { prompt, width, height, num_inference_steps: steps, guidance_scale: 3.5 }
    );
    return Array.isArray(out) ? out[0] : out;
  },

  // Stable Diffusion — personajes & concept art
  async generateConcept({ prompt, negative_prompt = "blurry, bad anatomy, watermark, text", width = 768, height = 1024 }) {
    const out = await this.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750d7579acec5b9c47c823ac4f87",
      { prompt: `game character concept art, ${prompt}`, negative_prompt, width, height, num_outputs: 1 }
    );
    return Array.isArray(out) ? out[0] : out;
  }
};

// ════════════════════════════════════════════════
//  MANUS LLM — Razonamiento avanzado
// ════════════════════════════════════════════════
export const ManusService = {
  // Manus usa formato OpenAI-compatible
  BASE: "https://api.manus.im/v1",
  key() { return cfg().manusKey || ""; },
  ok()  { return !!this.key(); },

  async chat(messages, opts = {}) {
    if (!this.ok()) throw new Error("Manus key no configurada");
    const r = await fetch(`${this.BASE}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.key()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: opts.model || "manus-pro",
        messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens || 2000,
        ...opts
      })
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.error?.message || `Manus ${r.status}`);
    }
    const d = await r.json();
    return d.choices?.[0]?.message?.content || "";
  },

  async generate(prompt, systemPrompt = "", opts = {}) {
    const messages = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });
    return this.chat(messages, opts);
  }
};

// ════════════════════════════════════════════════
//  🧠 HYPER BRAIN — Orquestador paralelo
// ════════════════════════════════════════════════
export const HyperBrain = {

  // ── 1. FULL CHARACTER FORGE ─────────────────────────────────
  // Genera TODO para un personaje en paralelo:
  // Lore + Concept Art + Modelo 3D + Voz — a la vez
  async forgeCharacter({ name, archetype, description, voiceId, onStep }) {
    const step = (s, d) => onStep && onStep(s, d);
    step("start", { name });

    // ─── FASE 1: Manus genera lore + prompt visual + voz (paralelo) ───
    step("lore", "Generando lore, visual DNA y perfil de voz con Manus...");

    const SYSTEM = `Eres el diseñador de personajes del juego "El Resurgir del Pingüino de Cristal" (dark fantasy cyberpunk, RPG 2D). 
Cuando generes contenido, sé específico, oscuro, evocador y cinematográfico.
Responde siempre en JSON puro sin markdown.`;

    const [loreResult, visualPrompt, voiceText] = await Promise.all([
      // Lore completo
      ManusService.generate(
        `Genera el lore completo para el personaje:
Nombre: ${name}
Arquetipo: ${archetype}
Descripción: ${description || "personaje de videojuego dark fantasy cyberpunk"}

Responde en JSON: { "bio": "...", "backstory": "...", "motivation": "...", "decision_matrix": { "values": [], "fears": [], "desires": [] }, "tags": [] }`,
        SYSTEM
      ).catch(() => null),

      // Prompt para Replicate
      ManusService.generate(
        `Genera UN prompt en inglés para crear concept art de:
Nombre: ${name}, Arquetipo: ${archetype}, ${description || ""}
Estilo: dark fantasy cyberpunk, game character, detailed armor, dramatic lighting, full body
Responde SOLO el prompt, sin explicación, máximo 120 palabras.`,
        SYSTEM
      ).catch(() => `${archetype} warrior character, ${name}, dark fantasy cyberpunk game art, detailed armor, dramatic purple lighting, full body, 8k, highly detailed`),

      // Texto de muestra de voz
      ManusService.generate(
        `Genera 3 líneas de diálogo épico en español para ${name} (${archetype}). Dark, intense, cinematic. Solo las líneas separadas por | sin nombres ni explicaciones.`,
        SYSTEM
      ).catch(() => `En el umbral de la oscuridad, solo quedan los valientes.|Este mundo no merece mi compasión, pero lo protegeré de todas formas.|La batalla ha terminado. Pero la guerra... apenas comienza.`)
    ]);

    step("assets", "Generando imagen y modelo 3D en paralelo...");

    // ─── FASE 2: Replicate (imagen) + Tripo3D (3D) en paralelo ───
    const tripoPrompt = `${archetype} character ${name}, dark fantasy cyberpunk, full body, detailed, game asset`;

    const [imageUrl, tripoTask] = await Promise.all([
      ReplicateService.generateImage({
        prompt: typeof visualPrompt === "string" ? visualPrompt : `${archetype} ${name} dark fantasy cyberpunk character full body`,
        width: 768, height: 1024, steps: 4
      }).catch(() => null),

      TripoService.generate(tripoPrompt).catch(() => null)
    ]);

    step("voice", "Generando voz con ElevenLabs...");

    // ─── FASE 3: Voz con ElevenLabs ───
    let audioUrl = null;
    const voiceLine = typeof voiceText === "string"
      ? voiceText.split("|")[0].trim()
      : "En el umbral de la oscuridad, solo quedan los valientes.";

    if (voiceId && ElevenService.ok()) {
      audioUrl = await ElevenService.tts({
        voiceId,
        text: voiceLine,
        stability: 0.65,
        similarityBoost: 0.80,
        style: 0.35
      }).catch(() => null);
    }

    // ─── PARSEAR LORE ───
    let parsedLore = {};
    if (loreResult) {
      try {
        const clean = loreResult.replace(/```json?/g, "").replace(/```/g, "").trim();
        parsedLore = JSON.parse(clean);
      } catch { parsedLore = { bio: loreResult }; }
    }

    step("done", "¡Personaje forjado!");

    return {
      name,
      archetype,
      bio: parsedLore.bio || description || "",
      lore_prompt: parsedLore.backstory || "",
      decision_matrix: parsedLore.decision_matrix || null,
      tags: parsedLore.tags || [archetype.toLowerCase()],
      concept_image_url: imageUrl,
      voice_audio_url: audioUrl,
      mesh_topology: tripoTask ? { tripo3d_task_id: tripoTask.task_id, status: tripoTask.status } : null,
      _voiceLine: voiceLine,
      _visualPrompt: typeof visualPrompt === "string" ? visualPrompt : ""
    };
  },

  // ── 2. FULL GAME GENESIS ─────────────────────────────────────
  // Genera GDD + Cover art + Marketing copy a la vez
  async genesisGame({ title, genre, atmosphere, onStep }) {
    const step = (s, d) => onStep && onStep(s, d);
    step("start", { title });

    const SYSTEM = `Eres el game designer de "Game Comic Crafter". Creas documentos de diseño épicos, detallados y únicos para videojuegos indie dark fantasy. Responde en JSON puro.`;

    step("gdd", "Generando Game Design Document con Manus...");

    const [gddResult, coverPrompt] = await Promise.all([
      ManusService.generate(
        `Crea el GDD completo para:
Título: ${title}
Género: ${genre}
Atmósfera: ${atmosphere}

Responde en JSON: {
  "description": "synopsis 2 párrafos",
  "game_design_document": "GDD detallado markdown 500 palabras",
  "combat_system": "descripción sistema de combate",
  "npc_density": "low|medium|high",
  "global_context": "contexto del mundo",
  "sales_description": "descripción atractiva para vender en Shopify (HTML permitido)",
  "seo_tags": ["tag1","tag2","tag3","tag4","tag5"]
}`,
        SYSTEM
      ).catch(() => null),

      ManusService.generate(
        `Genera un prompt en inglés para crear la portada de un videojuego:
Título: ${title}, Género: ${genre}, Atmósfera: ${atmosphere}
Estilo: dark fantasy cyberpunk game cover art, cinematic, dramatic lighting, epic composition
Solo el prompt, máximo 100 palabras.`,
        SYSTEM
      ).catch(() => `${genre} game cover art ${title}, ${atmosphere}, dark fantasy cyberpunk, epic cinematic composition, dramatic lighting, 8k`)
    ]);

    step("art", "Generando cover art con Replicate...");

    const coverUrl = await ReplicateService.generateImage({
      prompt: typeof coverPrompt === "string" ? coverPrompt : `${genre} game cover ${title} dark fantasy epic`,
      width: 1024, height: 1024
    }).catch(() => null);

    let parsed = {};
    if (gddResult) {
      try { parsed = JSON.parse(gddResult.replace(/```json?/g,"").replace(/```/g,"").trim()); }
      catch { parsed = { description: gddResult }; }
    }

    step("done", "¡Juego creado!");

    return {
      title,
      genre,
      atmosphere,
      description: parsed.description || "",
      game_design_document: parsed.game_design_document || "",
      combat_system: parsed.combat_system || "",
      npc_density: parsed.npc_density || "medium",
      global_context: parsed.global_context || "",
      sales_description: parsed.sales_description || "",
      cover_image_url: coverUrl,
      _seoTags: parsed.seo_tags || [],
      _coverPrompt: typeof coverPrompt === "string" ? coverPrompt : ""
    };
  },

  // ── 3. MARKETING BLITZ ──────────────────────────────────────
  // Poster + Trailer script + Instagram copy + Synopsis en paralelo
  async marketingBlitz({ project, onStep }) {
    const step = (s, d) => onStep && onStep(s, d);
    step("start", {});

    const SYSTEM = `Eres el director de marketing de Game Comic Crafter. Creas contenido viral, épico y que engancha. Siempre en JSON puro.`;
    const ctx = `Juego: ${project.title} | Género: ${project.genre} | Atmósfera: ${project.atmosphere} | ${project.description}`;

    step("copy", "Generando copy viral con Manus en 3 idiomas...");

    const [synopsisResult, posterPrompt, trailerScript] = await Promise.all([
      ManusService.generate(
        `Para este videojuego: ${ctx}
Genera en JSON: {
  "synopsis_es": "synopsis épica español 100 palabras",
  "synopsis_en": "epic synopsis english 100 words",
  "synopsis_fr": "synopsis épique français 100 mots",
  "instagram_copy": "copy para Instagram con emojis y hashtags",
  "shopify_description": "descripción HTML atractiva para vender en Shopify"
}`,
        SYSTEM
      ).catch(() => null),

      ManusService.generate(
        `Genera el prompt para crear un póster épico de marketing del juego: ${ctx}
Estilo: dark fantasy cyberpunk game poster, epic art, dramatic lighting, title text integration
Solo el prompt, máximo 120 palabras.`,
        SYSTEM
      ).catch(() => `epic dark fantasy game poster ${project.title}, cyberpunk atmosphere, dramatic lighting, hero silhouette`),

      ManusService.generate(
        `Escribe el script de un tráiler cinematográfico de 60 segundos para: ${ctx}
Incluye: voz en off épica, efectos de sonido [SFX: ...], música [MÚSICA: ...], 5-7 escenas.
Formato: script listo para grabar.`,
        SYSTEM
      ).catch(() => `[MÚSICA ÉPICA]\nVOZ EN OFF: "Un mundo al borde del colapso...\n${project.title}\n¿Estás listo?"`)
    ]);

    step("poster", "Generando póster con Replicate...");

    const posterUrl = await ReplicateService.generateImage({
      prompt: typeof posterPrompt === "string" ? posterPrompt : `epic game poster ${project.title} dark fantasy`,
      width: 1024, height: 1024
    }).catch(() => null);

    let parsed = {};
    if (synopsisResult) {
      try { parsed = JSON.parse(synopsisResult.replace(/```json?/g,"").replace(/```/g,"").trim()); }
      catch { parsed = { synopsis_es: synopsisResult }; }
    }

    step("done", "¡Marketing listo!");

    return {
      poster_url: posterUrl,
      synopsis_es: parsed.synopsis_es || "",
      synopsis_en: parsed.synopsis_en || "",
      synopsis_fr: parsed.synopsis_fr || "",
      trailer_script: typeof trailerScript === "string" ? trailerScript : "",
      shopify_description: parsed.shopify_description || "",
      instagram_copy: parsed.instagram_copy || "",
      seo_tags: project._seoTags || [],
      _posterPrompt: typeof posterPrompt === "string" ? posterPrompt : ""
    };
  },

  // ── 4. VOICE BATCH ──────────────────────────────────────────
  // Genera múltiples líneas de voz en paralelo para un personaje
  async voiceBatch({ characterName, archetype, lines, voiceId, onStep }) {
    const step = (s, d) => onStep && onStep(s, d);
    if (!ElevenService.ok()) throw new Error("ElevenLabs key no configurada");

    step("start", { count: lines.length });

    // Todas a la vez (máx 5 en paralelo para no saturar)
    const chunks = [];
    for (let i = 0; i < lines.length; i += 5) chunks.push(lines.slice(i, i + 5));

    const results = [];
    for (const chunk of chunks) {
      step("generating", `Generando ${results.length}/${lines.length}...`);
      const batch = await Promise.allSettled(
        chunk.map(line => ElevenService.tts({ voiceId, text: line, stability: 0.65, similarityBoost: 0.80, style: 0.30 }))
      );
      results.push(...batch.map((r, i) => ({
        text: chunk[i],
        url: r.status === "fulfilled" ? r.value : null,
        error: r.status === "rejected" ? r.reason?.message : null
      })));
    }

    step("done", `${results.filter(r=>r.url).length} audios generados`);
    return results;
  },

  // ── 5. ASSET BATCH ──────────────────────────────────────────
  // Genera múltiples imágenes de concept art en paralelo
  async assetBatch({ prompts, style = "dark fantasy cyberpunk game art", onStep }) {
    const step = (s, d) => onStep && onStep(s, d);
    step("start", { count: prompts.length });

    // Máx 3 en paralelo con Replicate
    const results = [];
    const chunks = [];
    for (let i = 0; i < prompts.length; i += 3) chunks.push(prompts.slice(i, i + 3));

    for (const chunk of chunks) {
      step("generating", `${results.length}/${prompts.length} assets...`);
      const batch = await Promise.allSettled(
        chunk.map(p => ReplicateService.generateImage({ prompt: `${p}, ${style}, 8k, detailed`, width: 768, height: 768 }))
      );
      results.push(...batch.map((r, i) => ({
        prompt: chunk[i],
        url: r.status === "fulfilled" ? r.value : null,
        error: r.status === "rejected" ? r.reason?.message : null
      })));
    }

    step("done", `${results.filter(r=>r.url).length} assets generados`);
    return results;
  }
};

// ════════════════════════════════════════════════
//  INIT — aplica todas las keys
// ════════════════════════════════════════════════
export function initHyperBrain(config = {}) {
  window.__GCC_CONFIG__ = { ...(window.__GCC_CONFIG__ || {}), ...config };
}

export const ALL_SERVICES_STATUS = () => ({
  tripo:     { name:"Tripo3D",     ok: true,                    icon:"🏺" },
  eleven:    { name:"ElevenLabs",  ok: ElevenService.ok(),      icon:"🎙️" },
  replicate: { name:"Replicate",   ok: ReplicateService.ok(),   icon:"🎨" },
  manus:     { name:"Manus AI",    ok: ManusService.ok(),       icon:"🧠" },
});

export default HyperBrain;
