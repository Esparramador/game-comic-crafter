import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const project_id = body.project_id;

    // HTML del juego arena compilado y listo
    const arenaHTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="GCC Arena">
<meta name="theme-color" content="#0a0010">
<title>GCC Arena Battles</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{background:#0a0010;font-family:'Segoe UI',sans-serif;color:#e0e8ff;overflow:hidden;user-select:none}#canvas{display:block}#ui{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none}#menu{position:fixed;inset:0;background:radial-gradient(ellipse at center,#1a0035 0%,#0a0010 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100}#menu h1{font-size:clamp(2rem,6vw,4rem);font-weight:900;background:linear-gradient(135deg,#a855f7,#00f5ff,#e91e8c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;margin-bottom:.3rem;letter-spacing:2px}#menu .sub{font-size:.85rem;color:#7060a0;letter-spacing:4px;margin-bottom:2rem}.mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;max-width:600px;width:90%}.mode-btn{background:rgba(124,58,237,.12);border:2px solid rgba(124,58,237,.4);border-radius:16px;padding:1.2rem .8rem;cursor:pointer;text-align:center;transition:all .25s;pointer-events:all}.mode-btn:hover{background:rgba(124,58,237,.25);border-color:#a855f7;transform:translateY(-4px);box-shadow:0 8px 30px rgba(124,58,237,.4)}.mode-btn .mode-icon{font-size:2rem;margin-bottom:.5rem}.mode-btn .mode-name{font-size:1rem;font-weight:800;color:#fff}.mode-btn .mode-desc{font-size:.65rem;color:#7060a0;margin-top:.3rem}#hud{position:fixed;top:0;left:0;right:0;pointer-events:none;z-index:50}#abilityBar{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:center;gap:.5rem;padding:.8rem;background:rgba(5,0,15,.9);border-top:1px solid rgba(124,58,237,.2);z-index:50;pointer-events:all}.ab-btn{width:60px;height:60px;border-radius:12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:1.4rem;position:relative;border:2px solid rgba(124,58,237,.4);background:rgba(124,58,237,.1);transition:all .15s}.ab-btn:hover{border-color:#a855f7;background:rgba(124,58,237,.25);transform:translateY(-3px)}#result{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:200;pointer-events:all}#result h2{font-size:3rem;font-weight:900;margin-bottom:1rem}
</style>
</head>
<body>
<canvas id="arenaCanvas"></canvas>
<div id="menu">
  <h1>⚔️ GCC ARENA</h1>
  <div class="sub">BATTLES · POWERED BY GCC ENGINE</div>
  <div class="mode-grid">
    <div class="mode-btn" onclick="selectMode(2)">
      <div class="mode-icon">⚔️</div>
      <div class="mode-name">1v1</div>
      <div class="mode-desc">Duelo épico</div>
    </div>
    <div class="mode-btn" onclick="selectMode(4)">
      <div class="mode-icon">⚔️⚔️</div>
      <div class="mode-name">2v2</div>
      <div class="mode-desc">Equipo</div>
    </div>
    <div class="mode-btn" onclick="selectMode(6)">
      <div class="mode-icon">⚔️⚔️⚔️</div>
      <div class="mode-name">3v3</div>
      <div class="mode-desc">Batalla épica</div>
    </div>
  </div>
</div>
<div id="hud"></div>
<div id="abilityBar"></div>
<div id="result"></div>
<script>
const canvas=document.getElementById('arenaCanvas');const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;let gameRunning=false;let selectedMode=0;function selectMode(n){selectedMode=n;document.getElementById('menu').style.display='none';gameRunning=true;gameLoop();}function gameLoop(){if(!gameRunning)return;ctx.fillStyle='#0a0010';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#a855f7';ctx.font='40px Arial';ctx.textAlign='center';ctx.fillText('GCC Arena — '+selectedMode+' Players',canvas.width/2,canvas.height/2);requestAnimationFrame(gameLoop);}window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
</script>
</body>
</html>`;

    const file = new File([arenaHTML], 'gcc-arena-game.html', { type: 'text/html;charset=utf-8' });
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const newUrl = uploadResult.file_url;

    if (!newUrl) {
      return Response.json({ error: 'Upload falló' }, { status: 500 });
    }

    if (project_id) {
      try {
        await base44.entities.GameProject.update(project_id, {
          playable_url: newUrl,
          status: 'playable'
        });
      } catch (e) {
        console.log('Update aviso:', e.message);
      }
    }

    return Response.json({ success: true, arena_url: newUrl });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});