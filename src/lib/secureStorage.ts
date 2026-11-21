import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Gagal mengambil item dari secure storage untuk kunci ${key}:`, error);
    return null;
  }
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Gagal menyimpan item ke secure storage untuk kunci ${key}:`, error);
    throw new Error(`Gagal menyimpan item untuk kunci ${key}`);
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Gagal menghapus item dari secure storage untuk kunci ${key}:`, error);
    throw new Error(`Gagal menghapus item untuk kunci ${key}`);
  }
}
