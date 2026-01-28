import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path, Ellipse } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function Capture() {
  const ref = useRef<CameraView | null>(null);
  const [ok, setOk] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(
      (res) => setOk(res.status === "granted")
    );
  }, []);

  if (!ok) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionBox}>
          <View style={styles.permissionIconBox}>
            <Text style={styles.permissionIcon}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>카메라 권한 필요</Text>
          <Text style={styles.permissionText}>
            피부 분석을 위해{"\n"}카메라 접근 권한이 필요합니다
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={ref} 
        style={StyleSheet.absoluteFill} 
        facing="front"
        onCameraReady={() => setIsReady(true)}
      />
      
      {/* 상단 오버레이 */}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent"]}
        style={styles.topOverlay}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.instructionBox}>
          <Text style={styles.topText}>얼굴을 가이드에 맞춰주세요</Text>
        </View>
      </LinearGradient>

      {/* 얼굴 가이드라인 */}
      <View style={styles.guidelineContainer}>
        <Svg width={width} height={height} style={styles.svg}>
          {/* 타원형 얼굴 가이드 */}
          <Ellipse
            cx={width / 2}
            cy={height / 2 - 50}
            rx={130}
            ry={170}
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10, 8"
            opacity={0.8}
          />
          
          {/* 눈 위치 가이드 */}
          <Circle
            cx={width / 2 - 45}
            cy={height / 2 - 80}
            r="4"
            fill="#FFFFFF"
            opacity={0.6}
          />
          <Circle
            cx={width / 2 + 45}
            cy={height / 2 - 80}
            r="4"
            fill="#FFFFFF"
            opacity={0.6}
          />
          
          {/* 코 위치 가이드 */}
          <Circle
            cx={width / 2}
            cy={height / 2 - 30}
            r="3"
            fill="#FFFFFF"
            opacity={0.5}
          />
          
          {/* 입 위치 가이드 */}
          <Path
            d={`M ${width / 2 - 25} ${height / 2 + 30} Q ${width / 2} ${height / 2 + 38} ${width / 2 + 25} ${height / 2 + 30}`}
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
            opacity={0.5}
          />
        </Svg>

        {/* 가이드 코너 마크 */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>

      {/* 하단 안내 및 버튼 */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        style={styles.bottomOverlay}
      >
        <View style={styles.tipsContainer}>
          <View style={styles.tip}>
            <View style={styles.tipIconBox}>
              <Text style={styles.tipIcon}>💡</Text>
            </View>
            <Text style={styles.tipText}>밝은 곳에서 촬영</Text>
          </View>
          <View style={styles.tip}>
            <View style={styles.tipIconBox}>
              <Text style={styles.tipIcon}>👤</Text>
            </View>
            <Text style={styles.tipText}>정면 응시</Text>
          </View>
        </View>

        {/* 촬영 버튼 */}
        <TouchableOpacity
          style={styles.shutterContainer}
          activeOpacity={0.8}
       onPress={async () => {
          const photo = await ref.current?.takePictureAsync({
            quality: 0.9,
            skipProcessing: true, // ✅ iOS 필수
          });

          if (!photo?.uri) return; // ✅ 핵심

          router.push({
            pathname: "/(tabs)/analysis/upload",
            params: { imageUri: photo.uri },
          });
        }}

        >
          <View style={styles.shutterOuter}>
            <View style={styles.shutterMiddle}>
              <View style={styles.shutterInner} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.shutterText}>촬영하기</Text>
      </LinearGradient>

      {/* 준비 상태 표시 */}
      {isReady && (
        <View style={styles.readyBadge}>
          <View style={styles.readyDot} />
          <Text style={styles.readyText}>준비 완료</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },

  // 권한 요청 화면
  permissionContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionBox: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  permissionIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  permissionIcon: {
    fontSize: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  permissionText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },

  // 상단 오버레이
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    zIndex: 10,
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignSelf: "flex-start",
  },
  backText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  instructionBox: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  topText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  // 가이드라인
  guidelineContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },

  // 코너 마크
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  topLeft: {
    top: height / 2 - 220,
    left: width / 2 - 160,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: height / 2 - 220,
    right: width / 2 - 160,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: height / 2 - 120,
    left: width / 2 - 160,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: height / 2 - 120,
    right: width / 2 - 160,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },

  // 하단 오버레이
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: "center",
    zIndex: 10,
  },

  // 팁
  tipsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  tipIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  tipIcon: {
    fontSize: 12,
  },
  tipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // 촬영 버튼
  shutterContainer: {
    alignItems: "center",
  },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  shutterMiddle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
  },
  shutterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 16,
    letterSpacing: 0.5,
  },

  // 준비 완료 배지
  readyBadge: {
    position: "absolute",
    top: 150,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(46, 204, 113, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  readyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  readyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});