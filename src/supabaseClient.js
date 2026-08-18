import { createClient } from '@supabase/supabase-js';

// Vite (padrão em projetos criados com "npm create vite"): usa import.meta.env e o prefixo VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se o seu projeto foi criado com Create React App (react-scripts) em vez de Vite,
// apague as duas linhas acima e use estas, com o prefixo REACT_APP_:
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// true somente se as duas variáveis estiverem realmente definidas.
// O App.jsx usa isso para mostrar uma tela explicativa em vez de travar com tela preta.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
