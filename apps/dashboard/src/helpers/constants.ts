export const BACKEND_SERVICE_ORIGIN =
  import.meta.env.SANITY_APP_BACKEND_SERVICE_ORIGIN ||
  (import.meta.env.DEV ? 'http://localhost:3000' : '')

export const SECONDS_IN_30_DAYS = (604800 / 7) * 30
export const SECONDS_IN_60_DAYS = SECONDS_IN_30_DAYS * 2

export const SENTIMENTS = [
  { title: 'All', value: 'all' },
  { title: 'Positive', value: 'positive' },
  { title: 'Negative', value: 'negative' },
  { title: 'Constructive', value: 'constructive' },
  { title: 'Unknown', value: 'unknown' },
]
