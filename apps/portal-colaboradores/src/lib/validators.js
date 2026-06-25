// Validações leves (poka-yoke). Poucos usuários → senha não precisa ser forte.
export const onlyDigits = (s) => (s || "").replace(/\D/g, "");

export function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((s || "").trim());
}

// senha: mínimo 6, ao menos 1 letra e 1 número (suficiente p/ poucos clientes)
export function checaSenha(s) {
  if (!s || s.length < 6) return "A senha precisa de ao menos 6 caracteres.";
  if (!/[a-zA-Z]/.test(s) || !/\d/.test(s)) return "Use letras e números na senha.";
  return null;
}

export function maskCep(s) {
  const d = onlyDigits(s).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function maskCpf(s) {
  const d = onlyDigits(s).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function enderecoCompleto(e) {
  if (!e) return false;
  return [e.cep, e.logradouro, e.numero, e.cidade, e.uf].every((x) => x && String(x).trim());
}

export function enderecoLinha(e) {
  if (!enderecoCompleto(e)) return "";
  const compl = e.complemento ? `, ${e.complemento}` : "";
  return `${e.logradouro}, ${e.numero}${compl} — ${e.bairro ? e.bairro + ", " : ""}${e.cidade}/${e.uf} — CEP ${e.cep}`;
}
