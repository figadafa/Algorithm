import { useEffect, useState } from "react";
import {
  fetchLearningMaterials,
  LearningMaterial,
} from "@/api/learningMaterials";

interface LearningMaterialsState {
  materials: LearningMaterial[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useLearningMaterials(): LearningMaterialsState {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    let active = true;

    const loadMaterials = () => {
      setLoading(true);
      setError(null);

      // .then() digunakan untuk menangani hasil Promise yang berhasil (resolve)
      fetchLearningMaterials()
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
                : "Terjadi kesalahan saat memuat materi."
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
