import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const activeSessions = new Map();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, session_code, character_id, position, health, game_state } = body;

    if (action === 'create_session') {
      const sessionCode = `ARENA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const session = {
        id: crypto.randomUUID(),
        session_code: sessionCode,
        game_project_id: body.game_project_id,
        created_by: user.email,
        players: [{ email: user.email, character_id, health: 100, position: { x: 0, y: 0 }, score: 0 }],
        status: 'waiting',
        max_players: body.max_players || 4,
        created_at: new Date().toISOString(),
        game_state: {}
      };
      activeSessions.set(sessionCode, session);
      
      const saved = await base44.asServiceRole.entities.GameSession.create(session);
      return Response.json({ success: true, session_code: sessionCode, session_id: saved.id });
    }

    if (action === 'join_session') {
      const session = activeSessions.get(session_code);
      if (!session) {
        return Response.json({ error: 'Session not found' }, { status: 404 });
      }
      
      if (session.players.length >= session.max_players) {
        return Response.json({ error: 'Session full' }, { status: 400 });
      }
      
      session.players.push({ email: user.email, character_id, health: 100, position: { x: Math.random() * 800, y: Math.random() * 600 }, score: 0 });
      
      await base44.asServiceRole.entities.GameSession.update(session.id, { players: session.players });
      return Response.json({ success: true, session, players: session.players });
    }

    if (action === 'update_state') {
      const session = activeSessions.get(session_code);
      if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });
      
      const playerIndex = session.players.findIndex(p => p.email === user.email);
      if (playerIndex !== -1) {
        if (position) session.players[playerIndex].position = position;
        if (health !== undefined) session.players[playerIndex].health = health;
        if (game_state) session.game_state = game_state;
      }
      
      await base44.asServiceRole.entities.GameSession.update(session.id, { 
        players: session.players,
        game_state: session.game_state 
      });
      
      return Response.json({ success: true, players: session.players, game_state: session.game_state });
    }

    if (action === 'get_session') {
      const session = activeSessions.get(session_code) || 
        await base44.asServiceRole.entities.GameSession.filter({ session_code }, '-created_date', 1).then(r => r[0]);
      if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });
      return Response.json({ success: true, session });
    }

    if (action === 'end_session') {
      const session = activeSessions.get(session_code);
      if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });
      
      session.status = 'finished';
      session.ended_at = new Date().toISOString();
      await base44.asServiceRole.entities.GameSession.update(session.id, { status: 'finished', ended_at: session.ended_at });
      activeSessions.delete(session_code);
      
      return Response.json({ success: true, session });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});