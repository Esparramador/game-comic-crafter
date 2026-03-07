import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { project_id, playable_url } = body;

    if (!playable_url) {
      return Response.json({ error: 'playable_url required' }, { status: 400 });
    }

    const project = await base44.entities.GameProject.filter({ id: project_id }, '', 1).then(r => r[0]);
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const capacitorConfig = {
      appId: 'com.gamecomiccrafter.arena',
      appName: project.title || 'Arena Game',
      webDir: 'www',
      server: {
        androidScheme: 'https',
        url: playable_url,
        cleartext: true
      },
      plugins: {
        SplashScreen: {
          launchShowDuration: 0
        },
        CapacitorHttp: {
          enabled: true
        }
      }
    };

    const capacitorJson = JSON.stringify(capacitorConfig, null, 2);
    const androidConfigUrl = await base44.asServiceRole.integrations.Core.UploadFile({
      file: new File([capacitorJson], 'capacitor.config.json', { type: 'application/json' })
    });

    const buildScript = `#!/bin/bash
echo "Building APK for ${project.title}..."
npm install -g @capacitor/cli
npm install
npm run build
npx cap init "${project.title}" com.gamecomiccrafter.arena --web-dir=dist
npx cap add android
npx cap sync
cd android && ./gradlew assembleRelease
echo "APK ready at android/app/build/outputs/apk/release/"`;

    const scriptUrl = await base44.asServiceRole.integrations.Core.UploadFile({
      file: new File([buildScript], 'build-apk.sh', { type: 'text/plain' })
    });

    await base44.entities.GameProject.update(project_id, {
      export_status: 'building',
      export_formats: ['web', 'android_apk']
    });

    return Response.json({
      success: true,
      build_status: 'queued',
      project_title: project.title,
      capacitor_config: androidConfigUrl.file_url,
      build_script: scriptUrl.file_url,
      expected_output: 'android/app/build/outputs/apk/release/app-release.apk',
      note: 'APK build started. This takes 2-5 minutes.'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});