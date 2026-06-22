import { Instagram, Linkedin, Facebook, MapPin, Mail, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import Button from "./Button";
import { useT } from "../i18n";

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/officecollectionuniformes/" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/office-collection-uniformes/" },
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/officeuniformes/" },
];

function FooterLinks({ title, items }) {
  return (
    <div>
      <h4 className="font-body text-[12px] font-semibold uppercase tracking-wide2 text-white">{title}</h4>
      <ul className="mt-5 space-y-3">
        {items.map((it) => (
          <li key={it}>
            <a href="#" className="font-body text-[14px] text-footer-text transition-colors hover:text-white">{it}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const t = useT();
  const f = t.footer;
  const enderecos = [
    { title: f.showroom, lines: f.spLines },
    { title: f.fabrica, lines: f.poaLines },
  ];

  return (
    <footer className="bg-footer-bg text-footer-text">
      {/* CTA de orçamento */}
      <div className="border-b border-footer-line">
        <div className="container-page flex flex-col items-center justify-between gap-5 py-10 text-center md:flex-row md:text-left">
          <div>
            <p className="font-script text-3xl leading-none text-white md:text-4xl">{f.ctaScript}</p>
            <p className="mt-1 font-body text-[14px] text-footer-text">{f.ctaText}</p>
          </div>
          <Button as="a" href="https://wa.me/message/X5MTMAWYZESNO1" target="_blank" rel="noopener noreferrer" variant="primary">
            {f.quote}
            <ArrowRight size={16} strokeWidth={2} />
          </Button>
        </div>
      </div>

      {/* Colunas */}
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Logo tone="light" size="md" />
            <p className="mt-5 max-w-xs font-body text-[14px] leading-relaxed text-footer-text">{f.brandTagline}</p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-footer-line text-footer-text transition-colors hover:border-white hover:text-white"
                >
                  <Icon size={17} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          <FooterLinks {...f.cols.inst} />
          <FooterLinks {...f.cols.prod} />
          <FooterLinks {...f.cols.atend} />

          {/* Onde estamos */}
          <div>
            <h4 className="font-body text-[12px] font-semibold uppercase tracking-wide2 text-white">{f.where}</h4>
            <div className="mt-5 space-y-5">
              {enderecos.map((addr) => (
                <address key={addr.title} className="not-italic">
                  <p className="flex items-center gap-2 font-body text-[12.5px] font-semibold uppercase tracking-wide2 text-white">
                    <MapPin size={13} strokeWidth={1.8} className="text-wine" />
                    {addr.title}
                  </p>
                  <div className="mt-1.5 space-y-0.5 font-body text-[13px] leading-relaxed text-footer-text">
                    {addr.lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                </address>
              ))}
              <p className="flex items-center gap-2 font-body text-[13px] text-footer-text">
                <Mail size={13} strokeWidth={1.8} className="text-wine" />
                comercial@officecollection.com.br
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-footer-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="font-body text-[12.5px] text-footer-text">
            © {new Date().getFullYear()} Office Collection · ACTI — Com. Serv. Ind. de Roupas Ltda.
          </p>
          <p className="font-body text-[12.5px] text-footer-text">{f.legalTagline}</p>
        </div>
      </div>
    </footer>
  );
}
