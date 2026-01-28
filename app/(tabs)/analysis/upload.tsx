import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Upload() {
  // 🔥 Capture / Analyzing 과 이름 통일
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

  // 안전 가드
  if (!imageUri) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>이미지를 불러올 수 없습니다</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>다시 촬영하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>사진 확인</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 🔥 스크롤 영역 */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* 안내 문구 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>✨</Text>
          <Text style={styles.infoText}>
            사진이 선명하게 나왔는지 확인해주세요
          </Text>
        </View>

        {/* 사진 미리보기 */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.image} />

            {/* 체크 배지 */}
            <View style={styles.imageOverlay}>
              <View style={styles.checkBadge}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            </View>
          </View>

          {/* 체크 포인트 */}
          <View style={styles.checkpoints}>
            {["얼굴이 선명해요", "밝기가 적당해요", "정면을 바라봤어요"].map(
              (text) => (
                <View key={text} style={styles.checkpoint}>
                  <View style={styles.checkpointIcon}>
                    <Text style={styles.checkIconSmall}>✓</Text>
                  </View>
                  <Text style={styles.checkpointText}>{text}</Text>
                </View>
              )
            )}
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomSection}>
        {/* 다시 찍기 */}
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retakeText}>다시 찍기</Text>
        </TouchableOpacity>

        {/* 분석 시작 */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            router.replace({
              pathname: "/(tabs)/analysis/analyzing",
              params: { imageUri },
            })
          }
        >
          <LinearGradient
            colors={["#000000", "#333333"]}
            style={styles.analyzeButton}
          >
            <Text style={styles.analyzeText}>이 사진으로 분석</Text>
            <View style={styles.analyzeIconBox}>
              <Text style={styles.analyzeIcon}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.privacyText}>
          🔒 분석 후 사진은 즉시 삭제됩니다
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 16, marginBottom: 12 },
  backLink: { color: "#000", fontWeight: "700" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  backText: { fontSize: 22, fontWeight: "700" },
  title: { fontSize: 18, fontWeight: "800" },
  placeholder: { width: 40 },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    margin: 20,
    padding: 16,
    borderWidth: 1,
  },
  infoIcon: { fontSize: 18, marginRight: 8 },
  infoText: { fontSize: 14, fontWeight: "600" },

  imageContainer: { paddingHorizontal: 20 },
  imageWrapper: {
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },

  imageOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  checkBadge: {
    width: 40,
    height: 40,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: { color: "#fff", fontSize: 20, fontWeight: "800" },

  checkpoints: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    backgroundColor: "#FAFAFA",
  },
  checkpoint: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkpointIcon: {
    width: 20,
    height: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkIconSmall: { color: "#fff", fontSize: 12, fontWeight: "800" },
  checkpointText: { fontSize: 14, fontWeight: "600" },

  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  retakeButton: {
    borderWidth: 2,
    paddingVertical: 14,
    marginBottom: 12,
  },
  retakeText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },

  analyzeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    marginBottom: 12,
  },
  analyzeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },
  analyzeIconBox: {
    width: 24,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  analyzeIcon: { color: "#fff", fontSize: 16, fontWeight: "800" },

  privacyText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
  },
});
