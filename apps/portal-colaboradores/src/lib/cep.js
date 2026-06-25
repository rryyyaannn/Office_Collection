// Busca de CEP (ViaCEP). Preenche o endereço automaticamente (poka-yoke).
// Roda no browser do colaborador; se falhar (offline/CEP inválido), cai p/ preenchimento manual.
import { onlyDigits } from "./validators";

export async function buscaCep(cep) {
  const d = onlyDigits(cep);
  if (d.length !== 8) return { ok: false, reason: "formato" };
  try {
    const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    const j = await r.json();
    if (j.erro) return { ok: false, reason: "nao_encontrado" };
    return {
      ok: true,
      endereco: {
        cep: `${d.slice(0, 5)}-${d.slice(5)}`,
        logradouro: j.logradouro || "",
        bairro: j.bairro || "",
        cidade: j.localidade || "",
        uf: j.uf || "",
      },
    };
  } catch {
    return { ok: false, reason: "rede" };
  }
}
