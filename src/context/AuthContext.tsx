import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Flag lokal untuk effect ini: mencegah setState setelah unmount / StrictMode cleanup.
    let active = true;

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      // Callback sengaja synchronous: tidak ada await ke fungsi supabase lain di sini.
      setSession(nextSession);
      setLoading(false);
    });

    const restoreSession = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) {
          setSession(null);
          return;
        }
        setSession(sessionData.session ?? null);
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void restoreSession();

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading }),
    [user, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
