import { useAppContext, useDisconnectAll, useRainbowKitAccountContext } from '@/composables'
import { Dialog } from "@/components/Common/Dialog";
import { ConnectOption } from "@/components/ConnectModal/ConnectOption";
import { SignIn } from "@/components/ConnectModal/SignIn";
import { MobileWalletSteps, MobileWalletSummary, WalletConnector, WalletStep, WalletSummary, SignInRefType, Address, Chain } from "@/types"
import { Component, defineComponent, h, PropType, SlotsType } from "vue"
import { useWalletConnectStoreContext } from '@/composables/wallet.connect';

export const ConnectModal = defineComponent({
    props: {
        open: {
            type: Boolean,
            default: false,
            required: true
        },
        onClosed: {
            type: Function as PropType<() => void>,
            required: true
        }
    } as const,
    slots: Object as SlotsType<{
        connectWithConnectorByMobile: {
            connectorName: string,
            onClosed: (()=> void)
        },
        connectWithoutConnectorByMobile: {
            fragment: MobileWalletSummary,
            step: MobileWalletSteps,
            wallets: Array<WalletConnector>,
            disclaimer: Component | undefined,
            changeWalletStep: ((headerBackButtonLink: MobileWalletSteps)=> void),
            learnMoreUrl: string | undefined,
        },
        connectByDesktop: {
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
        authenticate: {
            signIn: (() => Promise<void>),
            verify: ((message: any, signature: `0x${string}` | undefined) => Promise<void>),
            signMessage: ((message: any) => Promise<`0x${string}` | undefined>),
            getNonce: (() => Promise<void>),
            signInInfo: SignInRefType,
            address: Address | undefined,
            chain: Chain | undefined
        },
    }>,
    setup(props, { slots }) {
        const titleId = 'rk_connect_title'
        const { connectionStatus,isConnecting } = useRainbowKitAccountContext()
        const { disconnectAll } = useDisconnectAll()
        const { connectModalTeleportTarget:target } = useAppContext();    
        const store = useWalletConnectStoreContext();
        
        const onAuthCancel = () => {
            props.onClosed()
            disconnectAll()
        }

        const onConnectCancel = () => {
            props.onClosed() 
            store.resetWalletConnectUri();
            if (isConnecting.value) disconnectAll()
        }

        return ()=>{
            if(connectionStatus.value === 'loading' || connectionStatus.value === 'connecting' || connectionStatus.value === 'connected'){
                return h('div',()=>{});
            }
            if(connectionStatus.value === 'disconnected'){
                return h(Dialog,{
                    onClosed: onConnectCancel,
                    open: props.open,
                    identifier: titleId,
                    bottomSheetOnMobile: true,
                    padding: '0',
                    wide: true,
                    target: target?.value ?? "body"
                },()=>h(ConnectOption,{
                    onClosed: onConnectCancel
                },{
                    desktop: slots.connectByDesktop ? (props: { 
                        groupWallets: Record<string, WalletConnector[]>, 
                        wallets: WalletConnector[],
                        disclaimer: Component | undefined,
                        fragment: WalletSummary,
                        changeWalletStep: (newWalletStep: WalletStep, isBack: boolean) => void,
                        selectWallet: (connector: WalletConnector) => void; qrCodeUri: string | undefined, 
                        compactModalEnabled: boolean,
                        hasQrCode: boolean,
                        hasExtension: boolean, 
                        hasExtensionAndMobile: boolean 
                    })=> slots.connectByDesktop(props) : undefined,
                    mobileWithoutConnector: slots.connectWithoutConnectorByMobile ? (props: { 
                        fragment: MobileWalletSummary; 
                        step: MobileWalletSteps; 
                        wallets: WalletConnector[]; 
                        disclaimer: Component | undefined; 
                        changeWalletStep: (headerBackButtonLink: MobileWalletSteps) => void; 
                        learnMoreUrl: string | undefined; 
                    }) => slots.connectWithoutConnectorByMobile(props) : undefined,
                    mobileWithConnector: slots.connectWithConnectorByMobile ? (props: { 
                        connectorName: string; 
                        onClosed: () => void;
                    }) => slots.connectWithConnectorByMobile(props): undefined
                }));
            }

            return h(Dialog,{
                onClosed: onAuthCancel,
                open: props.open,
                identifier: titleId,
                bottomSheetOnMobile: true,
                padding: '0',
            },()=>h(SignIn,{
                onClosed: onAuthCancel,
                onClosedModal: props.onClosed,
            },{
                default: slots.authenticate ? (props: { 
                    signIn: () => Promise<void>; 
                    verify: (message: any, signature: `0x${string}` | undefined) => Promise<void>; 
                    signMessage: (message: any) => Promise<`0x${string}` | undefined>; 
                    getNonce: () => Promise<void>; 
                    signInInfo: SignInRefType; address: `0x${string}` | undefined; 
                    chain: Chain | undefined; 
                }) => slots.authenticate(props) : undefined
            }))
        }
    },
});