# E-Learning App — Modul 3 Pemrograman Mobile

Aplikasi E-Learning berbasis React Native Expo yang mengimplementasikan fitur Daily Learning Streak dan Integrasi API Pembelajaran sesuai dengan rubrik Modul 3.

## Fitur Utama

1.  **Dashboard Pembelajaran**: Menampilkan progress belajar, target harian, dan materi terbaru.
2.  **Daily Learning Streak**: Sistem penghitungan hari berturut-turut pengguna menyelesaikan sesi belajar.
3.  **Integrasi External API**: Mengambil materi pembelajaran secara dinamis dari API eksternal.
4.  **Kategori Pembelajaran**: Filter materi berdasarkan kategori (RPL, Game, Data, Network).

## Implementasi API (Modul 3)

Berdasarkan rubrik Modul 3, aplikasi ini mengimplementasikan:

### 1. External API & Interface
Aplikasi mengambil data dari endpoint:
`https://algorithm-api-ten.vercel.app/api/data`

Data dipetakan menggunakan Interface TypeScript untuk memastikan konsistensi tipe data:

```typescript
export interface LearningMaterial {
  id: number;
  kategori: string;
  judul: string;
  url: string;
}
```

### 2. Asynchronous Operation (Promise)
Implementasi menggunakan gabungan Custom Async Function dan metode Promise (`.then`, `resolve`, `reject`).

#### Contoh `new Promise`, `resolve()`, dan `reject()`:
Ditemukan di `src/api/learningMaterials.ts`. Fungsi `fetchLearningMaterials` membungkus operasi fetch dalam sebuah Promise manual.

```typescript
export function fetchLearningMaterials(): Promise<LearningMaterial[]> {
  return new Promise((resolve, reject) => {
    fetch(URL)
      .then(response => {
        if (!response.ok) reject(new Error("Gagal fetch"));
        return response.json();
      })
      .then(data => resolve(data)) // Menggunakan resolve untuk sukses
      .catch(err => reject(err));  // Menggunakan reject untuk gagal
  });
}
```

#### Contoh `.then()`, `.catch()`, dan `.finally()`:
Ditemukan di `src/hooks/useLearningMaterials.ts`. Hook ini mengonsumsi Promise dari API dan memperbarui state UI.

```typescript
fetchLearningMaterials()
  .then((result) => {
    setMaterials(result); // Menangani hasil sukses
  })
  .catch((error) => {
    setError(error.message); // Menangani error
  })
  .finally(() => {
    setLoading(false); // Selesai loading
  });
```

## Struktur Proyek

- `src/api/`: Logika komunikasi dengan API eksternal.
- `src/app/`: Halaman aplikasi (Expo Router).
- `src/components/`: Komponen UI reusable.
- `src/context/`: State management (Learning Progress & Theme).
- `src/hooks/`: Custom hooks untuk logika bisnis (Fetching data).
- `src/storage/`: Logika penyimpanan data lokal (AsyncStorage).
- `src/utils/`: Fungsi pembantu (Streak calculation).

## Teknologi yang Digunakan

- React Native & Expo
- TypeScript
- Expo Router (File-based Routing)
- AsyncStorage (Persistensi Data)
- React Context API
