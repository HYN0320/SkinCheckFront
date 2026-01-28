import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Guide() {
  const guides = [
    { icon: "🎯", text: "얼굴을 화면 중앙에 맞춰주세요" },
    { icon: "💡", text: "밝은 곳에서 촬영해주세요" },
    { icon: "👓", text: "안경 / 마스크는 제거해주세요" },
    { icon: "👤", text: "정면을 바라보고 촬영해주세요" },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#000000", "#2A2A2A"]}
            style={styles.iconGradient}
          >
            <Text style={styles.headerIcon}>📸</Text>
          </LinearGradient>
        </View>
        <Text style={styles.title}>촬영 가이드</Text>
        <Text style={styles.subtitle}>
          정확한 분석을 위해{"\n"}아래 가이드를 따라주세요
        </Text>
      </View>

      {/* 가이드 카드들 */}
      <View style={styles.guideContainer}>
        {guides.map((guide, index) => (
          <View key={index} style={styles.guideCard}>
            <View style={styles.guideIconBox}>
              <Text style={styles.guideIcon}>{guide.icon}</Text>
            </View>
            <Text style={styles.guideText}>{guide.text}</Text>
            <View style={styles.accentLine} />
          </View>
        ))}
      </View>

      {/* 예시 이미지 영역 */}
      <View style={styles.exampleBox}>
        <View style={styles.faceCircleOuter}>
          <View style={styles.faceCircle}>
            <Text style={styles.faceEmoji}>😊</Text>
          </View>
        </View>
        <Text style={styles.exampleText}>이렇게 촬영해주세요!</Text>
        <View style={styles.decorativeDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* 촬영 시작 버튼 */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push("/(tabs)/analysis/capture")}
      >
        <LinearGradient
          colors={["#000000", "#1A1A1A"]}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>촬영 시작하기</Text>
            <View style={styles.buttonArrowBox}>
              <Text style={styles.buttonSubText}>→</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* 하단 안내 */}
      <View style={styles.bottomNoticeContainer}>
        <View style={styles.lockIcon}>
          <Text style={styles.lockEmoji}>🔒</Text>
        </View>
        <Text style={styles.bottomNotice}>
          촬영된 사진은 분석 후 즉시 삭제됩니다
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  // 헤더
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },

  // 가이드 카드
  guideContainer: {
    marginBottom: 32,
  },
  guideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  accentLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#000000",
  },
  guideIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: "#E8E8E8",
  },
  guideIcon: {
    fontSize: 28,
  },
  guideText: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "600",
    lineHeight: 22,
  },

  // 예시 영역
  exampleBox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 32,
    marginBottom: 32,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  faceCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#E8E8E8",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  faceCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  faceEmoji: {
    fontSize: 60,
  },
  exampleText: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  decorativeDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CCCCCC",
  },

  // 버튼
  button: {
    borderRadius: 28,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginRight: 12,
    letterSpacing: 0.5,
  },
  buttonArrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonSubText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  // 하단 안내
  bottomNoticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  lockIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  lockEmoji: {
    fontSize: 12,
  },
  bottomNotice: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
});