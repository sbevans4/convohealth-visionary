
# Firebase Integration for Android

After exporting your project to GitHub and initializing the Android platform, you'll need to make the following modifications to integrate Firebase:

## 1. Add Firebase SDK to Project-level build.gradle

Open `android/build.gradle` and add these lines:

```gradle
buildscript {
    repositories {
        google()  // Make sure this is here
        jcenter()
    }
    dependencies {
        // Add this line
        classpath 'com.google.gms:google-services:4.3.15'
    }
}

allprojects {
    repositories {
        google()  // Make sure this is here
        jcenter()
    }
}
```

## 2. Add Firebase SDK to App-level build.gradle

Open `android/app/build.gradle` and add these lines at the bottom of the file:

```gradle
apply plugin: 'com.android.application'
// Add this line below other apply plugin statements
apply plugin: 'com.google.gms.google-services'

dependencies {
    // Add Firebase BoM
    implementation platform('com.google.firebase:firebase-bom:32.0.0')
    
    // Add Analytics dependency
    implementation 'com.google.firebase:firebase-analytics'
    
    // Add any other Firebase services you need
}
```

## 3. Sync Gradle

After making these changes, click "Sync Now" in Android Studio.

## 4. Initialize Firebase in Your App

The `google-services.json` file has already been added to your project.
