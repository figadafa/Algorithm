# Routing — E-Learning Mobile App

Dokumentasi struktur routing yang dibuat menggunakan [Expo Router](https://docs.expo.dev/router/introduction) (file-based routing).

## Struktur File

```
src/
├── app/
│   ├── _layout.tsx        # Root layout: ThemeProvider + SafeAreaProvider + BottomNav global
│   ├── index.tsx          # "/"                → Home
│   ├── learn.tsx          # "/learn"           → Learn (welcome)
│   ├── achievement.tsx    # "/achievement"     → Achievement (welcome)
│   ├── profile.tsx        # "/profile"         → Profile (welcome)
│   └── course/
│       └── [id].tsx       # "/course/:id"      → Detail course (dinamis)
├── components/
│   ├── BottomNav.tsx      # Navigasi bawah global (router.push + highlight via usePathname)
│   └── CourseCard.tsx     # Card course, punya props opsional onPress
└── data/
    ├── navItems.ts        # Data item navigasi (label, icon)
    └── learningPaths.ts   # Data learning path yang dipakai halaman home & detail
```

## Daftar Route

| Route             | File                  | Keterangan                                  |
| ----------------- | --------------------- | ------------------------------------------- |
| `/`               | `src/app/index.tsx`   | Beranda: streak, daily goal, daftar course  |
| `/learn`          | `src/app/learn.tsx`   | Halaman welcome Learn                       |
| `/achievement`    | `src/app/achievement.tsx` | Halaman welcome Achievement             |
| `/profile`        | `src/app/profile.tsx` | Halaman welcome Profile                     |
| `/course/[id]`    | `src/app/course/[id].tsx` | Detail course berdasarkan `id` param     |

## Root Layout (`src/app/_layout.tsx`)

Seluruh aplikasi dibungkus oleh:

1. **`SafeAreaProvider`** — menyediakan `useSafeAreaInsets()` untuk semua screen.
2. **`ThemeProvider`** — menyediakan `useTheme()` (`colors`, `darkMode`, `toggleTheme`) untuk semua screen.
3. **`Stack`** dengan `headerShown: false` — navigasi antar screen tanpa header bawaan.
4. **`BottomNav`** — dirender **global** (sekali, bukan per-screen), posisi `absolute` di bawah.

Karena provider ada di root layout, `index.tsx` dan screen lain tidak perlu lagi membungkus dengan `ThemeProvider` sendiri.

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

Di `src/app/course/[id].tsx`, param dibaca dan dicocokkan dengan data:

```tsx
const { id } = useLocalSearchParams<{ id: string }>();
const course = learningPaths.find((path) => path.id === Number(id));
```

Jika `id` tidak ditemukan, layar menampilkan state "Course not found". Tombol **Back** memakai `router.back()`.

> `experiments.typedRoutes: true` di `app.json` membuat path route (mis. `/course/[id]`) ter-check oleh TypeScript saat types di-generate.

## Menambah Route Baru

1. Buat file baru di `src/app/`, mis. `src/app/settings.tsx` → route `/settings`.
2. Untuk route dinamis, buat folder + `[param].tsx`, mis. `src/app/topic/[slug].tsx`.
3. Jika ingin muncul di bottom nav, tambahkan item di `src/data/navItems.ts` **dan** pemetaan label → route di `routeByLabel` (`src/components/BottomNav.tsx`).
4. Gunakan `useTheme()` + `globalStyles` + `BORDER_RADIUS` agar konsisten dengan screen lain, dan beri `paddingBottom: 90` pada konten scroll agar tidak tertutup BottomNav.

## Menjalankan

```bash
npm install
npx expo start
```
