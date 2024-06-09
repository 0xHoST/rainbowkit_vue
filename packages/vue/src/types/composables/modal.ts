import { DeepReadonly, ToRef } from "vue";

export const ModalSizeOptions = {
  COMPACT: 'compact',
  WIDE: 'wide'
} as const;
export type UseModalContextReturnType = {
  [K in keyof ModalContext]: DeepReadonly<ToRef<ModalContext[K]>>
} & { setModalContext: (value: ModalContext) => void };
export type ModalContext = {
  accountModalOpen: boolean,
  chainModalOpen: boolean,
  connectModalOpen: boolean,
  isWalletConnectModalOpen: boolean,
  isUnauthenticate: boolean,
  connectModalTeleportTarget?: string,
  chainModalTeleportTarget?:string,
  accountModalTeleportTarget?:string,
  openAccountModal: () => void,
  openChainModal: () => void,
  openConnectModal: () => void,
  closeAccountModal: ()=>void,
  closeChainModal: ()=> void,
  closeConnectModal: ()=> void,
  closeAllModal:(keepConnectModal: boolean)=>void,
};
export type ModalSize = (typeof ModalSizeOptions)[keyof typeof ModalSizeOptions];