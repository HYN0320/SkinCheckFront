import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";
import { login as loginApi } from "../../src/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authLogin = useAuthStore((s) => s.login);

  const onLogin = async () => {
    try {
      const res = await loginApi(email, password);
      await authLogin(
      res.data.data.accessToken,
      { name: res.data.data.name }
    );
      router.replace("/(tabs)/home");
    } catch (e: any) {
      Alert.alert(
        "로그인 실패",
        e?.response?.data?.message ?? "이메일 또는 비밀번호 오류"
      );
    }
  };

  const onGoogleLogin = () => {
    Alert.alert("준비중", "구글 로그인은 곧 지원됩니다.");
  };

  const onKakaoLogin = () => {
    Alert.alert("준비중", "카카오 로그인은 곧 지원됩니다.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkinCheck</Text>
      <Text style={styles.subtitle}>피부 분석을 시작해보세요</Text>

      {/* 이메일 로그인 */}
      <TextInput
        style={styles.input}
        placeholder="이메일"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
        <Text style={styles.primaryText}>로그인</Text>
      </TouchableOpacity>

      {/* 구분선 */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>또는</Text>
        <View style={styles.line} />
      </View>

      {/* 소셜 로그인 */}
      <TouchableOpacity
        style={[styles.socialButton, styles.google]}
        onPress={onGoogleLogin}
      >
        <Text style={styles.socialText}>Google로 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.socialButton, styles.kakao]}
        onPress={onKakaoLogin}
      >
        <Text style={[styles.socialText, { color: "#000" }]}>
          카카오로 로그인
        </Text>
      </TouchableOpacity>

      {/* 회원가입 */}
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.link}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 8,
    color: "#999",
    fontSize: 12,
  },
  socialButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  google: {
    backgroundColor: "#4285F4",
  },
  kakao: {
    backgroundColor: "#FEE500",
  },
  socialText: {
    color: "#fff",
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },
});
