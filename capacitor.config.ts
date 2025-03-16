
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5c493edebbc343deb1d23a7209345528',
  appName: 'AI Doctor Notes',
  webDir: 'dist',
  server: {
    url: 'https://5c493ede-bbc3-43de-b1d2-3a7209345528.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999",
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  android: {
    buildOptions: {
      keystorePath: 'aidoctornotes.keystore',
      keystoreAlias: 'aidoctornotes',
      keystorePassword: '${process.env.KEYSTORE_PASSWORD}',
      keystoreAliasPassword: '${process.env.ALIAS_PASSWORD}',
    },
    allowMixedContent: true,
    captureInput: true,
    webViewUserAgent: 'AI Doctor Notes Android App',
    backgroundColor: "#FFFFFF",
    minSdkVersion: 22,
    targetSdkVersion: 33,
    overrideUserAgent: false,
    appendUserAgent: 'AI Doctor Notes/1.0.0',
    permissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE"
    ]
  }
};

export default config;
