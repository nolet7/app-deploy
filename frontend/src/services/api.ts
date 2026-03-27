const handle = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
};

const getHealthCheck = () => fetch('/api/healthz').then(handle);
const getTemplates = () => fetch('/api/templates').then(handle);
const getDeployments = () => fetch('/api/deployments').then(handle);
const getAppRequests = () => fetch('/app-requests').then(handle);
const getAppRequestPrompt = (id: string) => fetch(`/app-requests/${id}/prompt`).then(handle);

const createAppRequest = (payload: any) =>
  fetch('/app-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);

const generateApp = (id: string) =>
  fetch(`/app-requests/${id}/generate`, {
    method: 'POST',
  }).then(handle);

const getGeneration = (id: string) =>
  fetch(`/app-requests/${id}/generation`).then(handle);

export const api = {
  getHealthCheck,
  getTemplates,
  getDeployments,
  getAppRequests,
  getAppRequestPrompt,
  createAppRequest,
  generateApp,
  getGeneration,
};