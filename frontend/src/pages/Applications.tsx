import { useEffect, useState } from 'react';
import { Eye, FileCode, Rocket } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Badge, getStatusBadgeVariant } from '../components/Badge';
import { PageLoader } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import type { AppRequest } from '../types';

interface ApplicationsProps {
  onViewPrompt: (requestId: string) => void;
}

export function Applications({ onViewPrompt }: ApplicationsProps) {
  const [applications, setApplications] = useState<AppRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deployingId, setDeployingId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getAppRequests();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeploy(requestId: string) {
    setDeployingId(requestId);

    try {
      await api.createDeployment({ request_id: requestId });
      await loadApplications();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deployment');
    } finally {
      setDeployingId(null);
    }
  }

  function handleViewDetails(app: AppRequest) {
    setSelectedApp(app);
    setShowDetailsModal(true);
  }

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (app: AppRequest) => (
        <span className="font-mono text-xs text-gray-600">{app.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'app_name',
      header: 'App Name',
      render: (app: AppRequest) => (
        <span className="font-medium text-gray-900">{app.app_name}</span>
      ),
    },
    {
      key: 'template_name',
      header: 'Template',
      render: (app: AppRequest) => (
        <span className="text-gray-700">{app.template_name}</span>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      render: (app: AppRequest) => (
        <Badge variant="info" size="sm">
          {app.environment}
        </Badge>
      ),
    },
    {
      key: 'owner_team',
      header: 'Owner Team',
      render: (app: AppRequest) => (
        <span className="text-gray-700">{app.owner_team}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (app: AppRequest) => (
        <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
          {app.status}
        </Badge>
      ),
    },
    {
      key: 'ingress_type',
      header: 'Ingress',
      render: (app: AppRequest) => (
        <span className="text-gray-700">{app.ingress_type}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (app: AppRequest) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(app)}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewPrompt(app.id)}
            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Generate Prompt"
          >
            <FileCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeploy(app.id)}
            disabled={deployingId === app.id}
            className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-50"
            title="Deploy"
          >
            <Rocket className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card
        title="Applications"
        action={
          <Button
            variant="primary"
            onClick={() => (window.location.hash = '/new-request')}
            size="sm"
          >
            New Request
          </Button>
        }
      >
        <Table
          data={applications}
          columns={columns}
          emptyMessage="No applications found. Create your first app request to get started."
        />
      </Card>

      {selectedApp && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Application Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Request ID</label>
                <p className="font-mono text-sm text-gray-900">{selectedApp.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <Badge variant={getStatusBadgeVariant(selectedApp.status)}>
                  {selectedApp.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">App Name</label>
              <p className="text-gray-900">{selectedApp.app_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <p className="text-gray-900">{selectedApp.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Template</label>
                <p className="text-gray-900">{selectedApp.template_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Environment</label>
                <p className="text-gray-900">{selectedApp.environment}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Owner Team</label>
                <p className="text-gray-900">{selectedApp.owner_team}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Ingress Type</label>
                <p className="text-gray-900">{selectedApp.ingress_type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Requires Database</label>
                <Badge variant={selectedApp.requires_database ? 'success' : 'default'}>
                  {selectedApp.requires_database ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Requires Cache</label>
                <Badge variant={selectedApp.requires_cache ? 'success' : 'default'}>
                  {selectedApp.requires_cache ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>

            {selectedApp.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                <p className="text-gray-900">{new Date(selectedApp.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
