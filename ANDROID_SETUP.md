
# Android Setup Instructions

Follow these steps to set up your Android app for production release:

## Development Setup

1. **Export your project to GitHub** using the "Export to GitHub" button in the Lovable interface

2. **Clone your GitHub repository** to your local machine:
   ```bash
   git clone <your-github-repo-url>
   cd <your-project-directory>
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build your web application**:
   ```bash
   npm run build
   ```

5. **Sync with Capacitor Android platform**:
   ```bash
   npx cap sync android
   ```

6. **Open the Android project in Android Studio**:
   ```bash
   npx cap open android
   ```

## Production Release Preparation

### 1. Create a Keystore for Signing

```bash
keytool -genkey -v -keystore convohealth.keystore -alias convohealth -keyalg RSA -keysize 2048 -validity 10000
```

Follow the prompts to create a secure keystore. **Remember your passwords!**

### 2. Set Environment Variables for Build

Set these environment variables in your build system:
- KEYSTORE_PASSWORD: The password you set for the keystore
- ALIAS_PASSWORD: The password for the alias

### 3. Update App Icons and Splash Screen

Replace placeholder icons in:
- `android/app/src/main/res/mipmap-*` 
- `android/app/src/main/res/drawable-*`

### 4. Create Privacy Policy

Create a privacy policy and host it at the URL specified in strings.xml

### 5. Build Release APK/Bundle

In Android Studio:
1. Select `Build > Generate Signed Bundle / APK`
2. Choose `Android App Bundle` or `APK` based on your needs
3. Fill in the keystore information (path, passwords)
4. Select release build variant
5. Complete the build process

### 6. Test on Real Devices

Test your app on multiple Android devices with different screen sizes and Android versions before submission.

### 7. Play Store Submission

1. Create a Google Play Developer account
2. Create a new application in the Google Play Console
3. Fill in all required information (descriptions, screenshots, etc.)
4. Upload your signed AAB/APK
5. Complete the store listing and submit for review

## Troubleshooting

- If you encounter build errors, check the Gradle logs in Android Studio
- For plugin-related issues, run `npx cap doctor` to verify your setup
- For permissions issues, verify AndroidManifest.xml has all required permissions

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs/android)
- [Google Play Publishing](https://developer.android.com/distribute/best-practices/launch)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
