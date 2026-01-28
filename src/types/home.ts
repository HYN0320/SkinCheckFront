// src/types/home.ts

export interface SkinStatus {
  moisture: number;     // 수분
  elasticity: number;   // 탄력
  pore: number;         // 모공
  pigmentation: number; // 색소침착
}

export interface CosmeticDto {
  name: string;
  brand?: string;
  imageUrl?: string;
  link: string;
}

export interface HomeRecommendationSection {
  category: string;          // MOISTURE, ELASTICITY 등
  title: string;             // "수분", "탄력" 등 한글 이름
  guide: string;             // "집중 케어가 필요해요" 등
  products: CosmeticDto[];
}

export interface RecentHistoryDto {
  analysisId: number;
  date: string;         // "2025-01-19"
  skinType: string;     // "COMBINATION" 또는 "복합성"
  summary: string;
}

export interface HomeResponse {
  skinStatus: SkinStatus;                    // ← 객체로 변경
  recommendations: HomeRecommendationSection[];
  recentHistories: RecentHistoryDto[];       // 이름도 recentHistories로 통일 추천
}