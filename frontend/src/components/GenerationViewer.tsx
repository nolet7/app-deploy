import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

type GenerationViewerProps = {
  requestId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export function GenerationViewer({ requestId, isOpen, onClose }: GenerationViewerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !requestId) return;

    async function load() {
      try {
        setLoading(true);
        setError('');
        setData(null);
        const result = await api.getGeneration(requestId);
        setData(result);
      } catch (err: any) {
        setError(err?.message || 'Failed to load generation details');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isOpen, requestId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[520px] bg-white shadow-2xl border-l z-50 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="text-xl font-semibold">Generation Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">Close</button>
      </div>

      <div className="p-5 overflow-y-auto flex-1">
        {loading && <div>Loading generation details...</div>}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div><span className="font-semibold">Request ID:</span> {data.request_id}</div>
              <div><span className="font-semibold">App Name:</span> {data.app_name}</div>
              <div><span className="font-semibold">Template:</span> {data.template_name}</div>
              <div><span className="font-semibold">Environment:</span> {data.environment}</div>
              <div><span className="font-semibold">Status:</span> {data.status}</div>
              <div><span className="font-semibold">Output Directory:</span> {data.output_dir}</div>
            </div>

            {Array.isArray(data.files) && data.files.length > 0 && (
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Generated Files</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {data.files.map((file: string) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.prompt && (
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Generation Prompt</h3>
                <pre className="whitespace-pre-wrap text-sm bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">
                  {data.prompt}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}