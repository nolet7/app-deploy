export interface HealthCheck {
  status: string;
  timestamp: string;
  version?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  framework: string;
  runtime: string;
  requires_database: boolean;
  requires_cache: boolean;
  ingress: string;
}

export interface AppRequest {
  id: string;
  app_name: string;
  description: string;
  template_name: string;
  environment: string;
  ingress_type: string;
  owner_team: string;
  requires_database: boolean;
  requires_cache: boolean;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAppRequestPayload {
  app_name: string;
  description: string;
  template_name: string;
  environment: string;
  ingress_type: string;
  owner_team: string;
  requires_database: boolean;
  requires_cache: boolean;
}

export interface Deployment {
  id: string;
  request_id: string;
  app_name: string;
  environment: string;
  status: string;
  namespace: string;
  image_tag: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDeploymentPayload {
  request_id: string;
}

export interface PromptResponse {
  request_id: string;
  prompt: string;
  generated_at?: string;
}

export interface DashboardStats {
  totalTemplates: number;
  totalAppRequests: number;
  totalDeployments: number;
  healthStatus: string;
}

export type Environment = 'dev' | 'staging' | 'production';
export type IngressType = 'internal' | 'external' | 'both';
export type DeploymentStatus = 'pending' | 'deploying' | 'deployed' | 'failed';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'deployed';
