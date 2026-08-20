import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { lastContactDate, daysSince } from '../lib/format';
import { colors, spacing, radius, fontSize } from '../lib/theme';

// Mesma política de migração dos arquivos anteriores.

export default function FollowUp({ alerts, openClient, clients }) {
  const semContato15 = clients.filter(c => {
    const d = daysSince(lastContactDate(c));
    return c.status !== 'Perdido' && d !== null && d >= 15 && d < 30;
  });
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="font-display" style={{ fontSize: fontSize.xl, fontWeight: 700 }}>Follow-up & Alertas</div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>Empresas que precisam de ação para não esfriar a negociação</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, marginBottom: 14, color: colors.danger }}>
            <AlertTriangle size={16} /> Sem contato há 30+ dias ({alerts.length})
          </div>
          {alerts.map(({c, days}) => (
            <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: `9px ${spacing.xs}px`, borderBottom: `1px solid ${colors.bgPage}`, cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: fontSize.sm, fontWeight: 700 }}>{c.empresa}</div>
                <div style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{c.contato} · {c.vendedor}</div>
              </div>
              <div style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.danger, alignSelf: 'center' }}>{days === null ? 'nunca contatado' : `${days} dias`}</div>
            </div>
          ))}
          {alerts.length === 0 && <div style={{ fontSize: 12, color: colors.textMuted }}>Tudo em dia.</div>}
        </div>

        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, marginBottom: 14, color: colors.brandOrangeDark }}>
            <Clock size={16} /> Atenção: 15–29 dias sem contato ({semContato15.length})
          </div>
          {semContato15.map(c => {
            const days = daysSince(lastContactDate(c));
            return (
              <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: `9px ${spacing.xs}px`, borderBottom: `1px solid ${colors.bgPage}`, cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: fontSize.sm, fontWeight: 700 }}>{c.empresa}</div>
                  <div style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{c.contato} · {c.vendedor}</div>
                </div>
                <div style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.brandOrangeDark, alignSelf: 'center' }}>{days} dias</div>
              </div>
            );
          })}
          {semContato15.length === 0 && <div style={{ fontSize: 12, color: colors.textMuted }}>Nenhum caso no momento.</div>}
        </div>
      </div>
    </div>
  );
}
