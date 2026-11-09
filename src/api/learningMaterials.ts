export interface LearningMaterial {
  id: number;
  kategori: string;
  judul: string;
  url: string;
}

interface LearningMaterialsResponse {
  success: boolean;
  total: number;
  data: LearningMaterial[];
}

const LEARNING_MATERIALS_URL = "https://algorithm-api-ten.vercel.app/api/data";

function isLearningMaterial(value: unknown): value is LearningMaterial {
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

export async function fetchLearningMaterials(): Promise<LearningMaterial[]> {
  const response = await fetch(LEARNING_MATERIALS_URL);

  if (!response.ok) {
    throw new Error(`Gagal memuat materi (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Format respons API materi tidak valid.");
  }

  const result = payload as Partial<LearningMaterialsResponse>;
  if (
    result.success !== true ||
    !Array.isArray(result.data) ||
    !result.data.every(isLearningMaterial)
  ) {
    throw new Error("Format respons API materi tidak valid.");
  }

  return result.data;
}
