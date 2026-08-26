import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { colors, fontSize, fontFamily } from '../lib/theme';

export default function ConfigMissingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.brandNavy, fontFamily: fontFamily.body }}>
      <div style={{ background: colors.bgSurface, borderRadius: 14, padding: 32, width: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={20} color={colors.danger} />
          <div style={{ fontWeight: 700, fontSize: fontSize.lg }}>Configuração ausente</div>
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
          O app não conseguiu se conectar ao banco de dados porque as variáveis
          <code style={{ background: colors.bgPage, padding: '1px 5px', borderRadius: 4, margin: '0 3px' }}>VITE_SUPABASE_URL</code>
          e/ou
          <code style={{ background: colors.bgPage, padding: '1px 5px', borderRadius: 4, margin: '0 3px' }}>VITE_SUPABASE_ANON_KEY</code>
          não foram encontradas.
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
          Confira em <strong>Vercel → Settings → Environment Variables</strong> se elas estão cadastradas
          com esses nomes exatos, com os valores corretos (copiados de Project Settings → API no Supabase),
          e depois faça um <strong>Redeploy</strong>.
        </div>
      </div>
    </div>
  );
}
