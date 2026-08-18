import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfigMissingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101828', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 32, width: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={20} color="#B0463C" />
          <div style={{ fontWeight: 700, fontSize: 16 }}>Configuração ausente</div>
        </div>
        <div style={{ fontSize: 13, color: '#5B6472', lineHeight: 1.5 }}>
          O app não conseguiu se conectar ao banco de dados porque as variáveis
          <code style={{ background: '#F5F6F8', padding: '1px 5px', borderRadius: 4, margin: '0 3px' }}>VITE_SUPABASE_URL</code>
          e/ou
          <code style={{ background: '#F5F6F8', padding: '1px 5px', borderRadius: 4, margin: '0 3px' }}>VITE_SUPABASE_ANON_KEY</code>
          não foram encontradas.
        </div>
        <div style={{ fontSize: 13, color: '#5B6472', lineHeight: 1.5 }}>
          Confira em <strong>Vercel → Settings → Environment Variables</strong> se elas estão cadastradas
          com esses nomes exatos, com os valores corretos (copiados de Project Settings → API no Supabase),
          e depois faça um <strong>Redeploy</strong>.
        </div>
      </div>
    </div>
  );
}
