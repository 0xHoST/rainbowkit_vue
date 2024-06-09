import type { WalletStep } from "@/types";
import { 
    DownloadOptionsDetail, 
    DownloadDetail, 
    ConnectModalIntro, 
    GetConnectDetail, 
    InstructionDesktopDetail, 
    InstructionExtensionDetail, 
    InstructionMobileDetail, 
    ConnectDetail 
} from "@/components";

import { ComponentPublicInstance } from "vue";

export type WalletSummaryType = typeof DownloadOptionsDetail | 
    typeof ConnectDetail |
    typeof DownloadDetail | 
    typeof ConnectModalIntro | 
    typeof GetConnectDetail | 
    typeof InstructionDesktopDetail |
    typeof InstructionExtensionDetail |
    typeof InstructionMobileDetail;

export type WalletSummary = {
    headerBackButtonCallback?: () => void
    headerLabel?: string
    headerBackButtonLink?: WalletStep
};

export type WalletSummaryReturnType = {
    [key in WalletStep]: WalletSummary;
};

export type WalletSummaryComponent = {
    headerBackButtonCallback?: () => void
    headerLabel?: string
    headerBackButtonLink?: WalletStep
    component: ComponentPublicInstance
    props: any;
};

export type WalletSummaryComponentReturnType = {
    [key in WalletStep]: WalletSummaryComponent;
}

export type DesktopOptionProps = {
    onClosed: ()=> void
}