import React, {
  ReactNode,
  Suspense,
  createContext,
  use,
  useContext,
} from 'react'

import { BACKEND_SERVICE_ORIGIN } from '../helpers/constants'
import { Loading } from './loading'

export interface FathomContextType {
  stats: FathomStats | FathomError
}

const FathomContext = createContext<FathomContextType | undefined>(undefined)

interface FathomProviderProps {
  children: ReactNode
}

export type FathomStats = {
  pageviews: string
  pathname: string
}[]

export type FathomError = {
  error: string
  status: number
  details: any
}

const STATS_PATH = '/fathom/stats/AEGXJIAW'
const STATS_URL = new URL(STATS_PATH, BACKEND_SERVICE_ORIGIN)

const statsPromise = fetch(STATS_URL.toString(), {
  method: 'POST',
})
  .then((response) => response.json())
  .then((data) => {
    if ('error' in data) {
      return data as FathomError
    }
    return data as FathomStats
  })
  .catch((error) => {
    console.error(error)
    return { error: 'Failed to fetch stats', status: 500, details: error }
  })

function FathomStatsComponent({ children }: { children: ReactNode }) {
  const stats = use(statsPromise)

  const value: FathomContextType = {
    stats,
  }

  return (
    <FathomContext.Provider value={value}>{children}</FathomContext.Provider>
  )
}

export function FathomProvider({ children }: FathomProviderProps) {
  return (
    <Suspense fallback={<Loading message="Loading Fathom Analytics..." />}>
      <FathomStatsComponent>{children}</FathomStatsComponent>
    </Suspense>
  )
}

// Custom hook to use the Fathom context
export function useFathom() {
  const context = useContext(FathomContext)

  if (context === undefined) {
    throw new Error('useFathom must be used within a FathomProvider')
  }

  return context
}
