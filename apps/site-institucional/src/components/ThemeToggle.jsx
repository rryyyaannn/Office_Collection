import { useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Alterna entre tema claro e escuro.
 * O estado inicial é definido por um script anti-FOUC no index.html, que aplica
 * a classe `dark` no <html> antes da renderização. Aqui só sincronizamos e
 * persistimos a preferência.
 */
export default function ThemeToggle({ className = "" }) {
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-anim");
    const next = !dark;
    root.classList.toggle("dark", next);
    setDark(next);
    try {
      localStorage.setItem("oc-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    window.clearTimeout(window.__ocThemeT);
    window.__ocThemeT = window.setTimeout(() => root.classList.remove("theme-anim"), 450);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={dark}
      title={dark ? "Tema claro" : "Tema escuro"}
      className={`grid h-8 w-8 place-items-center text-ink transition-colors hover:text-wine ${className}`}
    >
      {dark ? <Sun size={18} strokeWidth={1.7} /> : <Moon size={18} strokeWidth={1.7} />}
    </button>
  );
}
