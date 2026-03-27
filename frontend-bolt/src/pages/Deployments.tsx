import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge, getStatusBadgeVariant } from '../components/Badge';
import { PageLoader } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { EmptyState } from '../components/EmptyState';
import { api } from '../services/api';
import type { Deployment } from '../types';

export function Deployments() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeployments();
  }, []);

  async function loadDeployments() {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getDeployments();
      setDeployments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deployments');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Alert variant="error" title="Error Loading Deployments">
        {error}
      </Alert>
    );
  }

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (deployment: Deployment) => (
        <span className="font-mono text-xs text-gray-600">{deployment.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'request_id',
      header: 'Request ID',
      render: (deployment: Deployment) => (
        <span className="font-mono text-xs text-gray-600">{deployment.request_id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'app_name',
      header: 'App Name',
      render: (deployment: Deployment) => (
        <span className="font-medium text-gray-900">{deployment.app_name}</span>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      render: (deployment: Deployment) => (
        <Badge variant="info" size="sm">
          {deployment.environment}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (deployment: Deployment) => (
        <Badge variant={getStatusBadgeVariant(deployment.status)} size="sm">
          {deployment.status}
        </Badge>
      ),
    },
    {
      key: 'namespace',
      header: 'Namespace',
      render: (deployment: Deployment) => (
        <span className="font-mono text-xs text-gray-700">{deployment.namespace}</span>
      ),
    },
    {
      key: 'image_tag',
      header: 'Image Tag',
      render: (deployment: Deployment) => (
        <span className="font-mono text-xs text-gray-700">{deployment.image_tag}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (deployment: Deployment) => (
        <span className="text-sm text-gray-600">
          {deployment.created_at ? new Date(deployment.created_at).toLocaleString() : '-'}
        </span>
      ),
    },
  ];

  if (deployments.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Rocket className="w-8 h-8" />}
          title="No Deployments Yet"
          description="Deploy applications from the Applications page to see them here."
          action={{
            label: 'Go to Applications',
            onClick: () => (window.location.hash = '/applications'),
          }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Deployment History</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track all application deployments across environments
          </p>
        </div>
      </div>

      <Card>
        <Table
          data={deployments}
          columns={columns}
          emptyMessage="No deployments found."
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Deployment Stats">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Deployments</span>
              <span className="text-lg font-semibold text-gray-900">{deployments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Successful</span>
              <span className="text-lg font-semibold text-green-600">
                {deployments.filter(d => d.status.toLowerCase().includes('deployed')).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Failed</span>
              <span className="text-lg font-semibold text-red-600">
                {deployments.filter(d => d.status.toLowerCase().includes('failed')).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-lg font-semibold text-yellow-600">
                {deployments.filter(d => d.status.toLowerCase().includes('deploying') || d.status.toLowerCase().includes('pending')).length}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Environments">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Development</span>
              <span className="text-lg font-semibold text-gray-900">
                {deployments.filter(d => d.environment === 'dev').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Staging</span>
              <span className="text-lg font-semibold text-gray-900">
                {deployments.filter(d => d.environment === 'staging').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Production</span>
              <span className="text-lg font-semibold text-gray-900">
                {deployments.filter(d => d.environment === 'production').length}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-2">
            {deployments.slice(0, 5).map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-900 truncate">{deployment.app_name}</span>
                <Badge variant={getStatusBadgeVariant(deployment.status)} size="sm">
                  {deployment.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
