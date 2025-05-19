import { IconButton } from "@/components/animate-ui/buttons/icon";
import { Moon } from "lucide-react";
import { useState } from "react";
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(localStorage.theme);
  function toggleTheme() {
    if (
      document.documentElement.classList.contains("dark") ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setTheme("dark");
    }
  }

  return <IconButton icon={Moon} active={theme === "dark"} onClick={toggleTheme} />;
}
