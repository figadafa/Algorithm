import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Kunci untuk menyimpan token otentikasi
export const TOKEN_KEY = "elearning_user_token";

/**
 * Menyimpan token otentikasi secara aman.
 * Menggunakan SecureStore untuk native dan localStorage untuk web.
 * @param token Token yang akan disimpan
 */
export async function saveAuthToken(token: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error("Gagal menyimpan token:", error);
    throw new Error("Gagal menyimpan token");
  }
}

/**
 * Mengambil token otentikasi yang tersimpan.
 * Menggunakan SecureStore untuk native dan localStorage untuk web.
 * @returns Token yang tersimpan atau null jika tidak ada
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Gagal mengambil token:", error);
    throw new Error("Gagal mengambil token");
  }
}

/**
 * Menghapus token otentikasi yang tersimpan.
 * Menggunakan SecureStore untuk native dan localStorage untuk web.
 */
export async function deleteAuthToken(): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Gagal menghapus token:", error);
    throw new Error("Gagal menghapus token");
  }
}
