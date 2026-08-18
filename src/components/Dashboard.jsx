import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GitBranch, Phone, AlertTriangle, TrendingUp, CheckCircle2, Briefcase } from 'lucide-react';

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

export default function Dashboard({ kpis, segChartData, stageChartData, vendedorData, alerts, openClient, setView }) {
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
