import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  LayoutDashboard, GitBranch, Users, Search, Bell, Truck, Plane, Phone, Mail,
  MessageCircle, Calendar, MapPin, Building2, ChevronRight, X, Plus, AlertTriangle,
  TrendingUp, Clock, CheckCircle2, ArrowLeft, Filter, User, Briefcase, LogOut,
  Download, Loader2, Trash2, Upload
} from 'lucide-react';
import { supabase, supabaseConfigured } from './supabaseClient';
import * as XLSX from 'xlsx';

const STAGES = [
  { key: 'Lead', label: 'Lead', color: '#8C93A6', icon: '01', prazo: 3 },
  { key: 'Primeiro Contato', label: 'Primeiro Contato', color: '#2E5EAA', icon: '02', prazo: 5 },
  { key: 'Visita Agendada', label: 'Visita Agendada', color: '#3E7CB1', icon: '03', prazo: 7 },
  { key: 'Visita Realizada', label: 'Visita Realizada', color: '#4C9F70', icon: '04', prazo: 5 },
  { key: 'Cotação Enviada', label: 'Cotação Enviada', color: '#F5A524', icon: '05', prazo: 7 },
  { key: 'Negociação', label: 'Negociação', color: '#E8871E', icon: '06', prazo: 10 },
  { key: 'Cliente Ativo', label: 'Cliente Ativo', color: '#1C7C54', icon: '07', prazo: 0 },
  { key: 'Perdido', label: 'Perdido', color: '#B0463C', icon: '08', prazo: 0 },
];
const stageOf = (key) => STAGES.find(s => s.key === key) || STAGES[0];

const STATUS_COLOR = {
  'Ativo': '#1C7C54', 'Prospect': '#2E5EAA', 'Perdido': '#B0463C', 'Recuperado': '#F5A524'
};

