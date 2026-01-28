import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import { signup } from "../../src/api/auth";
import VerifyEmailModal from "../../src/components/VerifyEmailModal";

/* ===== 상수 ===== */

const SKIN_CONCERNS = ["여드름", "기미/잡티", "주름", "모공", "민감성"];

const concernMap: Record<string, string> = {
  여드름: "PORE", // 임시 매핑
  "기미/잡티": "PIGMENT",
  주름: "WRINKLE",
  모공: "PORE",
  민감성: "SENSITIVE",
};

/* ===== 유효성 검사 ===== */

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string) =>
  password.length >= 8 &&
  /[A-Za-z]/.test(password) &&
  /[0-9]/.test(password);

/* ===== 컴포넌트 ===== */

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"M" | "F" | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);

  // 🔥 이메일 인증 안내 팝업
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const toggleConcern = (item: string) => {
    setConcerns((prev) =>
      prev.includes(item)
        ? prev.filter((c) => c !== item)
        : [...prev, item]
    );
  };

  const onSubmit = async () => {
    /* ===== 1️⃣ 필수값 검사 ===== */

    if (!name.trim()) {
      Alert.alert("입력 오류", "이름을 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("입력 오류", "이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("입력 오류", "이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (!password) {
      Alert.alert("입력 오류", "비밀번호를 입력해주세요.");
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        "비밀번호 오류",
        "비밀번호는 8자 이상이며\n영문과 숫자를 모두 포함해야 합니다."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("입력 오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    if (birthYear) {
      const year = Number(birthYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        Alert.alert("입력 오류", "출생년도를 다시 확인해주세요.");
        return;
      }
    }

    if (!agree) {
      Alert.alert("약관 동의", "이용약관에 동의해주세요.");
      return;
    }

    /* ===== 2️⃣ 회원가입 요청 ===== */

    try {
      await signup({
        email,
        password,
        name,
        gender,
        birthYear: birthYear ? Number(birthYear) : undefined,
        concerns: concerns.map((c) => concernMap[c]),
      });

      // 🔥 자동 로그인 ❌
      // 🔥 이메일 인증 안내 팝업 표시
      setShowVerifyModal(true);
    } catch (e: any) {
      Alert.alert(
        "회원가입 실패",
        e?.response?.data?.message ?? "서버 오류가 발생했습니다."
      );
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SkinCheck 회원가입</Text>
        <Text style={styles.subtitle}>
          간단한 정보로 맞춤 피부 분석을 시작해요
        </Text>

        <Text style={styles.sectionTitle}>기본 정보</Text>

        <TextInput
          style={styles.input}
          placeholder="이름"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="이메일"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호 (영문+숫자 8자 이상)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#999"
        />

        <Text style={styles.sectionTitle}>추가 정보 (선택)</Text>

        <Text style={styles.label}>성별</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.selectButton, gender === "M" && styles.selected]}
            onPress={() => setGender("M")}
          >
            <Text>남성</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectButton, gender === "F" && styles.selected]}
            onPress={() => setGender("F")}
          >
            <Text>여성</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="출생년도 (예: 1996)"
          keyboardType="numeric"
          value={birthYear}
          onChangeText={setBirthYear}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>피부 고민</Text>
        <View style={styles.wrap}>
          {SKIN_CONCERNS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.chip,
                concerns.includes(item) && styles.selected,
              ]}
              onPress={() => toggleConcern(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => setAgree(!agree)}>
          <Text style={styles.agree}>
            {agree ? "☑" : "☐"} 이용약관에 동의합니다 (필수)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, !agree && { opacity: 0.4 }]}
          disabled={!agree}
          onPress={onSubmit}
        >
          <Text style={styles.primaryText}>가입 완료</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.loginLink}>이미 계정이 있나요? 로그인</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔥 이메일 인증 팝업 */}
     <VerifyEmailModal
        visible={showVerifyModal}
        email={email}   // 🔥 이거 추가
        onClose={() => setShowVerifyModal(false)}
      />

    </>
  );
}

/* ===== 스타일 ===== */

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  selectButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selected: {
    backgroundColor: "#eee",
  },
  agree: {
    marginVertical: 16,
  },
  primaryButton: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
  },
  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 24,
    textAlign: "center",
    color: "#555",
  },
});
