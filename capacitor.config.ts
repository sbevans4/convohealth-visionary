
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5c493edebbc343deb1d23a7209345528',
  appName: 'convohealth-visionary',
  webDir: 'dist',
  server: {
    url: 'https://5c493ede-bbc3-43de-b1d2-3a7209345528.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
    }
  }
};

export default config;
