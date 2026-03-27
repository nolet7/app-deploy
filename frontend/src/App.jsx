import React from 'react'
import NewAppRequest from './pages/NewAppRequest.jsx'

export default function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#111" }}>
      <div style={{ padding: "2rem", borderBottom: "1px solid #ddd" }}>
        <h1>app-deploy</h1>
        <p>Enterprise Internal Developer Platform MVP</p>
      </div>

      <NewAppRequest />
    </div>
  );
}
