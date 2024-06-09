import { useEnsMetadata } from "@/composables/ensMetadata";
import { useLocale } from "@/composables/locale";
import { useModalContext } from "@/composables/modal";
import { useRainbowKitAccountContext } from "@/composables/account";
import { useRainbowKitBalance } from "@/composables/balance";
import { useRainbowKitChainContext } from "@/composables/chain";
import { useRecentTransactions, useShowRecentTransactionContext } from "@/composables/transaction";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { Container } from "@/components/Common/Container";
import { Avatar } from "@/components/AccountModal/Avatar";
import { DropdownIcon } from "@/components/Icons/DropdownIcon";
import { mapResponsiveValue, normalizeResponsiveValue, ResponsiveValue, touchable } from "@/css";
import { AccountStatus, ChainStatus, ConnectionStatus, GetEnsAddressReturnType, GetEnsAvatarReturnType, GetEnsNameReturnType, mainnet, RainbowKitChain } from "@/types";
import { computed, defineComponent, h, PropType, SlotsType, watch } from "vue";
import { formatAddress, formatENS, isMobile } from "@/utils";
import { useChainId } from "@wagmi/vue";
import { useThemeContext } from "@/composables";

export const createConnectButtonProps = {
    label: {
        type: String,
        default: 'Connect Wallet'
    },
    accountStatus: {
        type: [ Object, String ] as PropType<ResponsiveValue<AccountStatus>>,
        default: 'full'
    },
    chainStatus: {
        type: [ Object, String ] as PropType<ResponsiveValue<ChainStatus>>,
        default: () => ({ largeScreen: 'full', smallScreen: 'icon' })
    },
    showBalance: {
        type: [ Object, Boolean ] as PropType<ResponsiveValue<boolean>>,
        default: () => ({ largeScreen: true, smallScreen: false })
    }
} as const;

