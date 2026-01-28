import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

export default function Upload() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const deleteImage = () => {
    Alert.alert(
      "사진 삭제",
      "선택한 사진을 삭제하시겠어요?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => setImageUri(null),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>사진 업로드</Text>
          <View style={styles.titleUnderline} />
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* 이미지 영역 */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <View style={styles.imageWrapper}>
            <View style={styles.imageInnerShadow}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>

            {/* 삭제 버튼 */}
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.7}
              onPress={deleteImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
                style={styles.deleteGradient}
              >
                <Text style={styles.deleteIcon}>✕</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 이미지 정보 오버레이 */}
            <View style={styles.imageInfo}>
              <View style={styles.imageInfoBadge}>
                <View style={styles.checkDot} />
                <Text style={styles.imageInfoText}>선택됨</Text>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.emptyBox}
            activeOpacity={0.7}
            onPress={pickImage}
          >
            <View style={styles.emptyContent}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyIconBox}>
                  <Text style={styles.emptyEmoji}>📷</Text>
                </View>
                <View style={styles.emptyIconRing} />
              </View>
              <Text style={styles.emptyTitle}>사진을 선택해주세요</Text>
              <Text style={styles.emptySubtitle}>
                갤러리에서 선택하거나{"\n"}아래 버튼을 눌러주세요
              </Text>
              <View style={styles.emptyDivider} />
              <Text style={styles.emptyHint}>탭하여 선택</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomSection}>
        {!imageUri ? (
          <TouchableOpacity
            style={styles.galleryButton}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <View style={styles.galleryButtonContent}>
              <View style={styles.galleryIconBox}>
                <Text style={styles.galleryIcon}>🖼️</Text>
              </View>
              <View style={styles.galleryTextContainer}>
                <Text style={styles.galleryText}>갤러리에서 선택</Text>
                <Text style={styles.gallerySubtext}>사진 라이브러리 열기</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.changeButton}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <View style={styles.changeButtonInner}>
              <View style={styles.changeIconBox}>
                <Text style={styles.changeIcon}>🔄</Text>
              </View>
              <Text style={styles.changeText}>다른 사진 선택</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!imageUri}
          onPress={() =>
            router.replace({
              pathname: "/(tabs)/analysis/analyzing",
              params: { imageUri },
            })
          }
        >
          <LinearGradient
            colors={
              imageUri
                ? ["#1a1a1a", "#000000"]
                : ["#f5f5f5", "#e8e8e8"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.analyzeButton,
              !imageUri && styles.analyzeButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.analyzeText,
                !imageUri && styles.analyzeTextDisabled,
              ]}
            >
              분석 시작
            </Text>
            {imageUri && (
              <View style={styles.analyzeIconBox}>
                <Text style={styles.analyzeIcon}>→</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {imageUri && (
          <View style={styles.privacyContainer}>
            <View style={styles.privacyIcon}>
              <Text style={styles.privacyEmoji}>🔒</Text>
            </View>
            <Text style={styles.privacyText}>
              분석 후 사진은 즉시 삭제됩니다
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  // 헤더
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  backText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: "#1a1a1a",
    marginTop: 6,
    borderRadius: 2,
  },
  placeholder: {
    width: 44,
  },

  // 이미지 영역
  imageContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
  imageInnerShadow: {
    borderRadius: 24,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },

  // 삭제 버튼
  deleteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteGradient: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  // 이미지 정보
  imageInfo: {
    position: "absolute",
    bottom: 30,
    right: 5,
  },
  imageInfoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
  
  },
  imageInfoText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    letterSpacing: -0.2,
  
  },

  // 변경 버튼
  changeButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  changeButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  changeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  changeIcon: {
    fontSize: 16,
  },
  changeText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.3,
  },

  // 빈 상태
  emptyBox: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D0D0D0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIconContainer: {
    position: "relative",
    marginBottom: 28,
  },
  emptyIconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    zIndex: 2,
  },
  emptyIconRing: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    top: -8,
    left: -8,
    zIndex: 1,
  },
  emptyEmoji: {
    fontSize: 44,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#8E8E8E",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
  emptyDivider: {
    width: 60,
    height: 2,
    backgroundColor: "#E8E8E8",
    marginVertical: 24,
    borderRadius: 1,
  },
  emptyHint: {
    fontSize: 13,
    color: "#B0B0B0",
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  // 하단 버튼
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  galleryButton: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
  },
  galleryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  galleryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  galleryIcon: {
    fontSize: 22,
  },
  galleryTextContainer: {
    alignItems: "flex-start",
  },
  galleryText: {
    color: "#1a1a1a",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: -0.3,
  },
  gallerySubtext: {
    color: "#8E8E8E",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },

  // 분석 버튼
  analyzeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  analyzeButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  analyzeText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  analyzeTextDisabled: {
    color: "#B0B0B0",
  },
  analyzeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  analyzeIcon: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // 프라이버시 텍스트
  privacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    backgroundColor: "#F8F8F8",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  privacyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  privacyEmoji: {
    fontSize: 12,
  },
  privacyText: {
    fontSize: 12,
    color: "#8E8E8E",
    fontWeight: "500",
    letterSpacing: -0.2,
  },
});