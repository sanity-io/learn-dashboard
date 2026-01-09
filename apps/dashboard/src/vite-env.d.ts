/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SANITY_APP_PROJECT_ID: string
  readonly SANITY_APP_DATASET: string
  readonly SANITY_APP_BACKEND_SERVICE_ORIGIN?: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