///TODO : Buffer library causing delay for useAccount() as Buffer library is needed for wallet-connect. 
export const ConnectButton = defineComponent({
    props: createConnectButtonProps,
    slots: Object as SlotsType<{
        custom: {
            account?: {
                address: string
                balanceDecimals?: number
                balanceSymbol?: string
                balance?: string
                displayName?: GetEnsNameReturnType | GetEnsAddressReturnType
                ensAvatar?: GetEnsAvatarReturnType
                ensName?: GetEnsNameReturnType
                hasPendingTransactions: boolean,
                displayBalance: boolean
            }
            chain?: {
                hasIcon: boolean
                iconUrl?: string
                iconBackground?: string
                id: number
                name?: string
                unsupported?: boolean,
                loading: boolean,
                shouldHideChainButton?: boolean,
            }
            connectionStatus?: ConnectionStatus,
            accountModalOpen: boolean
            chainModalOpen: boolean
            connectModalOpen: boolean
            openAccountModal: () => void
            openChainModal: () => void
            openConnectModal: () => void
        }
    }>,
    setup(props, { slots }) {
        const { chainId: connectedChainId, address, connectionStatus, isConnected } = useRainbowKitAccountContext()
        const { t, adapter } = useLocale()
        const { rainbowKitChains: chains, chainByIds, initialChainId, ignoreChainModalOnConnect } = useRainbowKitChainContext()
        const { name, avatar } = useEnsMetadata()
        const { accountModalOpen, connectModalOpen, chainModalOpen, openAccountModal, openChainModal, openConnectModal } = useModalContext()
        const showRecentTransaction = useShowRecentTransactionContext()
        const transactions = useRecentTransactions()
        const currentChainId = useChainId()
        const chainId = computed(()=> isConnected.value ? connectedChainId.value : currentChainId.value)
        const { balance, symbol, decimals, shouldShowBalance } = useRainbowKitBalance(address,chainId)
        const { mode } = useThemeContext();

        const applicationKey = computed(() => {
            return `rainbowkit_locale_${adapter.value.currentLocale}_${mode.value}`;
        });
        const isSelectedChainSupported = computed<boolean>((() => (chains?.value?.some((chain) => chain.id === chainId.value) ?? false)))
        const hasChainIcon = computed(() => selectedChain.value?.iconUrl !== undefined)
        
        const hasPendingTransactions = computed(() => {
            if (!showRecentTransaction.value) return false
            if (!transactions) return false
            return transactions.value.length > 0
        });
        const selectedChain = computed<RainbowKitChain>(() => {
            let selectedChainId = chainId.value
            if (!selectedChainId) {
                selectedChainId = initialChainId?.value
            }
            if (!selectedChainId && chains?.value && !initialChainId?.value) {
                selectedChainId = chains?.value[0].id;
            }
            return chainByIds.value[selectedChainId ?? mainnet.id];
        });

        const computeResponsiveChainStatus = () => {
            if (typeof props.chainStatus === 'string') {
              return props.chainStatus;
            }
        
            if (props.chainStatus) {
              return normalizeResponsiveValue(props.chainStatus)[
                isMobile ? 'smallScreen' : 'largeScreen'
              ];
            }
        };

        const enableChainModal = computed(()=>{ 
            const hasMultipleChains = (chains?.value?.length ?? 0) > 1;
            const hasSelectedChain = selectedChain.value !== undefined;
            const hasInitialChain = initialChainId?.value !== undefined;
            const enableChainModalOnConnect = ignoreChainModalOnConnect?.value ?? true;
            const alreadyConnected =  connectionStatus.value === 'connected';
            const isUnauthenticated = connectionStatus.value === 'unauthenticated';
            const showChainStatus = computeResponsiveChainStatus() !== 'none';

            return ( 
                (((!hasInitialChain && enableChainModalOnConnect) || alreadyConnected) || isUnauthenticated) 
                && (hasMultipleChains || showChainStatus)
                && hasSelectedChain 
           );
        });

        return () => {
            if (slots.custom) {
                return h(()=>slots.custom({
                    account: address.value
                        ? {
                            address: address.value,
                            balanceDecimals: decimals.value,
                            balance: balance.value,
                            balanceSymbol: symbol.value,
                            displayName: name.value ? formatENS(name.value) : formatAddress(address.value),
                            ensAvatar: avatar.value,
                            ensName: name.value,
                            displayBalance: shouldShowBalance.value,
                            hasPendingTransactions: hasPendingTransactions.value ?? false
                        }
                        : undefined,
                    chain: selectedChain.value
                        ? {
                            hasIcon: hasChainIcon.value,
                            iconBackground: selectedChain.value?.iconBackground,
                            id: selectedChain.value?.id ?? 0,
                            name: selectedChain.value?.name,
                            loading: false,
                            iconUrl: selectedChain.value.iconUrl,
                            unsupported: !isSelectedChainSupported.value && isConnected.value,
                            shouldHideChainButton: !enableChainModal.value,
                        } : undefined,
                    connectionStatus: connectionStatus.value,
                    accountModalOpen: accountModalOpen.value,
                    chainModalOpen: chainModalOpen.value,
                    connectModalOpen: connectModalOpen.value,
                    openAccountModal: openAccountModal.value,
                    openChainModal: openChainModal.value,
                    openConnectModal: openConnectModal.value
                }));
            }

            return h(Container,{
                'data-rk-vue': true,
                key: applicationKey.value,
            },()=>h(Container,{
                display: 'flex',
                gap: '12',
            },()=>[
                
                ///Switch network button 
                ...enableChainModal.value ? [
                    h(Container,{
                        as: 'button',
                        alignItems: 'center',
                        borderRadius: 'connectButton',
                        boxShadow: 'connectButton',
                        fontFamily: 'body',
                        fontWeight: 'bold',
                        paddingX: '10',
                        paddingY: '8',
                        gap: '6',
                        type: 'button',
                        color: isSelectedChainSupported.value ? 'connectButtonText': 'connectButtonTextError',
                        background: isSelectedChainSupported.value ? 'connectButtonBackground' : 'connectButtonBackgroundError',
                        class: touchable({ active: 'shrink', hover: 'grow' }),
                        display: mapResponsiveValue(props.chainStatus, (value)=> (value === 'none' ? 'none' : 'flex')),
                        transition: 'default',
                        onClick: openChainModal.value,
                        'aria-label': 'Chain-Selector',
                    },()=>[
                        ...isSelectedChainSupported.value ? [
                            h(Container,{
                                alignItems: 'center',
                                display: 'flex',
                                gap: '6'
                            },()=>[
                                ...hasChainIcon.value && selectedChain.value ? [
                                    h(Container,{
                                        display: mapResponsiveValue(props.chainStatus, (value) => value === 'full' || value === 'icon' ? 'block' : 'none'),
                                        height: '24',
                                        width: '24'
                                    }, ()=>h(AsyncImage,{
                                        alt: selectedChain.value?.name ?? "Chain icon",
                                        background: selectedChain.value?.iconBackground,
                                        borderRadius: 'full',
                                        height: '24',
                                        width: '24',
                                        src: selectedChain.value?.iconUrl
                                    })),
                                ] : [],
    
                                h(Container,{
                                    display:  mapResponsiveValue(props.chainStatus, (value) => {
                                        if (value === 'icon' && !selectedChain?.value?.iconUrl) {
                                          return 'block'
                                        }
                                        return value === 'full' || value === 'name' ? 'block' : 'none'
                                    }),
                                },()=> selectedChain.value.name ?? selectedChain.value.id ?? '')
                            ])
                        ] : [
                            ...isConnected.value ? [
                                h(Container,{
                                    alignItems: 'center',
                                    display: 'flex',
                                    height: '24',
                                    paddingX: '4',
                                },()=> t('connect_wallet.wrong_network.label')),
                            ]: []
                        ],
                        
                        h(DropdownIcon,{})
                    ]),
                ] : [],

                ///logged in button
                ...address.value && connectionStatus.value === 'connected'? [
                    h(Container,{
                        as: 'button',
                        alignItems: 'center',
                        background: 'connectButtonBackground',
                        borderRadius: 'connectButton',
                        boxShadow: 'connectButton',
                        color: 'connectButtonText',
                        display: 'flex',
                        fontFamily: 'body',
                        fontWeight: 'bold',
                        transition: 'default',
                        type: 'button',
                        class: touchable({ active: 'shrink', hover: 'grow' }),
                        onClick: openAccountModal.value 
                    },()=>[
                        ...balance.value !== undefined ? [
                            h(Container,{
                                padding: '8',
                                paddingLeft: '12',
                                display: mapResponsiveValue(props.showBalance, (value) => (value ? 'block' : 'none')),
                            },()=> balance.value)
                        ] : [],

                        h(Container,{
                            borderColor: 'connectButtonBackground',
                            borderRadius: 'connectButton',
                            borderStyle: 'solid',
                            borderWidth: '2',
                            color: 'connectButtonText',
                            fontFamily: 'body',
                            fontWeight: 'bold',
                            paddingX: '8',
                            paddingY: '6',
                            transition: 'default',
                            background: normalizeResponsiveValue(props.showBalance)[isMobile ? 'smallScreen' : 'largeScreen']
                                ? 'connectButtonInnerBackground'
                                : 'connectButtonBackground'
                        },()=>h(Container,{
                            alignItems: 'center',
                            display: 'flex',
                            gap: '6',
                            height: '24'
                        },()=>[
                            h(Container,{
                                display: mapResponsiveValue(props.accountStatus, (value)=> value === 'full' || value === 'avatar' ? 'block' : 'none')
                            },()=>h(Avatar,{
                                size: 24,
                                address: address.value!,
                                imageUrl: avatar.value,
                                loading: hasPendingTransactions.value
                            })),

                            h(Container,{
                                alignItems: 'center',
                                display: 'flex',
                                gap: '6'
                            },()=>[
                                h(Container,{
                                    display: mapResponsiveValue(props.accountStatus, (value)=> value === 'full' || value === 'avatar' ? 'block' : 'none')
                                },()=> name.value),

                                h(DropdownIcon,{})
                            ])
                        ]))
                    ])
                ] : [],
                
                ///Connect button
                ...(!address.value && connectionStatus.value === 'disconnected') ? [
                    h(Container,{
                        as: 'button',
                        type: 'button',
                        background: 'accentColor',
                        borderRadius: 'connectButton',
                        color: 'accentColorForeground',
                        fontFamily: 'body',
                        fontWeight: 'bold',
                        transition: 'default',
                        height: '40',
                        paddingX: '14',
                        class: touchable({ active: 'shrink', hover: 'grow' }),
                        onClick: openConnectModal.value ,
                    },()=> props.label === 'Connect Wallet' ? t('connect_wallet.label') : props.label)
                ] : []
                
            ]));
        }
    },
});


