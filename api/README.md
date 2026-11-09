# ALGORITHM_api

REST API read-only sederhana untuk menyajikan data materi pembelajaran yang tersimpan di `data.json`. API ini dibangun dengan Node.js, JavaScript CommonJS, dan Vercel Serverless Functions, sehingga dapat langsung di-deploy ke Vercel tanpa Express, database, atau framework backend tambahan.

## Deskripsi Proyek

Repository ini berisi data hasil crawler dari Wikipedia untuk empat kategori materi:

| Kategori | Jumlah materi |
| --- | ---: |
| `RPL` | 5 |
| `Game` | 5 |
| `Data` | 4 |
| `Network` | 5 |
| **Total** | **19** |

Setiap objek pada `data.json` memiliki field asli berikut:

| Field | Tipe | Keterangan |
| --- | --- | --- |
| `id` | number | ID halaman Wikipedia |
| `kategori` | string | Kategori materi (`RPL`, `Game`, `Data`, atau `Network`) |
| `judul` | string | Judul materi |
| `url` | string | URL sumber materi |
| `materi` | string | Isi lengkap materi |

`crawler.py` dipertahankan sebagai program yang menghasilkan data tersebut. Isi `data.json` tidak diubah oleh API.

## Tujuan API

API ini bertujuan agar website, aplikasi mobile, atau aplikasi lain dapat mengambil data materi melalui HTTP request:

- Mengambil daftar materi dalam bentuk metadata yang ringan.
- Mengambil detail satu materi lengkap dengan isi `materi`.
- Memfilter materi berdasarkan ID dan/atau kategori.
- Menyediakan response JSON yang konsisten, CORS, dan HTTP status yang sesuai.

## Teknologi

- Node.js
- JavaScript CommonJS
- Vercel Serverless Functions
- `data.json` sebagai sumber data
- Tanpa dependency tambahan
- Tanpa Express.js, database, atau frontend

## Struktur Folder

```text
ALGORITHM_api/
├── api/
│   └── data.js       # Vercel Serverless Function untuk endpoint /api/data
├── data.json         # Sumber data asli (19 materi)
├── crawler.py        # Crawler data dari Wikipedia (dipertahankan)
├── package.json      # Metadata proyek dan script dev
├── .gitignore        # File/folder yang tidak perlu di-commit
└── README.md         # Dokumentasi proyek
```

Tidak ada `vercel.json` tambahan karena Vercel secara otomatis mengenali `api/data.js` sebagai Serverless Function dengan route `/api/data`. File `data.json` ikut ter-bundle karena di-`require` langsung dari function.

## Instalasi

Prasyarat:

- Node.js 18 atau lebih baru
- npm
- Akun Vercel (untuk deploy)

Clone repository, lalu masuk ke folder proyek:

```bash
git clone https://github.com/figadafa/ALGORITHM_api.git
cd ALGORITHM_api
```

Proyek ini tidak memiliki dependency runtime, jadi tidak ada paket yang perlu di-install untuk menjalankan kode API. Untuk menjalankan server lokal dengan Vercel CLI:

```bash
npm install -g vercel
```

Atau gunakan `npx` tanpa instalasi global:

```bash
npx vercel dev
```

## Menjalankan Server Lokal

Jalankan perintah berikut dari root proyek:

```bash
npm run dev
```

Script `dev` menjalankan `vercel dev`. Vercel CLI mungkin meminta login dan konfirmasi untuk menghubungkan folder dengan project Vercel. Setelah server berjalan, API biasanya tersedia di:

```text
http://localhost:3000/api/data
```

Contoh pengujian cepat:

```bash
curl "http://localhost:3000/api/data"
curl "http://localhost:3000/api/data?id=27010"
curl "http://localhost:3000/api/data?kategori=RPL"
```

Di PowerShell, gunakan `curl.exe` agar tidak memakai alias `curl` bawaan PowerShell:

```powershell
curl.exe "http://localhost:3000/api/data?id=27010"
```

## Endpoint

