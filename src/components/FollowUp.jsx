import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { lastContactDate, daysSince } from '../lib/format';

export default function FollowUp({ alerts, openClient, clients }) {
  const semContato15 = clients.filter(c => {
    const d = daysSince(lastContactDate(c));
    return c.status !== 'Perdido' && d !== null && d >= 15 && d < 30;
  });
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Follow-up & Alertas</div>
        <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>Empresas que precisam de ação para não esfriar a negociação</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#B0463C' }}>
            <AlertTriangle size={16} /> Sem contato há 30+ dias ({alerts.length})
          </div>
          {alerts.map(({c, days}) => (
            <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 4px', borderBottom: '1px solid #F5F6F8', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.empresa}</div>
                <div style={{ fontSize: 11, color: '#8C93A6' }}>{c.contato} · {c.vendedor}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#B0463C', alignSelf: 'center' }}>{days === null ? 'nunca contatado' : `${days} dias`}</div>
            </div>
          ))}
          {alerts.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6' }}>Tudo em dia.</div>}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#E8871E' }}>
            <Clock size={16} /> Atenção: 15–29 dias sem contato ({semContato15.length})
          </div>
          {semContato15.map(c => {
            const days = daysSince(lastContactDate(c));
            return (
              <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 4px', borderBottom: '1px solid #F5F6F8', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.empresa}</div>
                  <div style={{ fontSize: 11, color: '#8C93A6' }}>{c.contato} · {c.vendedor}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#E8871E', alignSelf: 'center' }}>{days} dias</div>
              </div>
            );
          })}
          {semContato15.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6' }}>Nenhum caso no momento.</div>}
        </div>
      </div>
    </div>
  );
}
