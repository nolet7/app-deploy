import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { GenerationViewer } from '../components/GenerationViewer';

type AppRequest = {
  id: number;
  app_name: string;
  description: string;
  template_name: string;
  environment: string;
  ingress_type?: string;
  owner_team?: string;
  status: string;
  requires_database: boolean;
  requires_cache: boolean;
};

type ApplicationsProps = {
  onViewPrompt?: (requestId: string) => void;
};

export function Applications({ onViewPrompt }: ApplicationsProps) {
  const [items, setItems] = useState<AppRequest[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [generationOpen, setGenerationOpen] = useState(false);
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null);

  async function loadItems() {
    try {
      setLoading(true);
      setError('');
      const data = await api.getAppRequests();

      if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data?.items)) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleGenerate(id: number) {
    try {
      setBusyId(id);
      setMessage('');
      await api.generateApp(String(id));
      setMessage(`Generated app files for request ${id}`);
      await loadItems();
      setSelectedGenerationId(String(id));
      setGenerationOpen(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate app');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-gray-600">Submitted application onboarding requests.</p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-green-700">
          {message}
        </div>
      )}

      {loading && (
        <div className="bg-white shadow rounded-2xl p-6">Loading applications...</div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white shadow rounded-2xl p-6">No application requests found.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="bg-white shadow rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">App Name</th>
                  <th className="px-4 py-3 font-semibold">Template</th>
                  <th className="px-4 py-3 font-semibold">Environment</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Database</th>
                  <th className="px-4 py-3 font-semibold">Cache</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.app_name}</div>
                      <div className="text-gray-500">{item.description}</div>
                    </td>
                    <td className="px-4 py-3">{item.template_name}</td>
                    <td className="px-4 py-3">{item.environment}</td>
                    <td className="px-4 py-3">{item.owner_team || '-'}</td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">{item.requires_database ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">{item.requires_cache ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onViewPrompt?.(String(item.id))}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          View Prompt
                        </button>

                        <button
                          type="button"
                          onClick={() => handleGenerate(item.id)}
                          disabled={busyId === item.id}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {busyId === item.id ? 'Generating...' : 'Generate App'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGenerationId(String(item.id));
                            setGenerationOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                        >
                          View Generation
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <GenerationViewer
        requestId={selectedGenerationId}
        isOpen={generationOpen}
        onClose={() => setGenerationOpen(false)}
      />
    </div>
  );
}