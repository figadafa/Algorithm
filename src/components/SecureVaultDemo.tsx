import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Platform, StyleSheet, ScrollView } from 'react-native';
import { saveAuthToken, getAuthToken, deleteAuthToken } from '@/lib/secureStorage';
import { useTheme } from '@/context/ThemeContext';


const SecureVaultDemo: React.FC = () => {
  const [tokenInput, setTokenInput] = useState<string>('');
  const [vaultValue, setVaultValue] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { colors } = useTheme();

  const platformLabel = Platform.OS === 'web' ? 'Web Browser (localStorage)' : `${Platform.OS === 'ios' ? 'iOS' : 'Android'} (SecureStore)`;

  const handleSaveToken = async () => {
    if (!tokenInput.trim()) {
      setStatusMessage('Token tidak boleh kosong.');
      return;
    }
    setLoading(true);
    setStatusMessage('');
    try {
      await saveAuthToken(tokenInput);
      setStatusMessage('Token berhasil disimpan!');
      setTokenInput(''); // Bersihkan input setelah disimpan
    } catch (error: any) {
      setStatusMessage(`Gagal menyimpan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadToken = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const token = await getAuthToken();
      setVaultValue(token);
      setStatusMessage(token ? 'Token berhasil dimuat!' : 'Tidak ada token ditemukan.');
    } catch (error: any) {
      setStatusMessage(`Gagal memuat: ${error.message}`);
      setVaultValue(null);
    } finally {
      setLoading(false);
    }
  };

  const handleWipeToken = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      await deleteAuthToken();
      setVaultValue(null);
      setStatusMessage('Token berhasil dihapus!');
      setTokenInput(''); // Bersihkan input
    } catch (error: any) {
      setStatusMessage(`Gagal menghapus: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      color: colors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    status: {
      marginBottom: 10,
      color: colors.text,
    },
    vaultPanel: {
      marginTop: 20,
      padding: 15,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 5,
      backgroundColor: colors.cardBackground,
    },
    vaultTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.primary,
    },
    vaultText: {
      color: colors.text,
    },
    platformLabel: {
      marginTop: 20,
      fontSize: 12,
      color: colors.secondary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Secure Vault Demo</Text>

      <TextInput
        style={styles.input}
        placeholder="Masukkan Token Lisensi..."
        placeholderTextColor={colors.secondary}
        value={tokenInput}
        onChangeText={setTokenInput}
        editable={!loading}
      />

      <View style={styles.buttonContainer}>
        <Button title={loading ? "Menyimpan..." : "Save Token"} onPress={handleSaveToken} disabled={loading} />
        <Button title={loading ? "Memuat..." : "Load Token"} onPress={handleLoadToken} disabled={loading} />
        <Button title={loading ? "Menghapus..." : "Wipe Token"} onPress={handleWipeToken} disabled={loading} />
      </View>

      {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}

      {vaultValue !== null && (
        <View style={styles.vaultPanel}>
          <Text style={styles.vaultTitle}>VAULT VALUE</Text>
          <Text style={styles.vaultText}>{vaultValue || ''}</Text>
        </View>
      )}

      <Text style={styles.platformLabel}>Platform: {platformLabel}</Text>
      {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />}
    </ScrollView>
  );
};

export default SecureVaultDemo;
