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

    const arenaHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Arena Game - Multijugador Online</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: #080c1a; font-family: Orbitron, sans-serif; }
    canvas { display: block; touch-action: none; }
    #ui { position: absolute; top: 10px; left: 10px; color: #00f5ff; font-size: 12px; z-index: 100; }
    #players { position: absolute; top: 50px; right: 10px; color: #7c3aed; font-size: 11px; max-width: 200px; z-index: 100; }
    #status { position: absolute; bottom: 10px; left: 10px; color: #22c55e; font-size: 11px; z-index: 100; }
    button { background: linear-gradient(135deg,#7c3aed,#e91e8c); border: none; color: #fff; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-family: inherit; }
  </style>
</head>
<body>
  <div id="ui">
    <div>🎮 ARENA GAME - MULTIJUGADOR</div>
    <div id="sessionCode">Session: -</div>
    <button onclick="createArena()" style="margin-top: 10px;">+ Crear Sala</button>
    <input type="text" id="joinCode" placeholder="ARENA-XXX" style="padding: 5px; margin-top: 5px; width: 80px;">
    <button onclick="joinArena()" style="margin-top: 5px;">Unirse</button>
  </div>
  <div id="players"></div>
  <div id="status">Status: Esperando...</div>

  <script>
    const API_BASE = '${req.headers.get('origin') || 'http://localhost:5173'}';
    let currentSession = null;
    let gameScene = null;

    class ArenaScene extends Phaser.Scene {
      constructor() { super({ key: 'Arena' }); }
      create() {
        this.add.text(16, 16, 'ARENA GAME - Multijugador Online', { fontSize: '24px', fill: '#00f5ff', fontFamily: 'Orbitron' });
        this.players = {};
        this.updateGameState();
      }
      update() {
        if (currentSession) {
          this.players = {};
          currentSession.players?.forEach((p, i) => {
            const x = p.position?.x || Math.random() * 800;
            const y = p.position?.y || Math.random() * 600;
            const key = p.email;
            if (!this.players[key]) {
              const circle = this.add.circle(x, y, 15, 0x7c3aed);
              this.players[key] = { sprite: circle, hp: p.health };
              this.add.text(x - 25, y - 30, p.email.split('@')[0], { fontSize: '10px', fill: '#fff' });
            } else {
              this.players[key].sprite.setPosition(x, y);
              this.players[key].hp = p.health;
            }
          });
        }
      }
      updateGameState() {
        setInterval(() => {
          if (currentSession?.session_code) {
            fetch(API_BASE + '/api/functions/arenaGameMultiplayer', {
              method: 'POST',
              body: JSON.stringify({
                action: 'get_session',
                session_code: currentSession.session_code
              })
            }).then(r => r.json()).then(d => {
              if (d.session) currentSession = d.session;
            });
          }
        }, 500);
      }
    }

    async function createArena() {
      const res = await fetch(API_BASE + '/api/functions/arenaGameMultiplayer', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_session',
          game_project_id: 'arena-game',
          max_players: 4,
          character_id: 'warrior-default'
        })
      });
      const data = await res.json();
      if (data.success) {
        currentSession = data;
        document.getElementById('sessionCode').textContent = 'Session: ' + data.session_code;
        document.getElementById('status').textContent = 'Status: Sala creada - Esperando jugadores...';
        startGame();
      }
    }

    async function joinArena() {
      const code = document.getElementById('joinCode').value;
      if (!code) return;
      const res = await fetch(API_BASE + '/api/functions/arenaGameMultiplayer', {
        method: 'POST',
        body: JSON.stringify({
          action: 'join_session',
          session_code: code,
          character_id: 'warrior-default'
        })
      });
      const data = await res.json();
      if (data.success) {
        currentSession = data.session;
        document.getElementById('sessionCode').textContent = 'Session: ' + code;
        document.getElementById('status').textContent = 'Status: Unido a la sala';
        startGame();
      } else {
        alert('Error: ' + data.error);
      }
    }

    function startGame() {
      if (gameScene) return;
      const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: ArenaScene,
        physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } }
      };
      const game = new Phaser.Game(config);
      gameScene = game.scene.scenes[0];
    }

    window.addEventListener('resize', () => {
      if (gameScene) gameScene.scale.resize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>`;

    const blob = new Blob([arenaHtml], { type: 'text/html' });
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file: blob });
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

    await base44.functions.invoke('buildArenaAPK', {
      project_id: arenaProject.id,
      playable_url: arenaUrl
    });

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