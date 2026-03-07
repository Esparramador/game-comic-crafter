// refresh_tripo_urls.js
// Refresca las URLs firmadas de Tripo3D para todos los GameCharacters
// Uso: node refresh_tripo_urls.js
// Requiere: TRIPO_API_KEY en .env

import { createClient } from '@base44/sdk';

const TRIPO_BEARER = process.env.TRIPO_API_KEY || "tsk_zlOCluH25qxtmvgEWSw7lUWL2fSpeXexmUW73IFvLDK";
const APP_ID = "69aa73f013b5c82e8989d6fc";

const base44 = createClient({
  appId: process.env.BASE44_APP_ID,
  token: process.env.BASE44_SERVICE_TOKEN,
  serverUrl: process.env.BASE44_API_URL,
});

async function getTripoTask(taskId) {
  const res = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
    headers: { 'Authorization': `Bearer ${TRIPO_BEARER}` }
  });
  const data = await res.json();
  if (data.code !== 0 || data.data?.status !== 'success') return null;
  return {
    glb_signed: data.data.output?.pbr_model || null,
    thumbnail: data.data.output?.rendered_image || null,
    glb_clean: (data.data.output?.pbr_model || '').split('?Policy=')[0],
  };
}

async function main() {
  console.log('🔄 Refrescando URLs de Tripo3D...\n');
  
  const chars = await base44.asServiceRole.entities.GameCharacter.list();
  let updated = 0;

  for (const char of chars) {
    const taskId = char.mesh_topology?.tripo3d_task_id;
    if (!taskId) { console.log(`⏭️  ${char.name} — sin task_id`); continue; }
    
    console.log(`🔍 ${char.name} — task: ${taskId}`);
    const result = await getTripoTask(taskId);
    
    if (!result) { console.log(`   ❌ task no disponible`); continue; }
    
    await base44.asServiceRole.entities.GameCharacter.update(char.id, {
      model_3d_glb_url: result.glb_signed,
      concept_image_url: result.thumbnail || char.concept_image_url,
      mesh_topology: {
        ...char.mesh_topology,
        last_refreshed: new Date().toISOString(),
        glb_clean: result.glb_clean,
      }
    });
    
    console.log(`   ✅ URL actualizada: ${result.glb_clean.substring(0, 70)}...`);
    updated++;
  }
  
  console.log(`\n✅ Listo — ${updated}/${chars.length} personajes actualizados`);
}

main().catch(console.error);
