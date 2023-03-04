import "dotenv/config";

export default {
  expo: {
    name: "Gig Fort",
    slug: "gig-fort",
    version: "1.0.0",
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
      bundleIdentifier: "org.name.gigfort",
      icon: "./assets/icon.png",
    },
    android: {
      googleServicesFile: "./google-services.json",
      icon: "./assets/icon.png",
      package: "com.gigfort",
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
