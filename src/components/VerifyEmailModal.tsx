import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { resendVerifyEmail } from "../api/auth";

interface Props {
  visible: boolean;
  email: string;
  onClose: () => void;
}

export default function VerifyEmailModal({
  visible,
  email,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const onResend = async () => {
    try {
      setLoading(true);
      await resendVerifyEmail(email);
      Alert.alert("완료", "인증 메일을 다시 보냈어요.\n메일함을 확인해주세요.");
    } catch (e: any) {
      Alert.alert(
        "실패",
        e?.response?.data?.message ?? "인증 메일 재전송에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>📧 이메일 인증이 필요해요</Text>

          <Text style={styles.desc}>
            회원가입이 완료되었습니다.
            {"\n"}
            입력하신 이메일로 인증 메일을 보냈어요.
            {"\n\n"}
            메일을 확인하고 인증을 완료해주세요.
          </Text>

          {/* 로그인 이동 */}
          <TouchableOpacity
            style={styles.primary}
            onPress={() => {
              onClose();
              router.replace("/(auth)/login");
            }}
          >
            <Text style={styles.primaryText}>로그인 하러 가기</Text>
          </TouchableOpacity>

          {/* 재전송 */}
          <TouchableOpacity onPress={onResend} disabled={loading}>
            {loading ? (
              <ActivityIndicator style={{ marginTop: 12 }} />
            ) : (
              <Text style={styles.resend}>인증 메일 다시 보내기</Text>
            )}
          </TouchableOpacity>

          {/* 닫기 */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.later}>나중에 할게요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ===== 스타일 ===== */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  primary: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  resend: {
    textAlign: "center",
    color: "#111",
    fontSize: 14,
    marginBottom: 12,
    textDecorationLine: "underline",
  },
  later: {
    textAlign: "center",
    color: "#888",
    fontSize: 13,
  },
});
