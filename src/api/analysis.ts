// src/api/analysis.ts
import { api } from "./client";

/**
 * 📸 이미지 업로드 기반 피부 분석
 */
export const uploadAnalysisImage = async (imageUri: string) => {
  const formData = new FormData();

  formData.append("image", {
    uri: imageUri,
    name: "analysis.jpg",
    type: "image/jpeg",
  } as any);

  const res = await api.post("/analysis", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
