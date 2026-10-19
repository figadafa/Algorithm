
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { StyleSheet } from 'react-native';

// Definisi interface untuk warna terang dan gelap
interface Colors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  tint: string;
  cardBackground: string;
  border: string;
  notification: string;
  // Tambahkan warna lain jika diperlukan
}

// Palet warna terang
const lightColors: Colors = {
  primary: '#162A47', // Biru
  secondary: '#6c757d', // Abu-abu
  background: '#f8f9fa', // Putih terang
  text: '#212529', // Hitam gelap
  tint: '#ffffff', // Putih
  cardBackground: '#ffffff',
  border: '#dee2e6',
  notification: '#dc3545',
};

// Palet warna gelap
const darkColors: Colors = {
  primary: '#007bff', // Biru (bisa disesuaikan untuk dark mode)
  secondary: '#6c757d', // Abu-abu
  background: '#1a1a1a', // Hitam gelap
  text: '#f8f9fa', // Putih terang
  tint: '#212529', // Hitam
  cardBackground: '#333333',
  border: '#444444',
  notification: '#dc3545',
};

// Definisi interface untuk ThemeContext
interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  colors: Colors;
}

// Buat ThemeContext
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props untuk ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// Komponen ThemeProvider
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const colors = darkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook kustom untuk menggunakan tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export BORDER_RADIUS agar tetap tersedia
export const BORDER_RADIUS = 12;

