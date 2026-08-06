import { createClient } from '@supabase/supabase-js';

// Vite (padrão em projetos criados com "npm create vite"): usa import.meta.env e o prefixo VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se o seu projeto foi criado com Create React App (react-scripts) em vez de Vite,
// apague as duas linhas acima e use estas, com o prefixo REACT_APP_:
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas. Veja o guia de configuração.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