| Method | Endpoint | Fungsi | Status sukses |
| --- | --- | --- | --- |
| `GET` | `/api/data` | Mengambil daftar metadata seluruh materi | `200` |
| `GET` | `/api/data?id=27010` | Mengambil detail lengkap satu materi berdasarkan ID | `200` |
| `GET` | `/api/data?kategori=RPL` | Mengambil daftar metadata berdasarkan kategori | `200` |
| `GET` | `/api/data?id=27010&kategori=RPL` | Mengambil detail materi berdasarkan kombinasi ID dan kategori | `200` |
| `OPTIONS` | `/api/data` | Menangani preflight CORS | `204` |

Method selain `GET` dan `OPTIONS` akan menghasilkan HTTP `405`.

## Parameter Query

| Parameter | Wajib | Contoh | Keterangan |
| --- | --- | --- | --- |
| `id` | Tidak | `27010` | Mencari satu materi berdasarkan ID. Perbandingan dilakukan secara aman dengan mengubah kedua nilai menjadi string. Jika tidak ditemukan, response HTTP `404`. |
| `kategori` | Tidak | `RPL` | Memfilter kategori tanpa membedakan huruf besar/kecil. `RPL`, `rpl`, dan `Rpl` dianggap sama. Jika tidak ada hasil, response tetap HTTP `200` dengan array kosong. |

Kedua parameter dapat digunakan bersamaan. Jika `id` digunakan dan kombinasi filter tidak menghasilkan data, response adalah HTTP `404`.

### Perbedaan daftar dan detail

- Tanpa `id`, API mengembalikan **metadata saja**: `id`, `kategori`, `judul`, dan `url`. Field `materi` tidak disertakan agar response daftar tetap ringan.
- Dengan `id`, API mengembalikan **objek lengkap**, termasuk field `materi`.
- Filter `kategori` saja tetap mengembalikan daftar metadata.
- Struktur asli `data.json` tidak diubah; pemilihan field hanya dilakukan pada response API.

## Contoh Request

```http
GET /api/data
GET /api/data?id=27010
GET /api/data?kategori=RPL
GET /api/data?kategori=rpl
GET /api/data?id=27010&kategori=RPL
```

## Contoh Response

### 1. Daftar seluruh materi

```http
GET /api/data
```

HTTP `200`:

```json
{
  "success": true,
  "total": 19,
  "data": [
    {
      "id": 27010,
      "kategori": "RPL",
      "judul": "Software engineering",
      "url": "https://en.wikipedia.org/wiki/Software_engineering"
    },
    {
      "id": 27471338,
      "kategori": "RPL",
      "judul": "Object-oriented programming",
      "url": "https://en.wikipedia.org/wiki/Object-oriented_programming"
    }
  ]
}
```

Daftar di atas dipersingkat; response sebenarnya berisi seluruh 19 materi.

### 2. Detail materi berdasarkan ID

```http
GET /api/data?id=27010
```

HTTP `200`:

```json
{
  "success": true,
  "total": 1,
  "data": [
    {
      "id": 27010,
      "kategori": "RPL",
      "judul": "Software engineering",
      "url": "https://en.wikipedia.org/wiki/Software_engineering",
      "materi": "Software engineering is a branch of both computer science and engineering..."
    }
  ]
}
```

Field `materi` dipersingkat pada contoh. Response sebenarnya berisi teks lengkap dari `data.json`.

### 3. Filter kategori

```http
GET /api/data?kategori=Game
```

HTTP `200`:

```json
{
  "success": true,
  "total": 5,
  "data": [
    {
      "id": 30392485,
      "kategori": "Game",
      "judul": "Game development",
      "url": "https://en.wikipedia.org/wiki/Game_development"
    }
  ]
}
```

Daftar di atas dipersingkat. Filter tidak case-sensitive.

### 4. Kategori tidak ditemukan

```http
GET /api/data?kategori=TidakAda
```

HTTP `200`:

```json
{
  "success": true,
  "total": 0,
  "data": []
}
```

### 5. ID tidak ditemukan

```http
GET /api/data?id=999999
```

HTTP `404`:

```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

### 6. Kombinasi ID dan kategori tidak cocok

```http
GET /api/data?id=27010&kategori=Game
```

HTTP `404`:

```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

### 7. Method tidak diizinkan

```http
POST /api/data
```

HTTP `405`:

