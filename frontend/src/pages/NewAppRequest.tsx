import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';

type Template = {
  name: string;
  description?: string;
};

export function NewAppRequest() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState({
    app_name: '',
    description: '',
    template_name: '',
    environment: 'dev',
    ingress_type: 'internal',
    owner_team: 'platform',
    requires_database: false,
    requires_cache: false,
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getTemplates()
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch((err: any) => setError(err?.message || 'Failed to load templates'));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const payload = {
        app_name: form.app_name,
        description: form.description,
        template_name: form.template_name,
        environment: form.environment,
        ingress: form.ingress_type,
        owner_team: form.owner_team,
        requires_database: form.requires_database,
        requires_cache: form.requires_cache,
      };

      const response = await api.createAppRequest(payload);
      setResult(response);
    } catch (err: any) {
      setError(err?.message || 'Failed to create app request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New App Request</h1>
        <p className="text-gray-600">Create a new application onboarding request.</p>
      </div>

      <form onSubmit={submit} className="space-y-6 bg-white shadow rounded-2xl p-6 max-w-3xl">
        <div>
          <label className="block text-sm font-medium mb-1">App Name</label>
          <input
            type="text"
            value={form.app_name}
            onChange={(e) => setForm({ ...form, app_name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="orders-api"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            placeholder="Order management backend"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Template</label>
          <select
            value={form.template_name}
            onChange={(e) => setForm({ ...form, template_name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select a template</option>
            {templates.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}{t.description ? ` - ${t.description}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Environment</label>
            <select
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="dev">dev</option>
              <option value="qa">qa</option>
              <option value="stage">stage</option>
              <option value="prod">prod</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ingress</label>
            <select
              value={form.ingress_type}
              onChange={(e) => setForm({ ...form, ingress_type: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="internal">internal</option>
              <option value="external">external</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Owner Team</label>
            <input
              type="text"
              value={form.owner_team}
              onChange={(e) => setForm({ ...form, owner_team: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.requires_database}
              onChange={(e) => setForm({ ...form, requires_database: e.target.checked })}
            />
            <span>Requires Database</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.requires_cache}
              onChange={(e) => setForm({ ...form, requires_cache: e.target.checked })}
            />
            <span>Requires Cache</span>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Create App Request'}
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-700">
            Request created successfully:
            <pre className="mt-2 whitespace-pre-wrap text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
}