import type {
  HealthCheck,
  Template,
  AppRequest,
  CreateAppRequestPayload,
  Deployment,
  CreateDeploymentPayload,
  PromptResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type CollectionEnvelope<T> = T[] | { items: T[] };

function unwrapCollection<T>(data: CollectionEnvelope<T>): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
    return data.items;
  }
  return [];
}

function normalizeAppRequest(app: AppRequest): AppRequest {
  return {
    ...app,
    id: String(app.id),
  };
}

function normalizeDeployment(deployment: Deployment): Deployment {
  return {
    ...deployment,
    id: String(deployment.id),
    request_id: String(deployment.request_id),
  };
}


class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    let errorData: unknown;

    try {
      errorData = await response.json();
      if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
        errorMessage = (errorData as { message: string }).message;
      }
    } catch {
      // Unable to parse error response
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text() as Promise<T>;
}

export const api = {
  async getHealthCheck(): Promise<HealthCheck> {
    const response = await fetch(`${API_BASE_URL}/api/healthz`);
    return handleResponse<HealthCheck>(response);
  },

  async getTemplates(): Promise<Template[]> {
    const response = await fetch(`${API_BASE_URL}/api/templates`);
    return handleResponse<Template[]>(response);
  },

  async getAppRequests(): Promise<AppRequest[]> {
    const response = await fetch(`${API_BASE_URL}/app-requests`);
    const data = await handleResponse<CollectionEnvelope<AppRequest>>(response);
    return unwrapCollection(data).map(normalizeAppRequest);
  },

  async createAppRequest(payload: CreateAppRequestPayload): Promise<AppRequest> {
    const response = await fetch(`${API_BASE_URL}/app-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<AppRequest>(response);
    return normalizeAppRequest(data);
  },

  async getDeployments(): Promise<Deployment[]> {
    const response = await fetch(`${API_BASE_URL}/api/deployments`);
    const data = await handleResponse<CollectionEnvelope<Deployment>>(response);
    return unwrapCollection(data).map(normalizeDeployment);
  },

  async createDeployment(payload: CreateDeploymentPayload): Promise<Deployment> {
    const response = await fetch(`${API_BASE_URL}/api/deployments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<Deployment>(response);
    return normalizeDeployment(data);
  },

  async getAppRequestPrompt(requestId: string): Promise<PromptResponse> {
    const response = await fetch(`${API_BASE_URL}/api/app-requests/${requestId}/prompt`);
    return handleResponse<PromptResponse>(response);
  },
};

export { ApiError };
