import React, { useState } from 'react';
import { Truck, Building2, Plus, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import { STAGES, stageOf, selStyle, STATUS_COLOR } from '../lib/constants';
import { fmtDate } from '../lib/format';
import { colors, spacing, radius, fontSize } from '../lib/theme';

// Mesma política de migração dos arquivos anteriores: cor sempre trocada por
// token; espaçamento/raio/fonte só trocados quando o valor bate exatamente.
// O tom '#2B3648' (círculos/linhas inativas do trilho de etapas) não tem
// token correspondente em theme.js e foi mantido como estava — é específico
// desse componente (trilho sobre fundo escuro).

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: spacing.xs }}>{label}</div>
      {type === 'textarea' ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={2}
          style={{ width: '100%', padding: '7px 9px', borderRadius: 7, border: `1px solid ${colors.border}`, fontSize: fontSize.sm, resize: 'vertical' }} />
      ) : (
        <input value={value || ''} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '7px 9px', borderRadius: 7, border: `1px solid ${colors.border}`, fontSize: fontSize.sm }} />
      )}
    </div>
  );
}

export default function ClienteDetalhe({ client, updateClient, addTimelineEntry, setView, deleteClient }) {
  const [novaNota, setNovaNota] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const stg = stageOf(client.etapa);
  const sortedTimeline = [...client.timeline].sort((a,b) => (b.data||'').localeCompare(a.data||''));
  const stageIdx = STAGES.findIndex(s => s.key === client.etapa);

  async function handleExcluir() {
    setExcluindo(true);
    const ok = await deleteClient(client.id);
    setExcluindo(false);
    if (ok) setView('clientes');
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button onClick={() => setView('clientes')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: colors.info, fontSize: fontSize.sm, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={14} /> Voltar para clientes
        </button>

        {!confirmandoExclusao ? (
          <button onClick={() => setConfirmandoExclusao(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px solid ${colors.border}`, color: colors.danger, fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '6px 10px', borderRadius: 7 }}>
            <Trash2 size={13} /> Excluir cadastro
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: 12 }}>
            <span style={{ color: colors.danger, fontWeight: 600 }}>Excluir "{client.empresa}" permanentemente?</span>
            <button onClick={handleExcluir} disabled={excluindo}
              style={{ background: colors.danger, color: colors.bgSurface, border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }}>
              {excluindo ? 'Excluindo...' : 'Sim, excluir'}
            </button>
            <button onClick={() => setConfirmandoExclusao(false)}
              style={{ background: 'none', border: `1px solid ${colors.border}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <div className="font-display" style={{ fontSize: fontSize.xl, fontWeight: 700 }}>{client.empresa}</div>
          <div style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: 3 }} className="font-mono">{client.cnpj || 'CNPJ não informado'} · {client.segmento}</div>
        </div>
        <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
          <select value={client.status} onChange={e => updateClient(client.id, { status: e.target.value })} style={{ ...selStyle, fontWeight: 700, color: STATUS_COLOR[client.status] }}>
            {['Ativo','Prospect','Perdido','Recuperado'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ROUTE / STAGE TRACKER — signature element */}
      <div style={{ background: colors.textPrimary, borderRadius: radius.lg, padding: '18px 22px', marginBottom: 18, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 720 }}>
          {STAGES.filter(s => s.key !== 'Perdido').map((s, i, arr) => {
            const active = i <= stageIdx && client.etapa !== 'Perdido';
            const current = s.key === client.etapa;
            return (
              <React.Fragment key={s.key}>
                <div onClick={() => updateClient(client.id, { etapa: s.key })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flexShrink: 0, width: 96 }}>
                  <div style={{
                    width: current ? 30 : 22, height: current ? 30 : 22, borderRadius: '50%',
                    background: active ? s.color : '#2B3648', border: current ? `3px solid ${colors.bgSurface}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
                    boxShadow: current ? `0 0 0 4px ${s.color}44` : 'none'
                  }}>
                    {current && <Truck size={13} color={colors.textPrimary} />}
                  </div>
                  <div style={{ fontSize: 10, color: active ? colors.bgSurface : colors.textSecondary, marginTop: 6, textAlign: 'center', fontWeight: current ? 700 : 500 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: i < stageIdx ? s.color : '#2B3648', minWidth: 20, marginTop: -18 }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* FICHA */}
        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={15}/> Ficha da Empresa</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
            <Field label="Razão Social" value={client.razaoSocial} onChange={v => updateClient(client.id,{razaoSocial:v})} />
            <Field label="Nome Fantasia" value={client.nomeFantasia} onChange={v => updateClient(client.id,{nomeFantasia:v})} />
            <Field label="CNPJ" value={client.cnpj} onChange={v => updateClient(client.id,{cnpj:v})} />
            <Field label="Segmento" value={client.segmento} onChange={v => updateClient(client.id,{segmento:v})} />
            <Field label="Cidade" value={client.cidade} onChange={v => updateClient(client.id,{cidade:v})} />
            <Field label="Estado" value={client.estado} onChange={v => updateClient(client.id,{estado:v})} />
            <Field label="Contato principal" value={client.contato} onChange={v => updateClient(client.id,{contato:v})} />
            <Field label="Telefone / WhatsApp" value={client.telefone} onChange={v => updateClient(client.id,{telefone:v})} />
            <Field label="E-mail" value={client.email} onChange={v => updateClient(client.id,{email:v})} />
            <Field label="Vendedor responsável" value={client.vendedor} onChange={v => updateClient(client.id,{vendedor:v})} />
            <Field label="Modal utilizado" value={client.modal} onChange={v => updateClient(client.id,{modal:v})} />
            <Field label="Transportadora atual" value={client.transportadoraAtual} onChange={v => updateClient(client.id,{transportadoraAtual:v})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
            <Field label="Principais dores / necessidade" value={client.necessidade} onChange={v => updateClient(client.id,{necessidade:v})} type="textarea" />
            <Field label="Objeções levantadas" value={client.objecoes} onChange={v => updateClient(client.id,{objecoes:v})} type="textarea" />
          </div>
          <div style={{ marginTop: spacing.md }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>Probabilidade de fechamento: {client.probabilidade}%</div>
            <input type="range" min={0} max={100} value={client.probabilidade} onChange={e => updateClient(client.id,{probabilidade: Number(e.target.value)})} style={{ width: '100%' }} />
          </div>
        </div>

        {/* TIMELINE */}
        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl, display: 'flex', flexDirection: 'column', maxHeight: 640 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15}/> Histórico de Interações</div>
          <div style={{ fontSize: 11.5, color: colors.textMuted, marginBottom: spacing.md }}>{client.timeline.length} registros</div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <input value={novaNota} onChange={e => setNovaNota(e.target.value)} placeholder="Registrar visita, ligação, e-mail, proposta..."
              style={{ flex: 1, padding: `${spacing.sm}px 10px`, borderRadius: 7, border: `1px solid ${colors.border}`, fontSize: fontSize.sm }}
              onKeyDown={e => { if (e.key === 'Enter' && novaNota.trim()) { addTimelineEntry(client.id, novaNota); setNovaNota(''); } }} />
            <button onClick={() => { if (novaNota.trim()) { addTimelineEntry(client.id, novaNota); setNovaNota(''); } }}
              style={{ background: colors.textPrimary, color: colors.bgSurface, border: 'none', borderRadius: 7, padding: `0 ${spacing.md}px`, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Plus size={15} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, position: 'relative', paddingLeft: 14, borderLeft: `2px solid ${colors.borderCard}` }}>
            {sortedTimeline.map((t, i) => (
              <div key={i} style={{ marginBottom: spacing.lg, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -19, top: 2, width: 8, height: 8, borderRadius: '50%', background: colors.info }} />
                <div className="font-mono" style={{ fontSize: 10.5, color: colors.textMuted, fontWeight: 600 }}>{fmtDate(t.data)}</div>
                <div style={{ fontSize: fontSize.sm, marginTop: 2, lineHeight: 1.45 }}>{t.nota}</div>
              </div>
            ))}
            {sortedTimeline.length === 0 && <div style={{ fontSize: 12, color: colors.textMuted }}>Nenhum registro ainda.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
