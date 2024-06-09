import {
  type ModalContext,
  type Context,
  type ModalSize,
  type RainbowKitPluginOptions,
  ModalContextKey,
  ModalSizeOptions,
  ModalSizeContextKey,
} from '@/types'
import { useRainbowKitAccountContext } from "@/composables/account";
import { useAuthenticationConfigContext} from "@/composables/authentication";
import { useWalletButtonContext } from "@/composables/button";
import { useWindow} from "@/composables/window";
import { largeScreenMinWidth } from '@/css'
import { useAccountEffect, useConfig } from '@wagmi/vue'
import { computed, inject, reactive, ref, toRefs, watch } from 'vue'

export function configureModalSizeContext() {
  const { connector } = useWalletButtonContext()
  const { modalSize } = useModalSizeContext()
  const windowSizeRef = useWindow()
  const windowSize = windowSizeRef.value
  const isSmallScreen = windowSize?.width && windowSize.width < largeScreenMinWidth;
  modalSize.value = connector.value !== null || isSmallScreen ? ModalSizeOptions.COMPACT : ModalSizeOptions.WIDE;
  watch([connector,windowSizeRef ],([newConnector, windowSize])=>{
    const isSmallScreen = windowSize?.width && windowSize.width < largeScreenMinWidth;
    modalSize.value = newConnector != null || isSmallScreen ? ModalSizeOptions.COMPACT : ModalSizeOptions.WIDE;
  });
}

export function configureModalContext() {
  const { chainId, connectionStatus } = useRainbowKitAccountContext()
  const { status } = useAuthenticationConfigContext()
  const { accountModalOpen, chainModalOpen, connectModalOpen, closeAllModal } = useModalContext()
  const { chains } = useConfig()
  const modal = reactive(useModalContext());
  const isCurrentChainSupported = chains.some((chain) => chain.id === chainId.value);
  const isOpenAccountModalValid = isCurrentChainSupported && connectionStatus?.value === 'connected'
  const isOpenConnectModalValid = connectionStatus?.value === 'disconnected' || connectionStatus?.value === 'unauthenticated' || connectionStatus?.value === 'connecting';
  const isOpenChainModalValid = connectionStatus?.value === 'connected' || connectionStatus?.value === 'disconnected';
  const isUnauthenticated = connectionStatus?.value === 'unauthenticated'
  Object.assign(modal,{
    ...modal,
    isUnauthenticate: isUnauthenticated,
    openAccountModal: isOpenAccountModalValid
      ? () => {
          accountModalOpen.value = true;
        }
      : ()=>{},
    openChainModal: isOpenChainModalValid
      ? () => {
          chainModalOpen.value = true;
        }
      : ()=>{},
    openConnectModal: isOpenConnectModalValid
      ? () => {
          connectModalOpen.value = true;
        }
      : ()=>{},
    closeAccountModal: () => {
      accountModalOpen.value = false;
    },
    closeChainModal: () => {
      chainModalOpen.value = false;
    },
    closeConnectModal: () => {
      connectModalOpen.value = false;
    },
    closeAllModal: (keepConnectModal: boolean = false) => {
      connectModalOpen.value = keepConnectModal ? true: false;
      accountModalOpen.value = false;
      chainModalOpen.value = false;
    }
  })

  watch([()=> connectionStatus.value,()=> chainId.value],([newConnectionStatus,newChainId])=>{
    const isCurrentChainSupported = chains.some((chain) => chain.id === newChainId);
    const isOpenAccountModalValid = isCurrentChainSupported && newConnectionStatus === 'connected'
    const isOpenConnectModalValid = newConnectionStatus === 'disconnected' || newConnectionStatus === 'unauthenticated';
    const isOpenChainModalValid = newConnectionStatus === 'connected' || newConnectionStatus === 'disconnected';
    const isUnauthenticated = newConnectionStatus === 'unauthenticated'

    Object.assign(modal,{
      ...modal,
      isUnauthenticate: isUnauthenticated,
      openAccountModal: isOpenAccountModalValid
        ? () => {
            accountModalOpen.value = true;
          }
        : ()=>{},
      openChainModal: isOpenChainModalValid
        ? () => {
            chainModalOpen.value = true;
          }
        : ()=>{},
      openConnectModal: isOpenConnectModalValid
        ? () => {
            connectModalOpen.value = true;
          }
        : ()=>{},
      closeAccountModal: () => {
        accountModalOpen.value = false;
      },
      closeChainModal: () => {
        chainModalOpen.value = false;
      },
      closeConnectModal: () => {
        connectModalOpen.value = false;
      },
      closeAllModal: (keepConnectModal: boolean = false) => {
        connectModalOpen.value = keepConnectModal ? true: false;
        accountModalOpen.value = false;
        chainModalOpen.value = false;
      }
    })
  });

  useAccountEffect({
    onConnect: ()=> {
      return closeAllModal.value(status?.value === 'unauthenticated');
    },
    onDisconnect: ()=>{
      closeAllModal.value(false)
    }
  })

  /*watch(modal,(newModal) => {
    if(!newModal.isUnauthenticate) return;
    if(!newModal.closeAllModal) return;
    newModal.closeAllModal(false);
  })*/
}

export function createModalSizeContext(option: RainbowKitPluginOptions): Context<ModalSize> {
  const context = ref<ModalSize>(option.modalSize ?? ModalSizeOptions.WIDE)
  return context;
}

export function createModalContext(option: RainbowKitPluginOptions): Context<ModalContext> {
  const { chainModalTeleportTarget, accountModalTeleportTarget, connectModalTeleportTarget } = option
  const context = ref<ModalContext>({
    chainModalOpen: false,
    connectModalOpen: false,
    accountModalOpen: false,
    isWalletConnectModalOpen: false,
    isUnauthenticate: false,
    chainModalTeleportTarget: chainModalTeleportTarget ?? 'body',
    connectModalTeleportTarget: connectModalTeleportTarget ?? 'body',
    accountModalTeleportTarget: accountModalTeleportTarget ?? 'body',
    openAccountModal:()=>{},
    openChainModal: ()=>{},
    openConnectModal: () => {},
    closeAccountModal: ()=> {},
    closeChainModal: ()=> {},
    closeConnectModal: ()=> {},
    closeAllModal:(_)=>{},
  })

  return context;
}

export function useModalSizeContext(){
  const context = inject(ModalSizeContextKey)
  if (!context) throw Error(`Could not find injected '${String(ModalSizeContextKey)}' instance.`)
  const compactModeEnabled = computed(()=> context.value === ModalSizeOptions.COMPACT)
  return { compactModeEnabled, modalSize: context }
}

export function useModalContext()  {
  const context = inject(ModalContextKey)
  if (!context) {
    throw Error(`Could not find injected '${String(ModalContextKey)}' instance.`)
  }
  return toRefs(reactive(context.value));
}
