// 📁 src/types/analysis.ts

export type FaceRegion =
  | "forehead"
  | "leftEye"
  | "rightEye"
  | "leftCheek"
  | "rightCheek"
  | "lip";

export type ConditionLevel = "GOOD" | "NORMAL" | "LOW" | "BAD";

export interface RegionCondition {
  type: string;
  value: number;
  level: ConditionLevel;
}

export interface RegionView {
  region: FaceRegion;
  conditions: RegionCondition[];
}

export interface AnalysisResult {
  analysisId: number;
  skinType: string;
  summary: string;

  conditions: RegionCondition[]; // ✅ ★ 핵심 ★

  regions: RegionView[];
}
