import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { gameTitle = 'Arena Game', description = 'Epic multiplayer arena battles' } = body;

    // Crear o reutilizar Arena Game
    let arenaGame = await base44.asServiceRole.entities.GameProject.filter(
      { title: 'Arena Game', created_by: user.email },
      '-created_date',
      1
    );

    let gameProjectId = arenaGame?.[0]?.id;

    if (!gameProjectId) {
      const newGame = await base44.asServiceRole.entities.GameProject.create({
        title: 'Arena Game',
        description: 'Multiplayer Arena Battles with 6 AI opponents',
        genre: 'Fighting',
        format: '2D',
        engine: 'Phaser.js',
        status: 'generating',
        npc_density: 'high',
        playable_url: '/ArenaGame'
      });
      gameProjectId = newGame.id;
    }

    // Crear 6 personajes IA
    const aiCharacters = [
      { name: 'Vortex', archetype: 'Speed Warrior', bio: 'Master of velocity and wind magic' },
      { name: 'Inferno', archetype: 'Fire Knight', bio: 'Commands the power of flames' },
      { name: 'Sentinel', archetype: 'Tank Knight', bio: 'Unbreakable defender of the arena' },
      { name: 'Specter', archetype: 'Shadow Assassin', bio: 'Moves through shadows unseen' },
      { name: 'Thunderstrike', archetype: 'Lightning Mage', bio: 'Wields the power of storms' },
      { name: 'Chronos', archetype: 'Time Warrior', bio: 'Controls temporal forces' }
    ];

    const characterIds = [];
    for (const charData of aiCharacters) {
      const char = await base44.asServiceRole.entities.GameCharacter.create({
        name: charData.name,
        archetype: charData.archetype,
        bio: charData.bio,
        gender: 'Unknown',
        behavior_logic: 'npc',
        tags: ['arena-ai', 'multiplayer', gameTitle]
      });
      characterIds.push(char.id);
    }

    // Generar assets del juego
    const gameAssets = [
      { type: 'character', name: 'player_sprite', format: 'PNG' },
      { type: 'character', name: 'enemy_sprite_base', format: 'PNG' },
      { type: 'texture', name: 'arena_floor', format: 'PNG' },
      { type: 'texture', name: 'particle_effect', format: 'PNG' },
      { type: 'script', name: 'game_logic.js', format: 'JS' },
      { type: 'sprite_sheet', name: 'combat_animations', format: 'PNG' }
    ];

    for (const asset of gameAssets) {
      await base44.asServiceRole.entities.AssetRepository.create({
        name: asset.name,
        type: asset.type,
        source_app: 'game_crafter',
        project_id: gameProjectId,
        format: asset.format,
        tags: ['arena-game', 'multiplayer', ...characterIds],
        file_size_mb: Math.floor(Math.random() * 50) + 1
      });
    }

    // Actualizar GameProject con IDs de personajes
    await base44.asServiceRole.entities.GameProject.update(gameProjectId, {
      character_ids: characterIds,
      status: 'playable'
    });

    return Response.json({
      success: true,
      gameProjectId,
      characterIds,
      aiCount: 6,
      message: 'Arena Game generated with 6 AI characters and assets saved to repository'
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});