import { Platform } from 'react-native';

// Android emulator routes 10.0.2.2 → host machine's localhost.
// iOS simulator and web both reach the host machine via localhost directly.
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

/**
 * Base URL for all API requests.
 * Override at build time via EXPO_PUBLIC_API_URL in your .env file, e.g.:
 *   EXPO_PUBLIC_API_URL=http://192.168.1.42:8000/api
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${DEV_HOST}:8000/api`;
