import { View, Text, StyleSheet, Animated, Alert } from "react-native";
import { useEffect, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { uploadAnalysisImage } from "@/api/analysis";
import { useAnalysisStore } from "@/store/analysisStore";

export default function Analyzing() {
  const scale = useRef(new Animated.Value(0.8)).current;
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

  const {
    setResult,
    markUpdated,
    setLatestSummary,
  } = useAnalysisStore.getState();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const runAnalysis = async () => {
      try {
        if (!imageUri) throw new Error("imageUri 없음");

        const res = await uploadAnalysisImage(imageUri);

        const analysisResult =
          res?.data?.data ??
          res?.data?.result ??
          res?.data;

        if (!analysisResult?.analysisId) {
          throw new Error("analysisId 없음 (백엔드 응답)");
        }

        /** ✅ 결과 저장 (타입 정확히) */
        setResult({
          analysisId: analysisResult.analysisId,
          skinType: analysisResult.skinType,
          summary: analysisResult.summary,
          conditions: analysisResult.conditions,
          regions: analysisResult.regions,
        });

        markUpdated();

        setLatestSummary({
          analysisId: analysisResult.analysisId,
          skinType: analysisResult.skinType,
          summary: analysisResult.summary,
          date: new Date().toISOString().slice(0, 10),
        });

        /** ✅ URL param 없이 이동 (store 기반) */
        router.replace("/(tabs)/analysis");
      } catch (e) {
        console.error("❌ 분석 실패", e);
        Alert.alert("분석 실패", "피부 분석 중 문제가 발생했습니다.");
        router.replace("/(tabs)/home");
      }
    };

    runAnalysis();
  }, [imageUri]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { transform: [{ scale }] }]} />
      <Text style={styles.text}>피부 분석 중…</Text>
      <Text style={styles.subText}>잠시만 기다려주세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#111",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  subText: {
    marginTop: 6,
    fontSize: 13,
    color: "#666",
  },
});
