import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { loginUser, registerUser, validateCredentials } from "@/lib/auth";

type MessageType = "error" | "info";

export default function LoginScreen() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callsign, setCallsign] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("error");

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (loading) return;

    setMessage("");

    const validationError = validateCredentials(
      { email, password, callsign },
      isRegistering,
    );
    if (validationError) {
      setMessageType("error");
      setMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = isRegistering
        ? await registerUser({ email, password, callsign })
        : await loginUser({ email, password });

      if (!result.ok) {
        setMessageType("error");
        setMessage(result.message ?? "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      if (result.needsEmailConfirmation) {
        setMessageType("info");
        setMessage(
          result.message ?? "Pendaftaran berhasil. Cek email untuk verifikasi.",
        );
        return;
      }

      // Tidak ada router.push di sini: route guard yang akan memindahkan halaman
      // setelah sesi berubah.
      setMessageType("info");
      setMessage(isRegistering ? "Pendaftaran berhasil." : "Login berhasil.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi.",
      );
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering((current) => !current);
    setMessage("");
    setMessageType("error");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.primary }]}>
            {isRegistering ? "Daftar Akun" : "Masuk"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            {isRegistering
              ? "Buat akun untuk mulai belajar."
              : "Selamat datang kembali."}
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="nama@email.com"
            placeholderTextColor={colors.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Minimal 6 karakter"
            placeholderTextColor={colors.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          {isRegistering ? (
            <View>
              <Text style={[styles.label, { color: colors.text }]}>
                Nama Panggilan
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Nama panggilanmu"
                placeholderTextColor={colors.secondary}
                value={callsign}
                onChangeText={setCallsign}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
          ) : null}

          {message ? (
            <Text
              style={[
                styles.message,
                {
                  color:
                    messageType === "error" ? colors.notification : colors.primary,
                },
              ]}
            >
              {message}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: loading }}
            onPress={handleSubmit}
            disabled={loading}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.tint} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.tint }]}>
                {isRegistering ? "Daftar" : "Masuk"}
              </Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={toggleMode}
            disabled={loading}
            style={styles.toggle}
          >
            <Text style={[styles.toggleText, { color: colors.primary }]}>
              {isRegistering
                ? "Sudah punya akun? Masuk di sini"
                : "Belum punya akun? Daftar di sini"}
            </Text>
          </Pressable>

          <Link href="/supabase-health" style={styles.healthLink}>
            <Text style={[styles.healthLinkText, { color: colors.secondary }]}>
              Cek koneksi server
            </Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  button: {
    borderRadius: BORDER_RADIUS,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  toggle: {
    marginTop: 18,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 13,
  },
  healthLink: {
    marginTop: 24,
    alignItems: "center",
  },
  healthLinkText: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
