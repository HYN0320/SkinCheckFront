import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Intro() {
  useEffect(() => {
    const clear = async () => {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("user");
    };
    clear();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");

      // 이미 로그인 되어 있으면 홈으로
      if (token) {
        router.replace("/(tabs)/home");
      }
    };

    checkToken();
  }, []);

  return (
    <ImageBackground
      source={require("../src/assets/intro.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>Skin Check</Text>
        <Text style={styles.subtitle}>
          피부를 이해하는 가장 쉬운 방법
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },
});
