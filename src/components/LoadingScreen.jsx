import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ label }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F6F8', flexDirection: 'column', gap: 10 }}>
      <Loader2 size={22} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 13, color: '#5B6472' }}>{label || 'Carregando...'}</div>
    </div>
  );
}