function lastContactDate(client) {
  if (!client.timeline.length) return null;
  const dates = client.timeline.map(t => t.data).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
}
function daysSince(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return Math.floor((now - d) / 86400000);
}
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const [y,m,d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
function uid() { return Math.random().toString(36).slice(2, 10); }

// Converte uma linha do Supabase (snake_case) para o formato usado no app (camelCase)
function rowToClient(r) {
  return {
    id: r.id, empresa: r.empresa, razaoSocial: r.razao_social, nomeFantasia: r.nome_fantasia,
    cnpj: r.cnpj, ie: r.ie, segmento: r.segmento, contato: r.contato, telefone: r.telefone,
    whatsapp: r.whatsapp, email: r.email, endereco: r.endereco, cep: r.cep,
    cidade: r.cidade, estado: r.estado, site: r.site, instagram: r.instagram, linkedin: r.linkedin,
    status: r.status, etapa: r.etapa, vendedor: r.vendedor,
    transportadoraAtual: r.transportadora_atual, concorrentes: r.concorrentes,
    tipoOperacao: r.tipo_operacao, volumeMensal: r.volume_mensal, modal: r.modal,
    necessidade: r.necessidade, dores: r.dores, objecoes: r.objecoes, diferenciais: r.diferenciais,
    valorPotencial: r.valor_potencial, probabilidade: r.probabilidade, proximaAcao: r.proxima_acao,
    timeline: r.timeline || [],
  };
}

// Converte um patch em camelCase (vindo da UI) para snake_case (colunas do Supabase)
const FIELD_TO_COLUMN = {
  empresa: 'empresa', razaoSocial: 'razao_social', nomeFantasia: 'nome_fantasia', cnpj: 'cnpj',
  ie: 'ie', segmento: 'segmento', contato: 'contato', telefone: 'telefone', whatsapp: 'whatsapp',
  email: 'email', endereco: 'endereco', cep: 'cep', cidade: 'cidade', estado: 'estado',
  site: 'site', instagram: 'instagram', linkedin: 'linkedin', status: 'status', etapa: 'etapa',
  vendedor: 'vendedor', transportadoraAtual: 'transportadora_atual', concorrentes: 'concorrentes',
  tipoOperacao: 'tipo_operacao', volumeMensal: 'volume_mensal', modal: 'modal',
  necessidade: 'necessidade', dores: 'dores', objecoes: 'objecoes', diferenciais: 'diferenciais',
  valorPotencial: 'valor_potencial', probabilidade: 'probabilidade', proximaAcao: 'proxima_acao',
  timeline: 'timeline',
};
function patchToRow(patch) {
  const row = {};
  Object.entries(patch).forEach(([k, v]) => { if (FIELD_TO_COLUMN[k]) row[FIELD_TO_COLUMN[k]] = v; });
  return row;
}

// --- Importação de planilha (Excel/CSV) ---
function normalizeHeader(s) {
  return String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Converte uma linha da planilha (objeto com cabeçalhos originais) para uma linha da tabela `clients`.
// Retorna null se a linha não tiver ao menos o nome da empresa.
function mapImportRow(rawRow) {
  const entries = Object.entries(rawRow).map(([k, v]) => [normalizeHeader(k), v]);
  function find(aliases) {
    for (const [k, v] of entries) {
      if (aliases.includes(k) && String(v).trim() !== '') return v;
    }
    return undefined;
  }
  const empresa = find(['empresa', 'nome', 'nome da empresa', 'nome fantasia', 'razao social']);
  if (!empresa) return null;
  const telefone = find(['telefone', 'celular', 'whatsapp', 'fone']);
  return {
    empresa: String(empresa).trim(),
    razao_social: String(find(['razao social']) || empresa).trim(),
    nome_fantasia: String(empresa).trim(),
    cnpj: String(find(['cnpj']) || '').trim(),
    segmento: String(find(['segmento']) || '').trim(),
    contato: String(find(['contato', 'nome do contato']) || '').trim(),
    telefone: String(telefone || '').trim(),
    whatsapp: String(find(['whatsapp']) || telefone || '').trim(),
    email: String(find(['email', 'e-mail']) || '').trim(),
    cidade: String(find(['cidade']) || '').trim(),
    estado: String(find(['estado', 'uf']) || '').trim(),
    vendedor: String(find(['vendedor', 'responsavel']) || '').trim(),
    status: String(find(['status']) || 'Prospect').trim() || 'Prospect',
    etapa: String(find(['etapa']) || 'Lead').trim() || 'Lead',
    modal: 'Rodoviário',
    valor_potencial: Number(find(['valor potencial', 'valor'])) || 0,
    probabilidade: 30,
    proxima_acao: String(find(['proxima acao', 'proximo passo']) || '').trim(),
    timeline: [],
  };
}

function ConfigMissingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101828', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 32, width: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={20} color="#B0463C" />
          <div style={{ fontWeight: 700, fontSize: 16 }}>Configuração ausente</div>
        </div>
        <div style={{ fontSize: 13, color: '#5B6472', lineHeight: 1.5 }}>
          O app não conseguiu se conectar ao banco de dados porque as variáveis
          <code style={{ background: '#F5F6F8', padding: '1px 5px', borderRadius: 4, margin: '0 3px' }}>VITE_SUPABASE_URL</code>
          e/ou
          <code style={{ background: '#F5F6F8', padding: '1px 5px', borderRadius: 4, margin: '0 3px' }}>VITE_SUPABASE_ANON_KEY</code>
          não foram encontradas.
        </div>
        <div style={{ fontSize: 13, color: '#5B6472', lineHeight: 1.5 }}>
          Confira em <strong>Vercel → Settings → Environment Variables</strong> se elas estão cadastradas
          com esses nomes exatos, com os valores corretos (copiados de Project Settings → API no Supabase),
          e depois faça um <strong>Redeploy</strong>.
        </div>
      </div>
    </div>
  );
}

