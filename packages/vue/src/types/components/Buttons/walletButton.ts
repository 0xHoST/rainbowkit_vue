import type { WalletConnector } from "@/types"

export type WalletButtonRendererProps = {
    error: boolean,
    loading: boolean,
    connected: boolean,
    ready: boolean,
    connector?: WalletConnector,
    connect: ()=> Promise<void>
}

export type WalletButtonProps = {
    wallet?: string
}