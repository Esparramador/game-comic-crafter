import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArenaGame() {
  const gameRef = useRef(null);
  const [gameInstance, setGameInstance] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Cargar Phaser dinámicamente
    if (!window.Phaser) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js';
      script.onload = () => {
        console.log('Phaser cargado');
      };
      document.head.appendChild(script);
    }
  }, []);

  const generateArenaGame = async () => {
    setGenerating(true);
    setMessage('Generando Arena Game con 6 IA\'s...');
    try {
      const response = await base44.functions.invoke('generateArenaGameComplete', {
        gameTitle: 'Arena Game',
        description: 'Epic multiplayer arena battles with 6 AI opponents'
      });
      setMessage(`✅ Arena Game generado: ${response.data.aiCount} IA's creadas, ${response.data.characterIds.length} personajes guardados`);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const startGame = (mode) => {
    setSelectedMode(mode);
    
    if (gameInstance) {
      gameInstance.destroy(true);
    }

    if (!window.Phaser) {
      console.error('Phaser no está disponible');
      return;
    }

    class GameScene extends window.Phaser.Scene {
      constructor() {
        super({ key: 'Main' });
      }
      create() {
        this.add.text(16, 16, `Arena Game - ${mode} Jugadores + 6 IA's`, { 
          font: '20px Arial', 
          fill: '#fff' 
        });
        
        // Crear jugador central
        const player = this.add.circle(
          this.sys.game.config.width / 2,
          this.sys.game.config.height / 2,
          15,
          0xa855f7
        );
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.playerObj = { 
          x: this.sys.game.config.width / 2,
          y: this.sys.game.config.height / 2,
          vx: 0,
          vy: 0,
          sprite: player
        };
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
        
        this.playerObj.x = Math.max(15, Math.min(this.sys.game.config.width - 15, this.playerObj.x));
        this.playerObj.y = Math.max(15, Math.min(this.sys.game.config.height - 15, this.playerObj.y));
        
        this.playerObj.sprite.setPosition(this.playerObj.x, this.playerObj.y);
      }
    }

    const config = {
      type: window.Phaser.AUTO,
      parent: gameRef.current,
      width: window.innerWidth,
      height: window.innerHeight - 100,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
      },
      scene: GameScene,
      backgroundColor: '#0a0010'
    };

    const game = new window.Phaser.Game(config);
    setGameInstance(game);
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a0010', display: 'flex', flexDirection: 'column' }}>
      {!selectedMode ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg,#a855f7,#00f5ff,#e91e8c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            margin: 0
          }}>⚔️ GCC ARENA</h1>
          <div style={{ fontSize: '.85rem', color: '#7060a0', letterSpacing: '4px' }}>BATTLES · POWERED BY GCC ENGINE</div>
          
          {/* Botón de generación */}
          <Button
            onClick={generateArenaGame}
            disabled={generating}
            style={{
              background: generating ? '#666' : '#00d4ff',
              color: '#000',
              padding: '0.8rem 1.6rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generando 6 IA's...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generar Arena Game Completo
              </>
            )}
          </Button>

          {message && (
            <div style={{
              background: message.includes('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${message.includes('✅') ? '#22c55e' : '#ef4444'}`,
              color: message.includes('✅') ? '#22c55e' : '#ef4444',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '600px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {message}
            </div>
          )}
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '2rem',
            maxWidth: '600px',
            width: '90%'
          }}>
            {[
              { players: 2, icon: '⚔️', name: '1v1', desc: 'Duelo épico' },
              { players: 4, icon: '⚔️⚔️', name: '2v2', desc: 'Equipo' },
              { players: 6, icon: '⚔️⚔️⚔️', name: '3v3', desc: 'Batalla épica' }
            ].map(mode => (
              <button
                key={mode.players}
                onClick={() => startGame(mode.players)}
                style={{
                  background: 'rgba(124,58,237,.12)',
                  border: '2px solid rgba(124,58,237,.4)',
                  borderRadius: '16px',
                  padding: '1.2rem 0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.25s',
                  color: '#fff'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(124,58,237,.25)';
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'rgba(124,58,237,.12)';
                  e.target.style.borderColor = 'rgba(124,58,237,.4)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{mode.icon}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>{mode.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#7060a0', marginTop: '0.3rem' }}>{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{
            padding: '1rem',
            color: '#fff',
            fontSize: '0.9rem',
            borderBottom: '1px solid rgba(124,58,237,.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🎮 GCC Arena - {selectedMode} Jugadores + 6 IA's</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => window.location.href = createPageUrl('AssetRepository')}
                style={{
                  background: 'rgba(124,58,237,.2)',
                  border: '1px solid rgba(124,58,237,.4)',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                📦 Repositorio
              </button>
              <button
                onClick={() => setSelectedMode(null)}
                style={{
                  background: 'rgba(124,58,237,.2)',
                  border: '1px solid rgba(124,58,237,.4)',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                ← Volver
              </button>
            </div>
          </div>
          <div ref={gameRef} style={{ flex: 1 }} />
        </>
      )}
    </div>
  );
}