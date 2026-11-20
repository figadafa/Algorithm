import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { colors } = useTheme();
  const router = useRouter();

  const handleAuth = async () => {
    if (loading) return;

    const trimmedEmail = email.trim();
    const trimmedCallsign = callsign.trim();

    // Validasi input
    if (!trimmedEmail || !password) {
      setMessage('Email dan password wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password minimal 6 karakter.');
      return;
    }

    if (isRegistering && trimmedCallsign.length < 3) {
      setMessage('Nama panggilan minimal 3 karakter.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isRegistering) {
        // Proses Pendaftaran (REGISTER)
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              callsign: trimmedCallsign,
              role: "student",
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          router.replace("/");
        } else {
          setMessage("Pendaftaran berhasil, cek email untuk verifikasi");
        }
      } else {
        // Proses Masuk (LOGIN)
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Kredensial login tidak valid");
          }
          throw error;
        }

        router.replace("/");
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: colors.cardBackground,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    label: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: colors.tint,
      fontWeight: 'bold',
      fontSize: 16,
    },
    toggleText: {
      color: colors.primary,
      textAlign: 'center',
      marginTop: 20,
      fontSize: 14,
    },
    messageText: {
      color: colors.notification,
      textAlign: 'center',
      marginBottom: 15,
      fontSize: 14,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.title}>
              {isRegistering ? 'Daftar Akun' : 'Selamat Datang'}
            </Text>

            {message ? <Text style={styles.messageText}>{message}</Text> : null}

            {isRegistering && (
              <>
                <Text style={styles.label}>Nama Panggilan</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Figa"
                  placeholderTextColor={colors.secondary}
                  value={callsign}
                  onChangeText={setCallsign}
                  autoCapitalize="words"
                />
              </>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimal 6 karakter"
              placeholderTextColor={colors.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.tint} />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegistering ? 'Daftar Sekarang' : 'Masuk'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
              <Text style={styles.toggleText}>
                {isRegistering
                  ? 'Sudah punya akun? Masuk di sini'
                  : 'Belum punya akun? Daftar di sini'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
