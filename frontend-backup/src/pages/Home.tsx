import React, { useEffect, useState } from 'react'
import { fetchHealth, fetchTemplates, fetchAppRequests, fetchDeployments } from '../services/api'

type AnyObj = Record<string, any>

export default function Home() {
  const [health, setHealth] = useState<AnyObj | null>(null)
  const [templates, setTemplates] = useState<AnyObj[]>([])
  const [requests, setRequests] = useState<AnyObj[]>([])
  const [deployments, setDeployments] = useState<AnyObj[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetchHealth(),
      fetchTemplates(),
      fetchAppRequests(),
      fetchDeployments(),
    ])
      .then(([h, t, r, d]) => {
        setHealth(h)
        setTemplates(t.templates || [])
        setRequests(r.items || [])
        setDeployments(d.items || d.deployments || [])
      })
      .catch((e) => setError(String(e.message || e)))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h2>Platform Overview</h2>
      {error && <div style={{ color: 'crimson', marginBottom: 16 }}>Error: {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: 16, marginTop: 16 }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Backend</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{health?.status || '...'}</div>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Templates</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{templates.length}</div>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#666' }}>App Requests</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{requests.length}</div>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Deployments</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{deployments.length}</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Available Templates</h3>
        <ul>
          {templates.map((t) => (
            <li key={t.name}>
              <strong>{t.name}</strong> — {t.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
