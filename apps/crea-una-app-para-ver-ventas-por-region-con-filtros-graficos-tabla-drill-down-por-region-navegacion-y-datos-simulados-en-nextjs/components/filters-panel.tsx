'use client'

import { CHANNELS, HEALTH, PERIODS, type ChannelKey, type HealthKey, type PeriodKey } from '../lib/mock-data'

interface FiltersPanelProps {
  period: PeriodKey
  channel: ChannelKey
  health: HealthKey
  onPeriodChange: (value: PeriodKey) => void
  onChannelChange: (value: ChannelKey) => void
  onHealthChange: (value: HealthKey) => void
}

export default function FiltersPanel({
  period,
  channel,
  health,
  onPeriodChange,
  onChannelChange,
  onHealthChange,
}: FiltersPanelProps) {
  return (
    <div className="filters-panel">
      <div className="control-group">
        <label htmlFor="fp-period">Periodo</label>
        <select
          id="fp-period"
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as PeriodKey)}
        >
          {Object.entries(PERIODS).map(([value, option]) => (
            <option key={value} value={value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="fp-channel">Canal</label>
        <select
          id="fp-channel"
          value={channel}
          onChange={(e) => onChannelChange(e.target.value as ChannelKey)}
        >
          {Object.entries(CHANNELS).map(([value, option]) => (
            <option key={value} value={value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="fp-health">Desempeño</label>
        <select
          id="fp-health"
          value={health}
          onChange={(e) => onHealthChange(e.target.value as HealthKey)}
        >
          {Object.entries(HEALTH).map(([value, option]) => (
            <option key={value} value={value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