function LoadingScreen({ label }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F6F8', flexDirection: 'column', gap: 10 }}>
      <Loader2 size={22} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 13, color: '#5B6472' }}>{label || 'Carregando...'}</div>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError('E-mail ou senha inválidos.');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101828', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', borderRadius: 14, padding: 32, width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#F5A524,#E8871E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={18} color="#101828" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>ROTA CRM</div>
        </div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" type="email" required
          style={{ padding: '9px 11px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13.5 }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" required
          style={{ padding: '9px 11px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13.5 }} />
        {error && <div style={{ fontSize: 12, color: '#B0463C' }}>{error}</div>}
        <button type="submit" disabled={loading}
          style={{ background: '#101828', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

function exportClientsToExcel(clients) {
  const resumo = clients.map(c => ({
    Empresa: c.empresa, 'Razão Social': c.razaoSocial, CNPJ: c.cnpj, Segmento: c.segmento,
    Contato: c.contato, Telefone: c.telefone, Email: c.email, Cidade: c.cidade, Estado: c.estado,
    Vendedor: c.vendedor, Status: c.status, Etapa: c.etapa,
    'Probabilidade (%)': c.probabilidade, 'Valor Potencial': c.valorPotencial,
    'Próxima Ação': c.proximaAcao, 'Nº de Interações': c.timeline.length,
    'Último Contato': [...c.timeline].map(t => t.data).filter(Boolean).sort().slice(-1)[0] || '',
  }));

  const interacoes = [];
  clients.forEach(c => {
    c.timeline.forEach(t => {
      interacoes.push({ Empresa: c.empresa, Data: t.data, Nota: t.nota });
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumo), 'Clientes');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(interacoes), 'Interações');
  const hoje = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `rota-crm-relatorio-${hoje}.xlsx`);
}

export default function CRMApp() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) return <ConfigMissingScreen />;
  if (authLoading) return <LoadingScreen label="Verificando login..." />;
  if (!session) return <LoginScreen />;
  return <CRMDashboard session={session} />;
}

function CRMDashboard({ session }) {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.from('clients').select('*').order('id').then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setClients(data.map(rowToClient));
      setLoadingClients(false);
    });

    // Mantém os dois logins sincronizados em tempo real
    const channel = supabase.channel('clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setClients(prev => prev.some(c => c.id === payload.new.id) ? prev : [...prev, rowToClient(payload.new)]);
        } else if (payload.eventType === 'UPDATE') {
          setClients(prev => prev.map(c => c.id === payload.new.id ? rowToClient(payload.new) : c));
        } else if (payload.eventType === 'DELETE') {
          setClients(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  const [view, setView] = useState('dashboard');
  const [errorMsg, setErrorMsg] = useState(null);
  function notifyError(msg) {
    setErrorMsg(msg);
    window.clearTimeout(notifyError._t);
    notifyError._t = window.setTimeout(() => setErrorMsg(null), 6000);
  }
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterSegmento, setFilterSegmento] = useState('Todos');

  const selected = clients.find(c => c.id === selectedId);

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

  async function updateClient(id, patch) {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    const { error } = await supabase.from('clients').update(patchToRow(patch)).eq('id', id);
    if (error) {
      console.error('Falha ao salvar alteração:', error.message);
      notifyError('Não foi possível salvar essa alteração. Verifique sua conexão e tente novamente.');
    }
  }
  async function addTimelineEntry(id, nota) {
    if (!nota.trim()) return;
    const today = new Date().toISOString().slice(0,10);
    const client = clients.find(c => c.id === id);
    const novaTimeline = [...(client?.timeline || []), { data: today, nota }];
    setClients(prev => prev.map(c => c.id === id ? { ...c, timeline: novaTimeline } : c));
    const { error } = await supabase.from('clients').update({ timeline: novaTimeline }).eq('id', id);
    if (error) {
      console.error('Falha ao salvar interação:', error.message);
      notifyError('Não foi possível salvar essa anotação. Verifique sua conexão e tente novamente.');
    }
  }
  async function addClient(empresa) {
    if (!empresa.trim()) return;
    const row = {
      empresa, razao_social: empresa, nome_fantasia: empresa, status: 'Prospect',
      etapa: 'Lead', modal: 'Rodoviário', probabilidade: 30, valor_potencial: 0, timeline: [],
    };
    const { data, error } = await supabase.from('clients').insert(row).select().single();
    if (error) {
      console.error('Falha ao criar empresa:', error.message);
      notifyError('Não foi possível cadastrar essa empresa. Verifique sua conexão e tente novamente.');
      return;
    }
    setClients(prev => prev.some(c => c.id === data.id) ? prev : [...prev, rowToClient(data)]);
    return data.id;
  }
  // Insere várias linhas de uma vez (usado na importação de planilha).
  // Retorna { inserted, error }.
  async function importClients(rows) {
    if (!rows.length) return { inserted: 0, error: null };
    const { data, error } = await supabase.from('clients').insert(rows).select();
    if (error) {
      console.error('Falha ao importar planilha:', error.message);
      return { inserted: 0, error };
    }
    setClients(prev => [...prev, ...data.map(rowToClient)]);
    return { inserted: data.length, error: null };
  }
  async function deleteClient(id) {
    const anterior = clients;
    setClients(prev => prev.filter(c => c.id !== id));
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      console.error('Falha ao excluir:', error.message);
      notifyError('Não foi possível excluir esse cadastro. Verifique sua conexão e tente novamente.');
      setClients(anterior);
      return false;
    }
    return true;
  }
  function openClient(id) { setSelectedId(id); setView('detalhe'); }

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
          <button onClick={() => setErrorMsg(null)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, opacity: 0.8 }}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="card-hover" style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #ECEDF0', flex: 1, minWidth: 150 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 11.5, color: '#8C93A6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
        {Icon && <Icon size={15} color={color || '#8C93A6'} />}
      </div>
      <div className="font-display" style={{ fontSize: 28, fontWeight: 700, marginTop: 6, color: color || '#101828' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: '#8C93A6', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ kpis, segChartData, stageChartData, vendedorData, alerts, openClient, setView }) {
  const PALETTE = ['#2E5EAA','#F5A524','#1C7C54','#B0463C','#8C93A6','#3E7CB1','#E8871E','#4C9F70'];
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Painel Comercial</div>
        <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>Visão geral da carteira, funil e desempenho da equipe</div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <KpiCard label="Clientes Ativos" value={kpis.ativos} color="#1C7C54" icon={CheckCircle2} sub={`${kpis.total} empresas na base`} />
        <KpiCard label="Prospects" value={kpis.prospects} color="#2E5EAA" icon={TrendingUp} sub="em prospecção ativa" />
        <KpiCard label="Perdidos" value={kpis.perdidos} color="#B0463C" icon={AlertTriangle} sub="oportunidades encerradas" />
        <KpiCard label="Cotações em aberto" value={kpis.cotacoes} color="#F5A524" icon={Briefcase} sub="aguardando decisão" />
        <KpiCard label="Taxa de conversão" value={`${kpis.taxaConversao}%`} color="#101828" icon={GitBranch} sub="lead → cliente ativo" />
        <KpiCard label="Interações registradas" value={kpis.totalInteracoes} color="#101828" icon={Phone} sub="ligações, visitas, e-mails" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Funil Comercial</div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 14 }}>Distribuição de empresas por etapa</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={stageChartData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11.5, fill: '#5B6472' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F5F6F8' }} />
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {stageChartData.map((d,i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Top Segmentos</div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 10 }}>Empresas por segmento de atuação</div>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={segChartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {segChartData.map((d,i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {segChartData.slice(0,6).map((d,i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: '#5B6472' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i % PALETTE.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Volume por Vendedor</div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 14 }}>Empresas trabalhadas por responsável</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vendedorData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2E5EAA" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Alertas Inteligentes</div>
            <button onClick={() => setView('followup')} style={{ fontSize: 11.5, color: '#2E5EAA', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ver todos →</button>
          </div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 10 }}>Clientes sem contato há 30+ dias</div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {alerts.slice(0,6).map(({c, days}) => (
              <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px', borderBottom: '1px solid #F5F6F8', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.empresa}</div>
                  <div style={{ fontSize: 11, color: '#8C93A6' }}>{c.segmento}</div>
                </div>
                <div style={{ fontSize: 11, color: '#B0463C', fontWeight: 700, background: '#FBEAE7', padding: '2px 8px', borderRadius: 20 }}>
                  {days === null ? 'sem contato' : `${days}d`}
                </div>
              </div>
            ))}
            {alerts.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6', padding: 8 }}>Nenhum alerta no momento.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Funil({ clients, updateClient, openClient }) {
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

function ClienteLista({ clients, openClient, filterStatus, setFilterStatus, filterSegmento, setFilterSegmento, segmentos, total, addClient, importClients }) {
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

const selStyle = { padding: '7px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12.5, background: '#fff', color: '#101828' };

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8C93A6', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>{label}</div>
      {type === 'textarea' ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={2}
          style={{ width: '100%', padding: '7px 9px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12.5, resize: 'vertical' }} />
      ) : (
        <input value={value || ''} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '7px 9px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12.5 }} />
      )}
    </div>
  );
}

function ClienteDetalhe({ client, updateClient, addTimelineEntry, setView, deleteClient }) {
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
        <button onClick={() => setView('clientes')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#2E5EAA', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={14} /> Voltar para clientes
        </button>

        {!confirmandoExclusao ? (
          <button onClick={() => setConfirmandoExclusao(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #E5E7EB', color: '#B0463C', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '6px 10px', borderRadius: 7 }}>
            <Trash2 size={13} /> Excluir cadastro
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ color: '#B0463C', fontWeight: 600 }}>Excluir "{client.empresa}" permanentemente?</span>
            <button onClick={handleExcluir} disabled={excluindo}
              style={{ background: '#B0463C', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }}>
              {excluindo ? 'Excluindo...' : 'Sim, excluir'}
            </button>
            <button onClick={() => setConfirmandoExclusao(false)}
              style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{client.empresa}</div>
          <div style={{ fontSize: 12.5, color: '#8C93A6', marginTop: 3 }} className="font-mono">{client.cnpj || 'CNPJ não informado'} · {client.segmento}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={client.status} onChange={e => updateClient(client.id, { status: e.target.value })} style={{ ...selStyle, fontWeight: 700, color: STATUS_COLOR[client.status] }}>
            {['Ativo','Prospect','Perdido','Recuperado'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ROUTE / STAGE TRACKER — signature element */}
      <div style={{ background: '#101828', borderRadius: 12, padding: '18px 22px', marginBottom: 18, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 720 }}>
          {STAGES.filter(s => s.key !== 'Perdido').map((s, i, arr) => {
            const active = i <= stageIdx && client.etapa !== 'Perdido';
            const current = s.key === client.etapa;
            return (
              <React.Fragment key={s.key}>
                <div onClick={() => updateClient(client.id, { etapa: s.key })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flexShrink: 0, width: 96 }}>
                  <div style={{
                    width: current ? 30 : 22, height: current ? 30 : 22, borderRadius: '50%',
                    background: active ? s.color : '#2B3648', border: current ? '3px solid #fff' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
                    boxShadow: current ? `0 0 0 4px ${s.color}44` : 'none'
                  }}>
                    {current && <Truck size={13} color="#101828" />}
                  </div>
                  <div style={{ fontSize: 10, color: active ? '#fff' : '#5B6472', marginTop: 6, textAlign: 'center', fontWeight: current ? 700 : 500 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: i < stageIdx ? s.color : '#2B3648', minWidth: 20, marginTop: -18 }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* FICHA */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={15}/> Ficha da Empresa</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Principais dores / necessidade" value={client.necessidade} onChange={v => updateClient(client.id,{necessidade:v})} type="textarea" />
            <Field label="Objeções levantadas" value={client.objecoes} onChange={v => updateClient(client.id,{objecoes:v})} type="textarea" />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8C93A6', textTransform: 'uppercase', marginBottom: 6 }}>Probabilidade de fechamento: {client.probabilidade}%</div>
            <input type="range" min={0} max={100} value={client.probabilidade} onChange={e => updateClient(client.id,{probabilidade: Number(e.target.value)})} style={{ width: '100%' }} />
          </div>
        </div>

        {/* TIMELINE */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20, display: 'flex', flexDirection: 'column', maxHeight: 640 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15}/> Histórico de Interações</div>
          <div style={{ fontSize: 11.5, color: '#8C93A6', marginBottom: 12 }}>{client.timeline.length} registros</div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <input value={novaNota} onChange={e => setNovaNota(e.target.value)} placeholder="Registrar visita, ligação, e-mail, proposta..."
              style={{ flex: 1, padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12.5 }}
              onKeyDown={e => { if (e.key === 'Enter' && novaNota.trim()) { addTimelineEntry(client.id, novaNota); setNovaNota(''); } }} />
            <button onClick={() => { if (novaNota.trim()) { addTimelineEntry(client.id, novaNota); setNovaNota(''); } }}
              style={{ background: '#101828', color: '#fff', border: 'none', borderRadius: 7, padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Plus size={15} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, position: 'relative', paddingLeft: 14, borderLeft: '2px solid #ECEDF0' }}>
            {sortedTimeline.map((t, i) => (
              <div key={i} style={{ marginBottom: 16, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -19, top: 2, width: 8, height: 8, borderRadius: '50%', background: '#2E5EAA' }} />
                <div className="font-mono" style={{ fontSize: 10.5, color: '#8C93A6', fontWeight: 600 }}>{fmtDate(t.data)}</div>
                <div style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.45 }}>{t.nota}</div>
              </div>
            ))}
            {sortedTimeline.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6' }}>Nenhum registro ainda.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUp({ alerts, openClient, clients }) {
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
