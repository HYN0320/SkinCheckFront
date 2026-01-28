import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const api = axios.create({
  baseURL: "https://nondespotic-haleigh-flashier.ngrok-free.dev/api",
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
