/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_IPFS_GATEWAY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
