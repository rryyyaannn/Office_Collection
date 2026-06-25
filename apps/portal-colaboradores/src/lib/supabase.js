// Cliente Supabase do app (anon key; a RLS protege os dados por tenant/usuário).
// Habilitado só quando VITE_DATA_SOURCE=supabase e as chaves existem.
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const dataSource = import.meta.env.VITE_DATA_SOURCE || "mock";
export const supabaseEnabled = dataSource === "supabase" && !!url && !!anon;

export const supabase = url && anon
  ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } })
  : null;
