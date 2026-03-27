import React, { useEffect, useState } from 'react'
import { fetchDeployments } from '../services/api'

type AnyObj = Record<string, any>

export default function Deployments() {
  const [items, setItems] = useState<AnyObj[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDeployments()
      .then((d) => setItems(d.items || d.deployments || []))
      .catch((e) => setError(String(e.message || e)))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h2>Deployments</h2>
      {error && <div>{error}</div>}
      {items.length === 0 ? (
        <p>No deployments yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.app_name} — {item.environment} — {item.status} — {item.namespace}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
