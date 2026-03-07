import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const JINETE_CLASS = `  {
    id: 'jinete_alfalfa',
    name: 'Jinete de Alfalfa',
    icon: '🌾',
    role: 'Warrior/Assassin',
    roleClass: 'role-dps',
    color: '#86efac',
    glow: 'rgba(134,239,172,0.4)',
    desc: 'Guerrero veloz montado. Lidera el avance con lanza y velocidad incomparable.',
    stats: { hp: 900, mp: 200, atk: 75, def: 35, spd: 1.8 },
    abilities: [
      { name: 'Carga de Alfalfa', icon: '\\u{1F33E}', key: 'Q', cd: 4, cost: 30,
        desc: 'Embiste al enemigo causando daño masivo',
        fn: (u, t, g) => { const dmg = u.atk * 2.8; g.dealDamage(u, t, dmg); g.log(u.name + ' carga con fuerza! ' + dmg.toFixed(0) + ' DMG', 'dmg'); } },
      { name: 'Lanza Dorada', icon: '\\u2728', key: 'W', cd: 6, cost: 40,
        desc: 'Lanza dorada que penetra defensas',
        fn: (u, t, g) => { const dmg = u.atk * 3.2 - t.def * 0.3; g.dealDamage(u, t, dmg); g.log('Lanza Dorada atraviesa! ' + dmg.toFixed(0) + ' DMG penetrante', 'special'); } },
      { name: 'Galope Evasivo', icon: '\\u{1F4A8}', key: 'E', cd: 8, cost: 50,
        desc: 'Esquiva y contraataca instantáneamente',
        fn: (u, t, g) => { u.hp = Math.min(u.maxHp, u.hp + u.atk * 1.2); g.dealDamage(u, t, u.atk * 1.5); g.log('Galope Evasivo! Recupera vida y contraataca', 'heal'); } },
      { name: 'Jinete Supremo', icon: '\\u{1F3C7}', key: 'R', cd: 30, cost: 100, special: true,
        desc: 'ULTIMATE: Convoca la manada — daño masivo en área',
        fn: (u, targets, g) => {
          const enemies = Array.isArray(targets) ? targets : [targets];
          enemies.forEach(function(t) { if(t && t.hp > 0) g.dealDamage(u, t, u.atk * 5); });
          g.log('JINETE SUPREMO! La manada arrasa el campo!', 'special');
        }
      }
    ]
  },`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const PROJECT_ID = '69aa90b1cb8f6837488e6aea';

    // 1. Fetch current arena HTML
    const arenaRes = await fetch('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69ac35e468cbabce520adc89/071d6fbb8_gcc-arena.html');
    if (!arenaRes.ok) return Response.json({ error: 'No se pudo descargar el HTML del arena' }, { status: 500 });
    const arenaHTML = await arenaRes.text();

    // 2. Check if Jinete already present
    if (arenaHTML.includes('jinete_alfalfa')) {
      return Response.json({ success: false, message: 'El Jinete de Alfalfa ya está en el juego' });
    }

    // 3. Inject Jinete into CLASSES array
    if (!arenaHTML.includes('const CLASSES = [')) {
      return Response.json({ error: 'No se encontró const CLASSES en el HTML', snippet: arenaHTML.substring(0, 500) }, { status: 500 });
    }
    const newHTML = arenaHTML.replace('const CLASSES = [', 'const CLASSES = [\n' + JINETE_CLASS);

    // 4. Upload modified HTML to Supabase via fetch (multipart)
    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(newHTML);
    const boundary = '----FormBoundary' + Date.now();
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="gcc-arena-jinete.html"\r\nContent-Type: text/html\r\n\r\n`;
    const footer = `\r\n--${boundary}--`;
    const headerBytes = encoder.encode(header);
    const footerBytes = encoder.encode(footer);
    const body = new Uint8Array(headerBytes.length + htmlBytes.length + footerBytes.length);
    body.set(headerBytes, 0);
    body.set(htmlBytes, headerBytes.length);
    body.set(footerBytes, headerBytes.length + htmlBytes.length);

    const APP_ID = Deno.env.get('BASE44_APP_ID');
    const uploadRes = await fetch(`https://base44.app/api/apps/${APP_ID}/files/public`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: body
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return Response.json({ error: 'Upload failed: ' + errText }, { status: 500 });
    }

    const uploadData = await uploadRes.json();
    const newUrl = uploadData.file_url || uploadData.url;

    if (!newUrl) return Response.json({ error: 'No se obtuvo URL del upload', data: uploadData }, { status: 500 });

    // 5. Update GameProject playable_url
    await base44.asServiceRole.entities.GameProject.update(PROJECT_ID, {
      playable_url: newUrl
    });

    return Response.json({ success: true, new_url: newUrl, message: 'Jinete de Alfalfa añadido y juego actualizado' });

  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});