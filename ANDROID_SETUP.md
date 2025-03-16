
# Android Setup and Publishing Guide

This guide provides detailed instructions for setting up, building, and publishing the ConvoHealth Visionary Android app.

## 1. Development Environment Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Android Studio](https://developer.android.com/studio)
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/javase-downloads.html) (version 11 or higher)

### Initial Project Setup

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

## 2. App Icon and Splash Screen Setup

### App Icons

1. **Create app icons** in the following sizes for different device densities:
   - mdpi: 48x48px
   - hdpi: 72x72px
   - xhdpi: 96x96px
   - xxhdpi: 144x144px
   - xxxhdpi: 192x192px
   - Play Store: 512x512px

2. **Use Android Studio Asset Studio**:
   - Right-click the `res` folder in Android Studio
   - Select "New > Image Asset"
   - Choose "Launcher Icons (Adaptive and Legacy)"
   - Upload your icon and configure settings
   - Click "Next" and "Finish"

### Splash Screen

1. **Create splash screen images** in multiple resolutions
2. **Place them in the appropriate drawable folders**
3. **Configure in `capacitor.config.ts` under the SplashScreen plugin section**

## 3. App Signing for Production

### Create a Keystore for Signing

```bash
keytool -genkey -v -keystore convohealth.keystore -alias convohealth -keyalg RSA -keysize 2048 -validity 10000
```

Follow the prompts to create a secure keystore. **Record your passwords securely!**

### Set Environment Variables for Build

Set these environment variables in your build system:
- `KEYSTORE_PASSWORD`: The password you set for the keystore
- `ALIAS_PASSWORD`: The password for the alias

For CI/CD systems, configure these as secure environment variables.

## 4. Publishing Requirements

### Create a Privacy Policy

1. Create a comprehensive privacy policy that covers:
   - Data collection practices
   - Permission usage explanation
   - Third-party services
   - User rights

2. Host it at a public URL (specified in strings.xml)

### Google Play Store Listing Assets

Prepare the following assets for your store listing:
- Short description (80 characters max)
- Full description (4000 characters max)
- Feature graphic (1024 x 500px)
- Promo graphic (180 x 120px)
- Screenshots (minimum 2):
  - Phone: 320-3840px width, 320-3840px height
  - 7-inch tablet: 320-3840px width, 320-3840px height
  - 10-inch tablet: 320-3840px width, 320-3840px height

## 5. Building for Release

### Using Android Studio

1. Select `Build > Generate Signed Bundle / APK`
2. Choose `Android App Bundle` (recommended) or `APK`
3. Fill in the keystore information (path, passwords)
4. Select release build variant
5. Complete the build process

### Using Command Line

```bash
# Set environment variables for keystore passwords
export KEYSTORE_PASSWORD=your_keystore_password
export ALIAS_PASSWORD=your_alias_password

# Build the web app
npm run build

# Sync with Android
npx cap sync android

# Build Android app (requires Gradle)
cd android
./gradlew bundleRelease  # For App Bundle
# OR
./gradlew assembleRelease  # For APK
```

The output will be in `android/app/build/outputs/`

## 6. Testing Before Submission

- Test on multiple physical devices with different screen sizes
- Verify all permissions work correctly
- Test in airplane mode and with poor connectivity
- Ensure the app meets all Play Store requirements

## 7. Google Play Store Submission

1. Create a [Google Play Developer account](https://play.google.com/console/signup) ($25 one-time fee)
2. Create a new application in the Google Play Console
3. Fill in all required information:
   - Store listing details
   - Content rating questionnaire
   - Pricing & distribution settings
   - Upload APK or App Bundle
4. Submit for review

## 8. Post-Launch Monitoring

- Set up Firebase Crashlytics for crash reporting
- Monitor user reviews and feedback
- Plan for regular updates to address issues

## Troubleshooting

- If you encounter build errors, check the Gradle logs in Android Studio
- For plugin-related issues, run `npx cap doctor` to verify your setup
- For permissions issues, verify AndroidManifest.xml has all required permissions

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs/android)
- [Google Play Publishing](https://developer.android.com/distribute/best-practices/launch)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Material Design Guidelines](https://material.io/design)
