import { fetchusers, users } from "@/api/users";
import { useEffect, useState } from "react";

interface usersState {
  materials: users[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useUsers(): usersState {
  const [materials, setMaterials] = useState<users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    let active = true;

    const loadMaterials = () => {
      setLoading(true);
      setError(null);

      // .then() digunakan untuk menangani hasil Promise yang berhasil (resolve)
      fetchusers()
        .then((result) => {
          if (active) {
            setMaterials(result);
          }
        })
        // .catch() digunakan untuk menangani hasil Promise yang gagal (reject)
        .catch((loadError) => {
          if (active) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Terjadi kesalahan saat memuat materi.",
            );
          }
        })
        // .finally() menjalankan kode setelah Promise selesai (baik berhasil maupun gagal)
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
    };

    loadMaterials();

    return () => {
      active = false;
    };
  }, [requestNumber]);

  return {
    materials,
    loading,
    error,
    retry: () => setRequestNumber((current) => current + 1),
  };
}
