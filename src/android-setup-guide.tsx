
import React from 'react';

const AndroidSetupGuide: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Android Setup Guide</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Building Your Android App</h2>
        
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>Export your project to GitHub</strong> using the "Export to GitHub" button in the Lovable interface
          </li>
          <li>
            <strong>Clone your GitHub repository</strong> to your local machine:
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
              git clone your-github-repo-url<br />
              cd your-project-directory
            </pre>
          </li>
          <li>
            <strong>Install dependencies</strong>:
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
              npm install
            </pre>
          </li>
          <li>
            <strong>Add Android platform</strong>:
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
              npx cap add android
            </pre>
          </li>
          <li>
            <strong>Build your web application</strong>:
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
              npm run build
            </pre>
          </li>
          <li>
            <strong>Sync with Capacitor</strong>:
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
              npx cap sync android
            </pre>
          </li>
          <li>
            <strong>Open in Android Studio</strong>:
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
              npx cap open android
            </pre>
          </li>
        </ol>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Creating a Keystore for App Signing</h2>
        
        <p className="mb-4">You'll need to create a keystore to sign your app for distribution:</p>
        
        <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
          keytool -genkey -v -keystore aidentalnotes.keystore -alias aidentalnotes -keyalg RSA -keysize 2048 -validity 10000
        </pre>
        
        <p className="mt-4">Store your keystore password securely. You'll need to set environment variables for your build:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>KEYSTORE_PASSWORD: Your keystore password</li>
          <li>ALIAS_PASSWORD: Your alias password</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Publishing to Google Play</h2>
        
        <ol className="list-decimal pl-6 space-y-3">
          <li>Create a <a href="https://play.google.com/console/signup" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Play Developer account</a> ($25 one-time fee)</li>
          <li>Create a new application in the Google Play Console</li>
          <li>Fill in all required store listing information</li>
          <li>Upload your signed APK or App Bundle</li>
          <li>Complete the content rating questionnaire</li>
          <li>Set up pricing and distribution options</li>
          <li>Submit for review</li>
        </ol>
        
        <p className="mt-4 italic">For more detailed instructions, see the ANDROID_SETUP.md file in your project.</p>
      </div>
    </div>
  );
};

export default AndroidSetupGuide;
