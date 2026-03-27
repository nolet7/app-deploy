import React, { useEffect, useState } from 'react'
import { fetchAppRequests, createDeployment } from '../services/api'

type AnyObj = Record<string, any>

export default function Applications() {
  const [items, setItems] = useState<AnyObj[]>([])
  const [message, setMessage] = useState('')

  async function load() {
    const data = await fetchAppRequests()
    setItems(data.items || [])
  }

  useEffect(() => {
    load().catch((e) => setMessage(String(e.message || e)))
  }, [])

  async function handleDeploy(item: AnyObj) {
    try {
      const result = await createDeployment({
        request_id: item.id,
        environment: item.environment || 'dev',
        status: 'DEPLOYED',
        namespace: `${item.app_name}-${item.environment || 'dev'}`,
        image_tag: 'v1.0.0',
      })
      setMessage(`Deployment created: ${result.app_name}`)
    } catch (e: any) {
      setMessage(String(e.message || e))
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Applications</h2>
      {message && <div style={{ marginBottom: 12 }}>{message}</div>}
      {items.length === 0 ? (
        <p>No application requests found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'App', 'Template', 'Environment', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.id}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.app_name}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.template_name}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.environment}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.status}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                  <button onClick={() => handleDeploy(item)}>Deploy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
