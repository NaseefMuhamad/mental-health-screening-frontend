export const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800';
export function routeParam(name) {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.hash.split('?')[1] || '').get(name) || '';
}
export function detailLink(type, id) { return `#/${type}/details?id=${encodeURIComponent(id)}`; }
