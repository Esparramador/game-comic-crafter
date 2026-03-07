import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const MAPS_KEY   = Deno.env.get("GOOGLE_MAPS_API_KEY");
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
const REPLICATE_KEY = Deno.env.get("REPLICATE_API_KEY");

// ── Gemini text ──
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

// ── Replicate image ──
async function generateImage(prompt) {
  const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
    method: "POST",
    headers: { "Authorization": `Token ${REPLICATE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: { prompt, num_outputs: 1, aspect_ratio: "16:9" } })
  });
  const pred = await res.json();
  const id = pred.id;
  if (!id) return null;
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

// ── Google Places Autocomplete ──
async function searchPlaces(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${MAPS_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.results || []).slice(0, 6).map(p => ({
    place_id: p.place_id,
    name: p.name,
    address: p.formatted_address,
    lat: p.geometry?.location?.lat,
    lng: p.geometry?.location?.lng,
    types: p.types || [],
    rating: p.rating,
    photo_ref: p.photos?.[0]?.photo_reference || null
  }));
}

// ── Google Place Details ──
async function getPlaceDetails(placeId) {
  const fields = "name,formatted_address,geometry,photos,types,rating,vicinity,address_components";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${MAPS_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || null;
}

// ── Google Nearby Search (para analizar la zona) ──
async function getNearbyPlaces(lat, lng, radius = 1000) {
  const types = ["park","museum","stadium","shopping_mall","university","hospital","church","subway_station"];
  const allPlaces = [];
  for (const type of types.slice(0, 4)) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${MAPS_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const results = (data.results || []).slice(0, 3).map(p => ({
      name: p.name, type, lat: p.geometry?.location?.lat, lng: p.geometry?.location?.lng
    }));
    allPlaces.push(...results);
  }
  return allPlaces;
}

// ── Google Static Map image URL ──
function getStaticMapUrl(lat, lng, zoom = 15) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=640x360&maptype=satellite&markers=color:red%7C${lat},${lng}&key=${MAPS_KEY}`;
}

// ── Street View URL ──
function getStreetViewUrl(lat, lng) {
  return `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${MAPS_KEY}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { mode, payload } = await req.json();

    // ── BUSCAR LUGAR ──
    if (mode === "search") {
      const places = await searchPlaces(payload.query);
      return Response.json({ success: true, places });
    }

    // ── ANALIZAR ZONA PARA JUEGO ──
    if (mode === "analyze") {
      const { place_id, lat, lng, name, address } = payload;

      // Obtener detalles del lugar y lugares cercanos en paralelo
      const [details, nearby] = await Promise.all([
        place_id ? getPlaceDetails(place_id) : Promise.resolve({ name, formatted_address: address }),
        getNearbyPlaces(lat, lng, 1500)
      ]);

      const staticMapUrl = getStaticMapUrl(lat, lng, 16);
      const streetViewUrl = getStreetViewUrl(lat, lng);

      // Generar análisis de escenario con Gemini
      const locationContext = `
        Lugar: ${details?.name || name}
        Dirección: ${details?.formatted_address || address}
        Coordenadas: ${lat}, ${lng}
        Tipos de lugar: ${(details?.types || []).join(", ")}
        Lugares cercanos: ${nearby.map(p => `${p.name} (${p.type})`).join(", ")}
      `;

      const analysisPrompt = `Eres un Game Designer AAA experto en mapear zonas reales como escenarios de videojuego.
      
      Analiza esta ubicación real y conviértela en un escenario de juego épico:
      ${locationContext}
      
      Devuelve un JSON con estos campos exactos:
      {
        "level_name": "nombre épico del nivel basado en el lugar real",
        "atmosphere": "Dark Fantasy|Cyberpunk|Post-Apocalíptico|Realista|etc",
        "genre_suggestion": "mejor género de juego para este escenario",
        "narrative": "historia de 3 párrafos ambientada en este lugar real transformado",
        "key_landmarks": ["punto clave 1 del juego", "punto clave 2", "punto clave 3", "punto clave 4", "punto clave 5"],
        "enemy_types": ["tipo enemigo 1 temático", "tipo enemigo 2", "tipo enemigo 3"],
        "game_mechanics": ["mecánica especial 1 aprovechando la geografía", "mecánica 2", "mecánica 3"],
        "art_prompt": "prompt detallado para generar arte del escenario con Replicate, incluyendo el estilo y elementos del lugar real",
        "level_objectives": ["objetivo principal", "objetivo secundario 1", "objetivo secundario 2"],
        "npc_density": "baja|media|alta|extrema",
        "real_world_hook": "descripción de cómo el lugar real inspira el diseño del nivel"
      }`;

      const [analysisText, conceptUrl] = await Promise.all([
        gemini(analysisPrompt),
        generateImage(`Epic game level concept art based on ${name}, ${address}, cinematic view, dramatic lighting, AAA quality, 8K, immersive environment`)
      ]);

      let analysis = {};
      try {
        analysis = JSON.parse(analysisText.replace(/```json|```/g, "").trim());
      } catch {
        analysis = { narrative: analysisText, level_name: name };
      }

      return Response.json({
        success: true,
        location: {
          name: details?.name || name,
          address: details?.formatted_address || address,
          lat, lng,
          nearby,
          static_map_url: staticMapUrl,
          street_view_url: streetViewUrl
        },
        analysis,
        concept_art_url: conceptUrl
      });
    }

    // ── GENERAR JUEGO COMPLETO DESDE ZONA REAL ──
    if (mode === "generate_game") {
      const { location, analysis, genre, game_title } = payload;

      const gddPrompt = `Actúa como Game Director AAA (Nintendo + Naughty Dog). 
      Crea un GDD completo para un juego basado en la ubicación real: ${location.name}, ${location.address}.
      
      Análisis del escenario: ${JSON.stringify(analysis)}
      Género: ${genre || analysis.genre_suggestion}
      Título: ${game_title || analysis.level_name}
      
      Devuelve JSON con:
      {
        "synopsis": "sinopsis épica de 2 párrafos",
        "mechanics": ["mecánica 1 con specs", "mecánica 2", "mecánica 3", "mecánica 4", "mecánica 5"],
        "levels": [{"name": "nivel", "description": "desc", "objective": "obj"}] (8 niveles),
        "enemies": [{"name": "nombre", "hp": 100, "dmg": 20, "special": "habilidad"}] (8 enemigos),
        "progression": "sistema de progresión detallado",
        "art_style": "estilo visual detallado",
        "shopify_description": "descripción de 200 palabras para vender el juego"
      }`;

      const [gddText, coverUrl] = await Promise.all([
        gemini(gddPrompt),
        generateImage(`${game_title || analysis.level_name} video game cover art, based on ${location.name}, ${analysis.atmosphere || "cinematic"}, epic, 8K AAA quality`)
      ]);

      return Response.json({
        success: true,
        gdd: gddText,
        cover_image_url: coverUrl,
        title: game_title || analysis.level_name,
        genre: genre || analysis.genre_suggestion,
        location_data: location
      });
    }

    return Response.json({ error: "Unknown mode" }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});