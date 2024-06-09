/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ENABLE_TESTNET: boolean;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;  
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
