const API_BASE = "/api";

export async function getTemplates() {
  const res = await fetch(`${API_BASE}/templates`);
  if (!res.ok) {
    throw new Error(`Failed to load templates: ${res.status}`);
  }
  return res.json();
}

export async function createAppRequest(payload) {
  const res = await fetch(`${API_BASE}/app-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to create app request: ${res.status}`);
  }

  return res.json();
}

export async function getAppRequests() {
  const res = await fetch(`${API_BASE}/app-requests`);
  if (!res.ok) {
    throw new Error(`Failed to load app requests: ${res.status}`);
  }
  return res.json();
}

export async function getPrompt(requestId) {
  const res = await fetch(`${API_BASE}/app-requests/${requestId}/prompt`);
  if (!res.ok) {
    throw new Error(`Failed to load prompt: ${res.status}`);
  }
  return res.json();
}
