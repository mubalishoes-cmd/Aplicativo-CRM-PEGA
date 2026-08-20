import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GitBranch, Phone, AlertTriangle, TrendingUp, CheckCircle2, Briefcase } from 'lucide-react';
import { colors, spacing, radius, fontSize } from '../lib/theme';

// Migração para os tokens de theme.js: só foram trocados os valores que batem
// EXATAMENTE com um token existente (cores sempre, espaçamento/fonte só quando
// o número é idêntico). Onde o valor atual não tem um token correspondente
// exato (ex.: fontSize 11.5, 13, 14; espaçamentos 6, 10, 14, 18, 22), ele foi
// mantido como está de propósito — a escala de theme.js foi pensada como uma
// futura simplificação, e trocar esses valores agora mudaria o tamanho/espaço
// renderizado em alguns pixels. Essa unificação fica para uma etapa visual
// separada e deliberada, não para esta refatoração (que não deve mudar nada
// na tela).

function KpiCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="card-hover" style={{ background: colors.bgSurface, borderRadius: radius.lg, padding: `${spacing.lg}px 18px`, border: `1px solid ${colors.borderCard}`, flex: 1, minWidth: 150 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 11.5, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
        {Icon && <Icon size={15} color={color || colors.textMuted} />}
      </div>
      <div className="font-display" style={{ fontSize: fontSize.xxl, fontWeight: 700, marginTop: 6, color: color || colors.textPrimary }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: colors.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ kpis, segChartData, stageChartData, vendedorData, alerts, openClient, setView }) {
  // Paleta de gráficos: mantida como hex direto de propósito (mesma decisão do
  // theme.js de não duplicar as cores de STAGES/constants.js aqui).
  const PALETTE = ['#2E5EAA','#F5A524','#1C7C54','#B0463C','#8C93A6','#3E7CB1','#E8871E','#4C9F70'];
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div className="font-display" style={{ fontSize: fontSize.xl, fontWeight: 700 }}>Painel Comercial</div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>Visão geral da carteira, funil e desempenho da equipe</div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <KpiCard label="Clientes Ativos" value={kpis.ativos} color={colors.success} icon={CheckCircle2} sub={`${kpis.total} empresas na base`} />
        <KpiCard label="Prospects" value={kpis.prospects} color={colors.info} icon={TrendingUp} sub="em prospecção ativa" />
        <KpiCard label="Perdidos" value={kpis.perdidos} color={colors.danger} icon={AlertTriangle} sub="oportunidades encerradas" />
        <KpiCard label="Cotações em aberto" value={kpis.cotacoes} color={colors.warning} icon={Briefcase} sub="aguardando decisão" />
        <KpiCard label="Taxa de conversão" value={`${kpis.taxaConversao}%`} color={colors.textPrimary} icon={GitBranch} sub="lead → cliente ativo" />
        <KpiCard label="Interações registradas" value={kpis.totalInteracoes} color={colors.textPrimary} icon={Phone} sub="ligações, visitas, e-mails" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: spacing.lg, marginBottom: spacing.lg }}>
        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Funil Comercial</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 14 }}>Distribuição de empresas por etapa</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={stageChartData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11.5, fill: colors.textSecondary }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: colors.bgPage }} />
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {stageChartData.map((d,i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Top Segmentos</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>Empresas por segmento de atuação</div>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={segChartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {segChartData.map((d,i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm }}>
            {segChartData.slice(0,6).map((d,i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: colors.textSecondary }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i % PALETTE.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Volume por Vendedor</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 14 }}>Empresas trabalhadas por responsável</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vendedorData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.bgSubtle} />
              <XAxis dataKey="name" tick={{ fontSize: fontSize.xs }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: fontSize.xs }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill={colors.info} radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: colors.bgSurface, borderRadius: radius.lg, border: `1px solid ${colors.borderCard}`, padding: spacing.xl }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Alertas Inteligentes</div>
            <button onClick={() => setView('followup')} style={{ fontSize: 11.5, color: colors.info, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ver todos →</button>
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>Clientes sem contato há 30+ dias</div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {alerts.slice(0,6).map(({c, days}) => (
              <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.sm}px ${spacing.xs}px`, borderBottom: `1px solid ${colors.bgPage}`, cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: fontSize.sm, fontWeight: 600 }}>{c.empresa}</div>
                  <div style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{c.segmento}</div>
                </div>
                <div style={{ fontSize: fontSize.xs, color: colors.danger, fontWeight: 700, background: '#FBEAE7' /* tom quase igual a colors.dangerBg (#FBEAE8), já assim antes da migração — não unificado agora para não alterar o pixel renderizado */, padding: `2px ${spacing.sm}px`, borderRadius: 20 }}>
                  {days === null ? 'sem contato' : `${days}d`}
                </div>
              </div>
            ))}
            {alerts.length === 0 && <div style={{ fontSize: 12, color: colors.textMuted, padding: spacing.sm }}>Nenhum alerta no momento.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
