
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5c493edebbc343deb1d23a7209345528',
  appName: 'ConvoHealth Visionary',
  webDir: 'dist',
  server: {
    url: 'https://5c493ede-bbc3-43de-b1d2-3a7209345528.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'convohealth.keystore',
      keystoreAlias: 'convohealth',
      keystorePassword: '${process.env.KEYSTORE_PASSWORD}',
      keystoreAliasPassword: '${process.env.ALIAS_PASSWORD}',
    },
    allowMixedContent: true,
    captureInput: true,
    webViewUserAgent: 'ConvoHealth Visionary Android App'
  }
};

export default config;
