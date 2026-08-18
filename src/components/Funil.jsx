import React, { useState } from 'react';
import { STAGES } from '../lib/constants';

export default function Funil({ clients, updateClient, openClient }) {
  const [dragId, setDragId] = useState(null);
  return (
    <div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Funil Comercial</div>
          <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>Arraste os cartões entre as etapas para atualizar o estágio da negociação</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
        {STAGES.map(stage => {
          const items = clients.filter(c => c.etapa === stage.key);
          return (
            <div key={stage.key}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragId != null) updateClient(dragId, { etapa: stage.key }); setDragId(null); }}
              style={{ minWidth: 250, flexShrink: 0, background: '#F0F1F3', borderRadius: 12, padding: 10, maxHeight: '72vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 10px' }}>
                <span className="font-mono" style={{ fontSize: 10, color: stage.color, fontWeight: 700, background: '#fff', padding: '2px 6px', borderRadius: 4 }}>{stage.icon}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{stage.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8C93A6', fontWeight: 600 }}>{items.length}</span>
              </div>
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 }}>
                {items.map(c => (
                  <div key={c.id} draggable onDragStart={() => setDragId(c.id)} onClick={() => openClient(c.id)}
                    className="card-hover"
                    style={{ background: '#fff', borderRadius: 9, padding: 10, cursor: 'grab', borderLeft: `3px solid ${stage.color}`, boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2 }}>{c.empresa}</div>
                    <div style={{ fontSize: 11, color: '#8C93A6', marginBottom: 6 }}>{c.segmento || 'Sem segmento'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10.5, color: '#5B6472' }}>{c.contato || '—'}</span>
                      <span style={{ fontSize: 10, color: '#8C93A6' }} className="font-mono">{c.vendedor}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: 11, color: '#B4B9C2', textAlign: 'center', padding: 16 }}>Vazio</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
