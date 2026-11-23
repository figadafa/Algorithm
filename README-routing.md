# Routing — E-Learning Mobile App

Dokumentasi struktur routing yang dibuat menggunakan [Expo Router](https://docs.expo.dev/router/introduction) (file-based routing).

## Struktur File

```
src/
├── app/
│   ├── _layout.tsx        # Root layout: provider + route guard + BottomNav global
│   ├── (auth)/            # Grup route publik — nama grup TIDAK muncul di URL
│   │   ├── login.tsx      # "/login"            → Masuk / daftar
│   │   └── supabase-health.tsx # "/supabase-health" → Cek koneksi & sesi Supabase
│   └── (app)/             # Grup route terlindungi — nama grup TIDAK muncul di URL
│       ├── index.tsx      # "/"                → Home
│       ├── learn.tsx      # "/learn"           → Learn (welcome)
│       ├── achievement.tsx # "/achievement"    → Achievement (welcome)
│       ├── profile.tsx     # "/profile"        → Profile & Sign Out
│       ├── helpdemo.tsx    # "/helpdemo"       → Help demo
│       └── course/
│           └── [id].tsx   # "/course/:id"      → Detail course (dinamis)
├── components/
│   ├── BottomNav.tsx      # Navigasi bawah (router.push + highlight via usePathname)
│   └── CourseCard.tsx     # Card course, punya props opsional onPress
├── context/
│   ├── AuthContext.tsx    # user/session/loading dari Supabase Auth
│   ├── LearningProgressContext.tsx # Streak & daily goal per akun
│   └── ThemeContext.tsx   # Tema terang/gelap
├── storage/
│   └── streakStorage.ts   # Penyimpanan streak dengan kunci per userId
└── data/
    ├── navItems.ts        # Data item navigasi (label, icon)
    └── learningPaths.ts   # Data learning path yang dipakai halaman home & detail
```

Folder `(auth)` dan `(app)` adalah **route group**: hanya untuk mengelompokkan file, tidak menambah segmen URL. Karena itu `BottomNav` tetap memakai `/`, `/learn`, `/achievement`, `/profile`, dan `/helpdemo`.

## Daftar Route

| Route             | File                                   | Keterangan                                    | Akses |
| ----------------- | -------------------------------------- | --------------------------------------------- | ----- |
| `/login`          | `src/app/(auth)/login.tsx`             | Masuk / daftar akun                           | Publik |
| `/supabase-health` | `src/app/(auth)/supabase-health.tsx`  | Cek koneksi Supabase & sesi                   | Publik |
| `/`               | `src/app/(app)/index.tsx`              | Beranda: streak, daily goal, daftar course    | Login |
| `/learn`          | `src/app/(app)/learn.tsx`              | Halaman welcome Learn                         | Login |
| `/achievement`    | `src/app/(app)/achievement.tsx`        | Halaman welcome Achievement                   | Login |
| `/profile`        | `src/app/(app)/profile.tsx`            | Profile, info akun & Sign Out                 | Login |
| `/helpdemo`       | `src/app/(app)/helpdemo.tsx`           | Help demo                                     | Login |
| `/course/[id]`    | `src/app/(app)/course/[id].tsx`        | Detail course berdasarkan `id` param          | Login |

## Root Layout (`src/app/_layout.tsx`)

Seluruh aplikasi dibungkus oleh (urutan penting):

1. **`SafeAreaProvider`** — menyediakan `useSafeAreaInsets()` untuk semua screen.
2. **`ThemeProvider`** — menyediakan `useTheme()` (`colors`, `darkMode`, `toggleTheme`) untuk semua screen.
3. **`AuthProvider`** — memulihkan sesi Supabase via `getSession()` dan mendengarkan `onAuthStateChange()`.
4. **`LearningProgressProvider`** — streak & daily goal, datanya diambil per `user.id`.
5. **`RootLayoutContent`** — `useAuth()` + `useSegments()` + `useRouter()` untuk route guard.

Aturan guard di `RootLayoutContent`:

- Saat `loading`, belum redirect dan menampilkan overlay `ActivityIndicator` di atas `<Stack>`.
- Tanpa user di luar grup `(auth)` → `router.replace("/login")`.
- Dengan user di dalam grup `(auth)` → `router.replace("/")`.
- Logout membuat `user` jadi `null`, sehingga aturan kedua otomatis mengunci halaman terproteksi.

`<Stack>` **selalu dirender** (tidak diganti spinner) agar Expo Router tidak error "navigate before mounting the Root Layout". Overlay hanya ditaruh di atasnya saat loading/redirect. `BottomNav` hanya tampil saat sudah login, tidak loading, dan tidak berada di grup `(auth)`.

Karena provider ada di root layout, screen tidak perlu lagi membungkus dengan `ThemeProvider` atau `AuthProvider` sendiri.

## Bottom Nav (`src/components/BottomNav.tsx`)

- Navigasi dilakukan **di dalam komponen** memakai `router.push()` dari `expo-router`.
- Highlight item aktif ditentukan oleh `usePathname()` (pathname saat ini).

Pemetaan label → route:

```ts
const routeByLabel: Record<string, Href> = {
  Home: "/",
  Learn: "/learn",
  Achievement: "/achievement",
  Profile: "/profile",
  help: "/helpdemo",
};
```

Catatan: saat berada di halaman detail course (`/course/1`, dst.), item **Home** tetap ditandai aktif.

Props BottomNav hanya `bottomInset` (dari `useSafeAreaInsets().bottom` di root layout) untuk menghitung padding aman di perangkat dengan gesture bar.

## Navigasi ke Detail Course

`CourseCard` menerima props opsional `onPress`. Di `index.tsx`:

```tsx
const handleCoursePress = (id: number) => {
  router.push({ pathname: "/course/[id]", params: { id: String(id) } });
};

<CourseCard learningPath={path} onPress={() => handleCoursePress(path.id)} />
```

Di `src/app/(app)/course/[id].tsx`, param dibaca dan dicocokkan dengan data:

```tsx
const { id } = useLocalSearchParams<{ id: string }>();
const course = learningPaths.find((path) => path.id === Number(id));
```

Jika `id` tidak ditemukan, layar menampilkan state "Course not found". Tombol **Back** memakai `router.back()`.

> `experiments.typedRoutes: true` di `app.json` membuat path route (mis. `/course/[id]`) ter-check oleh TypeScript saat types di-generate.

## Menambah Route Baru

1. Buat file baru di grup yang sesuai: `src/app/(app)/settings.tsx` untuk halaman terlindungi → route `/settings`, atau `src/app/(auth)/...` untuk halaman publik seperti `/login`.
2. Untuk route dinamis, buat folder + `[param].tsx`, mis. `src/app/(app)/topic/[slug].tsx`. Setelah itu jalankan `npx expo start -c` sebentar agar typed routes ter-generate ulang.
3. Jika ingin muncul di bottom nav, tambahkan item di `src/data/navItems.ts` **dan** pemetaan label → route di `routeByLabel` (`src/components/BottomNav.tsx`).
4. Gunakan `useTheme()` + `globalStyles` + `BORDER_RADIUS` agar konsisten dengan screen lain, dan beri `paddingBottom: 90` pada konten scroll agar tidak tertutup BottomNav.

## Menjalankan

```bash
npm install
npx expo start
```
