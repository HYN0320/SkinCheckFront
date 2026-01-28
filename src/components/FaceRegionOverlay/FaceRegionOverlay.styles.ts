import { StyleSheet, ViewStyle } from "react-native";

/**
 * 공통 원형 / 타원형 스타일
 * 👉 ViewStyle 타입 명시 (중요)
 */
const circle: ViewStyle = {
  borderRadius: 999,
  overflow: "hidden",
  borderWidth: 2,
};

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /**
   * 이마
   */
  forehead: {
    position: "absolute",
    top: "14%",
    left: "38%",
    width: "24%",
    height: "12%",
    ...circle,
  },

  /**
   * 왼쪽 눈가
   */
  leftEye: {
    position: "absolute",
    top: "32%",
    left: "28%",
    width: "14%",
    height: "8%",
    ...circle,
  },

  /**
   * 오른쪽 눈가
   */
  rightEye: {
    position: "absolute",
    top: "32%",
    right: "28%",
    width: "14%",
    height: "8%",
    ...circle,
  },

  /**
   * 왼쪽 볼
   */
  leftCheek: {
    position: "absolute",
    top: "45%",
    left: "25%",
    width: "13%",
    height: "10%",
    ...circle,
  },

  /**
   * 오른쪽 볼
   */
  rightCheek: {
    position: "absolute",
    top: "45%",
    right: "25%",
    width: "13%",
    height: "10%",
    ...circle,
  },

  /**
   * 입술
   */
  lip: {
    position: "absolute",
    bottom: "37%",
    left: "38%",
    width: "24%",
    height: "7%",
    ...circle,
  },
});
