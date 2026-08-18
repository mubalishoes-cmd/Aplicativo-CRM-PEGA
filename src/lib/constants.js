// Etapas do funil comercial e utilitário para localizar uma etapa pela chave.

export const STAGES = [
  { key: 'Lead', label: 'Lead', color: '#8C93A6', icon: '01', prazo: 3 },
  { key: 'Primeiro Contato', label: 'Primeiro Contato', color: '#2E5EAA', icon: '02', prazo: 5 },
  { key: 'Visita Agendada', label: 'Visita Agendada', color: '#3E7CB1', icon: '03', prazo: 7 },
  { key: 'Visita Realizada', label: 'Visita Realizada', color: '#4C9F70', icon: '04', prazo: 5 },
  { key: 'Cotação Enviada', label: 'Cotação Enviada', color: '#F5A524', icon: '05', prazo: 7 },
  { key: 'Negociação', label: 'Negociação', color: '#E8871E', icon: '06', prazo: 10 },
  { key: 'Cliente Ativo', label: 'Cliente Ativo', color: '#1C7C54', icon: '07', prazo: 0 },
  { key: 'Perdido', label: 'Perdido', color: '#B0463C', icon: '08', prazo: 0 },
];

export const stageOf = (key) => STAGES.find(s => s.key === key) || STAGES[0];

export const STATUS_COLOR = {
  'Ativo': '#1C7C54', 'Prospect': '#2E5EAA', 'Perdido': '#B0463C', 'Recuperado': '#F5A524'
};

// Estilo compartilhado dos selects de filtro (ClienteLista, ClienteDetalhe).
export const selStyle = { padding: '7px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12.5, background: '#fff', color: '#101828' };
