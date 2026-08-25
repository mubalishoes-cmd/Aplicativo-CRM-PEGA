// Funções de data usadas para calcular atrasos de contato e exibir datas em pt-BR.

import { CAMPO_LABEL } from './constants';

export function lastContactDate(client) {
  if (!client.timeline.length) return null;
  const dates = client.timeline.map(t => t.data).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
}
export function daysSince(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return Math.floor((now - d) / 86400000);
}
export function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const [y,m,d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// Formata um timestamp ISO (ex.: changed_at do histórico) em data + hora pt-BR.
export function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Descreve uma linha do histórico de alterações em uma frase, usada no
// título do botão "Desfazer" (topbar) para mostrar o que será revertido.
export function describeChange(c) {
  if (!c) return '';
  const campo = CAMPO_LABEL[c.campo] || c.campo;
  return `${c.empresa}: ${campo} de "${c.valorAnterior || '—'}" para "${c.valorNovo || '—'}"`;
}
