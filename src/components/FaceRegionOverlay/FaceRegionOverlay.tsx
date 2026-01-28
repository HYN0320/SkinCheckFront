import { View, TouchableOpacity } from "react-native";
import { RegionView, FaceRegion } from "@/types/analysis";
import { styles } from "./FaceRegionOverlay.styles";

interface Props {
  regions: RegionView[];
  onSelect: (r: RegionView) => void;
}

/** ✅ 부위별 고정 컬러 */
const REGION_COLOR: Record<FaceRegion, string> = {
  forehead: "#4FC3F7",    // 이마 - 수분 느낌
  leftEye: "#BA68C8",     // 눈가 - 탄력
  rightEye: "#BA68C8",
  leftCheek: "#81C784",  // 볼 - 색소/톤
  rightCheek: "#81C784",
  lip: "#FFB74D",        // 입술 - 모공/포인트
};

export default function FaceRegionOverlay({ regions, onSelect }: Props) {
  const map = Object.fromEntries(regions.map((r) => [r.region, r]));

  function render(regionKey: FaceRegion, style: any) {
    const region = map[regionKey];
    if (!region) return null;

    const color = REGION_COLOR[regionKey];

    return (
      <TouchableOpacity
        key={regionKey}
        activeOpacity={0.85}
        onPress={() => onSelect(region)}
        style={[
          style,
          {
            borderColor: color,
            backgroundColor: color + "33", // 기존 opacity 유지
          },
        ]}
      />
    );
  }

  return (
    <View style={styles.container}>
      {render("forehead", styles.forehead)}
      {render("leftEye", styles.leftEye)}
      {render("rightEye", styles.rightEye)}
      {render("leftCheek", styles.leftCheek)}
      {render("rightCheek", styles.rightCheek)}
      {render("lip", styles.lip)}
    </View>
  );
}
