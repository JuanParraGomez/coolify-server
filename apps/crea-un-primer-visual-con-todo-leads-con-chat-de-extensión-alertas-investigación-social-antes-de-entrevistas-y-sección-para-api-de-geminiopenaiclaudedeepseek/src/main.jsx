import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <main style={{fontFamily: 'sans-serif', padding: '2rem'}}>
      <h1>React Starter</h1>
      <p>Managed inside coolify-server.</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
