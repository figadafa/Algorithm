# Integrasi API Materi Pembelajaran

Dokumen ini menjelaskan integrasi API eksternal untuk menampilkan materi pembelajaran berdasarkan kategori pada aplikasi, lengkap dengan implementasi Promise sesuai rubrik Modul 3.

## API yang digunakan

Endpoint:

```text
https://algorithm-api-ten.vercel.app/api/data
```

API mengembalikan objek dengan informasi status, jumlah materi, dan daftar materi. Interface `LearningMaterial` digunakan untuk memetakan data sebagai berikut:

```typescript
export interface LearningMaterial {
  id: number;
  kategori: string;
  judul: string;
  url: string;
}
```

Kategori yang didukung adalah `RPL`, `Game`, `Data`, dan `Network`.

## Implementasi Promise (Modul 3)

Sesuai dengan ketentuan rubrik, aplikasi ini menggunakan implementasi `Promise` yang mencakup `new Promise`, `resolve`, `reject`, serta chaining `.then()`, `.catch()`, dan `.finally()`.

### 1. `new Promise()`, `resolve()`, dan `reject()`
Ditemukan di `src/api/learningMaterials.ts`. Fungsi `fetchLearningMaterials()` membungkus operasi `fetch` untuk memberikan kontrol penuh atas lifecycle request.

```typescript
export function fetchLearningMaterials(): Promise<LearningMaterial[]> {
  return new Promise((resolve, reject) => {
    fetch(LEARNING_MATERIALS_URL)
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`Gagal memuat materi (HTTP ${response.status}).`));
          return;
        }
        return response.json();
      })
      .then((payload: unknown) => {
        // ... validasi data ...
        resolve(result.data); // Sukses
      })
      .catch((error) => {
        // Handle error koneksi atau logika
        reject(error); // Gagal
      });
  });
}
```

### 2. `.then()`, `.catch()`, dan `.finally()`
Ditemukan di `src/hooks/useLearningMaterials.ts`. Hook ini mengonsumsi Promise dari API:

```typescript
fetchLearningMaterials()
  .then((result) => setMaterials(result)) // Menangani resolve
  .catch((loadError) => setError(loadError.message)) // Menangani reject
  .finally(() => setLoading(false)); // Eksekusi akhir
```

## Error Handling

Aplikasi menangani berbagai skenario error dengan pesan ramah pengguna:

- **Error Jaringan**: "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi."
- **Error HTTP/Validasi**: Pesan spesifik seperti "Gagal memuat materi (HTTP 404)" atau "Format respons API materi tidak valid."
- **Retry Mechanism**: Tombol "Coba lagi" memicu pemanggilan ulang fungsi fetch untuk memperbarui state.
- **Loading State**: `loading` state dipastikan selalu berakhir `false` melalui `.finally()`.

## Alur Data

1. `useLearningMaterials()` memicu `fetchLearningMaterials()` saat komponen pertama kali dimuat.
2. API dipanggil menggunakan `fetch()` (Pre-built Async Function).
3. Data diproses di dalam Promise `fetchLearningMaterials()` (Custom Async Function).
4. Hasil dikembalikan ke hook melalui `resolve` atau ditolak melalui `reject`.
5. Hook memperbarui state (`materials`, `error`, `loading`) melalui chain `.then/catch/finally`.
6. UI mendengarkan state dan menampilkan daftar materi yang sudah difilter berdasarkan kategori (`RPL`, `Game`, `Data`, `Network`).
