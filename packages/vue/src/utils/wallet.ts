import { createConnector } from '@wagmi/vue';
import { injected, walletConnect  } from '@wagmi/vue/connectors';
import { BrowserType, getBrowser } from './browser';
import { isIOS } from './mobile';
import { PlatformType, getPlatformType } from './platform';
import { isHexString } from '../utils/color';
import { 
  type CreateWalletConnectConnectorParams, 
  type CreateConnectorFn,
  type WalletList,
  type ConnectorsWithWalletsParams,
  type CreateConnector,
  type GetOrCreateWalletConnectInstanceParams,
  type GetWalletConnectConnectorParams,
  type InjectedProviderRequest,
  type RainbowKitWalletConnectParameters,
  type WalletConnectParameters,
  type WalletConnectorsParam,
  type WalletDetailsParams,
  type WalletInstance,
  type WalletListItem,
  type WalletMetaDataParameters,
  latestWalletStorageKey,
  recentWalletStorageKey,  
} from "@/types/index";
import { coinbaseWallet } from "@/wallets/coinbaseWallet/coinbaseWallet";
import { ledgerWallet } from "@/wallets/ledgerWallet/ledgerWallet";
import { metaMaskWallet } from "@/wallets/metaMaskWallet/metaMaskWallet";
import { rainbowWallet } from "@/wallets/rainbowWallet/rainbowWallet";

///private
const dedupe = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