```json
{
  "success": false,
  "message": "Method not allowed"
}
```

Response `405` juga menyertakan header `Allow: GET, OPTIONS`.

### 8. Preflight CORS

```http
OPTIONS /api/data
```

HTTP `204` tanpa body.

### 9. Kesalahan internal

Jika terjadi kesalahan saat memuat atau memproses data:

```json
{
  "success": false,
  "message": "Internal server error"
}
```

HTTP `500`.

## CORS

API mengirim header berikut pada setiap response:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

`Access-Control-Allow-Origin: *` digunakan untuk tahap pengembangan agar API mudah diakses dari aplikasi lain. Untuk produksi, batasi origin sesuai kebutuhan.

## Deploy ke Vercel

### Melalui dashboard Vercel

1. Pastikan repository sudah tersedia di GitHub.
2. Login ke [Vercel](https://vercel.com/).
3. Pilih **Add New Project**, lalu import repository `figadafa/ALGORITHM_api`.
4. Gunakan pengaturan berikut:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (root repository)
   - **Build Command**: kosongkan
   - **Output Directory**: kosongkan
   - **Install Command**: biarkan default
5. Klik **Deploy**.

Vercel akan mendeteksi `api/data.js` secara otomatis sebagai Serverless Function. Endpoint hasil deploy mengikuti pola:

```text
https://nama-project-anda.vercel.app/api/data
```

Ganti `nama-project-anda.vercel.app` dengan domain yang diberikan Vercel setelah deploy. Repository ini tidak menyertakan URL deployment karena belum di-deploy.

### Melalui Vercel CLI

```bash
npx vercel
npx vercel --prod
```

## Menggunakan API dari JavaScript `fetch`

Ganti `BASE_URL` dengan URL deployment yang sebenarnya.

```javascript
const BASE_URL = "https://nama-project-anda.vercel.app";

// Daftar metadata seluruh materi
async function ambilSemuaMateri() {
  const response = await fetch(`${BASE_URL}/api/data`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `HTTP ${response.status}`);
  }

  return result.data;
}

// Detail satu materi berdasarkan ID
async function ambilDetailMateri(id) {
  const response = await fetch(
    `${BASE_URL}/api/data?id=${encodeURIComponent(id)}`
  );
  const result = await response.json();

  if (response.status === 404) {
    throw new Error(result.message);
  }

  if (!response.ok) {
    throw new Error(result.message || `HTTP ${response.status}`);
  }

  return result.data[0];
}

// Daftar materi berdasarkan kategori
async function ambilMateriByKategori(kategori) {
  const response = await fetch(
    `${BASE_URL}/api/data?kategori=${encodeURIComponent(kategori)}`
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `HTTP ${response.status}`);
  }

  return result.data;
}

// Contoh pemakaian
ambilDetailMateri(27010)
  .then((materi) => console.log(materi.judul, materi.materi))
  .catch((error) => console.error(error.message));
```

## Catatan dan Keterbatasan

- API bersifat **read-only**; hanya tersedia `GET` dan `OPTIONS`. Tidak ada `POST`, `PUT`, `PATCH`, atau `DELETE`.
- Tidak ada autentikasi, dashboard admin, database, atau frontend.
- Tidak ada pagination karena jumlah data saat ini hanya 19. Jika data bertambah besar, pagination dapat ditambahkan kemudian.
- Daftar materi tidak menyertakan field `materi` untuk menjaga ukuran response tetap kecil. Field lengkap hanya dikirim saat detail diminta dengan `id`.
- `data.json` dimuat sekali per instance Serverless Function dan di-cache di memori. Perubahan data memerlukan deploy ulang agar instance baru memuat data terbaru.
- Filter kategori memakai pencocokan persis tanpa membedakan huruf besar/kecil. Nilai seperti `RPL` dan `rpl` cocok, tetapi pencarian sebagian kata tidak didukung.
- ID dibandingkan sebagai string agar aman terhadap perbedaan tipe data, tanpa mengubah tipe data asli pada response.
- CORS `*` cocok untuk pengembangan. Untuk produksi, sebaiknya batasi origin.
- `crawler.py` dan `data.json` tidak diubah oleh implementasi API ini.
