import 'dotenv/config';

export default {
  "expo": {
    "name": "gig-fort",
    "slug": "gig-fort",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "gig-fort",
            "project": "Gig Fort",
            "authToken": "5260cba2f5e04458a0ce40cd85a842704535351dfbbc4a0785ff93fd00aaf0f5"
          }
        }
      ]
    },
    "splash": {
      "image": "./assets/splash_animation.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "supportsTablet": true,
      "bundleIdentifier": "android.package.gigfort"
    },
    "android": {
      "googleServicesFile": "./google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.gigfort"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["sentry-expo"] ,
    "extra": {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      "eas": {
        "projectId": "b4ab6325-8049-4f43-85bf-ac0c35b40684"
      }
    }
  }
}