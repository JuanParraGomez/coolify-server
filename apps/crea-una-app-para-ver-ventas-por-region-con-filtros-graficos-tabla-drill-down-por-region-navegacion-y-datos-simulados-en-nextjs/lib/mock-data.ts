export const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']

export const PERIODS = {
  q1: { label: 'Q1', factor: 0.46, indices: [0, 1, 2] },
  q2: { label: 'Q2', factor: 0.54, indices: [3, 4, 5] },
  ytd: { label: 'YTD', factor: 1, indices: [0, 1, 2, 3, 4, 5] },
} as const

export const CHANNELS = {
  all: { label: 'Todos los canales', factor: 1, emphasis: 1 },
  online: { label: 'Online', factor: 0.36, emphasis: 1.04 },
  retail: { label: 'Retail', factor: 0.41, emphasis: 0.97 },
  partners: { label: 'Partners', factor: 0.23, emphasis: 1.11 },
} as const

export const HEALTH = {
  all: { label: 'Todas las regiones' },
  ahead: { label: 'Sólo arriba del objetivo' },
  watch: { label: 'Sólo en seguimiento' },
} as const

export const NAV_ITEMS = [
  { id: 'overview', label: 'Resumen' },
  { id: 'regions', label: 'Regiones' },
  { id: 'table', label: 'Tabla' },
  { id: 'drilldown', label: 'Drill-down' },
]

export const REGIONS = [
  {
    id: 'north',
    name: 'Norte',
    manager: 'Ana Suárez',
    color: '#E27A45',
    target: 9800000,
    margin: 32.4,
    orders: 1840,
    trend: [1480000, 1560000, 1610000, 1730000, 1820000, 1940000],
    channels: { online: 0.39, retail: 0.37, partners: 0.24 },
    subregions: [
      { name: 'Monterrey', revenue: 3920000, target: 3680000, orders: 690, conversion: 28.2, pipeline: 1140000 },
      { name: 'Saltillo', revenue: 2240000, target: 2360000, orders: 415, conversion: 23.8, pipeline: 820000 },
      { name: 'Chihuahua', revenue: 1930000, target: 1820000, orders: 352, conversion: 25.1, pipeline: 610000 },
      { name: 'Tijuana', revenue: 1510000, target: 1480000, orders: 283, conversion: 21.3, pipeline: 480000 },
    ],
    accounts: [
      { name: 'Grupo Atlas', segment: 'Enterprise', revenue: 1280000, delta: 14 },
      { name: 'Retail Nova', segment: 'Mid-market', revenue: 860000, delta: 8 },
      { name: 'Distribuciones Roca', segment: 'Partners', revenue: 640000, delta: -3 },
    ],
    alerts: [
      'Saltillo muestra menor conversión en retail frente al plan.',
      'El inventario en Tijuana se normaliza, pero sigue por debajo del ritmo de mayo.',
    ],
  },
  {
    id: 'central',
    name: 'Centro',
    manager: 'Carlos Pérez',
    color: '#2D8F85',
    target: 11300000,
    margin: 29.7,
    orders: 2165,
    trend: [1640000, 1710000, 1780000, 1840000, 1970000, 2050000],
    channels: { online: 0.34, retail: 0.45, partners: 0.21 },
    subregions: [
      { name: 'CDMX', revenue: 4250000, target: 4380000, orders: 792, conversion: 30.5, pipeline: 1480000 },
      { name: 'Puebla', revenue: 2330000, target: 2160000, orders: 452, conversion: 27.1, pipeline: 760000 },
      { name: 'Querétaro', revenue: 2090000, target: 2020000, orders: 403, conversion: 24.6, pipeline: 720000 },
      { name: 'Toluca', revenue: 1780000, target: 1900000, orders: 351, conversion: 22.5, pipeline: 590000 },
    ],
    accounts: [
      { name: 'Mercado Capital', segment: 'Enterprise', revenue: 1420000, delta: 6 },
      { name: 'Farmacias Uno', segment: 'Retail', revenue: 980000, delta: -2 },
      { name: 'Servicios Plaza', segment: 'SMB', revenue: 760000, delta: 11 },
    ],
    alerts: [
      'CDMX sostiene volumen, pero el ticket promedio cayó frente a abril.',
      'Toluca requiere acelerar partners para cerrar la brecha contra objetivo.',
    ],
  },
  {
    id: 'south',
    name: 'Sur',
    manager: 'María Nolasco',
    color: '#869C50',
    target: 8600000,
    margin: 35.1,
    orders: 1595,
    trend: [1190000, 1270000, 1320000, 1380000, 1460000, 1510000],
    channels: { online: 0.42, retail: 0.31, partners: 0.27 },
    subregions: [
      { name: 'Mérida', revenue: 2460000, target: 2360000, orders: 470, conversion: 32.4, pipeline: 880000 },
      { name: 'Tuxtla', revenue: 1790000, target: 1840000, orders: 314, conversion: 26.7, pipeline: 540000 },
      { name: 'Oaxaca', revenue: 1640000, target: 1580000, orders: 299, conversion: 24.2, pipeline: 490000 },
      { name: 'Cancún', revenue: 1410000, target: 1320000, orders: 262, conversion: 28.8, pipeline: 510000 },
    ],
    accounts: [
      { name: 'Hotelaria Azul', segment: 'Enterprise', revenue: 940000, delta: 17 },
      { name: 'Cadena Sol', segment: 'Retail', revenue: 690000, delta: 10 },
      { name: 'Mayab Connect', segment: 'Partners', revenue: 610000, delta: 5 },
    ],
    alerts: [
      'Tuxtla necesita más cobertura comercial en partners para junio.',
      'Mérida lidera margen y absorbe mejor el crecimiento online.',
    ],
  },
  {
    id: 'west',
    name: 'Oeste',
    manager: 'Diego Ramírez',
    color: '#7B5BE6',
    target: 9200000,
    margin: 30.8,
    orders: 1710,
    trend: [1360000, 1420000, 1470000, 1540000, 1600000, 1680000],
    channels: { online: 0.37, retail: 0.4, partners: 0.23 },
    subregions: [
      { name: 'Guadalajara', revenue: 3210000, target: 3340000, orders: 592, conversion: 27.3, pipeline: 1080000 },
      { name: 'León', revenue: 2010000, target: 1940000, orders: 382, conversion: 25.4, pipeline: 640000 },
      { name: 'Culiacán', revenue: 1770000, target: 1710000, orders: 319, conversion: 23.8, pipeline: 520000 },
      { name: 'La Paz', revenue: 1330000, target: 1340000, orders: 248, conversion: 20.9, pipeline: 430000 },
    ],
    accounts: [
      { name: 'Consumax', segment: 'Retail', revenue: 1040000, delta: 4 },
      { name: 'Logística Horizonte', segment: 'Enterprise', revenue: 840000, delta: 9 },
      { name: 'Canal Cinco', segment: 'Partners', revenue: 580000, delta: -1 },
    ],
    alerts: [
      'Guadalajara mantiene pipeline sano, aunque sigue por debajo del target.',
      'La Paz necesita más cobertura de cuentas medianas para mejorar volumen.',
    ],
  },
]

