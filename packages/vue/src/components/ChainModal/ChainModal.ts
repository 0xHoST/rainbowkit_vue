import { Container } from "@/components/Common/Container";
import { Dialog } from "@/components/Common/Dialog";
import { Text } from "@/components/Common/Text";
import { MenuButton } from "@/components/Buttons/MenuButton";
import { CloseButton } from "@/components/Buttons/CloseButton";
import { DisconnectSquareIcon } from "@/components/Icons/DisconnectSquareIcon";
import { ChainBox } from "@/components/ChainModal/ChainBox";
import { useRainbowKitChainContext, useLocale, useRainbowKitAccountContext, useAppContext } from '@/composables'
import { isMobile } from '@/utils'
import { DesktopScrollClassName, MobileScrollClassName } from "@/css";
import { RainbowKitChain, DisconnectMutate } from "@/types";
import { useChainId, useConfig, useDisconnect, useSwitchChain } from '@wagmi/vue'
import { defineComponent, h, computed, ref, SlotsType } from "vue"

export const createChainModalProps = {
    open: {
        type: Boolean,
        required: true
    },
} as const

export const ChainModal = defineComponent({
    props: createChainModalProps,
    slots: Object as SlotsType<{
        default: {
            isCurrentChainSupported: boolean,
            chains: Array<RainbowKitChain> | undefined,
            pendingChainId: number | undefined,
            disconnect: DisconnectMutate
        }
    }>,
    emits: [ 'closed' ],
    setup(props, { slots, emit }) {
        const pendingChainId = ref<number>()
        const { chainId: connectedChainId, isConnected } = useRainbowKitAccountContext()
        const currentChainId = useChainId();
        const chainId = computed(()=> isConnected.value ? connectedChainId.value : currentChainId.value);
        const { chains } = useConfig()
        const { t } = useLocale()
        const { disconnect } = useDisconnect()
        const { chainModalTeleportTarget:target } = useAppContext();
        const { switchChain } = useSwitchChain({
            mutation: {
                onMutate({ chainId }) {
                    pendingChainId.value = chainId
                },
                onSuccess(_data: any, _variables: any, _context: any) {
                    if (!pendingChainId.value) return
                    pendingChainId.value = undefined
                },
                onError(_error: any, _variables: any, _context: any) {
                    if (!pendingChainId.value) return
                    pendingChainId.value = undefined
                },
                onSettled(_data: any, _error: any, _variables: any, _context: any) {
                    emit('closed');
                }
            }
        })

        const titleId = 'rk_chain_modal_title'
        const isCurrentChainSupported = computed(() => chains.some((chain) => chain.id === chainId.value))
        const chainIconSize = computed(() => (isMobile ? '36' : '28'))
        const { rainbowKitChains: rkChains } = useRainbowKitChainContext()

        return () => {
            
            return h(Dialog, {
                onClosed: ()=> emit('closed'),
                open: props.open,
                identifier: titleId,
                bottomSheetOnMobile: true,
                paddingBottom: '0',
                target: target?.value ?? "body"
            }, slots.default ? slots.default({
                isCurrentChainSupported: isCurrentChainSupported.value,
                chains: rkChains?.value,
                pendingChainId: pendingChainId.value,
                disconnect,
            }) : ()=> h(Container, {
                display: 'flex',
                flexDirection: 'column',
                gap: '14'
            }, ()=>[
                h(Container, {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }, ()=>[
                    ...isMobile ? [
                        h(Container, { width: '30' })
                    ] : [],

                    h(Container, {
                        paddingBottom: '0',
                        paddingLeft: '8',
                        paddingTop: '4'
                    }, ()=>h(Text, {
                        tag: 'h1',
                        color: 'modalText',
                        id: titleId,
                        size: isMobile ? '20' : '18',
                        weight: 'heavy'
                    }, () => t('chains.title'))),

                    h(CloseButton, { onClick: ()=> emit('closed') })
                ]),

                ...!isCurrentChainSupported.value ? [
                    h(Container, {
                        marginX: '8',
                        textAlign: isMobile ? 'center' : 'left'
                    }, () => t('chains.wrong_network'))
                ] : [],

                ...rkChains?.value !== undefined ? [
                    h(Container, {
                        class: isMobile ? MobileScrollClassName : DesktopScrollClassName,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4',
                        padding: '2',
                        paddingBottom: '16'
                    }, ()=>[
                        ...rkChains.value!.map((e) => {
                            return h(ChainBox, {
                                idx: rkChains.value?.indexOf(e) ?? 0,
                                chainId: e.id,
                                currentChainId: chainId.value ?? 0,
                                switchChain: switchChain,
                                chainIconSize: chainIconSize.value,
                                isLoading: pendingChainId.value === e.id,
                                src: e.iconUrl,
                                name: e.name,
                                iconBackground: e.iconBackground,
                                key: e.id,
                                isConnected: isConnected.value
                            });
                        }),

                        ...!isCurrentChainSupported.value ? [
                            h(Container, {
                                background: 'generalBorderDim',
                                height: '1',
                                marginX: '8'
                            }),

                            h(MenuButton, {
                                onAction: () => disconnect()
                            }, ()=>h(Container, {
                                color: 'error',
                                fontFamily: 'body',
                                fontSize: '16',
                                fontWeight: 'bold'
                            }, ()=>h(Container, {
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }, ()=>h(Container, {
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '4',
                                height: chainIconSize.value
                            }, ()=>[
                                h(Container, {
                                    alignItems: 'center',
                                    color: 'error',
                                    height: chainIconSize.value,
                                    justifyContent: 'center',
                                    marginRight: '8'
                                }, ()=>h(DisconnectSquareIcon, { size: Number(chainIconSize.value) })),

                                h(Container, () => t('chains.disconnect'))
                            ]))))
                        ] : []
                    ])
                ] : [],
            ]))
        };


    },
});