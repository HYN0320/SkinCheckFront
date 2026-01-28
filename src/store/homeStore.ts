import { create } from "zustand";
import { HomeResponse } from "@/types/home";
import { fetchHome } from "@/api/home";

interface HomeState {
  data: HomeResponse | null;
  loading: boolean;
  load: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  data: null,
  loading: false,

  load: async () => {
    set({ loading: true });
    try {
      const data = await fetchHome();
      set({ data });
    } finally {
      set({ loading: false });
    }
  },
}));
