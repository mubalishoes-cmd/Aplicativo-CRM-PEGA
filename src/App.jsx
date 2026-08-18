import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, GitBranch, Users, Search, Bell, Truck, X, AlertTriangle,
  User, LogOut, Download,
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabaseClient';
import { STAGES } from './lib/constants';
import { lastContactDate, daysSince } from './lib/format';
import { exportClientsToExcel } from './lib/exportExcel';
import { useAuth } from './hooks/useAuth';
import { useClients } from './hooks/useClients';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import ConfigMissingScreen from './components/ConfigMissingScreen';
import Dashboard from './components/Dashboard';
import Funil from './components/Funil';
import ClienteLista from './components/ClienteLista';
import ClienteDetalhe from './components/ClienteDetalhe';
import FollowUp from './components/FollowUp';

export default function CRMApp() {
  const { session, authLoading } = useAuth();

  if (!supabaseConfigured) return <ConfigMissingScreen />;
  if (authLoading) return <LoadingScreen label="Verificando login..." />;
  if (!session) return <LoginScreen />;
  return <CRMDashboard session={session} />;
}

function CRMDashboard({ session }) {
  const {
    clients, loading: loadingClients, errorMsg, clearError,
    updateClient, addTimelineEntry, addClient, importClients, deleteClient,
  } = useClients();

  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterSegmento, setFilterSegmento] = useState('Todos');

  const selected = clients.find(c => c.id === selectedId);
  function openClient(id) { setSelectedId(id); setView('detalhe'); }

  const segmentos = useMemo(() => {
    const s = new Set(clients.map(c => c.segmento).filter(Boolean));
    return ['Todos', ...Array.from(s).sort()];
  }, [clients]);

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || [c.empresa, c.contato, c.telefone, c.segmento, c.cnpj, c.vendedor]
        .some(f => (f || '').toLowerCase().includes(q));
      const matchesStatus = filterStatus === 'Todos' || c.status === filterStatus;
      const matchesSeg = filterSegmento === 'Todos' || c.segmento === filterSegmento;
      return matchesSearch && matchesStatus && matchesSeg;
    });
  }, [clients, search, filterStatus, filterSegmento]);

  const kpis = useMemo(() => {
    const ativos = clients.filter(c => c.status === 'Ativo').length;
    const prospects = clients.filter(c => c.status === 'Prospect').length;
    const perdidos = clients.filter(c => c.status === 'Perdido').length;
    const recuperados = clients.filter(c => c.status === 'Recuperado').length;
    const cotacoes = clients.filter(c => c.etapa === 'Cotação Enviada' || c.etapa === 'Negociação').length;
    const totalInteracoes = clients.reduce((s,c) => s + c.timeline.length, 0);
    const taxaConversao = clients.length ? Math.round((ativos / clients.length) * 1000) / 10 : 0;
    return { ativos, prospects, perdidos, recuperados, cotacoes, totalInteracoes, taxaConversao, total: clients.length };
  }, [clients]);

  const alerts = useMemo(() => {
    return clients
      .filter(c => c.status !== 'Perdido')
      .map(c => ({ c, last: lastContactDate(c), days: daysSince(lastContactDate(c)) }))
      .filter(x => x.days === null || x.days >= 30)
      .sort((a,b) => (b.days ?? 999) - (a.days ?? 999))
      .slice(0, 12);
  }, [clients]);

  const segChartData = useMemo(() => {
    const map = {};
    clients.forEach(c => { const k = c.segmento || 'Outros'; map[k] = (map[k]||0)+1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,value])=>({name,value}));
  }, [clients]);

  const stageChartData = useMemo(() => {
    return STAGES.map(s => ({ name: s.label, value: clients.filter(c => c.etapa === s.key).length, color: s.color }));
  }, [clients]);

  const vendedorData = useMemo(() => {
    const map = {};
    clients.forEach(c => { const k = c.vendedor || 'Não informado'; map[k] = (map[k]||0)+1; });
    return Object.entries(map).map(([name,value])=>({name,value}));
  }, [clients]);

  const navItems = [
    { key: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { key: 'funil', label: 'Funil Comercial', icon: GitBranch },
    { key: 'clientes', label: 'Clientes', icon: Users },
    { key: 'followup', label: 'Follow-up', icon: Bell, badge: alerts.length },
  ];

  if (loadingClients) return <LoadingScreen label="Carregando carteira de clientes..." />;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#F5F6F8', minHeight: '100vh', color: '#101828' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #D3D7DE; border-radius: 4px; }
        input, select, textarea { font-family: 'Inter', sans-serif; }
        .card-hover { transition: transform .15s ease, box-shadow .15s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16,24,40,0.08); }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* SIDEBAR */}
        <aside style={{ width: 236, background: '#101828', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #1F2937' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#F5A524,#E8871E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} color="#101828" />
            </div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>ROTA CRM</div>
              <div style={{ fontSize: 10, color: '#8C93A6', letterSpacing: 0.5 }}>TRANSPORTE & LOGÍSTICA</div>
            </div>
          </div>
          <nav style={{ padding: '16px 10px', flex: 1 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = view === item.key || (view === 'detalhe' && item.key === 'clientes');
              return (
                <button key={item.key} onClick={() => setView(item.key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    marginBottom: 4, borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: active ? '#1E293B' : 'transparent', color: active ? '#fff' : '#A6ADBB',
                    fontSize: 13.5, fontWeight: active ? 600 : 500, position: 'relative',
                    borderLeft: active ? '3px solid #F5A524' : '3px solid transparent'
                  }}>
                  <Icon size={16} />
                  {item.label}
                  {item.badge > 0 && (
                    <span style={{ marginLeft: 'auto', background: '#B0463C', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: 16, borderTop: '1px solid #1F2937', fontSize: 11, color: '#5B6472' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom: 4 }}><User size={12}/> {session.user.email}</div>
            <div style={{ marginBottom: 8 }}>{clients.length} empresas na base</div>
            <button onClick={() => supabase.auth.signOut()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#A6ADBB', fontSize: 11, cursor: 'pointer', padding: 0 }}>
              <LogOut size={12} /> Sair
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* TOPBAR */}
          <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ position: 'relative', flex: '0 1 380px' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: '#8C93A6' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar empresa, contato, telefone, segmento..."
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#2E5EAA'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
              <button onClick={() => exportClientsToExcel(clients)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#101828', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                <Download size={14} /> Exportar Excel
              </button>
              <div style={{ fontSize: 12, color: '#5B6472' }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
            </div>
          </div>

          <div style={{ padding: 28 }}>
            {view === 'dashboard' && <Dashboard kpis={kpis} segChartData={segChartData} stageChartData={stageChartData} vendedorData={vendedorData} alerts={alerts} openClient={openClient} setView={setView} />}
            {view === 'funil' && <Funil clients={filtered} updateClient={updateClient} openClient={openClient} search={search} setSearch={setSearch} />}
            {view === 'clientes' && <ClienteLista clients={filtered} openClient={openClient} filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterSegmento={filterSegmento} setFilterSegmento={setFilterSegmento} segmentos={segmentos} total={clients.length} addClient={addClient} importClients={importClients} />}
            {view === 'detalhe' && selected && <ClienteDetalhe client={selected} updateClient={updateClient} addTimelineEntry={addTimelineEntry} setView={setView} deleteClient={deleteClient} />}
            {view === 'followup' && <FollowUp alerts={alerts} openClient={openClient} clients={clients} />}
          </div>
        </main>
      </div>

      {errorMsg && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, background: '#B0463C', color: '#fff',
          padding: '12px 16px', borderRadius: 9, fontSize: 13, maxWidth: 340,
          boxShadow: '0 6px 18px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'flex-start', gap: 10, zIndex: 999,
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>{errorMsg}</div>
          <button onClick={clearError}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, opacity: 0.8 }}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
