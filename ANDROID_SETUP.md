
# Android Setup Instructions

Follow these steps to set up your Android app after exporting from Lovable:

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

7. **Android Studio Configuration**:
   - Wait for Gradle sync to complete
   - Configure any Android-specific settings
   - Update the application's icon if desired (in `android/app/src/main/res/`)
   - Verify permissions in the AndroidManifest.xml file

8. **Run the app**:
   - Connect an Android device via USB or set up an emulator
   - Click the "Run" button in Android Studio to build and run the app

## Troubleshooting

- If you encounter build errors, make sure all dependencies are properly installed.
- For live reload during development, use the server URL configuration in the `capacitor.config.ts` file.
- For release builds, remove the server URL configuration.

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Guide](https://developer.android.com/studio/intro)
