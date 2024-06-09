import { useLocale } from "@/composables/locale";
import { useModalContext, configureModalSizeContext, configureModalContext } from "@/composables/modal";
import { configureRainbowKitChainContext } from "@/composables/chain";
import { useThemeContext } from "@/composables/theme";
import { configureTransactionStore } from "@/composables/transaction";
import { StyleComponent } from "@/composables/plugin";

import { AccountModal } from "@/components/AccountModal/AccountModal";
import { ChainModal } from "@/components/ChainModal/ChainModal";
import { ConnectModal } from "@/components/ConnectModal/ConnectModal";
import { Container } from "@/components/Common/Container";
import { SignInRefType, Address, Chain, GetEnsAvatarReturnType, GetEnsNameReturnType, DisconnectMutate } from "@/types";
import { MobileWalletSteps, MobileWalletSummary, RainbowKitChain, WalletConnector, WalletStep, WalletSummary } from "@/types";
import { computed, DefineComponent, defineComponent, h, SlotsType } from "vue";

export const RainbowKitProvider = defineComponent({
    slots: Object as SlotsType<{
        default: {},
        account: {
            ensName: GetEnsNameReturnType | undefined,
            ensAvatar: GetEnsAvatarReturnType | undefined,
            onDisconnect: (()=> void),
            address: Address | undefined,
            onClosed: (()=> void),
            formattedBalance: string | undefined,
            symbol: string | undefined,
            abbreviatedBalance: string | undefined,
            balance: BigInt | undefined
        },
        chain: {
            isCurrentChainSupported: boolean,
            chains: Array<RainbowKitChain> | undefined,
            pendingChainId: number | undefined,
            disconnect: DisconnectMutate
        },
        connectWithConnectorByMobile: {
            connectorName: string,
            onClosed: (()=> void)
        },
        connectWithoutConnectorByMobile: {
            fragment: MobileWalletSummary,
            step: MobileWalletSteps,
            wallets: Array<WalletConnector>,
            disclaimer: DefineComponent | undefined,
            changeWalletStep: ((headerBackButtonLink: MobileWalletSteps)=> void),
            learnMoreUrl: string | undefined,
        },
        connectByDesktop: {
            groupWallets: Record<string,Array<WalletConnector>>,
            wallets: Array<WalletConnector>,
            disclaimer: DefineComponent | undefined,
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
    setup(_, { slots }) {
        configureModalSizeContext();
        configureModalContext();
        configureRainbowKitChainContext();
        configureTransactionStore();

        const {
            connectModalOpen,
            accountModalOpen,
            chainModalOpen,
            closeConnectModal,
            closeAccountModal,
            closeChainModal
        } = useModalContext();

        const { css, mode } = useThemeContext();
        const { adapter } = useLocale();
        const applicationKey = computed(() => {
            return `rainbowkit_locale_${adapter.value.currentLocale}_${mode.value}`;
        });

        return ()=>{
            return h(Container,{ key: applicationKey.value },()=>[
                h(StyleComponent,{ themeId: "data-rk-vue" }, ()=> css.value),
                h(ConnectModal,{ 
                    open: connectModalOpen.value,
                    onClosed: closeConnectModal.value,
                },{
                    connectByDesktop: slots.connectByDesktop ? (props: { groupWallets: Record<string, WalletConnector[]>; 
                        wallets: WalletConnector[]; 
                        disclaimer: DefineComponent | undefined; 
                        fragment: WalletSummary; 
                        changeWalletStep: (newWalletStep: WalletStep, isBack: boolean) => void; 
                        selectWallet: (connector: WalletConnector) => void; qrCodeUri: string | undefined; 
                        compactModalEnabled: boolean; 
                        hasQrCode: boolean; 
                        hasExtension: boolean; 
                        hasExtensionAndMobile: boolean; 
                    })=> slots.connectByDesktop(props) : undefined,
                    connectWithoutConnectorByMobile: slots.connectWithoutConnectorByMobile ? (props: { 
                        fragment: MobileWalletSummary; 
                        step: MobileWalletSteps; 
                        wallets: WalletConnector[]; 
                        disclaimer: DefineComponent | undefined; 
                        changeWalletStep: (headerBackButtonLink: MobileWalletSteps) => void; 
                        learnMoreUrl: string | undefined; 
                    }) => slots.connectWithoutConnectorByMobile(props) : undefined,
                    connectWithConnectorByMobile: slots.connectWithConnectorByMobile ? (props: { 
                        connectorName: string; 
                        onClosed: () => void;
                    }) => slots.connectWithConnectorByMobile(props): undefined,
                    authenticate: slots.authenticate ? (props: { 
                        signIn: () => Promise<void>; 
                        verify: (message: any, signature: `0x${string}` | undefined) => Promise<void>; 
                        signMessage: (message: any) => Promise<`0x${string}` | undefined>; 
                        getNonce: () => Promise<void>; 
                        signInInfo: SignInRefType; 
                        address: `0x${string}` | undefined; 
                        chain: Chain | undefined; 
                    })=> slots.authenticate(props) : undefined
                }),
                h(AccountModal,{ 
                    open: accountModalOpen.value,
                    onClosed: closeAccountModal.value,
                },{
                    default: slots.account ? (props: { 
                        ensName: GetEnsNameReturnType | undefined; 
                        ensAvatar: GetEnsAvatarReturnType | undefined; 
                        onDisconnect: () => void; 
                        address: `0x${string}` | undefined; 
                        onClosed: () => void; 
                        formattedBalance: string | undefined; 
                        symbol: string | undefined; 
                        abbreviatedBalance: string | undefined; 
                        balance: BigInt | undefined; 
                    }) => slots.account(props): undefined,
                }),
                h(ChainModal,{ 
                    open: chainModalOpen.value,
                    onClosed: closeChainModal.value,
                },{
                    default: slots.chain ? (props: { 
                        isCurrentChainSupported: boolean; 
                        chains: RainbowKitChain[] | undefined; 
                        pendingChainId: number | undefined;
                        disconnect: DisconnectMutate; 
                    }) => slots.chain(props): undefined,
                }),

                slots.default ? slots.default({}) : undefined
            ])
        }
    },
});