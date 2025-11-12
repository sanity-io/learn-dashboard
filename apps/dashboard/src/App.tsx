import { type SanityConfig } from '@sanity/sdk'
import { SanityApp } from '@sanity/sdk-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import './styles.css'

import { CohortsWrapper } from './components/cohorts-wrapper'
import { Dashboard } from './components/dashboard'
import { FathomProvider } from './components/fathom-provider'
import { FeedbackWrapper } from './components/feedback-wrapper'
import { Layout } from './components/layout'
import { Loading } from './components/loading'
import { ReviewWrapper } from './components/review-wrapper'
import { SanityUI } from './components/sanity-ui'
import { TracksWrapper } from './components/tracks-wrapper'
import { UsersWrapper } from './components/users-wrapper'

const sanityConfigs: SanityConfig[] = [
  {
    projectId: import.meta.env.SANITY_APP_PROJECT_ID || '',
    dataset: import.meta.env.SANITY_APP_DATASET || '',
  },
]

if (
  !import.meta.env.SANITY_APP_PROJECT_ID ||
  !import.meta.env.SANITY_APP_DATASET
) {
  console.log(import.meta.env)
  throw new Error('Missing Sanity project ID or dataset')
}

function App() {
  return (
    <BrowserRouter>
      <SanityUI>
        <Layout>
          <SanityApp
            config={sanityConfigs}
            fallback={<Loading message="Loading Sanity App..." />}
          >
            <Routes>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<Navigate to="/cohorts" replace />} />
                <Route path="cohorts" element={<CohortsWrapper />} />
                <Route
                  path="courses"
                  element={
                    <FathomProvider>
                      <TracksWrapper />
                    </FathomProvider>
                  }
                />
                <Route path="users" element={<UsersWrapper />} />
                <Route
                  path="feedback/:feedbackId?"
                  element={<FeedbackWrapper />}
                />
                <Route path="review" element={<ReviewWrapper />} />
                <Route path="review/:id/:chatId?" element={<ReviewWrapper />} />
              </Route>
            </Routes>
          </SanityApp>
        </Layout>
      </SanityUI>
    </BrowserRouter>
  )
}

export default App
