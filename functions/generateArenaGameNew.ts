import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { characters = [] } = body;

    const gameId = crypto.randomUUID().substring(0, 8);
    const arenaHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Arena Game ${gameId}</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}body{background:#0a0010;font-family:'Orbitron',sans-serif;overflow:hidden;color:#e0e8ff}
    canvas{display:block;width:100%;height:100%}
    #hud{position:fixed;top:10px;left:10px;z-index:100;color:#00f5ff;font-size:13px}
    #info{position:fixed;bottom:10px;left:10px;z-index:100;color:#22c55e;font-size:11px}
    #players{position:fixed;top:10px;right:10px;z-index:100;color:#c084fc;font-size:11px;text-align:right}
    .btn{background:linear-gradient(135deg,#7c3aed,#e91e8c);border:none;color:#fff;padding:8px 14px;border-radius:6px;cursor:pointer;font-family:inherit;font-weight:700;margin:5px 0}
    input{padding:5px;background:#1a0030;border:1px solid #7c3aed;color:#fff;border-radius:4px;font-family:inherit}
  </style>
</head>
<body>
  <div id="hud">
    <div>⚔️ ARENA GAME</div>
    <div id="code" style="margin:5px 0">Session: -</div>
    <button class="btn" onclick="createSala()">+ Create Room</button>
    <div style="margin-top:8px">
      <input type="text" id="joinCode" placeholder="ARENA-XXX">
      <button class="btn" onclick="joinSala()">Join</button>
    </div>
  </div>
  <div id="info">
    <div id="status">🟡 Waiting...</div>
    <div id="health">HP: 100</div>
  </div>
  <div id="players"></div>

  <script>
const GAME_ID='${gameId}';let session=null,scene=null,player={x:innerWidth/2,y:innerHeight/2,vx:0,vy:0,hp:100};
class GameScene extends Phaser.Scene{
  constructor(){super({key:'Main'})}
  create(){
    this.physics.world.setBounds(0,0,this.sys.game.config.width,this.sys.game.config.height);
    this.cursors=this.input.keyboard.createCursorKeys();
    this.players={};
    this.updateSync();
  }
  update(){
    if(this.cursors){if(this.cursors.left.isDown)player.vx=-5;if(this.cursors.right.isDown)player.vx=5;if(this.cursors.up.isDown)player.vy=-5;if(this.cursors.down.isDown)player.vy=5;}
    player.vx*=0.92;player.vy*=0.92;player.x+=player.vx;player.y+=player.vy;
    player.x=Math.max(15,Math.min(this.sys.game.config.width-15,player.x));
    player.y=Math.max(15,Math.min(this.sys.game.config.height-15,player.y));
    Object.values(this.players).forEach(p=>{if(p.sprite)p.sprite.setPosition(p.x,p.y);});
  }
  updateSync(){setInterval(()=>{if(session?.session_code){fetch('/api/functions/arenaGameMultiplayer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update_state',session_code:session.session_code,position:{x:Math.round(player.x),y:Math.round(player.y)},health:player.hp})}).then(r=>r.json()).then(d=>{if(d.players)d.players.forEach(p=>{const k=p.email;if(!this.players[k]){this.players[k]={sprite:this.add.circle(p.position.x,p.position.y,12,0x7c3aed),x:p.position.x,y:p.position.y};this.add.text(p.position.x-20,p.position.y-25,p.email.split('@')[0],{font:'9px Arial',fill:'#fff'});}else{this.players[k].x=p.position.x;this.players[k].y=p.position.y;}});});}}},300);}
}
async function createSala(){const r=await fetch('/api/functions/arenaGameMultiplayer',{method:'POST',body:JSON.stringify({action:'create_session',game_project_id:GAME_ID,max_players:4,character_id:'warrior'})});const d=await r.json();if(d.success){session=d;document.getElementById('code').textContent='Session: '+d.session_code;document.getElementById('status').textContent='🟢 Room Created';initGame();}}
async function joinSala(){const c=document.getElementById('joinCode').value;if(!c)return;const r=await fetch('/api/functions/arenaGameMultiplayer',{method:'POST',body:JSON.stringify({action:'join_session',session_code:c,character_id:'warrior'})});const d=await r.json();if(d.success){session=d.session;document.getElementById('code').textContent='Session: '+c;document.getElementById('status').textContent='🟢 Joined';initGame();}else alert('Error: '+(d.error||'Failed'));}
function initGame(){if(scene)return;const cfg={type:Phaser.AUTO,width:innerWidth,height:innerHeight,physics:{default:'arcade',arcade:{gravity:{y:0}}},scene:GameScene,backgroundColor:'#0a0010'};scene=new Phaser.Game(cfg).scene.scenes[0];}
setInterval(()=>{if(session)document.getElementById('health').textContent='HP: '+Math.max(0,player.hp);},100);
  </script>
</body>
</html>`;

    const blob = new Blob([arenaHtml], { type: 'text/html' });
    const uploadResult = await base44.integrations.Core.UploadFile({ file: blob });
    const arenaUrl = uploadResult.file_url;

    const arenaProject = await base44.entities.GameProject.create({
      title: 'Arena Game',
      description: 'Juego multijugador online en tiempo real con Phaser',
      genre: 'Fighting',
      format: '2D',
      engine: 'Phaser.js',
      status: 'playable',
      playable_url: arenaUrl,
      cover_image_url: 'https://images.unsplash.com/photo-1538481572228-034ef077b87f?w=800&h=400&fit=crop',
      character_ids: characters.map(c => c.id).filter(Boolean),
      export_status: 'ready',
      export_formats: ['web', 'android_apk']
    });

    // Iniciar APK build en background (no esperar)
    base44.asServiceRole.functions.invoke('buildArenaAPK', {
      project_id: arenaProject.id,
      playable_url: arenaUrl
    }).catch(e => console.log('APK build error:', e.message));

    return Response.json({
      success: true,
      project: arenaProject,
      arena_url: arenaUrl,
      play_link: arenaUrl,
      multiplayer_api: '/api/functions/arenaGameMultiplayer',
      note: 'Arena Game creado. APK build en progreso. Visitantes pueden jugar desde URL.'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});