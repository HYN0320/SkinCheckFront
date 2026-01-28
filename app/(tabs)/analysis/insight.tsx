import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/api/client";
import { Image, TouchableOpacity, Linking } from "react-native";


import WaterSpreadChart, {
  type RegionKey,
  type ConditionType,
} from "@/components/WaterSpreadChart";
import { useAnalysisStore } from "@/store/analysisStore";

/* =====================
   상수
===================== */

const iconMap: Record<ConditionType, string> = {
  MOISTURE: "💧",
  ELASTICITY: "✨",
  PORE: "🔍",
  PIGMENTATION: "🎨",
};

const labelMap: Record<ConditionType, string> = {
  MOISTURE: "수분",
  ELASTICITY: "탄력",
  PORE: "모공",
  PIGMENTATION: "톤",
};

const LOADING_STEPS = [
  { text: "피부 이미지 분석 중", progress: 25 },
  { text: "부위별 데이터 추출 중", progress: 50 },
  { text: "AI 분석 진행 중", progress: 75 },
  { text: "결과 생성 중", progress: 100 },
];

/* =====================
   컴포넌트
===================== */

export default function Insight() {
  const params = useLocalSearchParams();
  const analysisId =
    typeof params.analysisId === "string"
      ? params.analysisId
      : Array.isArray(params.analysisId)
      ? params.analysisId[0]
      : undefined;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  /** 분석 결과 */
  const analysisResult = useAnalysisStore((s) => s.result);
  const [selectedType, setSelectedType] =
    useState<ConditionType>("MOISTURE");

  /** 그래프 애니메이션 */
  const chartScale = useRef(new Animated.Value(1)).current;
  
  /** 로딩 애니메이션 */
  const progressAnim = useRef(new Animated.Value(0)).current;

  /** 페이드인 애니메이션 */
  const fadeAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: LOADING_STEPS[loadingStep].progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [loadingStep]);

  useEffect(() => {
    if (!analysisId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get(`/analysis/${analysisId}/insight`)
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [analysisId]);

  useEffect(() => {
    if (!loading && data) {
      // 순차적 페이드인 애니메이션
      Animated.stagger(
        200,
        fadeAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [loading, data]);

  /* =====================
     로딩
  ===================== */

  if (loading) {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.loading}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>🔍</Text>
          <Text style={styles.loadingMainText}>피부 분석 중입니다</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: progressWidth },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {LOADING_STEPS[loadingStep].progress}%
            </Text>
          </View>

          <View style={styles.stepsContainer}>
            {LOADING_STEPS.map((step, index) => (
              <View
                key={index}
                style={[
                  styles.stepItem,
                  index === loadingStep && styles.stepItemActive,
                  index < loadingStep && styles.stepItemComplete,
                ]}
              >
                <View style={[
                  styles.stepDot,
                  index === loadingStep && styles.stepDotActive,
                  index < loadingStep && styles.stepDotComplete,
                ]}>
                  {index < loadingStep && (
                    <Text style={styles.stepCheck}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepText,
                    index === loadingStep && styles.stepTextActive,
                    index < loadingStep && styles.stepTextComplete,
                  ]}
                >
                  {step.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (!data) return null;

  /* =====================
     그래프 데이터
  ===================== */

  const chartData =
    analysisResult?.regions?.map((r) => ({
      region: r.region as RegionKey,
      value:
        r.conditions.find((c) => c.type === selectedType)?.value ??
        0,
    })) ?? [];

  const paragraphs =
    typeof data.insight === "string"
      ? data.insight
          .split(/\n|\.\s+/)
          .map((p: string) => p.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

  /* =====================
     탭 선택
  ===================== */

  const onSelectType = (type: ConditionType) => {
    setSelectedType(type);

    chartScale.setValue(0.9);
    Animated.spring(chartScale, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  /* =====================
     렌더링
  ===================== */

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <Animated.View style={[styles.header, { opacity: fadeAnims[0] }]}>
        <View style={styles.decorLine} />
        <Text style={styles.date}>{data.date}</Text>
        <Text style={styles.headerSubtitle}>Skin Analysis Report</Text>
      </Animated.View>

      {/* 피부 타입 */}
      <Animated.View 
        style={[
          styles.skinTypeCard,
          {
            opacity: fadeAnims[0],
            transform: [
              {
                translateY: fadeAnims[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.skinTypeContent}>
          <Text style={styles.skinTypeLabel}>피부 타입</Text>
          <Text style={styles.skinType}>{data.skinType}</Text>
        </View>
        <View style={styles.accentLine} />
      </Animated.View>

      {/* 부위별 확산 분석 */}
      <Animated.View 
        style={[
          styles.card,
          {
            opacity: fadeAnims[1],
            transform: [
              {
                translateY: fadeAnims[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>부위별 확산 분석</Text>
          <Text style={styles.cardSubtitle}>
            {labelMap[selectedType]} 분포도
          </Text>
        </View>

        {/* 조건 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {(Object.keys(labelMap) as ConditionType[]).map(
            (type) => (
              <Text
                key={type}
                onPress={() => onSelectType(type)}
                style={[
                  styles.tab,
                  selectedType === type && styles.tabActive,
                ]}
              >
                {iconMap[type]} {labelMap[type]}
              </Text>
            )
          )}
        </ScrollView>

        {/* 그래프 */}
        <Animated.View
          style={{ transform: [{ scale: chartScale }] }}
        >
          <WaterSpreadChart
            data={chartData}
            type={selectedType}
          />
        </Animated.View>
      </Animated.View>

      {/* AI 인사이트 */}
      <Animated.View 
        style={[
          styles.insightCard,
          {
            opacity: fadeAnims[2],
            transform: [
              {
                translateY: fadeAnims[2].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>AI 인사이트</Text>
        <View style={styles.insightContent}>
          {paragraphs.map((p: string, i: number) => (
            <View key={i} style={styles.paragraphContainer}>
              <Text style={styles.paragraphNumber}>
                {(i + 1).toString().padStart(2, '0')}
              </Text>
              <Text style={styles.paragraph}>{p}.</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* 요약 */}
      <Animated.View 
        style={[
          styles.summaryCard,
          {
            opacity: fadeAnims[3],
            transform: [
              {
                translateY: fadeAnims[3].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>요약</Text>
        <Text style={styles.summaryText}>{data.summary}</Text>
      </Animated.View>

      {/* AI 추천 화장품 */}
{Array.isArray(data.recommendedProducts) &&
  data.recommendedProducts.length > 0 && (
    <Animated.View
      style={[
        styles.recommendCard,
        {
          opacity: fadeAnims[3],
          transform: [
            {
              translateY: fadeAnims[3].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.recommendHeader}>
        <Text style={styles.sectionTitle}>AI 추천 화장품</Text>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI Pick</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productRow}
      >
        {data.recommendedProducts.map((p: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={styles.productCard}
            activeOpacity={0.85}
            onPress={() => {
              if (p.link) Linking.openURL(p.link);
            }}
          >
            <Image
              source={{ uri: p.imageUrl }}
              style={styles.productImage}
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {p.name}
              </Text>
              {p.brand && (
                <Text style={styles.productBrand}>
                  {p.brand}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )}


      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

/* =====================
   스타일
===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    padding: 32,
  },
  loadingContent: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  loadingTitle: {
    fontSize: 56,
    marginBottom: 16,
  },
  loadingMainText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 32,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3498DB",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3498DB",
  },
  stepsContainer: {
    width: "100%",
    gap: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepItemActive: {},
  stepItemComplete: {},
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: "#3498DB",
  },
  stepDotComplete: {
    backgroundColor: "#111",
  },
  stepCheck: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  stepText: {
    fontSize: 15,
    color: "#999",
  },
  stepTextActive: {
    color: "#111",
    fontWeight: "600",
  },
  stepTextComplete: {
    color: "#666",
  },

  header: {
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  decorLine: {
    width: 60,
    height: 1,
    backgroundColor: "#000",
    marginBottom: 24,
  },
  date: {
    fontSize: 32,
    fontWeight: "300",
    color: "#111",
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#999",
    letterSpacing: 2,
    fontWeight: "400",
  },

  skinTypeCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    paddingVertical: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    position: "relative",
  },
  skinTypeContent: {
    alignItems: "center",
  },
  skinTypeLabel: {
    fontSize: 12,
    color: "#999",
    letterSpacing: 1,
    marginBottom: 12,
    fontWeight: "400",
  },
  skinType: {
    fontSize: 36,
    fontWeight: "200",
    color: "#111",
    letterSpacing: 2,
  },
  accentLine: {
    position: "absolute",
    bottom: -1,
    left: "40%",
    width: "20%",
    height: 2,
    backgroundColor: "#111",
  },

  card: {
    marginHorizontal: 24,
    marginBottom: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderColor: "#E8E8E8",
  },
  cardHeader: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#111",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#999",
    fontWeight: "300",
  },

  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    marginBottom: 24,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "transparent",
    fontSize: 13,
    fontWeight: "400",
    color: "#666",
    letterSpacing: 0.3,
  },
  tabActive: {
    backgroundColor: "#111",
    color: "#FFF",
    borderColor: "#111",
  },

  insightCard: {
    marginHorizontal: 24,
    marginBottom: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderColor: "#E8E8E8",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#111",
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  insightContent: {
    gap: 20,
  },
  paragraphContainer: {
    flexDirection: "row",
    gap: 16,
  },
  paragraphNumber: {
    fontSize: 13,
    fontWeight: "300",
    color: "#999",
    minWidth: 28,
  },
  paragraph: {
    flex: 1,
    fontSize: 15,
    lineHeight: 26,
    color: "#444",
    fontWeight: "300",
  },

  summaryCard: {
    marginHorizontal: 24,
    marginBottom: 48,
    paddingTop: 32,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 26,
    color: "#444",
    fontWeight: "300",
  },
  /* ===== 화장품 추천 ===== */

recommendCard: {
  marginHorizontal: 24,
  marginBottom: 48,
  paddingTop: 32,
  borderTopWidth: 1,
  borderColor: "#E8E8E8",
},

recommendHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
},

aiBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderWidth: 1,
  borderColor: "#111",
},

aiBadgeText: {
  fontSize: 11,
  fontWeight: "600",
  letterSpacing: 1,
  color: "#111",
},

productRow: {
  gap: 16,
  paddingRight: 24,
},

productCard: {
  width: 140,
},

productImage: {
  width: 140,
  height: 140,
  backgroundColor: "#F2F2F2",
  marginBottom: 12,
},

productInfo: {
  gap: 4,
},

productName: {
  fontSize: 14,
  fontWeight: "400",
  color: "#111",
  lineHeight: 20,
},

productBrand: {
  fontSize: 12,
  color: "#999",
  fontWeight: "300",
},

});