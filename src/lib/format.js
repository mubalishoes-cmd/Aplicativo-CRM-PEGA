// Funções de data usadas para calcular atrasos de contato e exibir datas em pt-BR.

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
