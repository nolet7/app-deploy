import React, { useState } from 'react'
import Home from './pages/Home'
import Applications from './pages/Applications'
import Deployments from './pages/Deployments'

export default function App() {
  const [page, setPage] = useState<'home' | 'applications' | 'deployments'>('home')

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#fafafa', color: '#111' }}>
      <div style={{ padding: 24, borderBottom: '1px solid #ddd', background: '#fff' }}>
        <h1 style={{ margin: 0 }}>app-deploy</h1>
        <p style={{ marginTop: 8 }}>Internal Developer Platform MVP</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('applications')}>Applications</button>
          <button onClick={() => setPage('deployments')}>Deployments</button>
        </div>
      </div>

      {page === 'home' && <Home />}
      {page === 'applications' && <Applications />}
      {page === 'deployments' && <Deployments />}
    </div>
  )
}
