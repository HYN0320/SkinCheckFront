import { create } from "zustand";
import { AnalysisResult } from "@/types/analysis";

interface AnalysisState {
  // === 분석 결과 ===
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult) => void;

  // === 분석 이벤트 ===
  analysisUpdated: boolean;
  markUpdated: () => void;
  clearUpdated: () => void;

  // === 홈 갱신용 (최근 분석 요약) ===
  latestSummary: {
    analysisId: number;
    skinType: string;
    summary: string;
    date: string;
  } | null;
  setLatestSummary: (summary: AnalysisState["latestSummary"]) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  // 분석 결과
  result: null,
  setResult: (result) => set({ result }),

  // 분석 이벤트
  analysisUpdated: false,
  markUpdated: () => set({ analysisUpdated: true }),
  clearUpdated: () => set({ analysisUpdated: false }),

  // 홈용 요약
  latestSummary: null,
  setLatestSummary: (latestSummary) => set({ latestSummary }),
}));
