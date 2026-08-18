import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Plus, Upload } from 'lucide-react';
import { stageOf, selStyle, STATUS_COLOR } from '../lib/constants';
import { mapImportRow } from '../lib/mappers';

export default function ClienteLista({ clients, openClient, filterStatus, setFilterStatus, filterSegmento, setFilterSegmento, segmentos, total, addClient, importClients }) {
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [importando, setImportando] = useState(false);
  const [importResult, setImportResult] = useState(null);

  async function handleAdd() {
    if (!novaEmpresa.trim() || salvando) return;
    setSalvando(true);
    const id = await addClient(novaEmpresa.trim());
    setSalvando(false);
    if (id != null) { setNovaEmpresa(''); openClient(id); }
  }

  async function handleImportFile(e) {
    const file = e.target.files[0];
    e.target.value = ''; // permite escolher o mesmo arquivo de novo depois
    if (!file) return;
    setImportando(true);
    setImportResult(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      const mapped = rawRows.map(mapImportRow).filter(Boolean);
      if (!mapped.length) {
        setImportResult({ ok: false, msg: 'Nenhuma linha válida encontrada. A planilha precisa ter uma coluna "Empresa" (ou "Nome") preenchida.' });
      } else {
        const { inserted, error } = await importClients(mapped);
        if (error) setImportResult({ ok: false, msg: 'Erro ao salvar no banco. Tente novamente em instantes.' });
        else setImportResult({ ok: true, msg: `${inserted} de ${rawRows.length} linha(s) importada(s) com sucesso.` });
      }
    } catch (err) {
      setImportResult({ ok: false, msg: 'Não foi possível ler o arquivo. Confirme que é um .xlsx, .xls ou .csv válido.' });
    }
    setImportando(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Clientes</div>
          <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>{clients.length} de {total} empresas</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
            {['Todos','Ativo','Prospect','Perdido','Recuperado'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterSegmento} onChange={e => setFilterSegmento(e.target.value)} style={selStyle}>
            {segmentos.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={novaEmpresa} onChange={e => setNovaEmpresa(e.target.value)} placeholder="Nome da nova empresa..."
          style={{ flex: '0 1 320px', padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12.5 }}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} />
        <button onClick={handleAdd} disabled={salvando}
          style={{ background: '#101828', color: '#fff', border: 'none', borderRadius: 7, padding: '0 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600 }}>
          <Plus size={14} /> Nova Empresa
        </button>
        <label style={{ background: '#fff', color: '#101828', border: '1px solid #E5E7EB', borderRadius: 7, padding: '8px 14px', cursor: importando ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, opacity: importando ? 0.6 : 1 }}>
          <Upload size={14} /> {importando ? 'Importando...' : 'Importar Planilha'}
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImportFile} disabled={importando} style={{ display: 'none' }} />
        </label>
      </div>
      {importResult && (
        <div style={{
          marginBottom: 14, fontSize: 12.5, padding: '8px 12px', borderRadius: 7,
          background: importResult.ok ? '#EAF6EF' : '#FBEAE8', color: importResult.ok ? '#1C7C54' : '#B0463C',
        }}>
          {importResult.msg}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.2fr 1fr 1fr 1fr', padding: '10px 18px', fontSize: 11, fontWeight: 700, color: '#8C93A6', textTransform: 'uppercase', letterSpacing: 0.3, borderBottom: '1px solid #ECEDF0' }}>
          <div>Empresa</div><div>Segmento</div><div>Contato</div><div>Vendedor</div><div>Etapa</div><div>Status</div>
        </div>
        <div style={{ maxHeight: '62vh', overflowY: 'auto' }}>
          {clients.map(c => {
            const stg = stageOf(c.etapa);
            return (
              <div key={c.id} onClick={() => openClient(c.id)}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.2fr 1fr 1fr 1fr', padding: '11px 18px', fontSize: 12.5, borderBottom: '1px solid #F5F6F8', cursor: 'pointer', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ fontWeight: 700 }}>{c.empresa}</div>
                <div style={{ color: '#5B6472' }}>{c.segmento || '—'}</div>
                <div style={{ color: '#5B6472' }}>{c.contato || '—'}</div>
                <div style={{ color: '#5B6472' }} className="font-mono">{c.vendedor}</div>
                <div><span style={{ fontSize: 10.5, fontWeight: 700, color: stg.color, background: stg.color+'18', padding: '3px 8px', borderRadius: 20 }}>{stg.label}</span></div>
                <div><span style={{ fontSize: 10.5, fontWeight: 700, color: STATUS_COLOR[c.status], background: (STATUS_COLOR[c.status]||'#888')+'18', padding: '3px 8px', borderRadius: 20 }}>{c.status}</span></div>
              </div>
            );
          })}
          {clients.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#8C93A6', fontSize: 13 }}>Nenhuma empresa encontrada com esse filtro.</div>}
        </div>
      </div>
    </div>
  );
}
