import { create } from "zustand";
import type { ThemeStore } from "../types";


const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme)
    set({ theme })
  },
}));

export default useThemeStore;