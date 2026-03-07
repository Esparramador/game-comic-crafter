import { useEffect, useRef } from 'react';

export default function ArenaGame() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // HTML del juego arena
    const arenaHTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GCC Arena Battles</title>
<script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0010;font-family:'Segoe UI',sans-serif;color:#e0e8ff;overflow:hidden;user-select:none}
#canvas{display:block}
#ui{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none}
#menu{position:fixed;inset:0;background:radial-gradient(ellipse at center,#1a0035 0%,#0a0010 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100}
#menu h1{font-size:clamp(2rem,6vw,4rem);font-weight:900;background:linear-gradient(135deg,#a855f7,#00f5ff,#e91e8c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;margin-bottom:.3rem;letter-spacing:2px}
#menu .sub{font-size:.85rem;color:#7060a0;letter-spacing:4px;margin-bottom:2rem}
.mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;max-width:600px;width:90%}
.mode-btn{background:rgba(124,58,237,.12);border:2px solid rgba(124,58,237,.4);border-radius:16px;padding:1.2rem .8rem;cursor:pointer;text-align:center;transition:all .25s;pointer-events:all}
.mode-btn:hover{background:rgba(124,58,237,.25);border-color:#a855f7;transform:translateY(-4px);box-shadow:0 8px 30px rgba(124,58,237,.4)}
.mode-btn .mode-icon{font-size:2rem;margin-bottom:.5rem}
.mode-btn .mode-name{font-size:1rem;font-weight:800;color:#fff}
.mode-btn .mode-desc{font-size:.65rem;color:#7060a0;margin-top:.3rem}
#hud{position:fixed;top:0;left:0;right:0;pointer-events:none;z-index:50;padding:1rem;color:#fff;font-size:.9rem}
#abilityBar{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:center;gap:.5rem;padding:.8rem;background:rgba(5,0,15,.9);border-top:1px solid rgba(124,58,237,.2);z-index:50;pointer-events:all}
.ab-btn{width:60px;height:60px;border-radius:12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:1.4rem;position:relative;border:2px solid rgba(124,58,237,.4);background:rgba(124,58,237,.1);transition:all .15s}
.ab-btn:hover{border-color:#a855f7;background:rgba(124,58,237,.25);transform:translateY(-3px)}
</style>
</head>
<body>
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
<div id="hud">
  <div style="position:absolute;top:1rem;left:1rem">
    <div>🎮 GCC Arena</div>
    <div id="status" style="font-size:.75rem;color:#7060a0">Selecciona modo</div>
  </div>
</div>
<div id="abilityBar"></div>
<script>
let gameRunning = false;
let selectedMode = 0;
let game = null;

function selectMode(n) {
  selectedMode = n;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('status').textContent = '🟢 Batalla iniciada: ' + n + ' jugadores';
  gameRunning = true;
  initGame();
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Main' });
  }
  create() {
    this.players = {};
    this.add.text(16, 16, 'Arena Game - ' + selectedMode + ' Players', { font: '18px Arial', fill: '#fff' });
    
    // Crear jugador central
    const player = this.add.circle(this.sys.game.config.width/2, this.sys.game.config.height/2, 15, 0xa855f7);
    player.setInteractive();
    
    // Controles básicos
    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerObj = { x: this.sys.game.config.width/2, y: this.sys.game.config.height/2, vx: 0, vy: 0, sprite: player };
  }
  update() {
    if (this.cursors) {
      this.playerObj.vx = 0;
      this.playerObj.vy = 0;
      if (this.cursors.left.isDown) this.playerObj.vx = -5;
      if (this.cursors.right.isDown) this.playerObj.vx = 5;
      if (this.cursors.up.isDown) this.playerObj.vy = -5;
      if (this.cursors.down.isDown) this.playerObj.vy = 5;
    }
    
    this.playerObj.x += this.playerObj.vx;
    this.playerObj.y += this.playerObj.vy;
    
    // Limites
    this.playerObj.x = Math.max(15, Math.min(this.sys.game.config.width - 15, this.playerObj.x));
    this.playerObj.y = Math.max(15, Math.min(this.sys.game.config.height - 15, this.playerObj.y));
    
    this.playerObj.sprite.setPosition(this.playerObj.x, this.playerObj.y);
  }
}

function initGame() {
  if (game) return;
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 80,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: GameScene,
    backgroundColor: '#0a0010'
  };
  game = new Phaser.Game(config);
}

window.addEventListener('resize', () => {
  if (game) {
    game.scale.resize(window.innerWidth, window.innerHeight - 80);
  }
});
</script>
</body>
</html>`;

    containerRef.current.innerHTML = arenaHTML;
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}