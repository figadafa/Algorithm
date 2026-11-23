# Modul 4 — Auth, Route Guard & Streak per Akun (Akbar)

Dokumen ini merangkum perubahan yang dikerjakan pada branch `akbar` untuk Modul 4.
Tidak ada push, tidak ada perubahan `.env`, tidak ada backend baru, dan tidak ada
paket yang di-upgrade. Dependensi yang sudah tercantum di `package.json`/
`package-lock.json` disinkronkan dengan `npm ci` supaya `tsc`/`lint` bisa berjalan.

## Ringkasan

- Sesi Supabase dipulihkan saat mount dan dipantau lewat `onAuthStateChange`.
- Halaman dibagi menjadi dua route group: `(auth)` (publik) dan `(app)` (terlindungi).
  Nama group tidak muncul di URL, jadi semua path lama tetap valid.
- Login/daftar memakai kontrak `@/lib/auth`; perpindahan halaman sepenuhnya
  ditangani route guard, bukan tombol login.
- Sign Out memakai `logoutUser()`; logout langsung mengunci halaman terproteksi.
- Streak disimpan per `user.id`, dengan flag "sudah dimuat" agar tidak menimpa
  data akun baru dengan nilai default.

## File

### Dibuat

| File | Isi |
| --- | --- |
| `src/context/AuthContext.tsx` | `AuthProvider` + `useAuth()` (`user`, `session`, `loading`) |
| `src/app/(auth)/login.tsx` | UI login/daftar, validasi, pesan error/info, link health check |
| `MODUL-4-AKBAR.md` | Dokumen ini |

### Dipindah dengan `git mv` (isi tidak diubah)

| Sebelum | Sesudah |
| --- | --- |
| `src/app/index.tsx` | `src/app/(app)/index.tsx` |
| `src/app/learn.tsx` | `src/app/(app)/learn.tsx` |
| `src/app/achievement.tsx` | `src/app/(app)/achievement.tsx` |
| `src/app/profile.tsx` | `src/app/(app)/profile.tsx` |
| `src/app/helpdemo.tsx` | `src/app/(app)/helpdemo.tsx` |
| `src/app/course/` | `src/app/(app)/course/` |
| `src/app/supabase-health.tsx` | `src/app/(auth)/supabase-health.tsx` |

### Diubah

| File | Perubahan |
| --- | --- |
| `src/app/_layout.tsx` | Provider berurutan + route guard + overlay loading + BottomNav kondisional |
| `src/app/(app)/profile.tsx` | Info akun (callsign/email/role) + tombol Sign Out |
| `src/storage/streakStorage.ts` | Kunci storage menjadi `@daily_learning_streak:${userId}` dan `@last_learning_date:${userId}` |
| `src/context/LearningProgressContext.tsx` | Streak diambil per user, reset saat ganti/logout, flag data loaded |
| `README-routing.md` | Struktur group, daftar route, aturan guard, cara regenerate typed routes |
| `src/context/ThemeContext.tsx` | Housekeeping: hapus import `StyleSheet` yang unused |
| `src/hooks/useusers.ts` | Housekeeping: rename hook `useusers` → `useUsers` agar lint hijau |
| `src/api/users.ts` | Ikut di-commit agar working tree bersih (file pendukung hook tersebut) |

## Fungsi utama

### A. `AuthContext`

- `getSession()` dipanggil saat mount dengan `try/catch/finally`; `loading` menjadi
  `false` di `finally`, dan kegagalan dianggap belum login.
- `onAuthStateChange((event, session) => ...)` memperbarui `session` dan
  `user = session?.user ?? null`, serta `loading = false`. Callback sengaja
  synchronous (tanpa `await` ke fungsi Supabase lain).
- Subscription di-unsubscribe saat unmount; flag `active` mencegah update state
  setelah unmount / StrictMode cleanup.
- Value context dibungkus `useMemo`; `useAuth()` melempar error jika dipakai
  di luar `AuthProvider`.

### B. Struktur route

- `(app)` berisi halaman yang butuh login; `(auth)` berisi `login` dan
  `supabase-health` yang bisa dibuka sebelum login.
- URL tidak berubah: `/`, `/learn`, `/achievement`, `/profile`, `/helpdemo`,
  `/course/:id`, `/login`, `/supabase-health`.
- Typed routes di-generate ulang dua kali dengan `npx expo start -c` (setelah
  pemindahan route, dan setelah `login.tsx` dibuat).

### C. Login

