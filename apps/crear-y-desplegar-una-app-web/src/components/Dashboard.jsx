import React from 'react'

const styles = {
  heading: {
    fontSize: '5rem',
    fontWeight: 800,
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.025em',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: '1rem',
    color: '#6b7280',
    fontSize: '1.1rem',
    textAlign: 'center',
  },
}

export default function Dashboard() {
  return (
    <div>
      <h1 style={styles.heading}>Hola Mundo</h1>
      <p style={styles.subtitle}>App web desplegada con éxito ✓</p>
    </div>
  )
}
