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
    const playable_url = body.playable_url;
    const title = body.title || 'GCC Game';

    if (!playable_url) {
      return Response.json({ error: 'playable_url requerida' }, { status: 400 });
    }

    // 1. Descargar el HTML original
    let html;
    try {
      const htmlRes = await fetch(playable_url);
      if (htmlRes.ok) {
        html = await htmlRes.text();
      } else {
        throw new Error('HTTP ' + htmlRes.status);
      }
    } catch (e) {
      // Si falla el fetch, devolver el URL original de todas formas
      console.log('Aviso: no se pudo descargar HTML para PWA — devolviendo URL original', e.message);
      return Response.json({ success: true, pwa_url: playable_url });
    }

    const shortName = title.substring(0, 12);

    // 2. Inyectar metadatos PWA si no existen
    if (!html.includes('apple-mobile-web-app-capable')) {
      const pwaHead = `
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="${shortName}">
  <meta name="theme-color" content="#080c1a">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <style>html,body{margin:0;padding:0;overflow:hidden;background:#080c1a;}canvas{display:block;touch-action:none;}</style>`;
      html = html.replace('</head>', pwaHead + '\n</head>');
    }

    // 3. Subir el HTML con PWA
    const file = new File([html], 'game-pwa.html', { type: 'text/html' });
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const newUrl = uploadResult.file_url;

    if (!newUrl) {
      return Response.json({ error: 'Upload falló' }, { status: 500 });
    }

    // 4. Actualizar el proyecto si se pasó project_id — solo playable_url y status (seguros)
    if (project_id) {
      try {
        await base44.entities.GameProject.update(project_id, {
          playable_url: newUrl,
          status: 'playable'
        });
      } catch (e) {
        // Validación de esquema falla, pero la URL se devuelve igual al frontend
        console.log('Update DB aviso:', e.message);
      }
    }

    return Response.json({ success: true, pwa_url: newUrl });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});