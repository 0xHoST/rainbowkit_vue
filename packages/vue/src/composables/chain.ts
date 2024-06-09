import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  cronos,
  hardhat,
  optimism,
  polygon,
  xdc,
  zkSync,
  zora,
  ronin
} from '@wagmi/vue/chains'
import {
  RainbowKitChainContextKey,
  type RainbowKitChain,
  type RainbowKitChainMetadata,
  type RainbowKitPluginOptions,
  type RainbowKitChainContext,
  type Context,
  UseRainbowKitChainContextReturnType,
} from '../types'
import { inject, ref, computed, toRefs, reactive } from 'vue'
import { useConfig } from '@wagmi/vue'

///Need to override viem to support icon background and icon url 
const arbitrumIcon: RainbowKitChainMetadata = {
  iconBackground: '#96bedc',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/arbitrum.svg',{ query: '?url', eager: true })['../assets/chains/arbitrum.svg'].default
}

const avalancheIcon: RainbowKitChainMetadata = {
  iconBackground: '#e84141',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/avalanche.svg',{ query: '?url', eager: true })['../assets/chains/avalanche.svg'].default
}

const baseIcon: RainbowKitChainMetadata = {
  iconBackground: '#0052ff',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/base.svg',{ query: '?url', eager: true })['../assets/chains/base.svg'].default
}

const bscIcon: RainbowKitChainMetadata = {
  iconBackground: '#ebac0e',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/bsc.svg',{ query: '?url', eager: true })['../assets/chains/bsc.svg'].default
}

const cronosIcon: RainbowKitChainMetadata = {
  iconBackground: '#002D74',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/cronos.svg',{ query: '?url', eager: true })['../assets/chains/cronos.svg'].default
}

const ethereumIcon: RainbowKitChainMetadata = {
  iconBackground: '#484c50',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/ethereum.svg',{ query: '?url', eager: true })['../assets/chains/ethereum.svg'].default
}

const hardhatIcon: RainbowKitChainMetadata = {
  iconBackground: '#f9f7ec',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/hardhat.svg',{ query: '?url', eager: true })['../assets/chains/hardhat.svg'].default
}

const optimismIcon: RainbowKitChainMetadata = {
  iconBackground: '#ff5a57',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/optimism.svg',{ query: '?url', eager: true })['../assets/chains/optimism.svg'].default
}

const polygonIcon: RainbowKitChainMetadata = {
  iconBackground: '#9f71ec',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/polygon.svg',{ query: '?url', eager: true })['../assets/chains/polygon.svg'].default
}

const xdcIcon: RainbowKitChainMetadata = {
  iconBackground: '#f9f7ec',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/xdc.svg',{ query: '?url', eager: true })['../assets/chains/xdc.svg'].default
}

const zkSyncIcon: RainbowKitChainMetadata = {
  iconBackground: '#f9f7ec',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/zkSync.svg',{ query: '?url', eager: true })['../assets/chains/zkSync.svg'].default
}

const zoraIcon: RainbowKitChainMetadata = {
  iconBackground: '#000000',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/zora.svg',{ query: '?url', eager: true })['../assets/chains/zora.svg'].default
}

const roninIcon: RainbowKitChainMetadata = {
  iconBackground: '#1273EA',
  iconUrl: import.meta.glob<{ default: string }>('../assets/chains/ronin.svg',{ query: '?url', eager: true })['../assets/chains/ronin.svg'].default
}

const metadata: Record<number, RainbowKitChainMetadata> = {
  [arbitrum.id]: arbitrumIcon,
  [base.id]: baseIcon,
  [avalanche.id]: avalancheIcon,
  [bsc.id]: bscIcon,
  [cronos.id]: cronosIcon,
  [mainnet.id]: ethereumIcon,
  [hardhat.id]: hardhatIcon,
  [optimism.id]: optimismIcon,
  [polygon.id]: polygonIcon,
  [xdc.id]: xdcIcon,
  [zkSync.id]: zkSyncIcon,
  [zora.id]: zoraIcon,
  [ronin.id]: roninIcon
}

export function configureRainbowKitChainContext(){
  const { chains: selectedChains } = useConfig();
  const { initialChainId, rainbowKitChains: chains } = useRainbowKitChainContext();
  const context = reactive(useRainbowKitChainContext());
  const rainbowKitChains : Array<RainbowKitChain> = [];
  for(const chain of selectedChains){
    const selectedMetadata = metadata[chain.id];
    if(!selectedMetadata || !selectedMetadata.iconUrl || !selectedMetadata.iconBackground) continue;
    rainbowKitChains.push({ ...selectedMetadata, ...chain });
  }
  Object.assign(context,{ 
    initialChainId: initialChainId?.value, 
    rainbowKitChains: rainbowKitChains ?? chains?.value 
  });
}

export function createRainbowKitChainContext(
  option: RainbowKitPluginOptions):Context<RainbowKitChainContext>{
  const chains: Array<RainbowKitChain> = option.chains.map((chain)=>{
    const selectedMetadata = metadata[chain.id];
    return { selectedMetadata, ...chain } as RainbowKitChain
  });
 
  const context = ref<RainbowKitChainContext>({ 
    initialChainId: option.initialChainId, 
    rainbowKitChains:chains, 
    ignoreChainModalOnConnect: option.ignoreChainModalOnConnect 
  });
  return context;
}

export function useRainbowKitChainContext(): UseRainbowKitChainContextReturnType{
  const context = inject(RainbowKitChainContextKey)
  if (!context) throw Error(`Could not find injected '${String(RainbowKitChainContextKey)}' instance.`)

  const chainByIds = computed(()=>{
    const result: Record<number,RainbowKitChain> = {};
    for (const chain of context?.value?.rainbowKitChains ?? []) {
      result[chain.id] = chain
    }
    return result;
  });
  return { ...toRefs(reactive(context.value)), chainByIds }
}
