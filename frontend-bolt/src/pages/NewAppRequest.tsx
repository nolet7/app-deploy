import { useState, FormEvent } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Input, Textarea, Select } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { api } from '../services/api';
import type { CreateAppRequestPayload, AppRequest } from '../types';

interface FormData {
  app_name: string;
  description: string;
  template_name: string;
  environment: string;
  ingress_type: string;
  owner_team: string;
  requires_database: boolean;
  requires_cache: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function NewAppRequest() {
  const [formData, setFormData] = useState<FormData>({
    app_name: '',
    description: '',
    template_name: '',
    environment: '',
    ingress_type: '',
    owner_team: '',
    requires_database: false,
    requires_cache: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<AppRequest | null>(null);

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.app_name.trim()) {
      newErrors.app_name = 'App name is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.app_name)) {
      newErrors.app_name = 'App name must contain only lowercase letters, numbers, and hyphens';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.template_name) {
      newErrors.template_name = 'Template is required';
    }

    if (!formData.environment) {
      newErrors.environment = 'Environment is required';
    }

    if (!formData.ingress_type) {
      newErrors.ingress_type = 'Ingress type is required';
    }

    if (!formData.owner_team.trim()) {
      newErrors.owner_team = 'Owner team is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: CreateAppRequestPayload = {
        app_name: formData.app_name,
        description: formData.description,
        template_name: formData.template_name,
        environment: formData.environment,
        ingress_type: formData.ingress_type,
        owner_team: formData.owner_team,
        requires_database: formData.requires_database,
        requires_cache: formData.requires_cache,
      };

      const result = await api.createAppRequest(payload);
      setCreatedRequest(result);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create app request');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      app_name: '',
      description: '',
      template_name: '',
      environment: '',
      ingress_type: '',
      owner_team: '',
      requires_database: false,
      requires_cache: false,
    });
    setErrors({});
    setCreatedRequest(null);
    setSubmitError(null);
  }

  if (createdRequest) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Created Successfully</h2>
            <p className="text-gray-600 mb-6">Your app request has been submitted</p>

            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Request Details</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Request ID:</dt>
                  <dd className="text-sm font-medium text-gray-900">{createdRequest.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">App Name:</dt>
                  <dd className="text-sm font-medium text-gray-900">{createdRequest.app_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Template:</dt>
                  <dd className="text-sm font-medium text-gray-900">{createdRequest.template_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Environment:</dt>
                  <dd className="text-sm font-medium text-gray-900">{createdRequest.environment}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Status:</dt>
                  <dd className="text-sm font-medium text-gray-900">{createdRequest.status}</dd>
                </div>
              </dl>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={resetForm} variant="primary">
                Create Another Request
              </Button>
              <Button onClick={() => window.location.hash = '/applications'} variant="secondary">
                View All Applications
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Create New App Request">
        {submitError && (
          <Alert variant="error" title="Error" className="mb-6" onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="App Name"
              placeholder="my-awesome-app"
              value={formData.app_name}
              onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
              error={errors.app_name}
              helperText="Lowercase letters, numbers, and hyphens only"
              required
            />

            <Input
              label="Owner Team"
              placeholder="team-name"
              value={formData.owner_team}
              onChange={(e) => setFormData({ ...formData, owner_team: e.target.value })}
              error={errors.owner_team}
              required
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Describe your application..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            rows={3}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Template"
              value={formData.template_name}
              onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
              error={errors.template_name}
              options={[
                { value: 'nodejs', label: 'Node.js' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
                { value: 'golang', label: 'Go' },
                { value: 'react', label: 'React' },
              ]}
              required
            />

            <Select
              label="Environment"
              value={formData.environment}
              onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
              error={errors.environment}
              options={[
                { value: 'dev', label: 'Development' },
                { value: 'staging', label: 'Staging' },
                { value: 'production', label: 'Production' },
              ]}
              required
            />
          </div>

          <Select
            label="Ingress Type"
            value={formData.ingress_type}
            onChange={(e) => setFormData({ ...formData, ingress_type: e.target.value })}
            error={errors.ingress_type}
            options={[
              { value: 'internal', label: 'Internal Only' },
              { value: 'external', label: 'External' },
              { value: 'both', label: 'Both Internal and External' },
            ]}
            required
          />

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.requires_database}
                onChange={(e) => setFormData({ ...formData, requires_database: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Requires Database</span>
                <p className="text-sm text-gray-600">Provision a database instance for this application</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.requires_cache}
                onChange={(e) => setFormData({ ...formData, requires_cache: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Requires Cache</span>
                <p className="text-sm text-gray-600">Provision a Redis cache instance for this application</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={loading}>
              Create App Request
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Reset Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
