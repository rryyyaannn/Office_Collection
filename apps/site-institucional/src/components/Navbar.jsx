import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  LogIn,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import Logo from "./Logo";
import AnnouncementBar from "./AnnouncementBar";
import ThemeToggle from "./ThemeToggle";
import { useT, useLang } from "../i18n";
import { useCart } from "../cart";

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/officecollectionuniformes/" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/office-collection-uniformes/" },
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/officeuniformes/" },
];

// Submenu de Produtos por TIPO DE CLIENTE — leva às rotas de segmento
const PRODUTOS = [
  { key: "hospitais", href: "segmento/saude" },
  { key: "hotelaria", href: "segmento/hotelaria" },
  { key: "aviacao", href: "segmento/aviacao" },
  { key: "ab", href: "produtos" },
  { key: "social", href: "segmento/social" },
  { key: "servicos", href: "produtos" },
  { key: "todos", href: "produtos" },
];

// Ordem dos links = ordem em que as seções aparecem na página (funil)
const LINKS = [
  { key: "produtos", href: "produtos", dropdown: PRODUTOS },
  { key: "lookbook", href: "#estudio" },
  { key: "blog", href: "#blog" },
  { key: "historia", href: "#historia" },
  { key: "esg", href: "#esg" },
];

export default function Navbar() {
  const t = useT();
  const { lang, setLang, langs } = useLang();
  const { count, setOpen: setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header id="top" className="sticky top-0 z-50">
      <AnnouncementBar />

      <div
        className={`bg-cream/95 backdrop-blur-sm transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_24px_-18px_rgba(38,35,35,0.5)]" : ""
        }`}
      >
        <div className="container-page">
          {/* Linha 1: social · logo · idioma + ações */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div className="flex flex-1 items-center gap-4">
              <button className="lg:hidden text-ink" aria-label="Menu" onClick={() => setMobileOpen(true)}>
                <Menu size={22} strokeWidth={1.5} />
              </button>
              <div
                className={`hidden lg:flex items-center gap-4 text-ink-soft transition-all duration-300 overflow-hidden ${
                  scrolled ? "max-w-0 opacity-0" : "max-w-[220px] opacity-100"
                }`}
              >
                {SOCIALS.map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-wine transition-colors">
                    <Icon size={17} strokeWidth={1.6} />
                  </a>
                ))}
              </div>
            </div>

            <Logo size={scrolled ? "sm" : "md"} className="shrink-0 transition-all" />

            <div className="flex flex-1 items-center justify-end gap-4 text-ink sm:gap-5">
              <Link
                to="/acesso"
                className="hidden items-center gap-1.5 rounded-btn border border-wine/60 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide2 text-wine transition-colors hover:bg-wine hover:text-white sm:inline-flex"
              >
                <LogIn size={14} strokeWidth={1.8} /> {t.nav.acesso}
              </Link>
              <div className="hidden items-center gap-1 text-[11px] font-semibold tracking-wide2 md:flex">
                {langs.map((l, i) => (
                  <span key={l} className="flex items-center">
                    {i > 0 && <span className="mx-1 text-line">|</span>}
                    <button
                      onClick={() => setLang(l)}
                      aria-pressed={lang === l}
                      className={`transition-colors ${lang === l ? "text-wine" : "text-stone hover:text-ink"}`}
                    >
                      {l}
                    </button>
                  </span>
                ))}
              </div>
              <ThemeToggle />
              <Link to="/produtos" aria-label={t.nav.search} className="hover:text-wine transition-colors">
                <Search size={19} strokeWidth={1.6} />
              </Link>
              <Link to="/conta" aria-label={t.nav.clientArea} className="hidden hover:text-wine transition-colors sm:inline-flex">
                <User size={19} strokeWidth={1.6} />
              </Link>
              <button aria-label={t.nav.bag} onClick={() => setCartOpen(true)} className="relative hover:text-wine transition-colors">
                <ShoppingBag size={19} strokeWidth={1.6} />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-wine text-[9px] font-semibold text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Linha 2: menu (desktop) */}
          <nav className="hidden items-center justify-center gap-8 border-t border-line/70 py-3 lg:flex">
            {LINKS.map((link) => (
              <div key={link.key} className="group relative">
                <Link
                  to={`/${link.href}`}
                  className="flex items-center gap-1 py-1 font-body text-[14px] tracking-wide text-ink transition-colors hover:text-wine"
                >
                  {t.nav[link.key]}
                  {link.dropdown && (
                    <ChevronDown size={13} className="opacity-60 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                {link.dropdown && (
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[240px] border border-line bg-surface p-5 shadow-card">
                      <p className="mb-3 font-script text-2xl leading-none text-wine">{t.nav.bySegment}</p>
                      <ul className="space-y-2.5">
                        {link.dropdown.map((item) => (
                          <li key={item.key}>
                            <Link to={`/${item.href}`} className="block font-body text-[13.5px] text-ink-soft transition-colors hover:text-wine">
                              {t.nav.prod[item.key]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Drawer mobile */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "visible" : "invisible"}`} aria-hidden={!mobileOpen}>
        <div
          className={`absolute inset-0 bg-graphite/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[84%] max-w-sm overflow-y-auto bg-cream shadow-lift transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <Logo size="sm" />
            <button aria-label="Fechar" onClick={() => setMobileOpen(false)}>
              <X size={22} strokeWidth={1.5} className="text-ink" />
            </button>
          </div>

          <nav className="px-6 py-6">
            <Link
              to="/acesso"
              onClick={() => setMobileOpen(false)}
              className="mb-5 flex items-center justify-center gap-2 rounded-btn bg-wine px-4 py-3 text-[13px] font-semibold uppercase tracking-wide2 text-white"
            >
              <LogIn size={16} strokeWidth={1.8} /> {t.nav.acesso}
            </Link>
            <ul className="space-y-1">
              {LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    to={`/${link.href}`}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-line/60 py-3 font-serif text-xl text-ink transition-colors hover:text-wine"
                  >
                    {t.nav[link.key]}
                  </Link>
                  {link.dropdown && (
                    <ul className="mb-2 ml-1 mt-1 space-y-1">
                      {link.dropdown.map((item) => (
                        <li key={item.key}>
                          <Link
                            to={`/${item.href}`}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1.5 font-body text-[14px] text-ink-soft transition-colors hover:text-wine"
                          >
                            {t.nav.prod[item.key]}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-3 border-t border-line pt-6">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[12px] font-semibold tracking-wide2 ${lang === l ? "text-wine" : "text-stone"}`}
                >
                  {l}
                </button>
              ))}
              <span className="mx-1 text-line">·</span>
              {SOCIALS.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-ink-soft hover:text-wine">
                  <Icon size={18} strokeWidth={1.6} />
                </a>
              ))}
              <ThemeToggle className="ml-auto" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
