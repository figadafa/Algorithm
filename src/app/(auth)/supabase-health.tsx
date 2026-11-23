import React, { useState, useEffect } from 'react';
import { Text, Button, ActivityIndicator, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

const SupabaseHealthScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState<boolean>(false);
  const { colors } = useTheme();

  const checkSession = async () => {
    setCheckingSession(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSessionEmail(data.session?.user?.email || null);
    } catch (error) {
      console.error('Error checking session:', error);
      setSessionEmail(null);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    // Wrap in IIFE to avoid direct call if it warns, but this is the standard pattern
    (async () => {
      await checkSession();
    })();
  }, []);

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

  const testCloudBridge = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      // Mencoba mengambil data dari tabel learning_tasks
      const { error } = await supabase.from("learning_tasks").select("id").limit(1);

      if (error) {
        // Error code PGRST205 atau 42P01 menunjukkan tabel tidak ada
        if (error.code === "PGRST205" || error.code === "42P01") {
          setStatusMessage("Connected to Supabase! (tabel learning_tasks belum dibuat, jalankan supabase/schema.sql)");
        } else {
          setStatusMessage(`Database Error: ${error.message}`);
        }
      } else {
        setStatusMessage("Connected to Supabase!");
      }
    } catch (error: any) {
      setStatusMessage(`Network Error: ${error.message}`);
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
    urlText: {
      fontSize: 14,
      marginBottom: 10,
      color: colors.secondary,
    },
    panel: {
      backgroundColor: colors.cardBackground,
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    panelTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    statusText: {
      marginTop: 20,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    button: {
      marginTop: 20,
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: colors.tint,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Supabase Health Check</Text>
        <Text style={styles.urlText}>Target URL: {supabaseUrl ? supabaseUrl.replace("https://", "") : 'N/A'}</Text>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Session</Text>
          <Text style={{ color: colors.text, marginBottom: 10 }}>
            {checkingSession ? "Memeriksa..." : `User: ${sessionEmail || "Belum login"}`}
          </Text>
          <Button
            title="Cek Sesi"
            onPress={checkSession}
            disabled={checkingSession}
            color={colors.primary}
          />
        </View>

        <Button
          title={loading ? "Testing..." : "Test Cloud Bridge"}
          onPress={testCloudBridge}
          disabled={loading}
          color={colors.primary} // Atur warna tombol agar sesuai tema
        />

        {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />}
        {statusMessage ? <Text style={styles.statusText}>{statusMessage}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupabaseHealthScreen;
