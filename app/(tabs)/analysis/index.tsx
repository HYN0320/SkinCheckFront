import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";

import FaceRegionOverlay from "@/components/FaceRegionOverlay/FaceRegionOverlay";
import { useAnalysisStore } from "@/store/analysisStore";
import { FaceRegion, RegionView, AnalysisResult } from "@/types/analysis";

/* ===== 상수 ===== */

const ALL_REGIONS: FaceRegion[] = [
  "forehead",
  "leftEye",
  "rightEye",
  "leftCheek",
  "rightCheek",
  "lip",
];

const REGION_LABEL: Record<FaceRegion, string> = {
  forehead: "이마",
  leftEye: "왼쪽 눈가",
  rightEye: "오른쪽 눈가",
  leftCheek: "왼쪽 볼",
  rightCheek: "오른쪽 볼",
  lip: "입술",
};

const LEVEL_TEXT = {
  GOOD: "좋은 편",
  NORMAL: "보통",
  LOW: "다소 부족",
  BAD: "부족한 편",
} as const;

const CONDITION_EMOJI: Record<string, string> = {
  MOISTURE: "💧",
  ELASTICITY: "✨",
  PORE: "🔍",
  PIGMENTATION: "🎨",
};

const CONDITION_COLOR: Record<string, string> = {
  MOISTURE: "#4FC3F7",
  ELASTICITY: "#BA68C8",
  PORE: "#FFB74D",
  PIGMENTATION: "#81C784",
};

/* ===== 메인 ===== */

export default function Analysis() {
  const result = useAnalysisStore((s) => s.result) as AnalysisResult | null;
  const [selected, setSelected] = useState<RegionView | null>(null);

  const cardSlideAnim = useRef(new Animated.Value(0)).current;
  const cardOpacityAnim = useRef(new Animated.Value(0)).current;
  const badgePulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(badgePulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (!selected) return;

    cardSlideAnim.setValue(50);
    cardOpacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(cardSlideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selected]);

  if (!result) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={styles.emptyText}>분석 결과가 없습니다</Text>
      </View>
    );
  }

  /* 🔥 핵심 수정: 히스토리에서도 region 수치 보이게 */
const normalizedRegions: RegionView[] = result.regions;


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.headerBadge,
            { transform: [{ scale: badgePulseAnim }] },
          ]}
        >
          <Text style={styles.headerLabel}>SKIN ANALYSIS</Text>
        </Animated.View>
        <Text style={styles.title}>얼굴 영역별 상태</Text>
        <Text style={styles.subtitle}>터치하여 세부 정보를 확인하세요</Text>
      </View>

      {/* 얼굴 이미지 */}
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("@/assets/face.jpg")}
            style={styles.faceImage}
          />
          <FaceRegionOverlay
            regions={normalizedRegions}
            onSelect={setSelected}
          />
        </View>
      </View>

      {/* 영역 상세 */}
      {selected && (
        <Animated.View
          style={[
            styles.detailCard,
            {
              opacity: cardOpacityAnim,
              transform: [{ translateY: cardSlideAnim }],
            },
          ]}
        >
          <View style={styles.detailHeader}>
            <View style={styles.regionTitleContainer}>
              <View style={styles.regionDot} />
              <Text style={styles.regionTitle}>
                {REGION_LABEL[selected.region]}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelected(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.conditionsContainer}>
            {selected.conditions.map((c, i) => (
              <ConditionRow key={i} condition={c} />
            ))}
          </View>
        </Animated.View>
      )}

      {/* AI 인사이트 */}
      <TouchableOpacity
        style={styles.insightButton}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/analysis/insight",
            params: { analysisId: String(result.analysisId) },
          })
        }
      >
        <View style={styles.insightButtonInner}>
          <View style={styles.insightButtonContent}>
            <View style={styles.insightIconBox}>
              <Text style={styles.insightButtonEmoji}>✨</Text>
            </View>
            <Text style={styles.insightButtonText}>
              AI 피부 인사이트 보기
            </Text>
            <View style={styles.arrowBox}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ===== Condition Row ===== */

function ConditionRow({
  condition,
}: {
  condition: {
    type: string;
    value: number;
    level: keyof typeof LEVEL_TEXT;
  };
}) {
  const color = CONDITION_COLOR[condition.type] ?? "#999999";

  return (
    <View style={styles.conditionRow}>
      <View style={styles.conditionLeft}>
        <View style={styles.emojiBox}>
          <Text style={styles.conditionEmoji}>
            {CONDITION_EMOJI[condition.type] || "🧴"}
          </Text>
        </View>
        <Text style={styles.conditionType}>{condition.type}</Text>
      </View>

      <View style={styles.conditionRight}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            {LEVEL_TEXT[condition.level]}
          </Text>
        </View>
        <View style={[styles.valueCircle, { backgroundColor: color }]}>
          <Text style={styles.valueText}>{condition.value}</Text>
        </View>
      </View>
    </View>
  );
}

/* ===== styles (변경 없음) ===== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  contentContainer: { paddingBottom: 40 },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#666", fontWeight: "500" },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#666" },
  imageContainer: { paddingHorizontal: 20, marginVertical: 24 },
  imageWrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  faceImage: { width: "100%", height: "100%" },
  detailCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  regionTitleContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  regionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
  },
  regionTitle: { fontSize: 22, fontWeight: "800" },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { fontSize: 18, color: "#666" },
  conditionsContainer: { gap: 12 },
  conditionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  conditionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  emojiBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  conditionEmoji: { fontSize: 20 },
  conditionType: { fontSize: 15, fontWeight: "600" },
  conditionRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  levelBadge: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  levelText: { fontSize: 11, fontWeight: "700", color: "#333" },
  valueCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: { fontSize: 14, fontWeight: "800", color: "#FFF" },
  insightButton: { marginHorizontal: 20, marginTop: 8 },
  insightButtonInner: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 24,
    padding: 20,
  },
  insightButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  insightIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  insightButtonEmoji: { fontSize: 18 },
  insightButtonText: { fontSize: 17, fontWeight: "800" },
  arrowBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: { color: "#FFF", fontWeight: "800" },
});
