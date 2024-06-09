import { MobileWalletSteps, MobileWalletSummary, WalletConnector, WalletStep, WalletSummary } from "@/types";
import { useWalletButtonContext } from '@/composables';
import { isMobile } from "@/utils";
import { MobileStatus } from "@/components/ConnectModal/MobileStatus";
import { MobileOption } from "@/components/ConnectModal/MobileOption";
import { DesktopOptions } from "@/components/ConnectModal/DesktopOption";
import { computed, Component, defineComponent, h, PropType, SlotsType } from "vue";

export const ConnectOption = defineComponent({
    props: {
        onClosed: {
            type: Function as PropType<(() => void)>,
            required: true
        },
    } as const,
    slots: Object as SlotsType<{
        desktop: {
            groupWallets: Record<string,Array<WalletConnector>>,
            wallets: Array<WalletConnector>,
            disclaimer: Component | undefined,
            fragment: WalletSummary,
            changeWalletStep: ((newWalletStep: WalletStep, isBack: boolean)=> void),
            selectWallet: ((connector:WalletConnector)=> void),
            qrCodeUri: string | undefined,
            compactModalEnabled: boolean,
            hasQrCode: boolean,
            hasExtension: boolean,
            hasExtensionAndMobile: boolean
        },
        mobileWithoutConnector: {
            fragment: MobileWalletSummary,
            step: MobileWalletSteps,
            wallets: Array<WalletConnector>,
            disclaimer: Component | undefined,
            changeWalletStep: ((headerBackButtonLink: MobileWalletSteps)=> void),
            learnMoreUrl: string | undefined,
        },
        mobileWithConnector: {
            connectorName: string,
            onClosed: (()=> void)
        },
    }>,
    setup(props, { slots }) {
        const { connector }  = useWalletButtonContext();
        //const connector = computed(()=> button.value);
        return ()=>{
            if(isMobile && !!connector.value){
                return h(MobileStatus,{ onClosed: props.onClosed },{
                    default: slots.mobileWithConnector ? (props: { connectorName: string; onClosed: () => void; })=> slots.mobileWithConnector(props) : undefined,
                })
            }

            if(isMobile && connector.value == null){
                return h(MobileOption,{ onClosed: props.onClosed },{
                    default: slots.mobileWithoutConnector ? (props: { 
                        fragment: MobileWalletSummary; 
                        step: MobileWalletSteps; 
                        wallets: WalletConnector[]; 
                        disclaimer: Component | undefined; 
                        changeWalletStep: (headerBackButtonLink: MobileWalletSteps) => void; learnMoreUrl: string | undefined; 
                    }) => slots.mobileWithoutConnector(props): undefined,
                });
            }

            return h(DesktopOptions,{ onClosed: props.onClosed },{
                default: slots.desktop ? (props: { 
                    groupWallets: Record<string, WalletConnector[]>; 
                    wallets: WalletConnector[]; 
                    disclaimer: Component | undefined; 
                    fragment: WalletSummary; 
                    changeWalletStep: (newWalletStep: WalletStep, isBack: boolean) => void; 
                    selectWallet: (connector: WalletConnector) => void; 
                    qrCodeUri: string | undefined; 
                    compactModalEnabled: boolean; 
                    hasQrCode: boolean; 
                    hasExtension: boolean; 
                    hasExtensionAndMobile: boolean; 
                }) => slots.desktop(props) : undefined
            });
        }
    },
});