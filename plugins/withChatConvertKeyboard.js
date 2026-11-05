const fs = require('fs');
const path = require('path');
const {
  withAndroidManifest,
  withDangerousMod,
} = require('@expo/config-plugins');

const PACKAGE_NAME = 'com.chatconvert.keyboard';
const SERVICE_CLASS = `${PACKAGE_NAME}.ChatConvertInputMethodService`;

function ensureInputMethodService(manifest) {
  const application = manifest.manifest.application?.[0];
  if (!application) {
    throw new Error('ChatConvert Keyboard could not find the Android application node.');
  }

  application.service = application.service || [];
  const existing = application.service.find(
    (service) => service.$?.['android:name'] === SERVICE_CLASS,
  );

  const service = {
    $: {
      'android:name': SERVICE_CLASS,
      'android:label': 'ChatConvert Keyboard',
      'android:permission': 'android.permission.BIND_INPUT_METHOD',
      'android:exported': 'true',
      'android:directBootAware': 'true',
    },
    'intent-filter': [
      {
        action: [{ $: { 'android:name': 'android.view.InputMethod' } }],
      },
    ],
    'meta-data': [
      {
        $: {
          'android:name': 'android.view.im',
          'android:resource': '@xml/chatconvert_input_method',
        },
      },
    ],
  };

  if (existing) {
    Object.assign(existing, service);
  } else {
    application.service.push(service);
  }
  return manifest;
}

function copyNativeSources(config, platformProjectRoot) {
  const sourceRoot = path.join(config.modRequest.projectRoot, 'native');
  const javaRoot = path.join(
    platformProjectRoot,
    'app',
    'src',
    'main',
    'java',
    'com',
    'chatconvert',
    'keyboard',
  );
  const xmlRoot = path.join(platformProjectRoot, 'app', 'src', 'main', 'res', 'xml');
  const valuesRoot = path.join(
    platformProjectRoot,
    'app',
    'src',
    'main',
    'res',
    'values',
  );

  fs.mkdirSync(javaRoot, { recursive: true });
  fs.mkdirSync(xmlRoot, { recursive: true });
  fs.mkdirSync(valuesRoot, { recursive: true });

  for (const fileName of [
    'ChatConvertInputMethodService.java',
    'ConversionEngine.java',
    'LocalTranslationProvider.java',
    'RemoteTranslationProvider.java',
    'TranslationProvider.java',
  ]) {
    fs.copyFileSync(path.join(sourceRoot, fileName), path.join(javaRoot, fileName));
  }
  fs.copyFileSync(
    path.join(sourceRoot, 'chatconvert_input_method.xml'),
    path.join(xmlRoot, 'chatconvert_input_method.xml'),
  );
  const endpoint = process.env.CHATCONVERT_TRANSLATION_API_URL || '';
  fs.writeFileSync(
    path.join(valuesRoot, 'chatconvert_config.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources><string name="chatconvert_translation_api_url" translatable="false">${escapeXml(endpoint)}</string></resources>\n`,
  );
  return config;
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = function withChatConvertKeyboard(config) {
  config = withAndroidManifest(config, (manifestConfig) => {
    manifestConfig.modResults = ensureInputMethodService(manifestConfig.modResults);
    return manifestConfig;
  });

  return withDangerousMod(config, [
    'android',
    (dangerousConfig) => {
      return copyNativeSources(
        dangerousConfig,
        dangerousConfig.modRequest.platformProjectRoot,
      );
    },
  ]);
};