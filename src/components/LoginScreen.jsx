import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { colors, spacing, radius, fontSize, fontFamily } from '../lib/theme';

// Mesma política de migração dos arquivos anteriores.

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError('E-mail ou senha inválidos.');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.brandNavy, fontFamily: fontFamily.body }}>
      <form onSubmit={handleLogin} style={{ background: colors.bgSurface, borderRadius: 14, padding: 32, width: 320, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: spacing.sm }}>
          <div style={{ width: 34, height: 34, borderRadius: radius.sm, background: `linear-gradient(135deg,${colors.brandOrange},${colors.brandOrangeDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 17 L11 8 L15 12 L21 5" stroke={colors.textOnDark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 5 H21 V11" stroke={colors.textOnDark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: fontSize.lg }}>ROTA CRM</div>
        </div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" type="email" required
          style={{ padding: '9px 11px', borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: fontSize.base }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" required
          style={{ padding: '9px 11px', borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: fontSize.base }} />
        {error && <div style={{ fontSize: 12, color: colors.danger }}>{error}</div>}
        <button type="submit" disabled={loading}
          style={{ background: colors.brandNavy, color: colors.textOnDark, border: 'none', borderRadius: radius.sm, padding: '10px 0', fontSize: fontSize.base, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