- State: `email`, `password`, `callsign`, `isRegistering`, `loading`, `message`,
  `messageType`.
- Submit: abaikan saat loading → `validateCredentials` → `registerUser`/
  `loginUser` → tampilkan `result.message`; `needsEmailConfirmation` ditampilkan
  sebagai pesan info.
- Tombol berubah jadi `ActivityIndicator` dan disabled saat loading.
- Email memakai `keyboardType="email-address"`, `autoCapitalize="none"`,
  `autoCorrect={false}`; password memakai `secureTextEntry`.
- Field "Nama Panggilan" hanya muncul saat mode daftar; toggle antar mode tersedia.
- `KeyboardAvoidingView` + `ScrollView` + `SafeAreaView` dari
  `react-native-safe-area-context`; error memakai `colors.notification`, info
  memakai `colors.primary`.
- **Tidak ada `router.push()` setelah sukses.**

### D. Route guard

| Aturan | Kondisi | Aksi |
| --- | --- | --- |
| 1 | `loading === true` | Tidak redirect; tampilkan overlay |
| 2 | `!user && !inAuthGroup` | `router.replace("/login")` (termasuk setelah logout) |
| 3 | `user && inAuthGroup` | `router.replace("/")` |
| 4 | Logout → `user` jadi `null` | Aturan 2 mengunci halaman terproteksi |

- `<Stack>` selalu dirender; spinner tidak menggantikan `<Stack>`, melainkan
  overlay absolut berlatar `colors.background` di atasnya.
- `BottomNav` hanya tampil jika sudah login, `!loading`, dan bukan di grup `(auth)`.

### E. Profile

- Kartu "Your account" menampilkan `user.user_metadata.callsign`, `user.email`,
  dan `user.user_metadata.role`.
- Tombol **Sign Out** memanggil `logoutUser()`, disabled + `ActivityIndicator`
  saat proses, dan `Alert` jika `result.ok === false`.
- Toggle Dark Mode dan gaya lama tetap dipertahankan.

### F. Streak per akun

- `saveStreakData(userId, streak, lastLearningDate)` dan
  `loadStreakData(userId)` memakai kunci per akun.
- `LearningProgressProvider` mengambil `user` dari `useAuth()`. Snapshot milik
  user lain otomatis dianggap default; data user baru dimuat setelah itu.
- Flag `dataLoaded` + ref `loadedForUserId` mencegah efek save menulis nilai
  default sebelum data selesai dimuat.
- Jika `user === null`, storage tidak dibaca maupun ditulis.
- Logika perhitungan streak di `src/utils/streakCalculator.ts` tidak diubah.

## Verifikasi otomatis

| Perintah | Hasil |
| --- | --- |
| `npx tsc --noEmit` | ✅ Bersih |
| `npx expo lint` | ✅ 0 error (1 warning: `Platform` unused di `src/lib/supabase.ts`, file milik Figa yang tidak diubah) |
| `npx expo start -c` | ✅ Dijalankan sebentar dua kali lalu dihentikan untuk regenerate typed routes |

`git status` bersih; tidak ada file `.env` yang masuk commit.

## Commit

```
c4e064d fix(lint): rename useUsers hook and remove unused theme import
1b43fb9 feat(auth): add AuthContext with session restore and listener
def4b24 refactor(routing): group screens into (app) and (auth)
72a4204 feat(auth): add login and registration screen
83ce72f feat(auth): guard protected routes in root layout
e1e4264 feat(profile): show account details and sign out button
d399190 feat(streak): scope streak data per user account
```

## Yang perlu diuji manual

1. Cold start tanpa login → langsung masuk `/login`.
2. Daftar akun baru lalu login → langsung masuk Home tanpa navigasi manual.
3. Tutup Expo Go sepenuhnya lalu buka lagi → tetap login.
4. Sign Out di Profile → kembali ke `/login` dan halaman terproteksi terkunci.
5. Password salah → muncul pesan, tidak crash.
6. Dua akun berbeda → streak masing-masing terpisah.

## Catatan

- Bekerja di branch `akbar`; tidak ada `git push`.
- Dua stash yang sudah ada (`WIP on akbar`, `changes-before-reset-to-figa`)
  tidak disentuh.
- File Figa (`src/lib/supabase.ts`, `secureStorage.ts`, `auth.ts`,
  `learningTasks.ts`, `supabase/schema.sql`, `src/app/(auth)/supabase-health.tsx`)
  tidak diubah isinya.
