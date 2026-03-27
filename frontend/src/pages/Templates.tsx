import { useEffect, useState } from 'react';
import { Box, Database, Zap, Globe } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { PageLoader } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { EmptyState } from '../components/EmptyState';
import { api } from '../services/api';
import type { Template } from '../types';

export function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Alert variant="error" title="Error Loading Templates">
        {error}
      </Alert>
    );
  }

  if (templates.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Box className="w-8 h-8" />}
          title="No Templates Available"
          description="There are no templates configured in the platform yet."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Available Templates</h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose from {templates.length} pre-configured application templates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Box className="w-6 h-6" />
                </div>
                <Badge variant="info" size="sm">
                  {template.framework}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Runtime:</span>
                    <span className="font-medium text-gray-900">{template.runtime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Ingress:</span>
                    <span className="font-medium text-gray-900">{template.ingress}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                {template.requires_database && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    <Database className="w-3 h-3" />
                    Database
                  </div>
                )}
                {template.requires_cache && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    <Zap className="w-3 h-3" />
                    Cache
                  </div>
                )}
                {template.ingress && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    <Globe className="w-3 h-3" />
                    {template.ingress}
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={() => (window.location.hash = '/new-request')}
              >
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
