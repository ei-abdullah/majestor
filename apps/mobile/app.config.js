export default {
  expo: {
    name: 'Majestor',
    slug: 'majestor-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      bundler: 'metro',
    },
    extra: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
    },
  },
};
