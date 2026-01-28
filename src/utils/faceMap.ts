// 📁 얼굴 부위 기준 좌표 (UI 보조용)

export const FACE_REGIONS = {
  forehead: { top: 40, left: 90 },

  leftEye: { top: 85, left: 70 },
  rightEye: { top: 85, left: 110 },

  leftCheek: { top: 140, left: 50 },
  rightCheek: { top: 140, left: 130 },

  lip: { top: 190, left: 90 },
} as const;

/**
 * 분석 레벨 → 색상
 * (경고 톤 완화 버전)
 */
export function levelColor(level: string) {
  switch (level) {
    case "BAD":
      return "rgba(230, 126, 34, 0.7)";   // 주황 (완화된 경고)
    case "LOW":
      return "rgba(241, 196, 15, 0.7)";   // 노랑
    case "NORMAL":
      return "rgba(46, 204, 113, 0.7)";   // 초록
    case "GOOD":
      return "rgba(39, 174, 96, 0.7)";    // 진한 초록
    default:
      return "rgba(200,200,200,0.4)";
  }
}
