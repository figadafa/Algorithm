import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SecureVaultDemo from '@/components/SecureVaultDemo';
import { useTheme } from '@/context/ThemeContext';

const VaultDemoScreen: React.FC = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Menggunakan warna background dari tema
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <SecureVaultDemo />
    </SafeAreaView>
  );
};

export default VaultDemoScreen;
