import { supabase } from './supabase';

export interface AuthResult {
  ok: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
}

export function validateCredentials(input: { email: string; password: string; callsign?: string }, isRegistering: boolean): string | null {
  const { email, password, callsign } = input;

  if (!email || !password) {
    return 'Email dan password wajib diisi.';
  }

  if (password.length < 6) {
    return 'Password minimal 6 karakter.';
  }

  if (isRegistering && (!callsign || callsign.trim().length < 3)) {
    return 'Nama panggilan minimal 3 karakter.';
  }

  return null;
}

export async function registerUser({ email, password, callsign }: { email: string; password: string; callsign?: string }): Promise<AuthResult> {
  try {
    const trimmedEmail = email.trim();
    const trimmedCallsign = callsign?.trim();

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

    if (error) {
      return { ok: false, message: error.message };
    }

    if (data.session) {
      return { ok: true };
    } else {
      return { ok: true, message: "Pendaftaran berhasil, cek email untuk verifikasi", needsEmailConfirmation: true };
    }
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

export async function loginUser({ email, password }: { email: string; password: string }): Promise<AuthResult> {
  try {
    const trimmedEmail = email.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        return { ok: false, message: "Kredensial login tidak valid" };
      }
      return { ok: false, message: error.message };
    }

    return { ok: true };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

export async function logoutUser(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Berhasil logout" };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}
