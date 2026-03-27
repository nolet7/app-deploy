async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const fetchHealth = () => fetch('/api/healthz').then(handle);
export const fetchTemplates = () => fetch('/api/templates').then(handle);
export const fetchAppRequests = () => fetch('/app-requests').then(handle);
export const createAppRequest = (payload: unknown) =>
  fetch('/app-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);

export const fetchDeployments = () => fetch('/api/deployments').then(handle);
export const createDeployment = (payload: unknown) =>
  fetch('/api/deployments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);

export const fetchPrompt = (id: number | string) =>
  fetch(`/api/app-requests/${id}/prompt`).then(handle);

export const api = {
  getHealth: fetchHealth,
  getTemplates: fetchTemplates,
  getAppRequests: fetchAppRequests,
  createAppRequest,
  getDeployments: fetchDeployments,
  createDeployment,
  getPrompt: fetchPrompt,
};
