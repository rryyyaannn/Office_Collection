import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useT } from "../i18n";

/**
 * Botão flutuante de WhatsApp com animação de pulse.
 * Aparece após um leve scroll para não competir com o hero.
 */
export default function WhatsappFloat() {
  const t = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/message/X5MTMAWYZESNO1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.wa}
      className={`fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 animate-pulse-ring hover:scale-105 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <MessageCircle size={28} strokeWidth={2} fill="currentColor" className="text-white" />
    </a>
  );
}
