import type { MetricData } from '../lib/types'

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '1.5rem',
  minWidth: '200px',
  flex: '1',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  marginBottom: '0.5rem',
}

const valueStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: '#1e293b',
  marginBottom: '0.25rem',
}

const descStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  marginBottom: '0.75rem',
}

interface MetricCardProps {
  metric: MetricData
}

export default function MetricCard({ metric }: MetricCardProps) {
  const { title, formatted, description, trend } = metric
  const isPositive = trend.direction === 'up'
  const trendColor = isPositive ? '#16a34a' : '#dc2626'
  const trendPrefix = isPositive ? '+' : ''

  return (
    <div style={cardStyle}>
      <div style={labelStyle}>{title}</div>
      <div style={valueStyle}>{formatted}</div>
      <div style={descStyle}>{description}</div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: trendColor }}>
        {trendPrefix}{trend.value}% vs mes anterior
      </div>
    </div>
  )
}
