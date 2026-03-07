import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const PROJECT_ID = '69aa90b1cb8f6837488e6aea';

    // Fetch the current arena HTML
    const arenaRes = await fetch('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69ac35e468cbabce520adc89/071d6fbb8_gcc-arena.html');
    const arenaHTML = await arenaRes.text();

    // Find the CLASSES array in the HTML and inject Jinete de Alfalfa
    // The Jinete de Alfalfa is a Warrior/Assassin from the GDD
    const jineteClass = `  {
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
        desc: 'Embiste al enemigo causando daño masivo',
        fn: (u, t, g) => { const dmg = u.atk * 2.8; g.dealDamage(u, t, dmg); g.log(\`\${u.name} carga con fuerza! \${dmg.toFixed(0)} DMG\`, 'dmg'); } },
      { name: 'Lanza Dorada', icon: '✨', key: 'W', cd: 6, cost: 40,
        desc: 'Lanza dorada que penetra defensas',
        fn: (u, t, g) => { const dmg = u.atk * 3.2 - t.def * 0.3; g.dealDamage(u, t, dmg); g.log(\`Lanza Dorada atraviesa! \${dmg.toFixed(0)} DMG penetrante\`, 'special'); } },
      { name: 'Galope Evasivo', icon: '💨', key: 'E', cd: 8, cost: 50,
        desc: 'Esquiva y contraataca instantáneamente',
        fn: (u, t, g) => { u.hp = Math.min(u.maxHp, u.hp + u.atk * 1.2); g.dealDamage(u, t, u.atk * 1.5); g.log(\`¡Galope Evasivo! Recupera vida y contraataca\`, 'heal'); } },
      { name: 'Jinete Supremo', icon: '🏇', key: 'R', cd: 30, cost: 100, special: true,
        desc: 'ULTIMATE: Convoca la manada — daño masivo en área',
        fn: (u, targets, g) => {
          const enemies = Array.isArray(targets) ? targets : [targets];
          enemies.forEach(t => { if(t && t.hp > 0) g.dealDamage(u, t, u.atk * 5); });
          g.log(\`🏇 ¡JINETE SUPREMO! La manada arrasa el campo!\`, 'special');
          g.triggerAlunizaje && g.triggerAlunizaje();
        }
      }
    ]
  },`;

    // Inject Jinete BEFORE the existing classes array (after "const CLASSES = [")
    let newHTML;
    if (arenaHTML.includes('const CLASSES = [')) {
      newHTML = arenaHTML.replace('const CLASSES = [', `const CLASSES = [\n${jineteClass}`);
    } else {
      return Response.json({ error: 'No se encontró el array CLASSES en el HTML' }, { status: 500 });
    }

    // Upload the new HTML
    const blob = new Blob([newHTML], { type: 'text/html' });
    const formData = new FormData();
    formData.append('file', blob, 'pingüino-con-jinete.html');

    const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file: blob });
    const newUrl = uploadRes.file_url;

    // Update the GameProject playable_url
    await base44.asServiceRole.entities.GameProject.update(PROJECT_ID, {
      playable_url: newUrl
    });

    return Response.json({ success: true, new_url: newUrl, message: 'Jinete de Alfalfa añadido al juego' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});