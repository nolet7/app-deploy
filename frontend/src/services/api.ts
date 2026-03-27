const API_BASE = '/api';

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const fetchHealth = () => fetch(`${API_BASE}/healthz`).then(handle);
export const fetchTemplates = () => fetch(`${API_BASE}/templates`).then(handle);
export const fetchDeployments = () => fetch(`${API_BASE}/deployments`).then(handle);
export const fetchAppRequests = () => fetch('/app-requests').then(handle);

export const createDeployment = (payload: unknown) =>
  fetch(`${API_BASE}/deployments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
