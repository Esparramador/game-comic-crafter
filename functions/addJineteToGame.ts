import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const JINETE_BLOCK = `  {
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
      { name: 'Carga de Alfalfa', icon: '🌾', key: 'Q', cd: 4, cost: 30,
        desc: 'Embiste causando daño masivo',
        fn: (u, t, g) => { const d = u.atk * 2.8; g.dealDamage(u, t, d); g.log(u.name + ' carga! ' + d.toFixed(0) + ' DMG', 'dmg'); } },
      { name: 'Lanza Dorada', icon: '✨', key: 'W', cd: 6, cost: 40,
        desc: 'Lanza que penetra defensas enemigas',
        fn: (u, t, g) => { const d = u.atk * 3.2 - t.def * 0.3; g.dealDamage(u, t, d); g.log('Lanza Dorada! ' + d.toFixed(0) + ' DMG', 'special'); } },
      { name: 'Galope Evasivo', icon: '💨', key: 'E', cd: 8, cost: 50,
        desc: 'Esquiva y contraataca al instante',
        fn: (u, t, g) => { u.hp = Math.min(u.maxHp, u.hp + u.atk * 1.2); g.dealDamage(u, t, u.atk * 1.5); g.log('Galope Evasivo! Vida + contraataque', 'heal'); } },
      { name: 'Jinete Supremo', icon: '🏇', key: 'R', cd: 30, cost: 100, special: true,
        desc: 'ULTIMATE: La manada arrasa todo el campo de batalla',
        fn: (u, targets, g) => {
          const arr = Array.isArray(targets) ? targets : [targets];
          arr.forEach(function(t) { if (t && t.hp > 0) g.dealDamage(u, t, u.atk * 5); });
          g.log('JINETE SUPREMO! La manada arrasa!', 'special');
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

    // 1. Fetch original arena HTML
    const arenaRes = await fetch('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69ac35e468cbabce520adc89/071d6fbb8_gcc-arena.html');
    if (!arenaRes.ok) return Response.json({ error: 'No se pudo descargar el HTML' }, { status: 500 });
    const arenaHTML = await arenaRes.text();

    if (arenaHTML.includes('jinete_alfalfa')) {
      return Response.json({ success: false, message: 'Jinete ya está en el juego' });
    }

    if (!arenaHTML.includes('const CLASSES = [')) {
      return Response.json({ error: 'No se encontró CLASSES en el HTML' }, { status: 500 });
    }

    // 2. Inject Jinete as first class
    const newHTML = arenaHTML.replace('const CLASSES = [', 'const CLASSES = [\n' + JINETE_BLOCK);

    // 3. Upload via SDK UploadFile — pass as File object
    const file = new File([newHTML], 'gcc-arena-jinete.html', { type: 'text/html' });
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const newUrl = uploadResult.file_url;

    if (!newUrl) return Response.json({ error: 'Upload no devolvió URL', uploadResult }, { status: 500 });

    // 4. Update GameProject playable_url only — use PATCH via direct fetch with user token
    const token = req.headers.get('Authorization');
    const APP_ID = Deno.env.get('BASE44_APP_ID');
    const patchRes = await fetch(`https://base44.app/api/apps/${APP_ID}/entities/GameProject/${PROJECT_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ playable_url: newUrl })
    });
    if (!patchRes.ok) {
      const errText = await patchRes.text();
      return Response.json({ error: 'Patch failed: ' + errText }, { status: 500 });
    }

    return Response.json({ success: true, new_url: newUrl });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});