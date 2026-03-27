import { useEffect, useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import { Drawer } from './Modal';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { Alert } from './Alert';
import { api } from '../services/api';

interface PromptViewerProps {
  requestId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromptViewer({ requestId, isOpen, onClose }: PromptViewerProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && requestId) {
      loadPrompt();
    }
  }, [isOpen, requestId]);

  async function loadPrompt() {
    if (!requestId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.getAppRequestPrompt(requestId);
      setPrompt(data.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompt');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function handleClose() {
    setPrompt('');
    setError(null);
    setCopied(false);
    onClose();
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Generated Prompt"
      size="lg"
    >
      <div className="space-y-4">
        {loading && (
          <div className="py-12">
            <LoadingSpinner size="lg" text="Loading prompt..." />
          </div>
        )}

        {error && (
          <Alert variant="error" title="Error">
            {error}
          </Alert>
        )}

        {!loading && !error && prompt && (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileCode className="w-4 h-4" />
                <span>Request ID: {requestId?.slice(0, 8)}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words">
                {prompt}
              </pre>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileCode className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">Use this prompt</p>
                <p className="text-blue-700 text-xs">
                  Copy this generated prompt to configure your application deployment
                </p>
              </div>
            </div>
          </>
        )}

        {!loading && !error && !prompt && (
          <div className="text-center py-12 text-gray-500">
            No prompt available
          </div>
        )}
      </div>
    </Drawer>
  );
}
