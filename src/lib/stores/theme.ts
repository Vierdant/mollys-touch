import { writable } from "svelte/store";

type Theme = "light" | "dark";

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>("dark");

  // Function to apply theme to document
  function applyTheme(theme: Theme) {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }

  // Initialize theme from localStorage or default to dark
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      set(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }
  }

  return {
    subscribe,
    toggle: () => {
      update((currentTheme) => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        if (typeof window !== "undefined") {
          localStorage.setItem("theme", newTheme);
        }
        applyTheme(newTheme);
        return newTheme;
      });
    },
    set: (theme: Theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
      }
      applyTheme(theme);
      set(theme);
    },
  };
}

export const theme = createThemeStore();
