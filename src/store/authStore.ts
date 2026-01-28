import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: async (token, user) => {
    await AsyncStorage.setItem("accessToken", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("user");

    set({ token: null, user: null });
  },
}));
