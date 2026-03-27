const handle = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
};

const getHealthCheck = () => fetch('/api/healthz').then(handle);

const getTemplates = async () => {
  const data = await fetch('/api/templates').then(handle);
  return data.templates || [];
};

const getDeployments = async () => {
  const data = await fetch('/api/deployments').then(handle);
  return data.items || [];
};

const getAppRequests = async () => {
  const data = await fetch('/app-requests').then(handle);
  return data.items || [];
};

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