import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, GitBranch, Users, Search, Bell, X, AlertTriangle,
  User, LogOut, Download, History, RotateCcw,
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabaseClient';
import { STAGES } from './lib/constants';
import { lastContactDate, daysSince, describeChange } from './lib/format';
import { exportClientsToExcel } from './lib/exportExcel';
import { colors, spacing, radius, fontSize, fontFamily, shadow } from './lib/theme';
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
import Historico from './components/Historico';

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
    changes, undoing, undoLastChange,
  } = useClients(session.user.email);

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
    { key: 'historico', label: 'Histórico', icon: History },
  ];

  if (loadingClients) return <LoadingScreen label="Carregando carteira de clientes..." />;

  return (
    <div style={{ fontFamily: fontFamily.body, background: colors.bgPage, minHeight: '100vh', color: colors.textPrimary }}>
      <style>{`
        * { box-sizing: border-box; }
        .font-display { font-family: ${fontFamily.display}; }
        .font-mono { font-family: ${fontFamily.mono}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${colors.scrollbarThumb}; border-radius: 4px; }
        input, select, textarea { font-family: ${fontFamily.body}; }
        .card-hover { transition: transform .15s ease, box-shadow .15s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: ${shadow.cardHover}; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* SIDEBAR */}
        <aside style={{ width: 236, background: colors.sidebarBg, color: colors.textOnDark, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${colors.sidebarBorder}` }}>
            <div style={{ width: 34, height: 34, borderRadius: radius.sm, background: `linear-gradient(135deg,${colors.brandOrange},${colors.brandOrangeDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 17 L11 8 L15 12 L21 5" stroke={colors.textOnDark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 5 H21 V11" stroke={colors.textOnDark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: fontSize.md, letterSpacing: 0.3 }}>ROTA CRM</div>
              <div style={{ fontSize: 10, color: colors.textMuted, letterSpacing: 0.5 }}>TRANSPORTE & LOGÍSTICA</div>
            </div>
          </div>
          <nav style={{ padding: `${spacing.lg}px 10px`, flex: 1 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = view === item.key || (view === 'detalhe' && item.key === 'clientes');
              return (
                <button key={item.key} onClick={() => setView(item.key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: `10px ${spacing.md}px`,
                    marginBottom: spacing.xs, borderRadius: radius.sm, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: active ? colors.sidebarActiveBg : 'transparent', color: active ? colors.textOnDark : colors.textOnDarkMuted,
                    fontSize: fontSize.base, fontWeight: active ? 600 : 500, position: 'relative',
                    borderLeft: active ? `3px solid ${colors.brandOrange}` : '3px solid transparent'
                  }}>
                  <Icon size={16} />
                  {item.label}
                  {item.badge > 0 && (
                    <span style={{ marginLeft: 'auto', background: colors.danger, color: colors.textOnDark, fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: spacing.lg, borderTop: `1px solid ${colors.sidebarBorder}`, fontSize: fontSize.xs, color: colors.textSecondary }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom: spacing.xs }}><User size={12}/> {session.user.email}</div>
            <div style={{ marginBottom: spacing.sm }}>{clients.length} empresas na base</div>
            <button onClick={() => supabase.auth.signOut()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: colors.textOnDarkMuted, fontSize: fontSize.xs, cursor: 'pointer', padding: 0 }}>
              <LogOut size={12} /> Sair
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* TOPBAR */}
          <div style={{ background: colors.bgSurface, borderBottom: `1px solid ${colors.border}`, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: spacing.lg, position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ position: 'relative', flex: '0 1 380px' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: colors.textMuted }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar empresa, contato, telefone, segmento..."
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: 13, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = colors.info}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
              {changes.length > 0 && (
                <button onClick={undoLastChange} disabled={undoing} title={describeChange(changes[0])}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: colors.bgSubtle, color: colors.textPrimary, border: `1px solid ${colors.border}`, borderRadius: radius.sm, padding: `${spacing.sm}px ${spacing.md}px`, fontSize: fontSize.sm, fontWeight: 600, cursor: undoing ? 'default' : 'pointer', opacity: undoing ? 0.6 : 1 }}>
                  <RotateCcw size={14} /> {undoing ? 'Desfazendo...' : 'Desfazer'}
                </button>
              )}
              <button onClick={() => exportClientsToExcel(clients)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: colors.brandNavy, color: colors.textOnDark, border: 'none', borderRadius: radius.sm, padding: `${spacing.sm}px ${spacing.md}px`, fontSize: fontSize.sm, fontWeight: 600, cursor: 'pointer' }}>
                <Download size={14} /> Exportar Excel
              </button>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
            </div>
          </div>

          <div style={{ padding: spacing.xxl }}>
            {view === 'dashboard' && <Dashboard kpis={kpis} segChartData={segChartData} stageChartData={stageChartData} vendedorData={vendedorData} alerts={alerts} openClient={openClient} setView={setView} />}
            {view === 'funil' && <Funil clients={filtered} updateClient={updateClient} openClient={openClient} search={search} setSearch={setSearch} />}
            {view === 'clientes' && <ClienteLista clients={filtered} openClient={openClient} filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterSegmento={filterSegmento} setFilterSegmento={setFilterSegmento} segmentos={segmentos} total={clients.length} addClient={addClient} importClients={importClients} />}
            {view === 'detalhe' && selected && <ClienteDetalhe client={selected} updateClient={updateClient} addTimelineEntry={addTimelineEntry} setView={setView} deleteClient={deleteClient} />}
            {view === 'followup' && <FollowUp alerts={alerts} openClient={openClient} clients={clients} />}
            {view === 'historico' && <Historico changes={changes} openClient={openClient} undoLastChange={undoLastChange} undoing={undoing} />}
          </div>
        </main>
      </div>

      {errorMsg && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, background: colors.danger, color: colors.textOnDark,
          padding: `${spacing.md}px ${spacing.lg}px`, borderRadius: 9, fontSize: 13, maxWidth: 340,
          boxShadow: '0 6px 18px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'flex-start', gap: 10, zIndex: 999,
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>{errorMsg}</div>
          <button onClick={clearError}
            style={{ background: 'none', border: 'none', color: colors.textOnDark, cursor: 'pointer', padding: 0, opacity: 0.8 }}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
