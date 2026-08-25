import React from 'react';
import { History, RotateCcw } from 'lucide-react';
import { fmtDateTime } from '../lib/format';
import { CAMPO_LABEL } from '../lib/constants';
import { colors, spacing, radius, fontSize } from '../lib/theme';

// Tela "Histórico": lista as alterações de etapa/status registradas em
// client_changes, mais recente primeiro. Só a alteração mais recente
// (topo da lista) pode ser desfeita — é o que "Desfazer" reverte, tanto
// aqui quanto no botão equivalente da topbar.

export default function Historico({ changes, openClient, undoLastChange, undoing }) {
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="font-display" style={{ fontSize: fontSize.xl, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={20} /> Histórico de Alterações
        </div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
          Mudanças de etapa e status registradas na base, mais recentes primeiro
        </div>
      </div>

      <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
        {changes.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md}px ${spacing.xs}px`, borderBottom: `1px solid ${colors.bgPage}`, gap: spacing.md }}>
            <div style={{ minWidth: 0 }}>
              <div onClick={() => openClient(c.clientId)} style={{ fontSize: fontSize.sm, fontWeight: 700, cursor: 'pointer' }}>{c.empresa}</div>
              <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
                {CAMPO_LABEL[c.campo] || c.campo}: {c.valorAnterior || '—'} → {c.valorNovo || '—'}
              </div>
              <div className="font-mono" style={{ fontSize: 10.5, color: colors.textMuted, marginTop: 3 }}>
                {fmtDateTime(c.changedAt)}{c.changedBy ? ` · ${c.changedBy}` : ''}
              </div>
            </div>
            {i === 0 && (
              <button onClick={undoLastChange} disabled={undoing}
                style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, background: colors.bgSubtle, color: colors.textPrimary, border: `1px solid ${colors.border}`, borderRadius: radius.sm, padding: `${spacing.xs}px ${spacing.md}px`, fontSize: fontSize.xs, fontWeight: 600, cursor: undoing ? 'default' : 'pointer', opacity: undoing ? 0.6 : 1 }}>
                <RotateCcw size={12} /> {undoing ? 'Desfazendo...' : 'Desfazer'}
              </button>
            )}
          </div>
        ))}
        {changes.length === 0 && <div style={{ fontSize: 12, color: colors.textMuted }}>Nenhuma alteração registrada ainda.</div>}
      </div>
    </div>
  );
}
