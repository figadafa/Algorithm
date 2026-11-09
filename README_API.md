# Integrasi API Materi Pembelajaran

Dokumen ini menjelaskan integrasi API eksternal untuk menampilkan materi
pembelajaran berdasarkan kategori pada aplikasi.

## API yang digunakan

Endpoint:

```text
https://algorithm-api-ten.vercel.app/api/data
```

API mengembalikan objek dengan informasi status, jumlah materi, dan daftar
materi. Setiap materi memiliki `id`, `kategori`, `judul`, dan `url`. Kategori
yang digunakan aplikasi adalah `RPL`, `Game`, `Data`, dan `Network`.

## Perubahan yang ditambahkan

- `src/api/learningMaterials.ts` mendefinisikan interface `LearningMaterial`
  dan fungsi async `fetchLearningMaterials()` untuk mengambil serta memvalidasi
  data dari API.
- `src/hooks/useLearningMaterials.ts` menyediakan hook untuk memuat data secara
  async dan menyimpan status loading, error, serta aksi untuk mencoba kembali.
- `src/components/LearningMaterialsList.tsx` menampilkan daftar materi dan
  menangani tampilan loading, error, materi kosong, serta tombol coba lagi.
- `src/app/learn.tsx` menampilkan tab kategori. Materi yang terlihat disaring
  berdasarkan kategori tab yang dipilih.
- `src/app/course/[id].tsx` menampilkan daftar materi untuk kategori jalur
  belajar yang dibuka.

## Kesesuaian dengan screenshot

### Mengambil data External API dan memasukkannya ke Object menggunakan Interface — 10%

Implementasi ini ada di `src/api/learningMaterials.ts`:

- `LearningMaterial` mendefinisikan bentuk objek tiap materi dengan properti
  bertipe.
- `fetchLearningMaterials()` mengambil JSON dari endpoint eksternal dan
  memeriksa bentuk respons sebelum mengembalikan daftar materi.
- Data respons digunakan sebagai object `LearningMaterial` dan kemudian
  dikelompokkan di tampilan berdasarkan nilai `kategori`.

### Menggunakan Custom & Pre-built Async Function — 10%

Implementasi ini menggunakan keduanya:

- **Pre-built async function:** `fetch()` bawaan JavaScript digunakan untuk
  melakukan request HTTP, dan `response.json()` digunakan untuk membaca JSON.
- **Custom async function:** `fetchLearningMaterials()` adalah fungsi async
  buatan aplikasi yang memanggil `fetch()`, memeriksa respons, dan mengembalikan
  data bertipe `LearningMaterial[]`.
- Hook `useLearningMaterials()` memanggil fungsi tersebut secara async saat
  layar membutuhkan data.

## Alur data per kategori

1. Halaman Learn meminta seluruh materi melalui `useLearningMaterials()`.
2. Tab kategori dipilih oleh pengguna.
3. Daftar materi difilter dengan mencocokkan `material.kategori` terhadap
   kategori tab yang aktif.
4. Halaman detail course menggunakan kategori jalur belajar yang sama untuk
   menampilkan daftar materi terkait.

Jika request gagal, aplikasi menampilkan pesan error dan tombol **Coba lagi**.
