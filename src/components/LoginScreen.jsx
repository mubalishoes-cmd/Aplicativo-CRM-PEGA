import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101828', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', borderRadius: 14, padding: 32, width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#F5A524,#E8871E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={18} color="#101828" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>ROTA CRM</div>
        </div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" type="email" required
          style={{ padding: '9px 11px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13.5 }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" required
          style={{ padding: '9px 11px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13.5 }} />
        {error && <div style={{ fontSize: 12, color: '#B0463C' }}>{error}</div>}
        <button type="submit" disabled={loading}
          style={{ background: '#101828', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
