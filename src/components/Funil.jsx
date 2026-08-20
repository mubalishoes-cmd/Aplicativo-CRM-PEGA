import React, { useState } from 'react';
import { STAGES } from '../lib/constants';
import { colors, spacing, radius, fontSize, shadow } from '../lib/theme';

// Mesma política de migração usada em Dashboard.jsx: cores sempre trocadas por
// token; espaçamento e tamanho de fonte só trocados quando o valor bate
// EXATAMENTE com um token (senão o texto/espaçamento mudaria alguns pixels).
// Paddings com 3 valores (ex.: '4px 6px 10px') foram deixados como estavam
// inteiros, mesmo quando uma das partes batia com um token, para não misturar
// template literal com número solto de um jeito confuso.

export default function Funil({ clients, updateClient, openClient }) {
  const [dragId, setDragId] = useState(null);
  return (
    <div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="font-display" style={{ fontSize: fontSize.xl, fontWeight: 700 }}>Funil Comercial</div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>Arraste os cartões entre as etapas para atualizar o estágio da negociação</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: spacing.md, overflowX: 'auto', paddingBottom: spacing.md }}>
        {STAGES.map(stage => {
          const items = clients.filter(c => c.etapa === stage.key);
          return (
            <div key={stage.key}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragId != null) updateClient(dragId, { etapa: stage.key }); setDragId(null); }}
              style={{ minWidth: 250, flexShrink: 0, background: colors.bgSubtle, borderRadius: radius.lg, padding: 10, maxHeight: '72vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: '4px 6px 10px' }}>
                <span className="font-mono" style={{ fontSize: 10, color: stage.color, fontWeight: 700, background: colors.bgSurface, padding: '2px 6px', borderRadius: 4 }}>{stage.icon}</span>
                <span style={{ fontSize: fontSize.sm, fontWeight: 700 }}>{stage.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: fontSize.xs, color: colors.textMuted, fontWeight: 600 }}>{items.length}</span>
              </div>
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: spacing.sm, paddingRight: 2 }}>
                {items.map(c => (
                  <div key={c.id} draggable onDragStart={() => setDragId(c.id)} onClick={() => openClient(c.id)}
                    className="card-hover"
                    style={{ background: colors.bgSurface, borderRadius: 9, padding: 10, cursor: 'grab', borderLeft: `3px solid ${stage.color}`, boxShadow: shadow.cardSubtle }}>
                    <div style={{ fontSize: fontSize.sm, fontWeight: 700, marginBottom: 2 }}>{c.empresa}</div>
                    <div style={{ fontSize: fontSize.xs, color: colors.textMuted, marginBottom: 6 }}>{c.segmento || 'Sem segmento'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10.5, color: colors.textSecondary }}>{c.contato || '—'}</span>
                      <span style={{ fontSize: 10, color: colors.textMuted }} className="font-mono">{c.vendedor}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: fontSize.xs, color: colors.emptyStateText, textAlign: 'center', padding: spacing.lg }}>Vazio</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
