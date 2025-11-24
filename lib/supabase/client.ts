import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Por favor configúralas en tu archivo .env.local (desarrollo) o en Vercel (Settings → Environment Variables) y haz redeploy."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
