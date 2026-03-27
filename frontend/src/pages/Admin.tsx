import React from 'react'
import {
  Settings,
  Shield,
  Plug,
  Activity,
  FileCheck,
  Server,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface AdminSection {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: Array<{
    label: string;
    value: string | number;
    status?: 'active' | 'inactive' | 'pending';
  }>;
}

const adminSections: AdminSection[] = [
  {
    icon: <Server className="w-6 h-6" />,
    title: 'Platform Assets',
    description: 'Manage infrastructure and platform resources',
    items: [
      { label: 'Kubernetes Clusters', value: 3, status: 'active' },
      { label: 'Container Registries', value: 2, status: 'active' },
      { label: 'Cloud Providers', value: 1, status: 'active' },
      { label: 'Storage Backends', value: 4, status: 'active' },
    ],
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: 'Platform Standards',
    description: 'Governance policies and compliance standards',
    items: [
      { label: 'Security Policies', value: 12, status: 'active' },
      { label: 'Resource Quotas', value: 8, status: 'active' },
      { label: 'Naming Conventions', value: 5, status: 'active' },
      { label: 'Cost Policies', value: 3, status: 'pending' },
    ],
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Observability',
    description: 'Monitoring, logging, and tracing configuration',
    items: [
      { label: 'Monitoring Systems', value: 2, status: 'active' },
      { label: 'Log Aggregators', value: 1, status: 'active' },
      { label: 'APM Tools', value: 1, status: 'active' },
      { label: 'Alert Rules', value: 24, status: 'active' },
    ],
  },
  {
    icon: <Plug className="w-6 h-6" />,
    title: 'Integrations',
    description: 'Third-party services and API integrations',
    items: [
      { label: 'CI/CD Systems', value: 2, status: 'active' },
      { label: 'Secret Managers', value: 1, status: 'active' },
      { label: 'Service Mesh', value: 1, status: 'active' },
      { label: 'API Gateways', value: 1, status: 'active' },
    ],
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Approvals',
    description: 'Workflow approvals and access control',
    items: [
      { label: 'Pending Approvals', value: 3, status: 'pending' },
      { label: 'Approved Today', value: 7, status: 'active' },
      { label: 'Approval Policies', value: 5, status: 'active' },
      { label: 'Approval Workflows', value: 4, status: 'active' },
    ],
  },
];

export function Admin() {
  function getStatusBadge(status?: string) {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'inactive':
        return <Badge variant="default" size="sm">Inactive</Badge>;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Platform Administration</h1>
            <p className="text-blue-100 mt-1">
              Manage platform configuration, standards, and integrations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adminSections.map((section) => (
          <Card key={section.title} className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      {item.status && getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                Manage {section.title}
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Platform Health Overview">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">99.9%</div>
            <div className="text-sm text-gray-600">Platform Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">847</div>
            <div className="text-sm text-gray-600">Active Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">32</div>
            <div className="text-sm text-gray-600">Teams Onboarded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
            <div className="text-sm text-gray-600">Deployments Today</div>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Admin Portal</h3>
            <p className="text-sm text-blue-800 mb-4">
              This is a placeholder admin interface. In a production environment, these sections would
              connect to actual platform management systems, policy engines, and monitoring tools.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">UI Only</Badge>
              <Badge variant="info">No Backend Integration</Badge>
              <Badge variant="info">Demo Mode</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