export type PeriodKey = keyof typeof PERIODS
export type ChannelKey = keyof typeof CHANNELS
export type HealthKey = keyof typeof HEALTH
export type Region = (typeof REGIONS)[number]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

export function sum(values: number[]) {
  return values.reduce((total, current) => total + current, 0)
}

export function deriveRegion(region: Region, periodKey: PeriodKey, channelKey: ChannelKey) {
  const period = PERIODS[periodKey]
  const channel = CHANNELS[channelKey]
  const rawTrend = period.indices.map((index) => region.trend[index])
  const scaledTrend =
    channelKey === 'all'
      ? rawTrend
      : rawTrend.map((point) => Math.round(point * channel.factor * channel.emphasis))
  const revenue = sum(scaledTrend)
  const baseTarget = Math.round(region.target * period.factor)
  const target =
    channelKey === 'all' ? baseTarget : Math.round(baseTarget * channel.factor * 1.02)
  const seasonalBase = sum(rawTrend) || 1
  const targetTrend = rawTrend.map((point) => Math.round(target * (point / seasonalBase)))
  const orderFactor =
    channelKey === 'all'
      ? period.factor
      : period.factor * channel.factor * (channelKey === 'online' ? 1.16 : channelKey === 'retail' ? 0.96 : 0.82)
  const orders = Math.max(1, Math.round(region.orders * orderFactor))
  const avgTicket = Math.round(revenue / orders)
  const marginShift =
    channelKey === 'all' ? 0 : channelKey === 'online' ? 1.4 : channelKey === 'retail' ? -0.8 : 2.1
  const subregions = region.subregions.map((subregion) => {
    const revenueBase = Math.round(subregion.revenue * period.factor)
    const revenueValue =
      channelKey === 'all'
        ? revenueBase
        : Math.round(revenueBase * channel.factor * channel.emphasis)
    const targetBase = Math.round(subregion.target * period.factor)
    const targetValue =
      channelKey === 'all' ? targetBase : Math.round(targetBase * channel.factor * 1.02)
    const conversionShift =
      channelKey === 'all' ? 0 : channelKey === 'online' ? 2.2 : channelKey === 'retail' ? -1 : 1.1

    return {
      ...subregion,
      revenue: revenueValue,
      target: targetValue,
      orders: Math.max(1, Math.round(subregion.orders * orderFactor)),
      conversion: Number((subregion.conversion + conversionShift).toFixed(1)),
      pipeline: Math.round(subregion.pipeline * period.factor),
      delta: revenueValue - targetValue,
    }
  })
  const pipeline = sum(subregions.map((subregion) => subregion.pipeline))
  const accounts = region.accounts.map((account) => ({
    ...account,
    revenue:
      channelKey === 'all'
        ? account.revenue
        : Math.round(account.revenue * channel.factor * channel.emphasis),
    delta:
      account.delta +
      (channelKey === 'all' ? 0 : channelKey === 'online' ? 2 : channelKey === 'retail' ? -1 : 3),
  }))
  const performance = revenue / Math.max(target, 1)
  const health =
    performance >= 1.02 ? 'positive' : performance >= 0.97 ? 'steady' : 'warning'

  return {
    ...region,
    labels: period.indices.map((index) => MONTHS[index]),
    revenue,
    target,
    performance,
    margin: Number((region.margin + marginShift).toFixed(1)),
    orders,
    avgTicket,
    scaledTrend,
    targetTrend,
    subregions,
    pipeline,
    accounts,
    health,
  }
}

export type DerivedRegion = ReturnType<typeof deriveRegion>
