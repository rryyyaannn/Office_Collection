import { useState } from "react";
import { Field } from "./ui";
import { buscaCep } from "../lib/cep";
import { maskCep } from "../lib/validators";

// Endereço com preenchimento automático por CEP (poka-yoke). value/onChange controlados.
export default function AddressFields({ value, onChange }) {
  const e = value || {};
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState("");
  const upd = (patch) => onChange({ ...e, ...patch });

  async function onCep(raw) {
    const cep = maskCep(raw);
    upd({ cep });
    setAviso("");
    if (cep.replace(/\D/g, "").length === 8) {
      setBuscando(true);
      const r = await buscaCep(cep);
      setBuscando(false);
      if (r.ok) onChange({ ...e, cep, ...r.endereco });
      else setAviso(r.reason === "nao_encontrado" ? "CEP não encontrado — preencha manualmente." : "Não consegui buscar o CEP — preencha manualmente.");
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-6">
      <div className="sm:col-span-2">
        <Field label="CEP" hint={buscando ? "buscando…" : aviso}>
          <input className="input" value={e.cep || ""} onChange={(ev) => onCep(ev.target.value)} placeholder="00000-000" inputMode="numeric" />
        </Field>
      </div>
      <div className="sm:col-span-4">
        <Field label="Logradouro"><input className="input" value={e.logradouro || ""} onChange={(ev) => upd({ logradouro: ev.target.value })} /></Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Número"><input className="input" value={e.numero || ""} onChange={(ev) => upd({ numero: ev.target.value })} /></Field>
      </div>
      <div className="sm:col-span-4">
        <Field label="Complemento (opcional)"><input className="input" value={e.complemento || ""} onChange={(ev) => upd({ complemento: ev.target.value })} /></Field>
      </div>
      <div className="sm:col-span-3">
        <Field label="Bairro"><input className="input" value={e.bairro || ""} onChange={(ev) => upd({ bairro: ev.target.value })} /></Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Cidade"><input className="input" value={e.cidade || ""} onChange={(ev) => upd({ cidade: ev.target.value })} /></Field>
      </div>
      <div className="sm:col-span-1">
        <Field label="UF"><input className="input" value={e.uf || ""} maxLength={2} onChange={(ev) => upd({ uf: ev.target.value.toUpperCase() })} /></Field>
      </div>
    </div>
  );
}
