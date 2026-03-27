import { useEffect, useState } from 'react';
import { Activity, FileText, Layers, Rocket } from 'lucide-react';
import { StatCard } from '../components/Card';
import { Card } from '../components/Card';
import { Badge, getStatusBadgeVariant } from '../components/Badge';
import { PageLoader } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { api } from '../services/api';
import type { DashboardStats, AppRequest } from '../types';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalTemplates: 0,
    totalAppRequests: 0,
    totalDeployments: 0,
    healthStatus: 'unknown',
  });
  const [recentRequests, setRecentRequests] = useState<AppRequest[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    setError(null);

    try {
      const [healthCheck, templates, appRequests, deployments] = await Promise.all([
        api.getHealthCheck(),
        api.getTemplates(),
        api.getAppRequests(),
        api.getDeployments(),
      ]);

      setStats({
        totalTemplates: templates.length,
        totalAppRequests: appRequests.length,
        totalDeployments: deployments.length,
        healthStatus: healthCheck.status,
      });

      setRecentRequests(appRequests.slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Alert variant="error" title="Error Loading Dashboard">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Platform Health"
          value={stats.healthStatus}
          icon={<Activity />}
        />
        <StatCard
          title="Total Templates"
          value={stats.totalTemplates}
          icon={<Layers />}
        />
        <StatCard
          title="App Requests"
          value={stats.totalAppRequests}
          icon={<FileText />}
        />
        <StatCard
          title="Deployments"
          value={stats.totalDeployments}
          icon={<Rocket />}
        />
      </div>

      <Card title="Recent App Requests">
        {recentRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent app requests
          </div>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{request.app_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.template_name} • {request.environment}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{request.owner_team}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Platform Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Active Applications</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalAppRequests}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Available Templates</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalTemplates}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Deployments</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalDeployments}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">System Status</span>
              <Badge variant={stats.healthStatus === 'healthy' ? 'success' : 'warning'}>
                {stats.healthStatus}
              </Badge>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left font-medium">
              Create New App Request
            </button>
            <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left font-medium">
              View All Applications
            </button>
            <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left font-medium">
              Browse Templates
            </button>
            <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left font-medium">
              Check Deployments
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}