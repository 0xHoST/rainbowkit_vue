import type { WalletConnector } from "@/types";

export enum WalletStep {
  None = 'NONE',
  LearnCompact = 'LEARN_COMPACT',
  Get = 'GET',
  Connect = 'CONNECT',
  DownloadOptions = 'DOWNLOAD_OPTIONS',
  Download = 'DOWNLOAD',
  InstructionsMobile = 'INSTRUCTIONS_MOBILE',
  InstructionsDesktop = 'INSTRUCTIONS_DESKTOP',
  InstructionsExtension = 'INSTRUCTIONS_EXTENSION'
}

export type GetConnectDetail = {
  hasMobileCompanionApp: boolean,
  hasExtension: boolean,
  hasMobileExtension: boolean,
  hasMobileAndDesktop: boolean,
  wallet: WalletConnector
}