import "dotenv/config";

export default {
  expo: {
    name: "Gig Fort",
    slug: "gig-fort",
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      googleServicesFile: "./GoogleService-Info.plist",
      supportsTablet: true,
      bundleIdentifier: "org.name.gigfortnz",
      icon: "./assets/icon.png",
      buildNumber: "2"
    },
    android: {
      googleServicesFile: "./google-services.json",
      icon: "./assets/icon.png",
      package: "com.gigfort",
      config: {
        googleMaps: {
          apiKey: "AIzaSyD7q5ENGfNd9YM1nO6lRGG3CMOQMJHRc4Y"
        }
      },
      versionCode: 2
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      eas: {
        projectId: "b4ab6325-8049-4f43-85bf-ac0c35b40684",
      },
    },
  },
};
