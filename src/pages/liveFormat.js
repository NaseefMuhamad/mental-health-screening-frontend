export const label = value => String(value ?? '—').replaceAll('_', ' ');
export const date = value => value ? new Date(value).toLocaleString() : '—';
export const iso = value => new Date(value).toISOString();
export const nowLocal = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
