export interface users {
  id: number;
  kategori: string;
  judul: string;
  url: string;
}

interface usersresponse {
  success: boolean;
  total: number;
  data: users[];
}

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

function isusers(value: unknown): value is users {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const material = value as Record<string, unknown>;
  return (
    typeof material.id === "number" &&
    typeof material.kategori === "string" &&
    typeof material.judul === "string" &&
    typeof material.url === "string"
  );
}

export function fetchusers(): Promise<users[]> {
  return new Promise((resolve, reject) => {
    fetch(USERS_URL)
      .then((response) => {
        if (!response.ok) {
          // reject() digunakan untuk menangani kondisi error HTTP
          reject(new Error(`Gagal memuat materi (HTTP ${response.status}).`));
          return;
        }
        return response.json();
      })
      .then((payload: unknown) => {
        if (payload === undefined) return;

        if (typeof payload !== "object" || payload === null) {
          reject(new Error("Format respons API materi tidak valid."));
          return;
        }

        const result = payload as Partial<usersresponse>;
        if (
          result.success !== true ||
          !Array.isArray(result.data) ||
          !result.data.every(isusers)
        ) {
          reject(new Error("users respons API materi tidak valid."));
          return;
        }

        // resolve() digunakan untuk mengembalikan data ketika operasi berhasil
        resolve(result.data);
      })
      .catch((error) => {
        // Menangani error jaringan atau error lainnya
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          reject(
            new Error(
              "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.",
            ),
          );
        } else {
          reject(
            error instanceof Error
              ? error
              : new Error("Terjadi kesalahan saat memuat materi."),
          );
        }
      });
  });
}