const safeParseJsonArray = <T>(string: string | null): T[] => {
  try {
    const value = string ? JSON.parse(string) : []
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const createWalletConnectConnector = (
  params: CreateWalletConnectConnectorParams
): CreateConnectorFn => {
  const { projectId, walletDetails, walletConnectParameters } = params
  return createConnector((config) => ({
    ...getOrCreateWalletConnectInstance({
      projectId,
      walletConnectParameters,
      showQrModal: walletDetails.details.showQrModal
    })(config),
    ...walletDetails
  }))
}

const generateWalletMetadata = (
  item: WalletListItem,
  additionalParams?: Pick<
    WalletDetailsParams['details'],
    'isWalletConnectModalConnector' | 'showQrModal'
  >
): WalletDetailsParams => {
  const { createConnector, groupIndex, groupName, hidden, ...metadata } = item

  return {
    details: {
      ...metadata,
      groupIndex,
      groupName,
      isRainbowKitConnector: true,
      ...(additionalParams ? additionalParams : [])
    }
  }
}

///public
export const computeWalletConnectMetadata = ({
  appName,
  appDescription,
  appUrl,
  appIcon
}: WalletMetaDataParameters): RainbowKitWalletConnectParameters['metadata'] => {
  return {
    name: appName,
    description: appDescription ?? appName,
    url: appUrl ?? (typeof window !== 'undefined' ? window.location.href : ''),
    icons: [...(appIcon ? [appIcon] : [])]
  }
}

export const getConnectors = (items: WalletList, params: WalletConnectorsParam) => {
  const connectors: Array<CreateConnectorFn> = []
  const visibleWallets: Array<WalletListItem> = []
  const hiddenWallets: Array<WalletListItem> = []
  const { projectId, appName, appIcon, appDescription, appUrl, walletConnectParameters } = params

  let groupIndex = 0
  let itemIndex = 0
  const walletConnectMetaData = computeWalletConnectMetadata({
    appName,
    appDescription,
    appUrl,
    appIcon
  })

  for (const { groupName, wallets } of items) {
    for (const createWalletFn of wallets) {
      const wallet = createWalletFn({
        projectId,
        appName,
        appIcon,
        walletConnectParameters: {
          metadata: walletConnectMetaData,
          ...walletConnectParameters
        },
        walletConnectParametersForOthers: {
          metadata: walletConnectMetaData,
          ...walletConnectParameters
        }
      })

      if (wallet?.iconAccent && !isHexString(wallet?.iconAccent)) {
        throw new Error(`Property \`iconAccent\` is not a hex value for wallet: ${wallet.name}`)
      }

      const item: WalletListItem = {
        ...wallet,
        index: itemIndex,
        groupIndex,
        groupName
      }

      if (typeof wallet === 'function') {
        hiddenWallets.push(item)
        itemIndex = itemIndex++
        continue
      }

      visibleWallets.push(item)
      itemIndex = itemIndex++
    }
    groupIndex = groupIndex++
  }

  const walletItems: Array<WalletListItem> = [...visibleWallets, ...hiddenWallets]

  for (const item of walletItems) {
    const { createConnector, hidden, id } = item

    if (typeof hidden === 'function') {
      if (hidden()) continue
    }

    const isWalletConnect = id === 'walletConnect'
    const params: Pick<
      WalletDetailsParams['details'],
      'isWalletConnectModalConnector' | 'showQrModal'
    > = {
      isWalletConnectModalConnector: true,
      showQrModal: true
    }

    if (isWalletConnect) {
      connectors.push(createConnector(generateWalletMetadata(item, params)))
      continue
    }

    connectors.push(createConnector(generateWalletMetadata(item)))
  }
  return connectors
}

export const getExtensionDownloadUrl = (wallet: WalletInstance): string | undefined => {
  const browser = getBrowser()
  return (
    {
      [BrowserType.Arc]: wallet.downloadUrls?.chrome,
      [BrowserType.Brave]: wallet.downloadUrls?.chrome,
      [BrowserType.Chrome]: wallet.downloadUrls?.chrome,
      [BrowserType.Edge]: wallet.downloadUrls?.edge || wallet.downloadUrls?.chrome,
      [BrowserType.Firefox]: wallet.downloadUrls?.firefox,
      [BrowserType.Opera]: wallet.downloadUrls?.opera || wallet.downloadUrls?.chrome,
      [BrowserType.Safari]: wallet.downloadUrls?.safari,
      [BrowserType.Browser]: wallet.downloadUrls?.browserExtension
    }[browser] ?? wallet.downloadUrls?.browserExtension
  )
}

export const getMobileDownloadUrl = (wallet: WalletInstance): string | undefined => {

  return (
    (isIOS ? wallet?.downloadUrls?.ios : wallet?.downloadUrls?.android) ??
    wallet?.downloadUrls?.mobile
  )
}

export const getDeskstopDownloadUrl = (wallet: WalletInstance): string | undefined => {
  const platform = getPlatformType()
  return (
    {
      [PlatformType.Windows]: wallet?.downloadUrls?.windows,
      [PlatformType.MacOS]: wallet?.downloadUrls?.macos,
      [PlatformType.Linux]: wallet?.downloadUrls?.linux,
      [PlatformType.Desktop]: wallet?.downloadUrls?.desktop
    }[platform] ?? wallet?.downloadUrls?.desktop
  )
}

export const getDefaultWallets = (
  parameters?: WalletConnectorsParam
): {
  connectors?: CreateConnectorFn[]
  wallets: WalletList
} => {
  const wallets: WalletList = [
    {
      groupName: 'Popular',
      wallets: [rainbowWallet, coinbaseWallet, metaMaskWallet, ledgerWallet]
    }
  ]

  if (parameters) {
    return {
      connectors: getConnectors(wallets, parameters),
      wallets
    }
  }

  return {
    wallets
  }
}

///sample: window.ethereum.provider[0]['isMetamask']
export const getExplicitInjectedProvider = (flag: string): any | undefined => {
  if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
    return
  }
  const providers = window.ethereum.providers
  if (providers) {
    return providers.find((provider: any) => provider[flag])
  }
  return window.ethereum[flag] ? window.ethereum : undefined
}

///sample: window.okxwallet
export const getNamespaceInjectedProvider = (namespace: string) => {
  const search = (provider: any, namespace: string): any => {
    const [property, ...path] = namespace.split('.')
    const _provider = provider[property]
    if (_provider) {
      if (path.length === 0) return _provider
      return search(_provider, path.join('.'))
    }
  }
  if (typeof window !== 'undefined') return search(window, namespace)
}

export const hasInjectedProvider = (request: InjectedProviderRequest): boolean => {
  const { namespace, flag } = request
  if (namespace && typeof getNamespaceInjectedProvider(namespace) !== 'undefined') return true
  if (flag && typeof getExplicitInjectedProvider(flag) !== 'undefined') return true
  return false
}

export const getInjectedProvider = (request: InjectedProviderRequest) => {
  const { namespace, flag } = request
  if (typeof window === 'undefined') return
  if (namespace) {
    // prefer custom eip1193 namespaces
    const windowProvider = getNamespaceInjectedProvider(namespace)
    if (windowProvider) return windowProvider
  }
  const providers = window.ethereum?.providers
  if (flag) {
    const provider = getExplicitInjectedProvider(flag)
    if (provider) return provider
  }
  if (typeof providers !== 'undefined' && providers.length > 0) return providers[0]
  return window.ethereum
}

export const createInjectedConnector = (provider?: any): CreateConnector => {
  return (walletDetails: WalletDetailsParams) => {
    // Create the injected configuration object conditionally based on the provider.
    const injectedConfig = provider
      ? {
          target: () => ({
            id: walletDetails.details.id,
            name: walletDetails.details.name,
            provider
          })
        }
      : {}

    return createConnector((config) => ({
      // Spread the injectedConfig object, which may be empty or contain the target function
      ...injected(injectedConfig)(config),
      ...walletDetails
    }))
  }
}

export const getInjectedConnector = (request: InjectedProviderRequest): CreateConnector => {
  const { namespace, flag, target } = request
  const provider = target ? target : getInjectedProvider({ flag, namespace })
  return createInjectedConnector(provider)
}

export const getOrCreateWalletConnectInstance = (
  params: GetOrCreateWalletConnectInstanceParams
): ReturnType<typeof walletConnect> => {
  const walletConnectInstances = new Map<string, ReturnType<typeof walletConnect>>()
  const { projectId, walletConnectParameters, showQrModal } = params
  let config: WalletConnectParameters = {
    ...(walletConnectParameters ? walletConnectParameters : {}),
    projectId,
    showQrModal: false // Required. Otherwise WalletConnect modal (Web3Modal) will popup during time of connection for a wallet
  }

  if (showQrModal) {
    config = { ...config, showQrModal: true }
  }

  const serializedConfig = JSON.stringify(config)
  const sharedWalletConnector = walletConnectInstances.get(serializedConfig)
  if (sharedWalletConnector) {
    return sharedWalletConnector
  }

  const newWalletConnectInstance = walletConnect(config)
  walletConnectInstances.set(serializedConfig, newWalletConnectInstance)
  return newWalletConnectInstance
}

export const getWalletConnectConnector = (params: GetWalletConnectConnectorParams): CreateConnector => {
  let { projectId, walletConnectParameters } = params
  // We use this projectId in place of YOUR_PROJECT_ID for our examples.
  // This allows us our examples and templates to be functional with WalletConnect v2.
  // We warn developers against using this projectId in their dApp in production.
  const exampleProjectId = '21fef48091f12692cad574a6f7753643'

  if (!projectId || projectId === '') {
    throw new Error(
      'No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2 https://www.rainbowkit.com/docs/installation#configure'
    )
  }

  if (projectId === 'YOUR_PROJECT_ID') {
    projectId = exampleProjectId
  }

  return (walletDetails: WalletDetailsParams) =>
    createWalletConnectConnector({
      projectId,
      walletDetails,
      walletConnectParameters
    })
}

export const mergeWallets = (
  newWallets: Array<WalletInstance>,
  existingWallets: Array<WalletInstance>
): Array<WalletInstance> => {
  return [
    ...newWallets,
    ...existingWallets.filter(
      (wallet) => !newWallets.some((newWallet) => newWallet.id === wallet.id)
    )
  ]
}

export const isRecentWallet = (recentWallets: WalletInstance[], walletId: string) => {
  return recentWallets.some((recentWallet) => recentWallet.id === walletId)
}

export const isRainbowKitConnector = (wallet: WalletInstance) => {
  return !!wallet.isRainbowKitConnector
}

export const isEIP6963Connector = (wallet: WalletInstance) => {
  return !!(
    !wallet.isRainbowKitConnector &&
    wallet.icon?.startsWith('data:image') &&
    wallet.uid &&
    wallet.name
  )
}

export const getRainbowKitConnectorWithWalletConnect = (
  wallet: WalletInstance,
  walletConnectModalConnector: WalletInstance
) => {
  const shouldUseWalletConnectModal = wallet.id === 'walletConnect' && walletConnectModalConnector
  return shouldUseWalletConnectModal ? { ...wallet, walletConnectModalConnector } : wallet
}

export const getConnectorsWithRecentWallets = ({
  wallets,
  recentWallets
}: ConnectorsWithWalletsParams) => {
  return [
    ...recentWallets,
    ...wallets.filter((wallet) => !isRecentWallet(recentWallets, wallet.id))
  ]
}

export const getLatestWalletId = (): string => {
  return typeof localStorage !== 'undefined'
    ? localStorage.getItem(latestWalletStorageKey) || ''
    : ''
}

export const addLatestWalletId = (walletId: string): void => {
  localStorage.setItem(latestWalletStorageKey, walletId)
}

export const clearLatestWalletIdentifier = (): void => {
  localStorage.removeItem(latestWalletStorageKey)
}

export const getRecentWalletIds = (): string[] => {
  return typeof localStorage !== 'undefined'
    ? safeParseJsonArray(localStorage.getItem(recentWalletStorageKey))
    : []
}

export const addRecentWalletId = (walletId: string): void => {
  const newValue = dedupe([walletId, ...getRecentWalletIds()])
  localStorage.setItem(recentWalletStorageKey, JSON.stringify(newValue))
}
