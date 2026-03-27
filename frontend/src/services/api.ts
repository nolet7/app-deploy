const handle = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  return res.text();
};

const unwrapCollection = <T>(data: T[] | { items: T[] }): T[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray((data as { items?: T[] }).items)) {
    return (data as { items: T[] }).items;
  }
  return [];
};

const normalizeAppRequest = (item: any) => ({
  ...item,
  id: Number(item.id),
});

const normalizeDeployment = (item: any) => ({
  ...item,
  id: String(item.id),
  request_id: String(item.request_id),
});

const getTemplates = () => fetch('/api/templates').then(handle);

const getDeployments = async () => {
  const data = await fetch('/api/deployments').then(handle);
  return unwrapCollection<any>(data).map(normalizeDeployment);
};

const getHealth = () => fetch('/api/healthz').then(handle);

const getAppRequests = async () => {
  const data = await fetch('/app-requests').then(handle);
  return unwrapCollection<any>(data).map(normalizeAppRequest);
};

const getAppRequestPrompt = (id: string) => fetch(`/app-requests/${id}/prompt`).then(handle);

const createAppRequest = async (payload: any) => {
  const data = await fetch('/app-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);

  return normalizeAppRequest(data);
};

const generateApp = (id: string) =>
  fetch(`/app-requests/${id}/generate`, {
    method: 'POST',
  }).then(handle);

const getGeneration = (id: string) =>
  fetch(`/app-requests/${id}/generation`).then(handle);

export const api = {
  getTemplates,
  getDeployments,
  getHealth,
  getAppRequests,
  getPrompt: getAppRequestPrompt,
  createAppRequest,
  generateApp,
  getGeneration,
};
