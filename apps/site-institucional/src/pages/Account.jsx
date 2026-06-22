import { useState } from "react";
import { User, Package, LogOut, MapPin, Plus } from "lucide-react";
import { useT } from "../i18n";
import Button from "../components/Button";

const field =
  "h-11 w-full border border-line bg-surface px-3 font-body text-[14px] text-ink outline-none transition-colors focus:border-wine";
const label = "mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-wide2 text-stone";

export default function Account() {
  const t = useT();
  const a = t.account;
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("oc-user") || "null");
    } catch {
      return null;
    }
  });
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState("orders");

  const login = (e) => {
    e.preventDefault();
    const u = { name: email.split("@")[0] || "Cliente", email };
    localStorage.setItem("oc-user", JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem("oc-user");
    setUser(null);
  };

  // ===== Não logado: login =====
  if (!user) {
    return (
      <div className="bg-cream">
        <div className="container-content flex min-h-[70vh] items-center justify-center py-16">
          <div className="w-full max-w-sm border border-line bg-surface p-8 shadow-card">
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line text-wine">
                <User size={22} strokeWidth={1.5} />
              </span>
              <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">{a.title}</h1>
              <p className="mt-1 font-body text-[13px] text-ink-soft">{a.loginSubtitle}</p>
            </div>
            <form onSubmit={login} className="mt-7 space-y-4">
              <div>
                <label className={label}>{a.email}</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>{a.password}</label>
                <input type="password" required className={field} />
              </div>
              <Button variant="dark" className="w-full">{a.enter}</Button>
            </form>
            <p className="mt-5 text-center font-body text-[13px] text-stone">
              {a.noAccount} <span className="cursor-pointer font-semibold text-wine">{a.register}</span>
            </p>
            <p className="mt-4 text-center font-body text-[11px] text-stone">{a.demoNote}</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== Logado: painel =====
  const orders = [
    { n: "OC481209", date: "10 mar 2025", total: "R$ 1.218,00", status: a.delivered },
    { n: "OC472815", date: "02 fev 2025", total: "R$ 669,00", status: a.processing },
  ];

  const TABS = [
    { k: "orders", label: a.tabs.orders, Icon: Package },
    { k: "data", label: a.tabs.data, Icon: User },
    { k: "addresses", label: a.tabs.addresses, Icon: MapPin },
  ];

  return (
    <div className="bg-cream">
      <div className="container-page py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-script text-3xl leading-none text-wine">{a.welcome}, {user.name}</p>
            <p className="mt-1 font-body text-[13px] text-stone">{user.email}</p>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink-soft hover:text-wine">
            <LogOut size={15} /> {a.logout}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* Menu lateral */}
          <aside className="flex gap-2 overflow-x-auto lg:flex-col">
            {TABS.map(({ k, label: lbl, Icon }) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex shrink-0 items-center gap-2.5 border px-4 py-3 text-left font-body text-[13.5px] transition-colors ${
                  tab === k ? "border-wine bg-surface text-wine" : "border-line text-ink-soft hover:border-ink"
                }`}
              >
                <Icon size={16} /> {lbl}
              </button>
            ))}
          </aside>

          {/* Conteúdo */}
          <div className="border border-line bg-surface p-6 lg:p-8">
            {tab === "orders" && (
              orders.length ? (
                <ul className="divide-y divide-line">
                  {orders.map((o) => (
                    <li key={o.n} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-serif text-lg font-semibold text-ink">{a.orderSample} {o.n}</p>
                        <p className="font-body text-[12.5px] text-stone">{o.date} · {o.total}</p>
                      </div>
                      <span className={`px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wide2 ${
                        o.status === a.delivered ? "bg-[#7FB069]/15 text-[#4d7a37]" : "bg-wine/10 text-wine"
                      }`}>
                        {o.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-ink-soft">{a.noOrders}</p>
            )}

            {tab === "data" && (
              <form className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                <div className="sm:col-span-2"><label className={label}>{a.fullName}</label><input defaultValue={user.name} className={field} /></div>
                <div><label className={label}>{a.email}</label><input defaultValue={user.email} className={field} /></div>
                <div><label className={label}>{a.phone}</label><input className={field} /></div>
                <div className="sm:col-span-2 mt-1"><Button variant="primary">{a.save}</Button></div>
              </form>
            )}

            {tab === "addresses" && (
              <div className="space-y-4">
                <div className="border border-line p-5">
                  <p className="flex items-center gap-2 font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink">
                    <MapPin size={14} className="text-wine" /> {user.name}
                  </p>
                  <p className="mt-2 font-body text-[13.5px] leading-relaxed text-ink-soft">
                    Rua da Consolação, 2996 · Jardins<br />São Paulo / SP · 01416-000
                  </p>
                </div>
                <Button variant="outline"><Plus size={15} /> {a.addAddress}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
