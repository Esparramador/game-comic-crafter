import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_KEY    = Deno.env.get("GEMINI_API_KEY");
const ELEVEN_KEY    = Deno.env.get("ELEVENLABS_API_KEY");
const TRIPO_KEY     = Deno.env.get("TRIPO3D_API_KEY");
const REPLICATE_KEY = Deno.env.get("REPLICATE_API_KEY");

// ── Gemini text generation ──
async function gemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── Replicate image generation ──
async function generateImage(prompt) {
  const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
    method: "POST",
    headers: { "Authorization": `Token ${REPLICATE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: { prompt, num_outputs: 1, aspect_ratio: "16:9" } })
  });
  const pred = await res.json();
  const id = pred.id;
  if (!id) return null;

  // Poll for result
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { "Authorization": `Token ${REPLICATE_KEY}` }
    });
    const data = await poll.json();
    if (data.status === "succeeded") return data.output?.[0] || null;
    if (data.status === "failed") return null;
  }
  return null;
}

// ── ElevenLabs voice generation ──
async function generateVoice(text, voiceId = "pNInz6obpgDQGcFmaJgB") {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": ELEVEN_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.8 } })
  });
  if (!res.ok) return null;
  const buf = await res.arrayBuffer();
  // Upload via base64 data URL
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return `data:audio/mpeg;base64,${b64}`;
}

// ── Tripo3D 3D model generation ──
async function generateModel3D(prompt) {
  const res = await fetch("https://api.tripo3d.ai/v2/openapi/task", {
    method: "POST",
    headers: { "Authorization": `Bearer ${TRIPO_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "text_to_model", prompt })
  });
  const data = await res.json();
  const taskId = data?.data?.task_id;
  if (!taskId) return null;

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const poll = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
      headers: { "Authorization": `Bearer ${TRIPO_KEY}` }
    });
    const pd = await poll.json();
    if (pd?.data?.status === "success") return pd?.data?.output?.model || null;
    if (pd?.data?.status === "failed") return null;
  }
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { mode, payload } = await req.json();

    if (mode === "game") {
      // 1. Generate GDD with Gemini
      const gddPrompt = `Actúa como Game Director AAA. Crea un GDD completo para el juego "${payload.title}" (${payload.genre}, ${payload.format}, ${payload.engine}).
      Incluye: sinopsis, 5 mecánicas core, sistema de progresión, 8 niveles, 10 enemigos con stats, prompt de arte para portada.
      Formato JSON con campos: synopsis, mechanics, levels, enemies, art_prompt, trailer_script`;
      
      const gddText = await gemini(gddPrompt);
      
      // 2. Generate cover image
      const artPrompt = `Video game cover art, ${payload.title}, ${payload.genre} game, ${payload.style || "dark fantasy"}, 8K, concept art, AAA quality, cinematic lighting, dramatic composition`;
      const coverUrl = await generateImage(artPrompt);

      return Response.json({ 
        success: true, 
        gdd: gddText, 
        cover_image_url: coverUrl,
        mode: "game"
      });
    }

    if (mode === "character") {
      // 1. Generate character lore with Gemini
      const lorePrompt = `Crea un personaje de videojuego completo:
      Nombre: ${payload.name}, Arquetipo: ${payload.archetype}, Rol: ${payload.role || "héroe"}
      Devuelve JSON con: bio (300 palabras), lore_prompt, decision_matrix (objeto con valores numéricos), voice_description, art_prompt_detailed`;
      
      const loreText = await gemini(lorePrompt);

      // 2. Generate character concept art
      const artPrompt = `Character concept art, ${payload.name}, ${payload.archetype}, ${payload.style || "dark fantasy"}, full body, detailed, 8K, AAA game character design`;
      const imageUrl = await generateImage(artPrompt);

      // 3. Generate 3D model (async, may take time)
      let model3dUrl = null;
      if (payload.generate3d) {
        model3dUrl = await generateModel3D(`${payload.name}, ${payload.archetype} character, game ready, detailed`);
      }

      return Response.json({
        success: true,
        lore: loreText,
        concept_image_url: imageUrl,
        model_3d_url: model3dUrl,
        mode: "character"
      });
    }

    if (mode === "voice") {
      const audioDataUrl = await generateVoice(payload.text, payload.voice_id);
      return Response.json({ success: true, audio_data: audioDataUrl, mode: "voice" });
    }

    if (mode === "marketing") {
      // Generate marketing copy + poster
      const mktPrompt = `Crea un kit de marketing completo para el juego "${payload.title}" (${payload.genre}):
      JSON con: poster_prompt (detallado para generar imagen), trailer_script (60s), synopsis_es, synopsis_en, seo_tags (array 10 items), shopify_description`;
      
      const mktText = await gemini(mktPrompt);

      // Generate poster
      const posterPrompt = `Epic game marketing poster, ${payload.title}, ${payload.genre}, cinematic, dramatic lighting, 4K, professional game artwork`;
      const posterUrl = await generateImage(posterPrompt);

      return Response.json({
        success: true,
        marketing: mktText,
        poster_url: posterUrl,
        mode: "marketing"
      });
    }

    if (mode === "image") {
      const url = await generateImage(payload.prompt);
      return Response.json({ success: true, url, mode: "image" });
    }

    return Response.json({ error: "Unknown mode" }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});