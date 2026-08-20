import React from 'react';
import { Loader2 } from 'lucide-react';
import { colors } from '../lib/theme';

export default function LoadingScreen({ label }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bgPage, flexDirection: 'column', gap: 10 }}>
      <Loader2 size={22} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 13, color: colors.textSecondary }}>{label || 'Carregando...'}</div>
    </div>
  );
}
