import type { ResponsiveValue } from '@/css'
import type { AuthenticationStatus, ConnectionStatus } from '@/types'
import type { GetEnsNameReturnType } from 'viem'
import type { GetEnsAvatarReturnType } from 'viem/actions'
import type { GetEnsAddressReturnType } from '@wagmi/vue/actions'

export type AccountStatus = 'full' | 'avatar' | 'address'
export type ChainStatus = 'full' | 'icon' | 'name' | 'none'
export interface ConnectButtonProps {
  label: string
  accountStatus: ResponsiveValue<AccountStatus>
  chainStatus: ResponsiveValue<ChainStatus>
  showBalance: ResponsiveValue<boolean>,
  authenticationStatus?: AuthenticationStatus,
  connectionStatus?: ConnectionStatus,
  accountModalOpen?: boolean,
  chainModalOpen?: boolean,
  connectModalOpen?: boolean,
  openAccountModal?: ()=>void,
  openChainModal?: ()=>void,
  openConnectModal?: ()=>void
}
export interface ConnectButtonRendererProps {
  account?: {
    address: string
    balanceDecimals?: number
    balanceSymbol?: string
    balance?: string
    displayName?: GetEnsNameReturnType | GetEnsAddressReturnType
    ensAvatar?: GetEnsAvatarReturnType
    ensName?: GetEnsNameReturnType
    hasPendingTransactions: boolean
  }
  chain?: {
    hasIcon: boolean
    iconUrl?: string
    iconBackground?: string
    id: number
    name?: string
    unsupported?: boolean,
    loading: boolean
  }
  authenticationStatus?: AuthenticationStatus,
  openAccountModal: () => void
  openChainModal: () => void
  openConnectModal: () => void
  accountModalOpen: boolean
  chainModalOpen: boolean
  connectModalOpen: boolean
}
